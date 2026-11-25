# Plano de implementação e validação

## Fase 0: recuperação
- [x] Confirmar repositório de destino `FELIPECOXTA/Oraculo-vida`.
- [x] Inventariar a base Spring Boot existente.
- [x] Criar branch de reconstrução.
- [ ] Importar e revisar frontend existente antes de reaproveitar componentes.
- [ ] Verificar documentação e regras completas de Matriz do Destino, incluindo continuação da seção chakras/parejas.

## Fase 1: monorepo funcional
- [ ] Servir frontend integrado ao Spring Boot.
- [ ] Layout responsivo, tema roxo e navegação simples.
- [ ] Configuração de build/teste e CI.

## Fase 2: cálculos
- [ ] Matriz do Destino: implementar regras confirmadas, testes de casos-limite e validação contra exemplos.
- [ ] Numerologia: documentar fórmula, implementar e testar.
- [ ] Mapa Astral: geocodificação, fuso histórico, efemérides e sistema de casas selecionado; não mostrar cálculo até motor confiável estar integrado.

## Fase 3: experiência de resultado
- [ ] Formulário separado de tela de leitura.
- [ ] Visualizações legíveis e acessíveis.
- [ ] Explicações, fórmulas e limitações exibidas no próprio produto.
- [ ] IA opcional para interpretação, mantendo cálculo separado.

## Fase 4: qualidade
- [ ] Testes unitários e de integração.
- [ ] Validação de responsividade, acessibilidade, privacidade e segurança.
- [ ] Build de produção.
- [ ] Deploy somente após configurar infraestrutura e secrets, não assumir que GitHub push publica o serviço.

## Critério de entrega
Só marcar um recurso como concluído após código commitado, build/teste executado e verificação funcional. Status e limitações ficam explícitos no README.
