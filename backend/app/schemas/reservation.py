from datetime import date as Date
from datetime import time as Time
from enum import StrEnum

from pydantic import BaseModel, field_validator

from app.models import Armario, Reserva, StatusReserva
from app.schemas.locker import TAMANHO_DOMINIO_PARA_API, LockerSizeAPI


class ReservationStatusAPI(StrEnum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


STATUS_RESERVA_PARA_API = {
    StatusReserva.ATIVA: ReservationStatusAPI.ACTIVE,
    StatusReserva.CONCLUIDA: ReservationStatusAPI.COMPLETED,
    StatusReserva.CANCELADA: ReservationStatusAPI.CANCELLED,
}


class CreateReservationRequest(BaseModel):
    locker_id: int
    date: Date
    time: Time

    @field_validator("date")
    @classmethod
    def data_nao_pode_ser_passada(cls, valor: Date) -> Date:
        if valor < Date.today():
            raise ValueError("A data da reserva não pode estar no passado.")
        return valor


class ReservationResponse(BaseModel):
    id: int
    locker_id: int
    locker_number: str
    locker_size: LockerSizeAPI
    date: Date
    time: Time
    status: ReservationStatusAPI

    @classmethod
    def from_model(cls, reserva: Reserva, armario: Armario) -> "ReservationResponse":
        return cls(
            id=reserva.id,
            locker_id=armario.id,
            locker_number=armario.numero,
            locker_size=TAMANHO_DOMINIO_PARA_API[armario.tamanho],
            date=reserva.data,
            time=reserva.hora,
            status=STATUS_RESERVA_PARA_API[reserva.status],
        )
