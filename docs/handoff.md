# Relatório Formal de Handoff - Projeto Locky (N1)

## 1. Identificação do Projeto e Equipe

- **Nome do Projeto**: Locky (Sistema de Gestão e Reserva de Armários de Academia)
- **Equipe**: Cartel / Locky Team
- **Product Owner (PO)**: Leonardo Lima
- **Scrum Master / Repo Admin**: Mariana
- **Backend Developers**: Miguel Dufloth
- **Frontend Developers**: Lucas Honorato
- **QA (Quality Assurance)**: Ana Júlia
- **Documentação / Apoio**: Miguel Huertas
- **Repositório GitHub**: [https://github.com/mari-catolicasc/locky](https://github.com/mari-catolicasc/locky)
- **Versão Entregue**: `v1.0` (Release N1)

---

## 2. Visão Geral da Arquitetura

O sistema **Locky** adota uma arquitetura em camadas totalmente desacoplada (Decoupled Full-Stack Architecture):

```
+-------------------------------------------------------+
|                Frontend (React + Vite)                |
|  - TypeScript, React Router, Context API (AuthContext)|
+-------------------------------------------------------+
                           |
                     HTTP REST / JSON
                           v
+-------------------------------------------------------+
|             Backend (FastAPI - Python 3.12)           |
|  - Routers (Auth, Lockers, Reservations, Health)      |
|  - Services (Regras de negócio, Validações)           |
|  - Repositories & SQLAlchemy ORM                      |
|  - Scheduler Background (APScheduler)                 |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|              Banco de Dados (SQLite / PostgreSQL)     |
|  - Migrations controladas via Alembic                 |
+-------------------------------------------------------+
```

---

## 3. Instruções de Instalação e Execução Local

### 3.1. Pré-requisitos
- Python 3.12+ (ou gerenciador `uv`)
- Node.js 18+ e npm

### 3.2. Configurando o Backend
```bash
cd backend
python -m venv .venv
# Ativar venv:
# Windows (PowerShell): .venv\Scripts\Activate.ps1
# Linux/macOS: source .venv/bin/activate

pip install -r pyproject.toml
# Executar migrations do banco de dados:
alembic upgrade head

# Iniciar servidor de desenvolvimento:
uvicorn app.main:app --reload --port 8000
```
- **Documentação Swagger UI**: `http://localhost:8000/docs`
- **ReDoc UI**: `http://localhost:8000/redoc`

### 3.3. Configurando o Frontend
```bash
cd frontend
npm install
npm run dev
```
- Aplicação acessível em `http://localhost:5173`.

---

## 4. Esteira de Qualidade e Testes

O projeto possui integração contínua configurada via **GitHub Actions**:
- `.github/workflows/backend-ci.yml`: Executa verificação de sintaxe, formatação e suíte de testes com `pytest`.
- `.github/workflows/frontend-ci.yml`: Executa verificação de TypeScript e build de produção com Vite.

### Executando Testes Localmente:
```bash
# No diretório backend/
pytest -v
```

---

## 5. Contrato de API e Endpoints Principais

A API é auto-documentada no padrão **OpenAPI 3.0** via FastAPI (`http://localhost:8000/docs`).

| Método | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Autenticação e geração de token JWT | Pública |
| `GET` | `/api/v1/auth/me` | Dados do usuário logado | Bearer Token |
| `GET` | `/api/v1/lockers` | Lista armários com paginação e filtros | Bearer Token |
| `POST` | `/api/v1/reservations` | Cria reserva de armário | Bearer Token |
| `PATCH` | `/api/v1/reservations/{id}/cancel` | Cancela reserva ativa | Bearer Token |
| `GET` | `/api/v1/reservations/history` | Histórico de reservas do usuário | Bearer Token |
| `GET` | `/api/v1/health` | Healthcheck de serviços e banco | Pública |

---

## 6. Parecer de Viabilidade de Recepção do Projeto

> [!IMPORTANT]
> **Avaliação de Viabilidade de Transferência (Handoff)**
> 
> A equipe receptora que assumir o projeto **Locky** na fase N2 encontrará uma base de código **estável, legível e completamente coberta por testes automatizados**.
> 
> **Pontos Fortes**:
> - Separação clara de responsabilidades no Backend (Router -> Service -> Repository -> Model).
> - Migrations de banco de dados gerenciadas rigorosamente via Alembic.
> - Frontend moderno com componentes reutilizáveis, contexto de autenticação e feedback ao usuário.
> - Esteira de CI pré-configurada passando em todos os PRs.
> 
> **Recomendações para a Próxima Equipe**:
> 1. Iniciar a fase N2 migrando o banco de dados de SQLite para PostgreSQL no ambiente de staging/produção (consulte `docs/debitos-tecnicos.md`).
> 2. Implementar a renovação silenciosa de tokens (Refresh Token).
> 3. Expandir o módulo administrativo (painel do admin) para criação e manutenção em lote de armários.
