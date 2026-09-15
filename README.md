# locky

Locky é um projeto de gestão de reservas de armários de academia desenvolvido para a disciplina de Manutenção e Melhoria de Software da Católica de Santa Catarina, 6ª fase.

## Fluxo de Versionamento e Pipeline de CI/CD

### Estratégia de Branches

- `main`: código pronto e estável para ser enviado para produção.
- `dev`: branch de desenvolvimento atual, pendente de testes para ser enviada à produção.
- `feature/CÓDIGO-DA-ISSUE`: correspondente à issues que incluem novas funcionalidades no sistema.
- `fix/CÓDIGO-DA-ISSUE`: correspondente à issues de manutenção do sistema.
- `docs/CÓDIGO-DA-ISSUE`: correspondente à issues de criação de documentação para o sistema.
- `refactor/CÓDIGO-DA-ISSUE` ou `refactor/DESCRICAO-BREVE`: correspondente a alterações no código que não afetam o comportamento do sistema.

### Exemplos
- docs/L3
- docs/L1

### Padronização de Commits

Todos os commits devem seguir o padrão abaixo:
- `nome-da-issue - breve descrição do que foi feito`.
Exemplo:
- `L3 - Criação do README do projeto com padrões de versionamento de código`

```
nome-da-issue - breve descrição do que foi feito.
```

## Definition of Ready (DoR) e Definition of Done (DoD)

### 3.1. Definition of Ready — DoR (Pronto para Desenvolver)

Uma tarefa (issue) só poderá entrar em desenvolvimento quando atender a **todos** os itens abaixo:

- A história de usuário está descrita no formato: *"Como [papel — ex: aluno, recepcionista, administrador], eu quero [funcionalidade] para que [benefício]"*.
- Os critérios de aceitação estão listados de forma objetiva e verificável (ex: "o sistema deve impedir a reserva de um armário já ocupado").
- As regras de negócio relacionadas à reserva de armários foram especificadas, incluindo exceções (ex: tempo máximo de reserva, cancelamento, armário em manutenção, liberação automática por expiração).
- As dependências técnicas foram mapeadas (ex: integração com banco de dados de armários, autenticação de usuários, endpoints de API envolvidos).
- O layout/protótipo de tela foi definido e aprovado pela equipe, quando a issue envolver interface com o usuário.
- A issue foi estimada e priorizada pela equipe (ex: story points, prioridade no board).
- A issue está corretamente classificada com o tipo de branch correspondente (`feature`, `fix`, `docs` ou `refactor`), conforme a estratégia de branches deste README.

### 3.2. Definition of Done — DoD (Pronto para Entrega / Concluído)

Uma tarefa só será considerada **"Concluída"** se atender rigorosamente a todos os itens:

- O código foi implementado seguindo os padrões de código e nomenclatura definidos pela equipe.
- Os commits seguem o padrão de mensagens estabelecido neste README (`nome-da-issue - breve descrição do que foi feito`).
- O código passou por Code Review, com Pull Request aprovado por pelo menos outro integrante da equipe.
- Testes (unitários e/ou de integração, conforme aplicável) foram criados ou atualizados e estão passando.
- A funcionalidade foi validada manualmente contra os critérios de aceitação definidos na DoR da issue, sem erros críticos ou bloqueantes.
- Não foram introduzidas regressões em funcionalidades já existentes do sistema.
- A documentação relevante (README, comentários de código, documentação de API) foi atualizada, quando aplicável.
- O Pull Request foi mesclado na branch `dev`, sem conflitos pendentes.
- A issue correspondente foi movida para a coluna "Concluído" no board do projeto.

## Guia de Estilo e Padrões de Código

> Esta seção existia desde o card L2 (17/08) com as convenções em aberto, pendentes da definição de stack. Foi perdida acidentalmente em `dev` durante a resolução de merge do PR #5 (`doc/L3`, 24/08), que partiu de um ponto anterior à sua criação. Restaurada e atualizada aqui com a stack já confirmada pela equipe: **backend em Python/FastAPI** e **frontend em TypeScript/React (Vite)**.

### 5.1. Convenções de Código

Como as duas camadas usam linguagens com convenções idiomáticas próprias e bem estabelecidas, as regras abaixo são definidas por camada — não faz sentido impor um guia único genérico sobre Python e TypeScript.

**Backend — Python / FastAPI**

- **Nomenclatura de variáveis, funções e módulos:** `snake_case` (ex.: `buscar_armario_disponivel`, `usuario_logado`).
- **Nomenclatura de classes:** `PascalCase` (ex.: `ReservaArmario`, `UsuarioService`).
- **Nomenclatura de constantes:** `UPPER_SNAKE_CASE` (ex.: `TEMPO_MAXIMO_RESERVA`).
- **Nomenclatura de arquivos e pastas:** `snake_case` (ex.: `reserva_armario.py`, `armario_service/`), conforme PEP 8.
- **Type hints obrigatórios** em toda função pública (parâmetros e retorno); `mypy --strict` roda no CI, não é sugestão.
- **Lint e formatação:** `ruff` como ferramenta única (substitui black + isort + flake8); zero warnings tolerados no CI.
- **Schemas de request/response:** Pydantic v2 (`model_validate`, `model_dump`, `Field(...)`) — nunca os métodos v1 depreciados.
- **Endpoints FastAPI:** um `APIRouter` por domínio, `Depends()` para injeção (auth, sessão de DB, paginação), `response_model` explícito em todo endpoint, status codes via `status.HTTP_*` (nunca número mágico solto).
- **Modelos de dados:** SQLAlchemy 2.0 no estilo novo (`Mapped[...]`, `mapped_column`), não o estilo legado `Column()` solto.

**Frontend — TypeScript / React**

- **Nomenclatura de variáveis e funções:** `camelCase` (ex.: `buscarArmarioDisponivel`, `usuarioLogado`).
- **Nomenclatura de componentes React:** `PascalCase`, arquivo com o mesmo nome do componente (ex.: `Dashboard.tsx` exportando `function Dashboard()`), seguindo o que já está em `src/pages` e `src/layouts`.
- **Nomenclatura de tipos e interfaces:** `PascalCase` (ex.: `Locker`, `ReservationStatus`).
- **Nomenclatura de constantes:** `UPPER_SNAKE_CASE`.
- **Nomenclatura de arquivos não-componente** (services, types, utils): `camelCase` (ex.: `lockerService.ts`, `reservationService.ts`), seguindo o padrão já em uso em `src/services` e `src/types`.
- **Lint:** ESLint, config já commitada em `frontend/eslint.config.js` (`@eslint/js` + `typescript-eslint` + regras de React Hooks); o build (`tsc -b && vite build`) falha com qualquer erro de tipo.

**Idioma do código (vale para as duas camadas)**

- Nomes de domínio (conceitos de negócio do Locky) em português: `Armario`, `Reserva`, `associado`, etc. — refletem o vocabulário do case de negócio e já são usados assim nos models/enums do backend (Fase 1).
- Termos técnicos genéricos e consolidados pelos frameworks seguem o inglês: `service`, `router`, `repository`, `dto`, `schema`, `hook`, etc.
- ⚠️ **Pendência de alinhamento:** os tipos atuais do frontend (`Locker`, `Reservation`) usam nomes e valores de enum em inglês (`available`/`reserved`/`occupied`), escritos antes desta convenção existir. Ver `docs/regras-negocio-contrato-api.md` para a proposta de vocabulário único entre front e back antes da integração real com a API.

### 5.2. Boas Práticas de Manutenibilidade

- **Evitar duplicação de código:** lógica repetida em mais de um lugar deve ser extraída para funções, métodos ou módulos reutilizáveis; antes de copiar e colar um trecho, avaliar se ele pode ser generalizado.
- **Responsabilidade única e tamanho de função:** cada função/método deve ter uma única responsabilidade e não ultrapassar 30 linhas. Funções maiores só são aceitas com justificativa técnica registrada em comentário no código ou na descrição do Pull Request.
- **Tratamento de exceções:** toda exceção previsível deve ser capturada e tratada (log, mensagem de erro ao usuário ou repropagação controlada). É proibido o uso de blocos vazios (`catch` no frontend, `except` no backend) — se uma exceção for intencionalmente ignorada, o motivo deve ser documentado em comentário no próprio bloco. No backend isso também é barrado automaticamente pelo lint (`ruff`, regra `E722`).
- **Verificação:** o cumprimento destas práticas é verificado em Code Review antes do merge na `dev`. No backend, adicionalmente é barrado de forma automática pelo pipeline de CI (`ruff` + `mypy --strict` + gate de cobertura de testes).
