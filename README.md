# locky
Locky é um projeto de gestão de reservas de armários de academia desenvolvido para a disciplina de Manutenção e Melhoria de Software da Católica de Santa Catarina, 6ª fase.

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
