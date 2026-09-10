from enum import StrEnum

from pydantic import BaseModel

from app.models import Armario, StatusArmario, TamanhoArmario


class LockerStatusAPI(StrEnum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"


class LockerSizeAPI(StrEnum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


STATUS_DOMINIO_PARA_API = {
    StatusArmario.DISPONIVEL: LockerStatusAPI.AVAILABLE,
    StatusArmario.RESERVADO: LockerStatusAPI.RESERVED,
    StatusArmario.OCUPADO: LockerStatusAPI.OCCUPIED,
    StatusArmario.MANUTENCAO: LockerStatusAPI.MAINTENANCE,
}
STATUS_API_PARA_DOMINIO = {v: k for k, v in STATUS_DOMINIO_PARA_API.items()}

TAMANHO_DOMINIO_PARA_API = {
    TamanhoArmario.PEQUENO: LockerSizeAPI.SMALL,
    TamanhoArmario.MEDIO: LockerSizeAPI.MEDIUM,
    TamanhoArmario.GRANDE: LockerSizeAPI.LARGE,
}
TAMANHO_API_PARA_DOMINIO = {v: k for k, v in TAMANHO_DOMINIO_PARA_API.items()}


class LockerResponse(BaseModel):
    id: int
    number: str
    status: LockerStatusAPI
    size: LockerSizeAPI

    @classmethod
    def from_model(cls, armario: Armario) -> "LockerResponse":
        return cls(
            id=armario.id,
            number=armario.numero,
            status=STATUS_DOMINIO_PARA_API[armario.status],
            size=TAMANHO_DOMINIO_PARA_API[armario.tamanho],
        )


class LockerListResponse(BaseModel):
    items: list[LockerResponse]
    total: int
    limit: int
    offset: int


class LockerStatsResponse(BaseModel):
    total: int
    available: int
    reserved: int
    occupied: int
