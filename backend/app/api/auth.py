from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_session
from app.core.exceptions import CredenciaisInvalidasError
from app.core.security import criar_token_acesso
from app.models import Usuario
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(
    dados: LoginRequest,
    session: Annotated[Session, Depends(get_session)],
) -> TokenResponse:
    try:
        usuario = auth_service.autenticar(session, dados.email, dados.password)
    except CredenciaisInvalidasError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        ) from None

    return TokenResponse(access_token=criar_token_acesso(usuario.id))


@router.get("/me", response_model=UserResponse)
def me(usuario: Annotated[Usuario, Depends(get_current_user)]) -> UserResponse:
    return UserResponse(
        id=usuario.id,
        name=usuario.nome,
        email=usuario.email,
        role=usuario.papel,
    )
