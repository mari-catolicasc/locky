from datetime import date, datetime, time, timedelta

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import (
    ArmarioIndisponivelError,
    ArmarioNaoEncontradoError,
    ReservaDeOutroUsuarioError,
    ReservaNaoEncontradaError,
    ReservaNaoPodeSerCanceladaError,
    UsuarioComReservaAtivaError,
)
from app.models import Armario, Reserva, StatusArmario, StatusReserva
from app.repositories import armario_repository, reserva_repository
from app.schemas.reservation import STATUS_API_PARA_RESERVA, ReservationStatusAPI


def criar_reserva(
    session: Session,
    usuario_id: int,
    locker_id: int,
    data_reserva: date,
    hora_reserva: time,
) -> tuple[Reserva, Armario]:
    if reserva_repository.existe_reserva_ativa(session, usuario_id):
        raise UsuarioComReservaAtivaError

    armario = armario_repository.buscar_para_atualizar(session, locker_id)
    if armario is None:
        raise ArmarioNaoEncontradoError
    if armario.status != StatusArmario.DISPONIVEL:
        raise ArmarioIndisponivelError

    reserva = Reserva(
        usuario_id=usuario_id,
        armario_id=armario.id,
        data=data_reserva,
        hora=hora_reserva,
    )
    armario.status = StatusArmario.RESERVADO
    session.add(reserva)
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise UsuarioComReservaAtivaError from exc
    session.refresh(reserva)
    return reserva, armario


def cancelar_reserva(
    session: Session, usuario_id: int, reserva_id: int
) -> tuple[Reserva, Armario]:
    reserva = reserva_repository.buscar_para_atualizar(session, reserva_id)
    if reserva is None:
        raise ReservaNaoEncontradaError
    if reserva.usuario_id != usuario_id:
        raise ReservaDeOutroUsuarioError
    if reserva.status != StatusReserva.ATIVA:
        raise ReservaNaoPodeSerCanceladaError

    armario = armario_repository.buscar_para_atualizar(session, reserva.armario_id)
    if armario is None:  # pragma: no cover - integridade referencial garante existência
        raise ArmarioNaoEncontradoError

    reserva.status = StatusReserva.CANCELADA
    armario.status = StatusArmario.DISPONIVEL
    session.commit()
    session.refresh(reserva)
    return reserva, armario


def listar_minhas(
    session: Session, usuario_id: int, status: ReservationStatusAPI | None
) -> list[tuple[Reserva, Armario]]:
    status_dominio = STATUS_API_PARA_RESERVA[status] if status is not None else None
    return reserva_repository.listar_por_usuario(session, usuario_id, status_dominio)


def listar_historico(
    session: Session,
    usuario_id: int,
    search: str | None,
    status: ReservationStatusAPI | None,
    data_inicial: date | None,
    data_final: date | None,
    limit: int,
    offset: int,
) -> tuple[list[tuple[Reserva, Armario]], int]:
    status_dominio = STATUS_API_PARA_RESERVA[status] if status is not None else None
    return reserva_repository.listar_historico(
        session,
        usuario_id,
        search,
        status_dominio,
        data_inicial,
        data_final,
        limit,
        offset,
    )


def _esta_vencida(reserva: Reserva, agora: datetime) -> bool:
    limite = datetime.combine(reserva.data, reserva.hora) + timedelta(
        minutes=settings.tempo_maximo_reserva_minutos
    )
    return agora >= limite


def expirar_reservas_vencidas(session: Session, agora: datetime | None = None) -> int:
    momento = agora if agora is not None else datetime.now()
    total_expiradas = 0

    for reserva in reserva_repository.listar_ativas_para_atualizar(session):
        if not _esta_vencida(reserva, momento):
            continue

        armario = armario_repository.buscar_para_atualizar(session, reserva.armario_id)
        if (
            armario is None
        ):  # pragma: no cover - integridade referencial garante existência
            continue

        reserva.status = StatusReserva.CONCLUIDA
        armario.status = StatusArmario.DISPONIVEL
        total_expiradas += 1

    session.commit()
    return total_expiradas
