import json
import logging
import sys

from app.core.logging_config import JsonFormatter, configurar_logging


def _registro(nivel: int, mensagem: str, exc_info: object = None) -> logging.LogRecord:
    return logging.LogRecord(
        name="app.teste",
        level=nivel,
        pathname=__file__,
        lineno=1,
        msg=mensagem,
        args=None,
        exc_info=exc_info,  # type: ignore[arg-type]
    )


def test_formata_registro_simples_como_json() -> None:
    formatter = JsonFormatter()
    registro = _registro(logging.INFO, "mensagem de teste")

    saida = formatter.format(registro)
    dados = json.loads(saida)

    assert dados["level"] == "INFO"
    assert dados["logger"] == "app.teste"
    assert dados["message"] == "mensagem de teste"
    assert "exception" not in dados


def test_formata_registro_com_excecao_inclui_traceback() -> None:
    formatter = JsonFormatter()
    try:
        raise ValueError("falha de teste")
    except ValueError:
        exc_info = sys.exc_info()

    registro = _registro(logging.ERROR, "erro capturado", exc_info)

    saida = formatter.format(registro)
    dados = json.loads(saida)

    assert "exception" in dados
    assert "ValueError" in dados["exception"]


def test_configurar_logging_nao_estoura_erro() -> None:
    configurar_logging()

    assert logging.getLogger().handlers
