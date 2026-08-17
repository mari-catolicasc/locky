# locky
Locky é um projeto de gestão de reservas de armários de academia desenvolvido para a disciplina de Manutenção e Melhoria de Software da Católica de Santa Catarina, 6ª fase.

# Guia de Estilo e Padrões de Código

## Convenções de Código
> ⚠️ **Stack ainda não confirmada pela equipe.** As convenções abaixo foram definidas de forma independente de linguagem/framework para não travar o card L2 no prazo. Assim que o PO e os devs de Frontend/Backend confirmarem a stack, atualizar o campo "Linguagem/Stack" abaixo e revisar as convenções de nomenclatura de arquivos se necessário (ex.: componentes React usam PascalCase no nome do arquivo, diferente do kebab-case padrão).

- **Linguagem/Stack:** `[A DEFINIR — aguardando confirmação da equipe]`
- **Nomenclatura de Variáveis e Funções:** `camelCase` (ex.: `buscarArmarioDisponivel`, `usuarioLogado`).
- **Nomenclatura de Classes:** `PascalCase` (ex.: `ReservaArmario`, `UsuarioService`).
- **Nomenclatura de Constantes:** `UPPER_SNAKE_CASE` (ex.: `TEMPO_MAXIMO_RESERVA`).
- **Nomenclatura de Arquivos e Pastas:** `kebab-case` (ex.: `reserva-armario.ts`, `armario-service/`), com exceção dos casos em que o framework escolhido exigir convenção própria — essa exceção deve ser documentada aqui assim que a stack for definida.
- **Idioma do Código:** português para nomes de domínio (classes, variáveis, funções e comentários que representem conceitos de negócio do Locky, como `Armario`, `Reserva`, `associado`), já que reflete a linguagem do case de negócio e da equipe. Termos técnicos genéricos e consolidados pelos frameworks (ex.: `service`, `controller`, `repository`, `dto`) podem seguir o inglês.

## Boas Práticas de Manutenibilidade
- **Evitar duplicação de código:** lógica repetida em mais de um lugar deve ser extraída para funções, métodos ou módulos reutilizáveis; antes de copiar e colar um trecho, avaliar se ele pode ser generalizado.
- **Responsabilidade única e tamanho de função:** cada função/método deve ter uma única responsabilidade e não ultrapassar 30 linhas. Funções maiores só são aceitas com justificativa técnica registrada em comentário no código ou na descrição do Pull Request.
- **Tratamento de exceções:** toda exceção previsível deve ser capturada e tratada (log, mensagem de erro ao usuário ou repropagação controlada). É proibido o uso de blocos `catch` vazios — se uma exceção for intencionalmente ignorada, o motivo deve ser documentado em comentário no próprio bloco.
- **Verificação:** o cumprimento destas práticas é verificado em Code Review antes do merge na `main`, conforme o DoD definido pelo QA.

# Fluxo de Versionamento e Pipeline de CI/CD
## Estratégia de Branches
- `main`: código pronto e estável para ser enviado para produção.
- `dev`: branch de desenvolvimento atual, pendente de testes para ser enviada à produção.
- `feature/nome-da-issue`: correspondente à issues que incluem novas funcionalidades no sistema.
- `fix/nome-da-issue`: correspondente à issues de manutenção do sistema.
- `docs/nome-da-issue`: correspondente à issues de criação de documentação para o sistema.
- `refactor/nome-da-issue` ou `refactor/descricao-breve`: correspondente a alterações no código que não afetam o comportamento do sistema.

## Padronização de Commits
Todos os commits devem seguir o padrão abaixo:
- `nome-da-issue - breve descrição do que foi feito`.
