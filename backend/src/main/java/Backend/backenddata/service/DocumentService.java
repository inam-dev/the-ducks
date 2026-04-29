package Backend.backenddata.service;

import Backend.backenddata.ai.OllamaClient;
import Backend.backenddata.entity.Document;
import Backend.backenddata.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final OllamaClient ollamaClient;

    public DocumentService(DocumentRepository documentRepository, OllamaClient ollamaClient) {
        this.documentRepository = documentRepository;
        this.ollamaClient = ollamaClient;
    }

    public Document uploadAndProcess(MultipartFile file) throws IOException {

        String content = new String(file.getBytes());

        String summary = ollamaClient.summarize(content);

        Document doc = new Document();
        doc.setTitle(file.getOriginalFilename());
        doc.setFileType(file.getContentType());
        doc.setStatus("Processed");
        doc.setSummary(summary);
        doc.setUploadDate(LocalDateTime.now());
        doc.setLastUpdated(LocalDateTime.now());

        return documentRepository.save(doc);
    }
}
