from datetime import UTC, datetime, timedelta

import jwt
from fastapi.testclient import TestClient

from app.core.config import settings
from app.models import Usuario
from tests.conftest import SENHA_TESTE


def _token(payload: dict[str, object]) -> str:
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_login_sucesso(client: TestClient, usuario: Usuario) -> None:
    resposta = client.post(
        "/auth/login",
        json={"email": usuario.email, "password": SENHA_TESTE},
    )

    assert resposta.status_code == 200
    corpo = resposta.json()
    assert corpo["token_type"] == "bearer"
    assert corpo["access_token"]


def test_login_senha_incorreta(client: TestClient, usuario: Usuario) -> None:
    resposta = client.post(
        "/auth/login",
        json={"email": usuario.email, "password": "errada"},
    )

    assert resposta.status_code == 401
    assert resposta.json()["detail"] == "Credenciais inválidas"


def test_login_usuario_inexistente(client: TestClient) -> None:
    resposta = client.post(
        "/auth/login",
        json={"email": "ninguem@locky.com", "password": "seja-la"},
    )

    assert resposta.status_code == 401
    assert resposta.json()["detail"] == "Credenciais inválidas"


def test_me_com_token_valido(client: TestClient, usuario: Usuario) -> None:
    login = client.post(
        "/auth/login",
        json={"email": usuario.email, "password": SENHA_TESTE},
    )
    token = login.json()["access_token"]

    resposta = client.get("/auth/me", headers=_auth(token))

    assert resposta.status_code == 200
    assert resposta.json() == {
        "id": usuario.id,
        "name": "Ana",
        "email": usuario.email,
        "role": "associado",
    }


def test_me_sem_token(client: TestClient) -> None:
    resposta = client.get("/auth/me")

    assert resposta.status_code == 401


def test_me_token_invalido(client: TestClient) -> None:
    resposta = client.get("/auth/me", headers=_auth("token-quebrado"))

    assert resposta.status_code == 401


def test_me_token_expirado(client: TestClient, usuario: Usuario) -> None:
    expirado = _token(
        {"sub": str(usuario.id), "exp": datetime.now(UTC) - timedelta(minutes=1)}
    )

    resposta = client.get("/auth/me", headers=_auth(expirado))

    assert resposta.status_code == 401


def test_me_token_sem_sub(client: TestClient) -> None:
    sem_sub = _token({"exp": datetime.now(UTC) + timedelta(minutes=5)})

    resposta = client.get("/auth/me", headers=_auth(sem_sub))

    assert resposta.status_code == 401


def test_me_usuario_inexistente(client: TestClient) -> None:
    token = _token({"sub": "9999", "exp": datetime.now(UTC) + timedelta(minutes=5)})

    resposta = client.get("/auth/me", headers=_auth(token))

    assert resposta.status_code == 401
