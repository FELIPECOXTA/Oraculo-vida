# Decisão de arquitetura: dois backends independentes

**Status:** decisão aprovada pelo proprietário do produto em 2026-11-24.  
**Branch:** arquitetura/separacao-2-produtos  
**Documento de arquitetura; não é implementação.**

## Backend 1: Oráculo Vida
- Primeiro lançamento: tarot e oráculos simbólicos.
- Repositório existente: FELIPECOXTA/Oraculo-vida (Java 17 / Spring Boot).
- README da main consultado em 2026-11-24 descreve health check e endpoint de transcrição via Gemini. Não está pronto para produção e não contém os serviços de tarot/oráculo do escopo.
- Inventariar e manter somente serviços do Oráculo Vida após auditoria. Avaliar transcrição quanto a necessidade, consentimento, retenção, assinatura de arquivo, limites, rate limiting e segurança.

## Backend 2: Toca da Cabocla
- Nome provisório; lançamento posterior.
- Novo repositório privado planejado: FELIPECOXTA/Toca-da-Cabocla-backend (a criar).
- Java 17/Spring Boot é opção para manter familiaridade operacional, mas stack deve ser confirmada antes do scaffold.
- API, banco, migrações, credenciais, logs, métricas, retenção, CI/CD, deploy e orçamento independentes.
- Conteúdo de Maria Padilha, Odu, ancestralidade e tradições espirituais deve ter curadoria e revisão próprias.

## Isolamento
- Bancos e schemas/instâncias separados, sem tabelas compartilhadas.
- Secrets, tokens, API keys e service accounts independentes.
- Endpoints, rate limits, quotas, logs e observabilidade segregados.
- Não compartilhar identidade ou dados entre produtos sem decisão explícita futura, consentimento e avaliação legal/técnica.
- Não assumir conta unificada, transferência de histórico ou integração entre apps.
- Cloud pode ter organização/conta comum, mas workloads, IAM, redes, recursos, custos e ambientes devem estar isolados.

## Sequência
1. Auditar backend atual: arquivos, endpoints, dependências, testes, CI, branches e PRs.
2. Definir MVP Oráculo Vida e separar/remover funcionalidades fora de escopo via PR revisado.
3. Definir contrato API/modelo de dados; implementar testes, segurança, limites e validação.
4. Criar repo privado Toca da Cabocla; scaffold somente após escopo e arquitetura confirmados.
5. Criar banco, migrações, secrets, ambiente e pipeline próprios.
6. Verificar isolamento, builds, testes, deploy, backup/restore, logging sem dados sensíveis e custos.
7. Abrir PRs separados; não fazer merge em main nem provisionar recursos pagos sem aprovação.

## Critérios de aceite
- Backends compilam, testam e deployam independentemente.
- Cada app acessa somente seu backend e banco.
- Não há compartilhamento acidental de tokens, dados, logs sensíveis ou tabelas.
- Contratos e políticas de dados estão documentados por produto.
