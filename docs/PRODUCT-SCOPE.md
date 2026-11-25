# Oráculo Vida | Escopo consolidado

## Produto
Aplicativo de autoconhecimento com interface roxa existente, visual desktop/mobile, layout adaptativo e foco em três ferramentas bem construídas:
1. **Matriz do Destino**: cálculo determinístico conforme as regras recebidas (redução de números de 1 a 22, posições do quadrado pessoal/ancestral e linhas internas). A especificação de chakras, pares e interpretações está incompleta no histórico recuperado e deve ser completada antes de implementar esses trechos.
2. **Mapa Astral**: cálculo astronômico real, com data, hora, cidade/país obrigatórios, coordenadas, timezone histórico e efemérides confiáveis. Nenhuma posição deve ser inventada ou estimada por IA.
3. **Numerologia**: módulo complementar enxuto, regras explícitas, entradas e resultados verificáveis.

## UX
- Paleta preservada: fundo roxo profundo `#100D21`, violeta `#4E369C`, lilás `#CCBEFF`, dourado suave `#FFE09D`.
- Glassmorphism, efeitos sutis, tipografia menor e legível, espaçamento contido, mobile-first com adaptação desktop.
- Campos de data em segmentos/cápsulas arredondadas; foco e edição sem retângulos internos agressivos.
- Após cálculo, mostrar resultados em uma tela própria; não manter o formulário e os dados pessoais no topo da leitura.
- Local de nascimento obrigatório no mapa astral.
- Não usar telas vazias, links metodológicos externos ou botões sem ação.
- Não criar bloqueio global de impressão nem exportação PDF por padrão. A decisão anterior foi não disponibilizar exportação PDF dentro do produto, sem impedir captura de tela do dispositivo.

## Arquitetura
Monorepo: Spring Boot serve APIs e o frontend compilado em `src/main/resources/static`. Modularização dentro do mesmo repositório e execução integrada. Frontend pode usar React/TypeScript compilado para static; Java/Spring Boot controla API, cálculos, autenticação quando adicionada e integração com serviços. Segredos ficam apenas no backend.

## Limites
- IA é camada de interpretação/explicação, nunca motor de cálculo.
- Resultados espirituais e astrológicos são simbólicos, não promessas de previsão.
- Toca da Cabocla/Caminhos do Axé é um produto distinto. Maria Padilha, Orixás e conteúdo religioso não devem ser incorporados ao Oráculo Vida astrológico sem decisão explícita.
- Evitar login, pagamento, histórico, tarot e dezenas de módulos na primeira entrega; somente incluir quando necessários e funcionais.
- Administração do proprietário será planejada para controle de usuários/uso e segurança, mas não deve expor dados sensíveis desnecessários.

## Dados
Nascimento e localização são dados pessoais. Minimizar coleta, solicitar consentimento e evitar enviar à IA os dados identificadores quando não necessários. Não persistir consultas por padrão sem escolha clara do usuário.
