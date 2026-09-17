# Pitch de Apresentação N1 - Roteiro do Product Owner (Leonardo Lima)

> **Projeto**: Locky - Sistema Inteligente de Gestão de Armários  
> **Apresentador**: Leonardo Lima (Product Owner)  
> **Tempo Sugerido**: 5 a 7 minutos  
> **Público-alvo**: Professor e Equipe Receptora do Handoff  

---

## 1. Estrutura dos Slides (PPTX)

| Slide | Título | Conteúdo Principal |
| :--- | :--- | :--- |
| **Slide 1** | **Locky - Gestão Inteligente de Armários** | Nome da equipe, integrantes, papel do PO (Leonardo Lima), logo/tema do projeto. |
| **Slide 2** | **O Problema & A Dor do Usuário** | Filas em recepções de academias, armários ocupados indefinidamente, chaves perdidas e falta de visibilidade em tempo real. |
| **Slide 3** | **A Solução Locky** | Plataforma web responsiva e self-service. Reserva rápida em poucos cliques, liberação automática por expiração e controle de acesso via perfil. |
| **Slide 4** | **Arquitetura & Engenharia** | FastAPI (Python), React + TypeScript, SQLAlchemy, Alembic e PostgreSQL/SQLite. Comunicação via REST API padronizada. |
| **Slide 5** | **Manutenibilidade & Qualidade (N1)** | Cobertura de testes unitários/integração (`pytest`), esteira de CI no GitHub Actions, política e inventário de Débitos Técnicos. |
| **Slide 6** | **Demonstração do Sistema** | Telas principais: Login, Dashboard, Grade de Armários (filtros/status), Minhas Reservas e Histórico. |
| **Slide 7** | **Handoff & Próximos Passos** | Estrutura da pasta `docs/` (`DER.md`, `debitos-tecnicos.md`, `handoff.md`), tag `v1.0` no Git e viabilidade de recepção para a N2. |

---

## 2. Roteiro de Fala Passo a Passo (Fala do Leonardo)

### Slide 1: Abertura e Apresentação (30 segundos)
> *"Boa noite professor, boa noite turma! Meu nome é **Leonardo Lima**, sou o **Product Owner** da equipe e hoje vou apresentar o **Locky**, o nosso sistema de gestão e reserva inteligente de armários para academias e ambientes corporativos."*

---

### Slide 2: O Problema (1 minuto)
> *"Quem nunca chegou na academia no horário de pico e perdeu minutos valiosos tentando encontrar um armário livre? Ou então se deparou com armários trancados por pessoas que nem estavam mais no local?*  
> *A gestão manual de armários gera filas na recepção, desperdício de espaço, chaves perdidas e zero controle sobre a taxa de ocupação do estabelecimento. Foi exatamente essa dor que o time Locky decidiu resolver."*

---

### Slide 3: A Solução (1 minuto)
> *"O Locky é uma plataforma web 100% autônoma. O aluno acessa o sistema pelo smartphone ou computador, escolhe o tamanho do armário desejado (pequeno, médio ou grande), visualiza os disponíveis em tempo real e realiza a reserva em segundos.*  
> *Além disso, o sistema conta com expiração automática inteligente: caso o tempo limite da reserva expire, o armário é liberado automaticamente no banco de dados para que outro usuário possa utilizar."*

---

### Slide 4 & 5: Engenharia, Qualidade e Manutenibilidade (1 minuto e meio)
> *"Como nosso foco nesta disciplina é a **Manutenção e Melhoria de Software**, construímos o Locky com padrões rigorosos de engenharia:*  
> - *No **Backend**, usamos FastAPI com Python 3.12, aplicando o padrão Repository e serviços isolados.*  
> - *No **Frontend**, utilizamos React com TypeScript e Vite para garantir tipagem forte e rápida resposta visual.*  
> - *Configuramos uma esteira de **CI no GitHub Actions** que valida automaticamente o código a cada Pull Request.*  
> - *E o mais importante: registramos todos os nossos débitos técnicos em um inventário formal com política de orçamento de 15% de refatoração por ciclo."*

---

### Slide 6: Demonstração e Resultados da N1 (1 minuto)
> *"Durante o ciclo N1, nossa equipe concluiu do L1 ao L17:*  
> - *Autenticação segura via JWT com hash de senha bcrypt.*  
> - *Listagem dinâmica de armários com filtros por tamanho e status.*  
> - *Prevenção de concorrência com lock otimista (garantindo que dois usuários não dobrem a reserva do mesmo armário).*  
> - *Histórico completo de reservas ativas, concluídas e canceladas."*

---

### Slide 7: Handoff e Conclusão (1 minuto)
> *"Finalizamos a entrega da N1 com o repositório congelado na release tag **v1.0**.*  
> *Toda a documentação exigida está organizada na pasta `docs/`: temos o Diagrama de Entidade-Relacionamento (`DER.md`), o Inventário de Débitos Técnicos (`debitos-tecnicos.md`) e o Relatório Formal de Handoff (`handoff.md`).*  
> *A base de código está limpa, testada e pronta para ser recebida com total viabilidade pela equipe de handoff. Muito obrigado a todos!"*

---

## 3. Perguntas Frequentes & Dicas de Defesa para o PO

- **P: Como vocês garantiram que dois alunos não reservam o mesmo armário ao mesmo tempo?**
  - **Resposta do PO**: *"Tratamos isso no backend utilizando lock otimista no repositório de reservas (`reserva_repository.py`) e verificando se o status do armário permanece `DISPONIVEL` na transação do banco. Se houver concorrência, o segundo pedido é rejeitado com mensagem clara e código HTTP 409 Conflict."*

- **P: Qual foi o maior débito técnico assumido na N1?**
  - **Resposta do PO**: *"O uso do banco SQLite na fase inicial para acelerar os testes. Registramos esse débito como `DT-01` no `docs/debitos-tecnicos.md` com prioridade Alta para migração para PostgreSQL na N2."*
