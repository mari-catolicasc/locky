# locky
Locky é um projeto de gestão de reservas de armários de academia desenvolvido para a disciplina de Manutenção e Melhoria de Software da Católica de Santa Catarina, 6ª fase.

# Fluxo de Versionamento e Pipeline de CI/CD
## Estratégia de Branches
- `main`: código pronto e estável para ser enviado para produção.
- `dev`: branch de desenvolvimento atual, pendente de testes para ser enviada à produção.
- `feature/CÓDIGO-DA-ISSUE`: correspondente à issues que incluem novas funcionalidades no sistema.
- `fix/CÓDIGO-DA-ISSUE`: correspondente à issues de manutenção do sistema.
- `docs/CÓDIGO-DA-ISSUE`: correspondente à issues de criação de documentação para o sistema.
- `refactor/CÓDIGO-DA-ISSUE` ou `refactor/DESCRICAO-BREVE`: correspondente a alterações no código que não afetam o comportamento do sistema.

## Exemplos
- docs/L3
- docs/L1

## Padronização de Commits
Todos os commits devem seguir o padrão abaixo:
- `nome-da-issue - breve descrição do que foi feito`.
Exemplo:
- `L3 - Criação do README do projeto com padrões de versionamento de código`
