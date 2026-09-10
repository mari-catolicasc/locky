import logging

from apscheduler.schedulers.background import BackgroundScheduler

from app.core.config import settings
from app.core.db import SessionLocal
from app.services.reservation_service import expirar_reservas_vencidas

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def _rodar_expiracao() -> None:
    with SessionLocal() as session:
        total = expirar_reservas_vencidas(session)
        if total:
            logger.info("Expirou %d reserva(s) vencida(s).", total)


def iniciar_scheduler() -> None:
    scheduler.add_job(
        _rodar_expiracao,
        "interval",
        minutes=settings.expiracao_intervalo_minutos,
        id="expirar_reservas_vencidas",
        replace_existing=True,
    )
    scheduler.start()


def parar_scheduler() -> None:
    scheduler.shutdown(wait=False)
