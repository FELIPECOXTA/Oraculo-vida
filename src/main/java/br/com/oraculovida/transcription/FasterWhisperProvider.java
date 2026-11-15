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

/**
 * Contrato do adaptador self-hosted: POST multipart /transcribe (file), resposta {"text":"..."}.
 * Faster-Whisper é biblioteca local, não uma API pública gratuita.
 */
@Component
public class FasterWhisperProvider implements TranscriptionProvider {
    private final String url;
    private final ObjectMapper mapper;
    private final HttpClient http = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5)).build();

    public FasterWhisperProvider(@Value("${whisper.transcribe-url:}") String url, ObjectMapper mapper) {
        this.url = url;
        this.mapper = mapper;
    }
    @Override public String name() { return "faster-whisper"; }
    @Override public int priority() { return 1; }
    @Override public boolean isConfigured() { return !url.isBlank(); }

    @Override public String transcribe(byte[] audio, String mime) throws Exception {
        URI target = URI.create(url);
        if (!"https".equalsIgnoreCase(target.getScheme())
                && !"http".equalsIgnoreCase(target.getScheme())) {
            throw new IOException("Invalid Whisper adapter scheme");
        }
        MultipartAudio.Payload body = MultipartAudio.build(audio, mime, Map.of());
        HttpRequest request = HttpRequest.newBuilder(target)
            .timeout(Duration.ofSeconds(90))
            .header("Content-Type", body.contentType())
            .POST(HttpRequest.BodyPublishers.ofByteArray(body.bytes())).build();
        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) throw new IOException("Whisper upstream failed");
        JsonNode payload = mapper.readTree(response.body());
        String text = payload.path("text").asText("");
        if (text.isBlank()) throw new IOException("Whisper empty transcription");
        return text.trim();
    }
}
