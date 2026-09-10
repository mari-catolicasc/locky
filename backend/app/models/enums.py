from enum import StrEnum


class StatusArmario(StrEnum):
    DISPONIVEL = "disponivel"
    RESERVADO = "reservado"
    OCUPADO = "ocupado"
    MANUTENCAO = "manutencao"


class TamanhoArmario(StrEnum):
    PEQUENO = "pequeno"
    MEDIO = "medio"
    GRANDE = "grande"


class StatusReserva(StrEnum):
    ATIVA = "ativa"
    CONCLUIDA = "concluida"
    CANCELADA = "cancelada"


class PapelUsuario(StrEnum):
    ASSOCIADO = "associado"
    ADMIN = "admin"
