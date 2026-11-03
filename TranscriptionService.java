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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
@Service
public class TranscriptionService {
  private final String apiKey;
  private final String model;
  private final ObjectMapper mapper;
  private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
  public TranscriptionService(@Value("${gemini.api-key:}") String apiKey,@Value("${gemini.model:}") String model,ObjectMapper mapper) {
    this.apiKey=apiKey;this.model=model;this.mapper=mapper;
  }
  public String transcribe(MultipartFile file,String mime) throws IOException,InterruptedException {
    if (apiKey.isBlank() || model.isBlank()) throw new IllegalStateException("Gemini not configured");
    String encoded=Base64.getEncoder().encodeToString(file.getBytes());
    Map<String,Object> body=Map.of("contents",new Object[]{Map.of("parts",new Object[]{
      Map.of("text","Transcreva fielmente o áudio no idioma original. Não invente falas, nomes ou palavras. Marque trechos incompreensíveis como [trecho inaudível]. Retorne somente a transcrição."),
      Map.of("inline_data",Map.of("mime_type",mime,"data",encoded))
    })});
    HttpRequest request=HttpRequest.newBuilder().uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/"+URLEncoder.encode(model,StandardCharsets.UTF_8)+":generateContent"))
      .timeout(Duration.ofSeconds(90)).header("Content-Type","application/json").header("x-goog-api-key",apiKey)
      .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body))).build();
    HttpResponse<String> response=http.send(request,HttpResponse.BodyHandlers.ofString());
    if (response.statusCode()!=200) throw new IOException("Gemini HTTP "+response.statusCode());
    JsonNode candidates=mapper.readTree(response.body()).path("candidates");
    if (!candidates.isArray() || candidates.isEmpty()) throw new IOException("No transcription");
    StringBuilder result=new StringBuilder();
    for (JsonNode part:candidates.get(0).path("content").path("parts")) {
      if (part.hasNonNull("text")) { if (result.length()>0) result.append("\n"); result.append(part.get("text").asText()); }
    }
    if (result.length()==0) throw new IOException("Empty transcription");
    return result.toString();
  }
}
