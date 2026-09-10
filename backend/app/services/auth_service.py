from sqlalchemy.orm import Session

from app.core.exceptions import CredenciaisInvalidasError
from app.core.security import verificar_senha
from app.models import Usuario
from app.repositories import usuario_repository


def autenticar(session: Session, email: str, senha: str) -> Usuario:
    usuario = usuario_repository.buscar_por_email(session, email)
    if usuario is None or not verificar_senha(senha, usuario.senha_hash):
        raise CredenciaisInvalidasError
    return usuario
