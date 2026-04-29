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

        return (String) response.get("response");
    }

    public String summarize(String text) {
        String prompt = "Summarise this document clearly and concisely:\n\n" + text;
        return generate(prompt);
    }
}
