from datetime import date, time

import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import (
    Armario,
    PapelUsuario,
    Reserva,
    StatusArmario,
    StatusReserva,
    TamanhoArmario,
    Usuario,
)


def test_usuario_papel_padrao_associado(db_session: Session) -> None:
    usuario = Usuario(email="ana@locky.com", senha_hash="x", nome="Ana")
    db_session.add(usuario)
    db_session.flush()

    assert usuario.papel == PapelUsuario.ASSOCIADO
    assert usuario.criado_em is not None


def test_armario_status_padrao_disponivel(db_session: Session) -> None:
    armario = Armario(numero="01", tamanho=TamanhoArmario.PEQUENO)
    db_session.add(armario)
    db_session.flush()

    assert armario.status == StatusArmario.DISPONIVEL


def test_reserva_defaults_e_timestamps(db_session: Session) -> None:
    usuario = Usuario(email="ana@locky.com", senha_hash="x", nome="Ana")
    armario = Armario(numero="01", tamanho=TamanhoArmario.MEDIO)
    db_session.add_all([usuario, armario])
    db_session.flush()

    reserva = Reserva(
        usuario_id=usuario.id,
        armario_id=armario.id,
        data=date(2026, 8, 24),
        hora=time(18, 30),
    )
    db_session.add(reserva)
    db_session.flush()
    db_session.refresh(reserva)

    assert reserva.status == StatusReserva.ATIVA
    assert reserva.criado_em is not None
    assert reserva.atualizado_em is not None


def test_email_duplicado_viola_unicidade(db_session: Session) -> None:
    db_session.add(Usuario(email="ana@locky.com", senha_hash="x", nome="Ana"))
    db_session.flush()

    db_session.add(Usuario(email="ana@locky.com", senha_hash="y", nome="Beto"))
    with pytest.raises(IntegrityError):
        db_session.flush()


def test_numero_armario_duplicado_viola_unicidade(db_session: Session) -> None:
    db_session.add(Armario(numero="01", tamanho=TamanhoArmario.PEQUENO))
    db_session.flush()

    db_session.add(Armario(numero="01", tamanho=TamanhoArmario.GRANDE))
    with pytest.raises(IntegrityError):
        db_session.flush()
