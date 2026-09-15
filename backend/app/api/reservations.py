from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_session
from app.core.exceptions import (
    ArmarioIndisponivelError,
    ArmarioNaoEncontradoError,
    UsuarioComReservaAtivaError,
)
from app.models import Usuario
from app.schemas.reservation import CreateReservationRequest, ReservationResponse
from app.services import reservation_service

router = APIRouter(prefix="/reservations", tags=["reservations"])


@router.post(
    "", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED
)
def criar_reserva(
    dados: CreateReservationRequest,
    session: Annotated[Session, Depends(get_session)],
    usuario: Annotated[Usuario, Depends(get_current_user)],
) -> ReservationResponse:
    try:
        reserva, armario = reservation_service.criar_reserva(
            session, usuario.id, dados.locker_id, dados.date, dados.time
        )
    except UsuarioComReservaAtivaError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Usuário já possui uma reserva ativa.",
        ) from None
    except ArmarioNaoEncontradoError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Armário não encontrado.",
        ) from None
    except ArmarioIndisponivelError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Armário não está disponível.",
        ) from None

    return ReservationResponse.from_model(reserva, armario)
