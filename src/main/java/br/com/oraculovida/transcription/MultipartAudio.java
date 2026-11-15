package br.com.oraculovida.transcription;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

final class MultipartAudio {
    private MultipartAudio() {}

    record Payload(byte[] bytes, String contentType) {}

    static Payload build(byte[] audio, String mime, Map<String, String> fields) throws IOException {
        String boundary = "oraculo-" + UUID.randomUUID();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        for (var field : fields.entrySet()) {
            write(out, "--" + boundary + "\r\n");
            write(out, "Content-Disposition: form-data; name=\"" + field.getKey() + "\"\r\n\r\n");
            write(out, field.getValue() + "\r\n");
        }
        write(out, "--" + boundary + "\r\n");
        write(out, "Content-Disposition: form-data; name=\"file\"; filename=\"recording\"\r\n");
        write(out, "Content-Type: " + mime + "\r\n\r\n");
        out.write(audio);
        write(out, "\r\n--" + boundary + "--\r\n");
        return new Payload(out.toByteArray(), "multipart/form-data; boundary=" + boundary);
    }

    private static void write(ByteArrayOutputStream out, String s) throws IOException {
        out.write(s.getBytes(StandardCharsets.UTF_8));
    }
}
