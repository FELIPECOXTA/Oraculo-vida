package br.com.oraculovida.transcription;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GeminiTranscriptionProvider implements TranscriptionProvider {
    private final String apiKey;
    private final String model;
    private final ObjectMapper mapper;
    private final HttpClient http = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10)).build();

    public GeminiTranscriptionProvider(@Value("${gemini.api-key:}") String apiKey,
            @Value("${gemini.model:}") String model, ObjectMapper mapper) {
        this.apiKey = apiKey;
        this.model = model;
        this.mapper = mapper;
    }
    @Override public String name() { return "google-gemini"; }
    @Override public int priority() { return 2; }
    @Override public boolean isConfigured() { return !apiKey.isBlank() && !model.isBlank(); }

    @Override public String transcribe(byte[] audio, String mime) throws Exception {
        String encoded = Base64.getEncoder().encodeToString(audio);
        Map<String, Object> body = Map.of("contents", new Object[] {
            Map.of("parts", new Object[] {
                Map.of("text", "Transcreva fielmente no idioma original. Não invente palavras ou nomes. Marque trechos incompreensíveis como [trecho inaudível]. Retorne somente a transcrição."),
                Map.of("inline_data", Map.of("mime_type", mime, "data", encoded))
            })
        });
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/"
                + URLEncoder.encode(model, StandardCharsets.UTF_8) + ":generateContent"))
            .timeout(Duration.ofSeconds(90))
            .header("Content-Type", "application/json")
            .header("x-goog-api-key", apiKey)
            .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
            .build();
        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) throw new IOException("Gemini upstream failed");
        JsonNode candidates = mapper.readTree(response.body()).path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) throw new IOException("Gemini no candidates");
        StringBuilder text = new StringBuilder();
        for (JsonNode part : candidates.get(0).path("content").path("parts")) {
            if (part.hasNonNull("text")) {
                if (text.length() > 0) text.append("\n");
                text.append(part.path("text").asText());
            }
        }
        if (text.toString().isBlank()) throw new IOException("Gemini empty transcription");
        return text.toString().trim();
    }
}
