# Locky — Sistema de Gestão de Reservas de Armários

O **Locky** é uma solução web moderna desenvolvida para a gestão e reserva simplificada de armários em academias, centros esportivos e ambientes corporativos.

---

## 📋 Matriz de Papéis da Equipe e Histórico de Contribuições (N1)

| Integrante | Papel Principal | Principais Atividades Realizadas (N1) | Evidências / Artefatos |
| :--- | :--- | :--- | :--- |
| **Leonardo Lima** | **Product Owner (PO)** | Definção do backlog, refinamento dos critérios de aceite, gestão do escopo da N1, estruturação dos artefatos de entrega e liderança da apresentação do Pitch. | Issue tracking, [docs/PITCH_ROTEIRO_PO.md](docs/PITCH_ROTEIRO_PO.md), [docs/handoff.md](docs/handoff.md). |
| **Marina** | **DevOps** | Elaboração do diário de bordo, gestão do repositório GitHub, acompanhamento de entregas, revisão de PRs, criação de acordos de manutenibilidade e governança das releases. | Pull Requests #1 a #5, #12, branch management, `Acordo de Manutenibilidade e Engenharia de So.docx`. |
| **Miguel Dufloth** | **Backend Developer** | Desenvolvimento da API REST em FastAPI, autenticação JWT, modelagem de banco de dados (SQLAlchemy + Alembic), regras de concorrência e testes automatizados. | Commits L8-L15, `backend/app/`, suíte `pytest` (20+ testes). |
| **Lucas Honorato** | **Frontend Developer** | Construção da interface web em React com TypeScript e Vite, telas de Login, Dashboard, Armários e Reservas, e integração com os endpoints REST. | Commits L4 e L16, `frontend/src/`, `frontend-ci.yml`. |
| **Ana Júlia** | **Quality Assurance (QA)** | Testes funcionais, validação de regras de negócio, reporte de bugs de concorrência/interface e verificação de critérios de aceite. | Commit L17 (`fix/l17-corrige-achados-qa`), relatórios de testes. |
| **Miguel Huertas** | **Engenheiro de Requisitos** | Auxílio na preparação de materiais visuais e suporte na síntese dos encontros da disciplina. | `regras-negocio-contrato-api.md`, relatórios de aula. |

---

## 📁 Estrutura de Documentação do Projeto (`docs/`)

- 📐 [**DER.md (Diagrama de Entidade-Relacionamento)**](docs/DER.md): Modelo lógico e físico de banco de dados, dicionário de colunas e restrições.
- 🛠️ [**debitos-tecnicos.md (Gestão de Débito Técnico)**](docs/debitos-tecnicos.md): Política oficial de débitos, critérios de prioridade e inventário de dívidas técnicas.
- 🤝 [**handoff.md (Relatório Formal de Handoff)**](docs/handoff.md): Documento de transferência do projeto, guia arquitetural e parecer de viabilidade para a recepção da N2.
- 🎤 [**PITCH_ROTEIRO_PO.md (Roteiro do Pitch - PO)**](docs/PITCH_ROTEIRO_PO.md): Estrutura de slides em PPTX e roteiro de fala para a apresentação presencial do Product Owner (Leonardo).
- 📜 [**Acordo de Manutenibilidade**](docs/Acordo%20de%20Manutenibilidade%20e%20Engenharia%20de%20So.docx): Diretrizes e combinados da equipe sobre padrões de engenharia.

---

## 📌 DoR e DoD (Definition of Ready & Definition of Done)

### Definition of Ready (DoR) — Uma issue está pronta para desenvolvimento quando:
1. Tem um título claro seguindo o padrão de nomenclatura.
2. Contém a descrição do problema ou da funcionalidade esperada.
3. Possui os **Critérios de Aceite** definidos e testáveis.
4. Foi estimada pela equipe e priorizada no backlog pelo Product Owner.
5. Não possui bloqueios pendentes de outras atividades.

### Definition of Done (DoD) — Uma tarefa é considerada concluída quando:
1. O código foi implementado seguindo o guia de estilo do projeto.
2. Foram criados ou atualizados os testes automatizados correspondentes.
3. O código passa sem erros no pipeline de CI (lint e testes).
4. O Pull Request foi revisado e aprovado por pelo menos um integrante da equipe.
5. As alterações foram mescladas na branch `dev`.
6. A documentação (DER, endpoints ou README) foi atualizada, se aplicável.

---

## 🌿 Versionamento e Padronização

### Nomenclatura de Branches
- `feature/nome-da-funcionalidade` — Novas funcionalidades.
- `fix/nome-da-correcao` — Correção de bugs.
- `docs/nome-da-documentacao` — Alterações em documentação.
- `refactor/nome-do-debito` — Quitação de débitos técnicos.

### Nomenclatura de Commits
Todos os commits devem seguir o padrão:
`NOME-DA-ISSUE - breve descrição do que foi feito`

---

## 🚀 Como Executar o Projeto Localmente

### Backend (FastAPI)
```bash
cd backend
uv sync
cp .env.example .env
docker compose up -d db
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8080
```
- Swagger API Docs: `http://localhost:8080/docs`

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Aplicação Web: `http://localhost:5173`

---

## 🧪 Testes Automatizados

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run build
```
