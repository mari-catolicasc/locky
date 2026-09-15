from sqlalchemy.orm import Session

from app.models import Armario, StatusArmario
from app.repositories import armario_repository
from app.schemas.locker import (
    STATUS_API_PARA_DOMINIO,
    TAMANHO_API_PARA_DOMINIO,
    LockerSizeAPI,
    LockerStatsResponse,
    LockerStatusAPI,
)


def listar_armarios(
    session: Session,
    status: LockerStatusAPI | None,
    size: LockerSizeAPI | None,
    limit: int,
    offset: int,
) -> tuple[list[Armario], int]:
    status_dominio = STATUS_API_PARA_DOMINIO[status] if status is not None else None
    tamanho_dominio = TAMANHO_API_PARA_DOMINIO[size] if size is not None else None
    return armario_repository.listar(
        session, status_dominio, tamanho_dominio, limit, offset
    )


def obter_stats(session: Session) -> LockerStatsResponse:
    contagem = armario_repository.contar_por_status(session)
    return LockerStatsResponse(
        total=sum(contagem.values()),
        available=contagem.get(StatusArmario.DISPONIVEL, 0),
        reserved=contagem.get(StatusArmario.RESERVADO, 0),
        occupied=contagem.get(StatusArmario.OCUPADO, 0),
    )
