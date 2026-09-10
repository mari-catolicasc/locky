from datetime import date, time, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import hash_senha
from app.models import (
    Armario,
    PapelUsuario,
    Reserva,
    StatusReserva,
    Usuario,
)

DATA_FUTURA = (date.today() + timedelta(days=7)).isoformat()


def _payload(locker_id: int) -> dict[str, object]:
    return {"locker_id": locker_id, "date": DATA_FUTURA, "time": "18:30:00"}


def _criar_reserva_ativa(
    client: TestClient, armario_id: int, auth_headers: dict[str, str]
) -> int:
    resposta = client.post(
        "/reservations", json=_payload(armario_id), headers=auth_headers
    )
    id_: int = resposta.json()["id"]
    return id_


def test_cancelar_reserva_propria(
    client: TestClient,
    armario_disponivel: Armario,
    auth_headers: dict[str, str],
) -> None:
    reserva_id = _criar_reserva_ativa(client, armario_disponivel.id, auth_headers)

    resposta = client.patch(f"/reservations/{reserva_id}/cancel", headers=auth_headers)

    assert resposta.status_code == 200
    assert resposta.json()["status"] == "cancelled"

    lockers = client.get("/lockers", headers=auth_headers).json()
    armario_atualizado = next(
        item for item in lockers["items"] if item["id"] == armario_disponivel.id
    )
    assert armario_atualizado["status"] == "available"


def test_cancelar_reserva_de_outro_usuario(
    client: TestClient,
    db_session: Session,
    armario_disponivel: Armario,
    auth_headers: dict[str, str],
) -> None:
    reserva_id = _criar_reserva_ativa(client, armario_disponivel.id, auth_headers)

    outro_usuario = Usuario(
        email="beto@locky.com",
        senha_hash=hash_senha("outrasenha"),
        nome="Beto",
        papel=PapelUsuario.ASSOCIADO,
    )
    db_session.add(outro_usuario)
    db_session.commit()

    login = client.post(
        "/auth/login", json={"email": "beto@locky.com", "password": "outrasenha"}
    )
    headers_beto = {"Authorization": f"Bearer {login.json()['access_token']}"}

    resposta = client.patch(f"/reservations/{reserva_id}/cancel", headers=headers_beto)

    assert resposta.status_code == 403


def test_cancelar_reserva_ja_cancelada(
    client: TestClient,
    armario_disponivel: Armario,
    auth_headers: dict[str, str],
) -> None:
    reserva_id = _criar_reserva_ativa(client, armario_disponivel.id, auth_headers)
    client.patch(f"/reservations/{reserva_id}/cancel", headers=auth_headers)

    resposta = client.patch(f"/reservations/{reserva_id}/cancel", headers=auth_headers)

    assert resposta.status_code == 409


def test_cancelar_reserva_concluida(
    client: TestClient,
    db_session: Session,
    armario_disponivel: Armario,
    usuario: Usuario,
    auth_headers: dict[str, str],
) -> None:
    concluida = Reserva(
        usuario_id=usuario.id,
        armario_id=armario_disponivel.id,
        data=date(2026, 8, 1),
        hora=time(10, 0),
        status=StatusReserva.CONCLUIDA,
    )
    db_session.add(concluida)
    db_session.commit()
    db_session.refresh(concluida)

    resposta = client.patch(
        f"/reservations/{concluida.id}/cancel", headers=auth_headers
    )

    assert resposta.status_code == 409


def test_cancelar_reserva_nao_encontrada(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    resposta = client.patch("/reservations/99999/cancel", headers=auth_headers)

    assert resposta.status_code == 404


def test_cancelar_reserva_sem_token(client: TestClient) -> None:
    resposta = client.patch("/reservations/1/cancel")

    assert resposta.status_code == 401
