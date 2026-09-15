from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import (
    Armario,
    Reserva,
    StatusArmario,
    StatusReserva,
    TamanhoArmario,
    Usuario,
)
from app.services.reservation_service import expirar_reservas_vencidas

MOMENTO = datetime(2026, 9, 10, 20, 0, 0)


def _criar_reserva_ativa(
    db_session: Session, usuario: Usuario, minutos_atras: int
) -> tuple[Reserva, Armario]:
    armario = Armario(
        numero=f"E{minutos_atras}",
        status=StatusArmario.RESERVADO,
        tamanho=TamanhoArmario.MEDIO,
    )
    db_session.add(armario)
    db_session.commit()
    db_session.refresh(armario)

    inicio = MOMENTO - timedelta(minutes=minutos_atras)
    reserva = Reserva(
        usuario_id=usuario.id,
        armario_id=armario.id,
        data=inicio.date(),
        hora=inicio.time(),
        status=StatusReserva.ATIVA,
    )
    db_session.add(reserva)
    db_session.commit()
    db_session.refresh(reserva)
    return reserva, armario


def test_reserva_vencida_e_expirada_e_armario_libera(
    db_session: Session, usuario: Usuario
) -> None:
    minutos_vencidos = settings.tempo_maximo_reserva_minutos + 1
    reserva, armario = _criar_reserva_ativa(db_session, usuario, minutos_vencidos)

    total = expirar_reservas_vencidas(db_session, MOMENTO)

    assert total == 1
    db_session.refresh(reserva)
    db_session.refresh(armario)
    assert reserva.status == StatusReserva.CONCLUIDA
    assert armario.status == StatusArmario.DISPONIVEL


def test_reserva_dentro_do_prazo_nao_e_tocada(
    db_session: Session, usuario: Usuario
) -> None:
    minutos_dentro_do_prazo = settings.tempo_maximo_reserva_minutos - 1
    reserva, armario = _criar_reserva_ativa(
        db_session, usuario, minutos_dentro_do_prazo
    )

    total = expirar_reservas_vencidas(db_session, MOMENTO)

    assert total == 0
    db_session.refresh(reserva)
    db_session.refresh(armario)
    assert reserva.status == StatusReserva.ATIVA
    assert armario.status == StatusArmario.RESERVADO


def test_job_sem_reservas_pendentes_nao_faz_nada(db_session: Session) -> None:
    total = expirar_reservas_vencidas(db_session, MOMENTO)

    assert total == 0


def test_job_e_idempotente(db_session: Session, usuario: Usuario) -> None:
    minutos_vencidos = settings.tempo_maximo_reserva_minutos + 1
    _criar_reserva_ativa(db_session, usuario, minutos_vencidos)

    primeira_execucao = expirar_reservas_vencidas(db_session, MOMENTO)
    segunda_execucao = expirar_reservas_vencidas(db_session, MOMENTO)

    assert primeira_execucao == 1
    assert segunda_execucao == 0


def test_expirar_reservas_vencidas_usa_agora_por_padrao(
    db_session: Session, usuario: Usuario
) -> None:
    total = expirar_reservas_vencidas(db_session)

    assert total == 0
