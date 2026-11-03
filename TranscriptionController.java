package br.com.oraculovida.transcription;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class TranscriptionController {
  private static final Set<String> AUDIO_TYPES = Set.of("audio/mpeg", "audio/mp3", "audio/mp4", "audio/wav", "audio/x-wav", "audio/webm", "audio/ogg", "audio/aac");
  private final TranscriptionService service;
  private final String internalToken;
  public TranscriptionController(TranscriptionService service, @Value("${oraculo.internal-token:}") String internalToken) {
    this.service = service; this.internalToken = internalToken;
  }
  @GetMapping("/health")
  public Map<String,String> health() { return Map.of("status", "ok"); }
  @PostMapping(value="/transcriptions", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> transcribe(@RequestHeader(value="X-Internal-Token",required=false) String token, @RequestParam("file") MultipartFile file) {
    if (internalToken.isBlank() || token == null || !MessageDigest.isEqual(internalToken.getBytes(StandardCharsets.UTF_8),token.getBytes(StandardCharsets.UTF_8)))
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Unauthorized"));
    if (file.isEmpty() || file.getSize() > 15 * 1024 * 1024L)
      return ResponseEntity.badRequest().body(Map.of("error","Invalid file size"));
    String mime = file.getContentType();
    if (mime == null || !AUDIO_TYPES.contains(mime))
      return ResponseEntity.badRequest().body(Map.of("error","Unsupported audio type"));
    try { return ResponseEntity.ok(Map.of("transcription",service.transcribe(file,mime))); }
    catch (IllegalStateException e) { return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error","Transcription service not configured")); }
    catch (Exception e) { return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error","Transcription failed")); }
  }
}
