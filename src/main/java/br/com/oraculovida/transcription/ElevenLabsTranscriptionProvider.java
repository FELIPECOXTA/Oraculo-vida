package br.com.oraculovida.transcription;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ElevenLabsTranscriptionProvider implements TranscriptionProvider {
    private final String apiKey;
    private final String model;
    private final ObjectMapper mapper;
    private final HttpClient http = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10)).build();

    public ElevenLabsTranscriptionProvider(@Value("${elevenlabs.api-key:}") String apiKey,
            @Value("${elevenlabs.model:scribe_v2}") String model, ObjectMapper mapper) {
        this.apiKey = apiKey;
        this.model = model;
        this.mapper = mapper;
    }
    @Override public String name() { return "elevenlabs"; }
    @Override public int priority() { return 3; }
    @Override public boolean isConfigured() { return !apiKey.isBlank() && !model.isBlank(); }

    @Override public String transcribe(byte[] audio, String mime) throws Exception {
        MultipartAudio.Payload body = MultipartAudio.build(audio, mime, Map.of("model_id", model));
        HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.elevenlabs.io/v1/speech-to-text"))
            .timeout(Duration.ofSeconds(90))
            .header("xi-api-key", apiKey)
            .header("Content-Type", body.contentType())
            .POST(HttpRequest.BodyPublishers.ofByteArray(body.bytes())).build();
        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) throw new IOException("ElevenLabs upstream failed");
        JsonNode json = mapper.readTree(response.body());
        String text = json.path("text").asText("");
        if (text.isBlank()) throw new IOException("ElevenLabs empty transcription");
        return text.trim();
    }
}
