package Backend.backenddata.controller;

import Backend.backenddata.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(documentService.uploadAndProcess(file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDocument(@PathVariable String id) {
        Map<String, Object> document = documentService.getDocument(id);
        return document == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(document);
    }

    @PostMapping("/{id}/translate")
    public ResponseEntity<Map<String, String>> translate(
            @PathVariable String id,
            @RequestBody Map<String, String> request
    ) {
        String language = request.getOrDefault("language", "English");
        return ResponseEntity.ok(documentService.translate(id, language));
    }
}
