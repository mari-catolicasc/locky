import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


def _formatar_erros_validacao(exc: RequestValidationError) -> str:
    partes = []
    for erro in exc.errors():
        campo = ".".join(str(item) for item in erro["loc"] if item != "body")
        partes.append(f"{campo}: {erro['msg']}" if campo else erro["msg"])
    return "; ".join(partes)


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={"detail": _formatar_erros_validacao(exc)},
    )


async def erro_interno_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Erro não tratado em %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Erro interno do servidor."},
    )


def registrar_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, erro_interno_handler)
