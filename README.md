# locky

Locky é um projeto de gestão de reservas de armários de academia desenvolvido para a disciplina de Manutenção e Melhoria de Software da Católica de Santa Catarina, 6ª fase.

## Fluxo de Versionamento e Pipeline de CI/CD

### Estratégia de Branches

- `main`: código pronto e estável para ser enviado para produção.
- `dev`: branch de desenvolvimento atual, pendente de testes para ser enviada à produção.
- `feature/nome-da-issue`: correspondente à issues que incluem novas funcionalidades no sistema.
- `fix/nome-da-issue`: correspondente à issues de manutenção do sistema.
- `docs/nome-da-issue`: correspondente à issues de criação de documentação para o sistema.
- `refactor/nome-da-issue` ou `refactor/descricao-breve`: correspondente a alterações no código que não afetam o comportamento do sistema.

### Padronização de Commits

Todos os commits devem seguir o padrão abaixo:

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

### 5.1. Convenções de Código

> ⚠️ **Stack ainda não confirmada pela equipe.** As convenções abaixo foram definidas de forma independente de linguagem/framework para não travar o card L2 no prazo. Assim que o PO e os devs de Frontend/Backend confirmarem a stack, atualizar o campo "Linguagem/Stack" abaixo e revisar as convenções de nomenclatura de arquivos se necessário (ex.: componentes React usam PascalCase no nome do arquivo, diferente do kebab-case padrão).

- **Linguagem/Stack:** `[A DEFINIR — aguardando confirmação da equipe]`
- **Nomenclatura de Variáveis e Funções:** `camelCase` (ex.: `buscarArmarioDisponivel`, `usuarioLogado`).
- **Nomenclatura de Classes:** `PascalCase` (ex.: `ReservaArmario`, `UsuarioService`).
- **Nomenclatura de Constantes:** `UPPER_SNAKE_CASE` (ex.: `TEMPO_MAXIMO_RESERVA`).
- **Nomenclatura de Arquivos e Pastas:** `kebab-case` (ex.: `reserva-armario.ts`, `armario-service/`), com exceção dos casos em que o framework escolhido exigir convenção própria — essa exceção deve ser documentada aqui assim que a stack for definida.
- **Idioma do Código:** português para nomes de domínio (classes, variáveis, funções e comentários que representem conceitos de negócio do Locky, como `Armario`, `Reserva`, `associado`), já que reflete a linguagem do case de negócio e da equipe. Termos técnicos genéricos e consolidados pelos frameworks (ex.: `service`, `controller`, `repository`, `dto`) podem seguir o inglês.

### 5.2. Boas Práticas de Manutenibilidade

- **Evitar duplicação de código:** lógica repetida em mais de um lugar deve ser extraída para funções, métodos ou módulos reutilizáveis; antes de copiar e colar um trecho, avaliar se ele pode ser generalizado.
- **Responsabilidade única e tamanho de função:** cada função/método deve ter uma única responsabilidade e não ultrapassar 30 linhas. Funções maiores só são aceitas com justificativa técnica registrada em comentário no código ou na descrição do Pull Request.
- **Tratamento de exceções:** toda exceção previsível deve ser capturada e tratada (log, mensagem de erro ao usuário ou repropagação controlada). É proibido o uso de blocos `catch` vazios — se uma exceção for intencionalmente ignorada, o motivo deve ser documentado em comentário no próprio bloco.
- **Verificação:** o cumprimento destas práticas é verificado em Code Review antes do merge na `dev`, conforme o DoD definido pelo QA.
