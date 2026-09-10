from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base
from app.models.enums import StatusArmario, TamanhoArmario


class Armario(Base):
    __tablename__ = "armarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    numero: Mapped[str] = mapped_column(String(10), unique=True, index=True)
    status: Mapped[StatusArmario] = mapped_column(default=StatusArmario.DISPONIVEL)
    tamanho: Mapped[TamanhoArmario] = mapped_column()
