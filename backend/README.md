# Locky — Backend

API de gestão de reservas de armários de academia, construída com FastAPI.

## Stack

- **FastAPI** + Uvicorn
- **SQLAlchemy 2.0** + Alembic (migrations)
- **PostgreSQL**
- **Pydantic v2** / pydantic-settings
- **uv** (gerenciador de pacotes)
- **ruff** (lint + format), **mypy --strict**, **pytest** (cobertura 100%)

## Requisitos

- Python 3.12
- [uv](https://docs.astral.sh/uv/)
- Docker (para o Postgres via `docker-compose`)

## Setup

```bash
# instalar dependências
uv sync

# variáveis de ambiente
cp .env.example .env

# subir o banco
docker compose up -d db

# aplicar migrations
uv run alembic upgrade head

# rodar a API (http://localhost:8080)
uv run uvicorn app.main:app --reload --port 8080
```

## Qualidade

```bash
uv run ruff check .        # lint
uv run ruff format .       # format
uv run mypy app            # tipos (strict)
uv run pytest              # testes + cobertura 100%
```

## Estrutura

```
app/
  api/          # routers (endpoints)
  core/         # config, db, security
  models/       # models SQLAlchemy
  schemas/      # schemas Pydantic (request/response)
  services/     # regras de negócio
  repositories/ # acesso a dados
tests/
  unit/
  integration/
```
