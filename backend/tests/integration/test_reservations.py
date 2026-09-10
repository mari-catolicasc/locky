from datetime import date, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import hash_senha
from app.models import Armario, PapelUsuario, StatusArmario, TamanhoArmario, Usuario

DATA_FUTURA = (date.today() + timedelta(days=7)).isoformat()


def _payload(locker_id: int) -> dict[str, object]:
    return {"locker_id": locker_id, "date": DATA_FUTURA, "time": "18:30:00"}


def test_criar_reserva_caminho_feliz(
    client: TestClient,
    armario_disponivel: Armario,
    auth_headers: dict[str, str],
) -> None:
    resposta = client.post(
        "/reservations", json=_payload(armario_disponivel.id), headers=auth_headers
    )

    assert resposta.status_code == 201
    corpo = resposta.json()
    assert corpo["locker_number"] == "01"
    assert corpo["locker_size"] == "medium"
    assert corpo["status"] == "active"

    lockers = client.get("/lockers", headers=auth_headers).json()
    armario_atualizado = next(
        item for item in lockers["items"] if item["id"] == armario_disponivel.id
    )
    assert armario_atualizado["status"] == "reserved"


def test_criar_reserva_armario_nao_encontrado(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    resposta = client.post("/reservations", json=_payload(99999), headers=auth_headers)

    assert resposta.status_code == 404


def test_criar_reserva_armario_indisponivel(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
) -> None:
    ocupado = Armario(
        numero="02", status=StatusArmario.OCUPADO, tamanho=TamanhoArmario.PEQUENO
    )
    db_session.add(ocupado)
    db_session.commit()
    db_session.refresh(ocupado)

    resposta = client.post(
        "/reservations", json=_payload(ocupado.id), headers=auth_headers
    )

    assert resposta.status_code == 409
    assert resposta.json()["detail"] == "Armário não está disponível."


def test_criar_reserva_usuario_ja_tem_reserva_ativa(
    client: TestClient,
    db_session: Session,
    armario_disponivel: Armario,
    auth_headers: dict[str, str],
) -> None:
    outro_armario = Armario(
        numero="03", status=StatusArmario.DISPONIVEL, tamanho=TamanhoArmario.GRANDE
    )
    db_session.add(outro_armario)
    db_session.commit()
    db_session.refresh(outro_armario)

    primeira = client.post(
        "/reservations", json=_payload(armario_disponivel.id), headers=auth_headers
    )
    assert primeira.status_code == 201

    segunda = client.post(
        "/reservations", json=_payload(outro_armario.id), headers=auth_headers
    )

    assert segunda.status_code == 409
    assert segunda.json()["detail"] == "Usuário já possui uma reserva ativa."


def test_criar_reserva_data_passada(
    client: TestClient, armario_disponivel: Armario, auth_headers: dict[str, str]
) -> None:
    payload = {
        "locker_id": armario_disponivel.id,
        "date": "2020-01-01",
        "time": "18:30:00",
    }

    resposta = client.post("/reservations", json=payload, headers=auth_headers)

    assert resposta.status_code == 422


def test_criar_reserva_hora_malformada(
    client: TestClient, armario_disponivel: Armario, auth_headers: dict[str, str]
) -> None:
    payload = {
        "locker_id": armario_disponivel.id,
        "date": DATA_FUTURA,
        "time": "25:99:00",
    }

    resposta = client.post("/reservations", json=payload, headers=auth_headers)

    assert resposta.status_code == 422


def test_criar_reserva_sem_token(
    client: TestClient, armario_disponivel: Armario
) -> None:
    resposta = client.post("/reservations", json=_payload(armario_disponivel.id))

    assert resposta.status_code == 401


def test_criar_reserva_usuario_diferente_nao_conflita(
    client: TestClient,
    db_session: Session,
    armario_disponivel: Armario,
    auth_headers: dict[str, str],
) -> None:
    outro_armario = Armario(
        numero="04", status=StatusArmario.DISPONIVEL, tamanho=TamanhoArmario.PEQUENO
    )
    outro_usuario = Usuario(
        email="beto@locky.com",
        senha_hash=hash_senha("outrasenha"),
        nome="Beto",
        papel=PapelUsuario.ASSOCIADO,
    )
    db_session.add_all([outro_armario, outro_usuario])
    db_session.commit()
    db_session.refresh(outro_armario)
    db_session.refresh(outro_usuario)

    login = client.post(
        "/auth/login",
        json={"email": outro_usuario.email, "password": "outrasenha"},
    )
    headers_beto = {"Authorization": f"Bearer {login.json()['access_token']}"}

    resposta_ana = client.post(
        "/reservations", json=_payload(armario_disponivel.id), headers=auth_headers
    )
    resposta_beto = client.post(
        "/reservations", json=_payload(outro_armario.id), headers=headers_beto
    )

    assert resposta_ana.status_code == 201
    assert resposta_beto.status_code == 201
