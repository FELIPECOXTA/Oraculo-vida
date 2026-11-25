# Oráculo Vida

Aplicação full-stack em um único repositório. O backend Java/Spring Boot serve a API e a interface web; front-end, back-end, cálculos, testes e documentação ficam versionados juntos.

## Identidade
- Paleta: roxo profundo `#100D21`, violeta `#4E369C`, lilás `#CCBEFF`, dourado suave `#FFE09D`.
- Interface responsiva, glassmorphism discreto, animações sutis e tipografia compacta.
- Produto enxuto: Matriz do Destino, Mapa Astral e Numerologia como núcleo.

## Estrutura
- `src/main/java`: API Spring Boot.
- `src/main/resources/static`: interface servida pelo Spring Boot.
- `docs`: escopo e plano.
- `src/test`: testes.

## Execução local
Requisitos: Java 17+ e Maven.
```bash
mvn spring-boot:run
```
A aplicação: http://localhost:8080.

## Status
A branch `rebuild/fullstack-oraculo-vida` contém a reconstrução em andamento. Recursos ainda não implementados devem ficar claramente identificados como indisponíveis, sem simular cálculos nem inventar resultados.

## Segurança
Não colocar tokens ou chaves de IA no frontend. Dados de nascimento e localização são pessoais; minimizar coleta e não persistir sem consentimento. IA explica resultados, mas cálculos são determinísticos e testados.

Consulte `docs/PRODUCT-SCOPE.md` e `docs/IMPLEMENTATION-PLAN.md`.
