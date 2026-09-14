from fastapi.testclient import TestClient


def test_cors_headers_presentes_para_origem_do_front(client: TestClient) -> None:
    resposta = client.get("/health", headers={"Origin": "http://localhost:5173"})

    assert resposta.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_cors_preflight_libera_origem_do_front(client: TestClient) -> None:
    resposta = client.options(
        "/lockers",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert resposta.status_code == 200
    assert resposta.headers["access-control-allow-origin"] == "http://localhost:5173"
