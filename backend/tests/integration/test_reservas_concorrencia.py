import os
import threading
from collections.abc import Generator
from datetime import date, time, timedelta

import pytest
from sqlalchemy import Engine, create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

import app.models  # noqa: F401  (registra os models em Base.metadata)
from app.core.db import Base
from app.core.exceptions import ArmarioIndisponivelError
from app.models import (
    Armario,
    PapelUsuario,
    Reserva,
    StatusArmario,
    TamanhoArmario,
    Usuario,
)
from app.services.reservation_service import criar_reserva

POSTGRES_TESTE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+psycopg://locky:locky@localhost:5433/locky_test",
)


@pytest.fixture
def engine_postgres() -> Generator[Engine, None, None]:
    engine = create_engine(POSTGRES_TESTE_URL, connect_args={"connect_timeout": 3})
    try:
        with engine.connect():
            pass
    except OperationalError:
        pytest.skip(
            f"Postgres de teste indisponível em {POSTGRES_TESTE_URL} "
            "(docker compose up -d db_test)"
        )
    Base.metadata.create_all(engine)
    yield engine
    engine.dispose()


def test_apenas_um_vence_a_corrida_pelo_mesmo_armario(engine_postgres: Engine) -> None:
    with Session(engine_postgres) as session:
        session.query(Reserva).delete()
        session.query(Armario).filter(Armario.numero == "CC01").delete()
        session.query(Usuario).filter(
            Usuario.email.in_(["a@locky.com", "b@locky.com"])
        ).delete()
        session.commit()

        armario = Armario(
            numero="CC01", status=StatusArmario.DISPONIVEL, tamanho=TamanhoArmario.MEDIO
        )
        usuario_a = Usuario(
            email="a@locky.com", senha_hash="x", nome="A", papel=PapelUsuario.ASSOCIADO
        )
        usuario_b = Usuario(
            email="b@locky.com", senha_hash="x", nome="B", papel=PapelUsuario.ASSOCIADO
        )
        session.add_all([armario, usuario_a, usuario_b])
        session.commit()
        armario_id, usuario_a_id, usuario_b_id = armario.id, usuario_a.id, usuario_b.id

    barreira = threading.Barrier(2)
    resultados: dict[str, str] = {}

    def tentar(nome: str, usuario_id: int) -> None:
        with Session(engine_postgres) as session:
            barreira.wait()
            try:
                criar_reserva(
                    session,
                    usuario_id,
                    armario_id,
                    date.today() + timedelta(days=1),
                    time(18, 30),
                )
                resultados[nome] = "sucesso"
            except ArmarioIndisponivelError:
                resultados[nome] = "indisponivel"

    t1 = threading.Thread(target=tentar, args=("t1", usuario_a_id))
    t2 = threading.Thread(target=tentar, args=("t2", usuario_b_id))
    t1.start()
    t2.start()
    t1.join(timeout=10)
    t2.join(timeout=10)

    assert sorted(resultados.values()) == ["indisponivel", "sucesso"]

    with Session(engine_postgres) as session:
        armario_final = session.get(Armario, armario_id)
        assert armario_final is not None
        assert armario_final.status == StatusArmario.RESERVADO
