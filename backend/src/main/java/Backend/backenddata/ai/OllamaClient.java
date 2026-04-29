package Backend.backenddata.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class OllamaClient {

    private final WebClient webClient;

    @Value("${ollama.url}")
    private String ollamaUrl;

    @Value("${ollama.model}")
    private String model;

    public OllamaClient(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public String generate(String prompt) {
        try {
            Map<String, Object> body = Map.of(
                    "model", model,
                    "prompt", prompt,
                    "stream", false
            );

            Map response = webClient.post()
                    .uri(ollamaUrl)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || response.get("response") == null) {
                return "";
            }

            return ((String) response.get("response")).trim();
        } catch (Exception exception) {
            return "";
        }
    }

    public String summarize(String text) {
        String prompt = """
                You are a council document assistant.
                Extract the useful text from this uploaded document content and summarise it in 2-3 clear sentences.
                Mention the likely council department and urgency if obvious.

                Uploaded content:
                """ + text;
        return generate(prompt);
    }

    public String translate(String text, String language) {
        String prompt = "Translate this redacted council document text to " + language
                + ". Keep redaction markers unchanged and return only the translation:\n\n" + text;
        return generate(prompt);
    }
}
