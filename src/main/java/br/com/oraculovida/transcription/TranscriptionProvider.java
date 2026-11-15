package br.com.oraculovida.transcription;

public interface TranscriptionProvider {
    String name();
    int priority();
    boolean isConfigured();
    String transcribe(byte[] audio, String mime) throws Exception;
}
