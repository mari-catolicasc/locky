from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_session
from app.schemas.locker import (
    LockerListResponse,
    LockerResponse,
    LockerSizeAPI,
    LockerStatsResponse,
    LockerStatusAPI,
)
from app.services import locker_service

router = APIRouter(
    prefix="/lockers", tags=["lockers"], dependencies=[Depends(get_current_user)]
)


@router.get("", response_model=LockerListResponse)
def listar_lockers(
    session: Annotated[Session, Depends(get_session)],
    status: Annotated[LockerStatusAPI | None, Query()] = None,
    size: Annotated[LockerSizeAPI | None, Query()] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> LockerListResponse:
    armarios, total = locker_service.listar_armarios(
        session, status, size, limit, offset
    )
    return LockerListResponse(
        items=[LockerResponse.from_model(armario) for armario in armarios],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/stats", response_model=LockerStatsResponse)
def stats_lockers(
    session: Annotated[Session, Depends(get_session)],
) -> LockerStatsResponse:
    return locker_service.obter_stats(session)
