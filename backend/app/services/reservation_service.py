from datetime import date, time

from sqlalchemy.orm import Session

from app.core.exceptions import (
    ArmarioIndisponivelError,
    ArmarioNaoEncontradoError,
    UsuarioComReservaAtivaError,
)
from app.models import Armario, Reserva, StatusArmario
from app.repositories import armario_repository, reserva_repository


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
    session.commit()
    session.refresh(reserva)
    return reserva, armario
