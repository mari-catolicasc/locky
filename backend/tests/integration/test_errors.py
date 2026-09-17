from datetime import date, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import hash_senha
from app.main import create_app
from app.models import Armario, PapelUsuario, Usuario

DATA_FUTURA = (date.today() + timedelta(days=7)).isoformat()


def _e_erro_padrao(corpo: object) -> bool:
    if not isinstance(corpo, dict):
        return False
    return list(corpo.keys()) == ["detail"] and isinstance(corpo["detail"], str)


def test_handler_404_formato_padrao(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    resposta = client.patch("/reservations/99999/cancel", headers=auth_headers)

    assert resposta.status_code == 404
    assert _e_erro_padrao(resposta.json())


def test_handler_401_formato_padrao(client: TestClient) -> None:
    resposta = client.get("/reservations/me")

    assert resposta.status_code == 401
    assert _e_erro_padrao(resposta.json())


def test_handler_403_formato_padrao(
    client: TestClient,
    db_session: Session,
    armario_disponivel: Armario,
    auth_headers: dict[str, str],
) -> None:
    payload = {
        "locker_id": armario_disponivel.id,
        "date": DATA_FUTURA,
        "time": "18:30:00",
    }
    reserva_id = client.post(
        "/reservations", json=payload, headers=auth_headers
    ).json()["id"]

    outro_usuario = Usuario(
        email="carla@locky.com",
        senha_hash=hash_senha("outrasenha"),
        nome="Carla",
        papel=PapelUsuario.ASSOCIADO,
    )
    db_session.add(outro_usuario)
    db_session.commit()

    login = client.post(
        "/auth/login", json={"email": "carla@locky.com", "password": "outrasenha"}
    )
    headers_carla = {"Authorization": f"Bearer {login.json()['access_token']}"}

    resposta = client.patch(f"/reservations/{reserva_id}/cancel", headers=headers_carla)

    assert resposta.status_code == 403
    assert _e_erro_padrao(resposta.json())


def test_handler_422_formato_padrao(
    client: TestClient, armario_disponivel: Armario, auth_headers: dict[str, str]
) -> None:
    payload = {
        "locker_id": armario_disponivel.id,
        "date": "2020-01-01",
        "time": "18:30:00",
    }

    resposta = client.post("/reservations", json=payload, headers=auth_headers)

    assert resposta.status_code == 422
    assert _e_erro_padrao(resposta.json())


def test_handler_500_formato_padrao_e_nao_vaza_detalhe_interno() -> None:
    app = create_app()

    def _quebra() -> Usuario:
        raise RuntimeError("falha proposital de teste, não deve aparecer na resposta")

    app.dependency_overrides[get_current_user] = _quebra
    cliente = TestClient(app, raise_server_exceptions=False)

    resposta = cliente.get("/lockers")

    assert resposta.status_code == 500
    assert resposta.json() == {"detail": "Erro interno do servidor."}
    assert "falha proposital" not in resposta.text
