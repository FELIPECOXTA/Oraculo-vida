# Origem dos cálculos: regras para o Oráculo Vida

## Estado confirmado (novembro de 2026)

O frontend React/Vite não contém um motor real de cálculos astrológicos. O backend Java/Spring existente ainda não disponibiliza um endpoint de mapa natal. Não apresentar demonstrações ou interpretações como cálculos verificados.

## Contrato para a implementação futura

1. O navegador deve consumir apenas endpoints próprios do Oráculo Vida para mapas e leituras. Não colocar URLs de ferramentas de terceiros, chaves, nomes de provedores, rastros internos ou respostas brutas no frontend, nos sourcemaps públicos, no HTML ou em mensagens de erro.
2. O serviço backend deve aplicar um motor de cálculo independente e verificável ou uma biblioteca/serviço formalmente autorizado. Implementar timezone histórico, geocodificação e tratamento explícito de hora desconhecida. Não copiar resultados, conteúdo ou métodos proprietários de outros sites.
3. Os contratos públicos devem retornar apenas dados necessários ao produto, versões de algoritmo e identificadores próprios, sem cabeçalhos de depuração nem metadados internos. Proteger segredos no servidor e evitar vazar dados de nascimento em logs.
4. Registrar internamente metodologia, dependências, proveniência, condições de uso e evidências de validação. Respeitar licenças, direitos autorais e atribuições obrigatórias: proteção de detalhes internos não autoriza ocultar créditos legalmente exigidos.
5. Validar em homologação o bundle publicado, a aba Network do navegador e os payloads de sucesso/erro; executar testes em desktop e mobile. Se houver envio de dados de usuários a serviços externos, refletir isso com transparência na política de privacidade.

## Barreira automatizada

O `npm run build` executa `scripts/check-source-exposure.mjs`, que falha se nomes de fontes não autorizadas aparecerem nos artefatos de `dist/`, inclusive scripts e sourcemaps. O verificador é preventivo e não substitui auditoria de requisições em tempo de execução ou do backend. Os nomes definidos nesse script não são enviados ao navegador.

## Fora do escopo desta proteção

- Implementar o motor matemático, autenticação ou pagamento.
- Comprovar que uma versão hospedada em outra plataforma usa o mesmo código.
- Garantir ausência de referências em uma versão já implantada sem inspecioná-la e republicá-la.
