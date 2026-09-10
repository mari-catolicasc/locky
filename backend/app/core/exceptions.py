class CredenciaisInvalidasError(Exception):
    """Credenciais de login inválidas ou token não autenticável."""


class ArmarioNaoEncontradoError(Exception):
    """Armário referenciado não existe."""


class ArmarioIndisponivelError(Exception):
    """Armário não está com status DISPONIVEL."""


class UsuarioComReservaAtivaError(Exception):
    """Usuário já possui uma reserva com status ATIVA."""
