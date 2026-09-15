from datetime import date, datetime, time

from sqlalchemy import Date, ForeignKey, Index, Time, func, text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base
from app.models.enums import StatusReserva


class Reserva(Base):
    __tablename__ = "reservas"
    __table_args__ = (
        # Garante em nível de banco que o usuário nunca tenha 2 reservas ATIVA ao
        # mesmo tempo, mesmo sob corrida (o SELECT de checagem em criar_reserva não
        # trava linha nenhuma; essa constraint é a rede de segurança real).
        Index(
            "ix_reservas_usuario_ativa_unica",
            "usuario_id",
            unique=True,
            postgresql_where=text("status = 'ATIVA'"),
            sqlite_where=text("status = 'ATIVA'"),
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), index=True)
    armario_id: Mapped[int] = mapped_column(ForeignKey("armarios.id"), index=True)
    data: Mapped[date] = mapped_column(Date)
    hora: Mapped[time] = mapped_column(Time)
    status: Mapped[StatusReserva] = mapped_column(default=StatusReserva.ATIVA)
    criado_em: Mapped[datetime] = mapped_column(server_default=func.now())
    atualizado_em: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )
