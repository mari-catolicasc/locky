# Regras de Negócio e Contrato de API — Locky

> Rascunho produzido pelo Engenheiro de Requisitos a partir do roteiro local de implementação do backend (não versionado). Objetivo: transformar as decisões marcadas como `[ASSUMIDO]` em regras formais — confirmadas pelo PO ou registradas como débito técnico (Acordo de Manutenibilidade, seção 2) — e travar um contrato único entre frontend e backend antes das Fases 2–4 do backend serem implementadas. Cada item de "Pendente PO" deve virar um card no Trello.

## 1. Por que este documento existe

O backend já está implementando (Fases 0 e 1 concluídas) sem nenhuma regra de negócio formalizada — a seção de Guia de Estilo foi perdida num merge e o `.docx` do Acordo só tem placeholders. Isso violou a própria DoR do time, que exige regras de negócio especificadas antes de uma issue entrar em desenvolvimento. Este documento cobre esse buraco agora, antes que as Fases 2–4 (autenticação, armários, reservas) sejam codificadas em cima de suposições não revisadas.

## 2. Vocabulário de domínio — proposta de contrato único

O backend já modelou os enums em português (`StrEnum`, Fase 1). O frontend, escrito antes da stack ser confirmada, usa nomes e valores em inglês. **Hoje não há custo de migração real**, porque `lockerService.ts`/`reservationService.ts` ainda retornam dados mockados em memória, não uma API real — então este é o momento certo de convergir, antes de existir uma integração de verdade para quebrar.

**Proposta:** a API expõe os valores de enum já definidos no backend (Fase 1), e o frontend atualiza seus tipos para os mesmos valores. Confirmar com Lucas (Frontend) antes de travar.

| Conceito | Backend (Fase 1, já implementado) | Frontend hoje (`src/types`) | Ação proposta |
|---|---|---|---|
| Status do armário | `disponivel \| ocupado \| reservado \| manutencao` (4 valores) | `available \| reserved \| occupied` (3 valores, inglês) | Frontend adota os 4 valores em português; UI ganha um estado visual para "manutenção" |
| Tamanho do armário | `pequeno \| medio \| grande` | `small \| medium \| large` (a tela de Reservations já exibe "Pequeno/Médio/Grande" como texto, mas o tipo `Locker.size` usa inglês) | Unificar em `pequeno \| medio \| grande` nos dois lados |
| Status da reserva | `ativa \| concluida \| cancelada` | `active \| completed \| cancelled` | Unificar em `ativa \| concluida \| cancelada` |
| Papel do usuário | `associado \| admin` (2 valores, roteiro do backend) | não existe ainda no frontend | ⚠️ **Ver pendência RN06 abaixo** — a DoR já fala em 3 papéis (aluno, recepcionista, administrador), não 2 |

## 3. Regras de negócio — de `[ASSUMIDO]` para confirmado

| # | Regra | Origem | Status |
|---|---|---|---|
| RN01 | Um associado só pode ter **1 reserva ativa** por vez. | Assumido pelo backend, com base no comportamento do front | **Pendente PO** — parece razoável, mas precisa virar regra oficial antes da Fase 4 (`POST /reservations` já bloqueia com 409 em cima disso) |
| RN02 | Armário tem 4 estados, incluindo `manutencao`, além dos 3 que o front conhece hoje. | Assumido pelo backend | **Pendente PO** + avisar Frontend (Lucas) — quem marca um armário como em manutenção? Existe tela para isso ou é só seed/admin manual? |
| RN03 | Reserva expira automaticamente após um tempo configurável (`TEMPO_MAXIMO_RESERVA`, sugestão 2h) se o armário não for "usado". | Assumido pelo backend (Fase 6) | **Pendente PO** — falta definir (a) o valor exato do tempo, e (b) como o sistema sabe que o armário foi "usado" (não há sensor/IoT no escopo — é uma confirmação manual do associado na tela, tipo "check-in"? Se não houver essa ação, a reserva nunca teria como ser marcada como usada antes de expirar) |
| RN04 | Cancelamento é permitido a qualquer momento antes do uso, sem janela mínima de antecedência. | Assumido pelo backend | **Pendente PO** — confirmar se não há penalidade para cancelamentos recorrentes (ex.: no-show) |
| RN05 | Conflito de reserva no mesmo armário é resolvido por transação/lock — primeiro que confirma, leva. | Decisão técnica do backend (Fase 4), não é bem uma regra de negócio | **Informativo** — só precisa de OK do PO se algum perfil (ex.: recepcionista) deveria ter prioridade sobre associado comum |
| RN06 | Papéis de usuário: a DoR (seção 3.1) menciona três papéis — *aluno, recepcionista, administrador* — mas o roteiro do backend só modela dois (`associado`, `admin`). | Inconsistência entre documentos | **Pendente PO** — decidir: `recepcionista` é o mesmo que `admin` para fins de permissão, ou precisa de um terceiro papel com regras próprias (ex.: pode cadastrar armário mas não pode ver relatórios)? Isso afeta o schema de `Usuario` e as dependências de autorização por rota |

## 4. Contrato de API proposto — Fases 2 a 4

Formato de resposta: JSON, `snake_case`, chaves e valores de enum em português conforme seção 2. Todo endpoint autenticado exige header `Authorization: Bearer <token>`.

### Fase 2 — Autenticação

```
POST /auth/login
Body:     { "email": "aluno@exemplo.com", "senha": "..." }
200:      { "access_token": "...", "token_type": "bearer" }
401:      credenciais inválidas (mensagem genérica — não indicar se foi email ou senha)

GET /auth/me
200:      { "id": 1, "nome": "...", "email": "...", "papel": "associado" }
401:      token ausente, inválido ou expirado
```

### Fase 3 — Armários

```
GET /lockers?status=disponivel&size=medio&page=1&page_size=20
200:      { "items": [ { "id": 1, "numero": "01", "status": "disponivel", "tamanho": "medio" } ], "total": 12, "page": 1, "page_size": 20 }

GET /lockers/stats
200:      { "total": 12, "disponiveis": 6, "reservados": 3, "ocupados": 3, "em_manutencao": 0 }
```
`POST /lockers` (cadastro de armário): **pendente decisão do PO** (ver Fase 3 do roteiro do backend) — se não houver tela de cadastro, documentar aqui que o provisionamento é manual via seed/migration.

### Fase 4 — Criar reserva

```
POST /reservations
Body:     { "locker_id": 1, "data": "2026-09-15", "hora": "14:00" }
201:      { "id": 10, "armario": { "id": 1, "numero": "01" }, "data": "...", "hora": "...", "status": "ativa" }
409:      já existe reserva ativa do usuário (RN01) — corpo de erro conforme seção 5
409:      armário não está disponível
422:      payload inválido (ex.: data no passado)
```

### Fase 5 — Cancelar e histórico

```
PATCH /reservations/{id}/cancel
200:      reserva atualizada com status "cancelada"; armário volta a "disponivel"
403:      reserva pertence a outro usuário
409:      reserva já cancelada ou concluída

GET /reservations/me?status=ativa
GET /reservations/me/history?search=&status=&start_date=&end_date=&page=1&page_size=20
```

## 5. Formato padrão de erro (antecipando a Fase 7)

Definir isso agora evita retrabalho — cada handler de erro das Fases 2–6 já pode seguir este formato em vez de ser padronizado depois:

```json
{
  "error": {
    "code": "RESERVA_JA_ATIVA",
    "message": "Você já possui uma reserva ativa.",
    "details": null
  }
}
```

- `code`: string estável em `UPPER_SNAKE_CASE`, para o frontend tratar por código, não por texto.
- `message`: texto amigável em português, seguro para mostrar ao usuário.
- `details`: opcional, usado em erros de validação (422) para apontar o campo.

## 6. Próximos passos

1. PO confirma ou ajusta RN01–RN06 (base para os cards do Trello referentes às Fases 2–6 do backend).
2. Frontend (Lucas) valida a proposta de vocabulário único da seção 2 antes de ser adotada.
3. Depois de aprovado, este documento vira a referência de contrato para as Fases 2–5 do backend e para o momento em que o frontend trocar os mocks pela API real.
