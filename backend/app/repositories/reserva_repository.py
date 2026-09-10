from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Reserva, StatusReserva


def existe_reserva_ativa(session: Session, usuario_id: int) -> bool:
    reserva = session.scalars(
        select(Reserva).where(
            Reserva.usuario_id == usuario_id,
            Reserva.status == StatusReserva.ATIVA,
        )
    ).first()
    return reserva is not None
