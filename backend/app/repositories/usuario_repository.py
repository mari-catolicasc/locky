from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Usuario


def buscar_por_email(session: Session, email: str) -> Usuario | None:
    return session.scalars(select(Usuario).where(Usuario.email == email)).first()


def buscar_por_id(session: Session, usuario_id: int) -> Usuario | None:
    return session.get(Usuario, usuario_id)
