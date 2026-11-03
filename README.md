# Oráculo Vida

Projeto independente para consultas de astrologia, tarot e numerologia.

## Entrega inicial

Backend Java 17 / Spring Boot com endpoint de transcrição de áudio Gemini. Somente o conceito de transcrição foi reaproveitado do projeto anterior. Não foram copiados pagamentos, Firebase, login ou interface.

Ainda **não está pronto para produção**. Faltam interface, autenticação por usuário, controle persistente de cotas e rate limiting, pagamentos reais, política de retenção, testes e implementação das consultas.

## Execução

Instale Java 17 e Maven. Defina `GEMINI_API_KEY`, `GEMINI_MODEL` (modelo compatível com áudio) e `ORACULO_INTERNAL_TOKEN` no ambiente. Depois execute `mvn spring-boot:run`.

- `GET /api/health`
- `POST /api/transcriptions`, multipart/form-data, campo `file`, cabeçalho `X-Internal-Token`.

Exemplo:

```bash
curl -X POST http://localhost:8080/api/transcriptions -H "X-Internal-Token: $ORACULO_INTERNAL_TOKEN" -F "file=@audio.mp3"
```

O token é destinado somente a comunicação servidor a servidor. **Não o exponha em aplicativos cliente.** MIME informado pelo cliente é verificado apenas contra uma lista, não por inspeção binária. Implementar validação real de arquivo e controles adicionais antes do lançamento.

## Licenciamento

Nenhum arquivo de licença foi adicionado. Para código proprietário, recomenda-se manter o repositório privado.
