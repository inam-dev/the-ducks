package Backend.service;

import Backend.backenddata.ai.OllamaClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DocumentService {

    private final OllamaClient ollamaClient;
    private final Map<String, Map<String, Object>> processedDocuments = new ConcurrentHashMap<>();

    public DocumentService(OllamaClient ollamaClient) {
        this.ollamaClient = ollamaClient;
    }

    public Map<String, Object> uploadAndProcess(MultipartFile file) throws IOException {
        String id = "doc-" + UUID.randomUUID().toString().substring(0, 8);
        String filename = file.getOriginalFilename() == null ? "Uploaded document" : file.getOriginalFilename();
        String originalText = extractDemoText(file);
        String summary = ollamaClient.summarize(originalText);

        if (summary.isBlank() || summary.toLowerCase().contains("cannot extract")) {
            summary = fallbackSummaryFor(originalText);
        }
        summary = redactDateOfBirth(summary);

        Map<String, Object> result = buildDemoResult(id, filename, originalText, summary);
        processedDocuments.put(id, result);
        return result;
    }

    public Map<String, Object> getDocument(String id) {
        return processedDocuments.get(id);
    }

    public Map<String, String> translate(String id, String language) {
        Map<String, Object> document = processedDocuments.get(id);
        String redactedText = document == null ? "Sensitive personal data has been redacted." : (String) document.get("redactedText");
        String translatedText = ollamaClient.translate(redactedText, language);

        if (translatedText.isBlank()) {
            translatedText = "Demo translation to " + language + ": " + redactedText;
        }

        return Map.of("translatedText", translatedText);
    }

    private String fallbackSummaryFor(String text) {
        String lowerText = text.toLowerCase();
        if (lowerText.contains("patient name") || lowerText.contains("paracetamol") || lowerText.contains("rx :")) {
            return "Demo OCR extracted a prescription for John Doe, age 23, with DOB redacted. The prescription notes fever and Paracetamol 2000 mg three times daily, signed by a doctor on 29/04/2026.";
        }

        return "This uploaded document has been processed by the local demo pipeline. It appears to need council review, redaction of personal details, and routing to the most relevant service team.";
    }

    private String extractDemoText(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename() == null ? "uploaded document" : file.getOriginalFilename();
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();

        if (isDemoScanUpload(filename, contentType)) {
            return demoTranscriptionFor(filename, contentType);
        }

        String rawText = new String(file.getBytes(), StandardCharsets.UTF_8)
                .replaceAll("[^\\x09\\x0A\\x0D\\x20-\\x7E]", " ")
                .replaceAll("\\s+", " ")
                .trim();

        if (rawText.length() < 30) {
            return demoTranscriptionFor(filename, contentType);
        }

        return rawText.length() > 6000 ? rawText.substring(0, 6000) : rawText;
    }

    private boolean isDemoScanUpload(String filename, String contentType) {
        String lowerFilename = filename.toLowerCase();
        return contentType.startsWith("image/")
                || lowerFilename.endsWith(".png")
                || lowerFilename.endsWith(".jpg")
                || lowerFilename.endsWith(".jpeg")
                || lowerFilename.endsWith(".pdf")
                || lowerFilename.endsWith(".doc")
                || lowerFilename.endsWith(".docx");
    }

    private String demoTranscriptionFor(String filename, String contentType) {
        String lowerFilename = filename.toLowerCase();
        boolean prescription = lowerFilename.contains("prescription")
                || lowerFilename.contains("rx")
                || lowerFilename.contains("medicine")
                || lowerFilename.contains("medical");
        boolean imageOrScan = contentType.startsWith("image/")
                || lowerFilename.endsWith(".pdf")
                || lowerFilename.endsWith(".doc")
                || lowerFilename.endsWith(".docx");

        if (prescription) {
            return """
                    Demo OCR transcription from uploaded prescription image.
                    Patient name : John Doe
                    age : 23
                    DOB : 11/05/2003

                    RX : Fever

                    Paracetamol
                    2000 mg three times daily

                    signature doctor
                    Date : 29/04/2026
                    """;
        }

        if (imageOrScan) {
            return """
                    Demo OCR transcription from uploaded handwritten note image.
                    Dear council, my name is Sarah Ahmed and I live at 42 Green Lane, Hillingdon.
                    There is damp and mould in my flat and my child has asthma.
                    Please arrange an inspection urgently because the bedroom wall is wet and the smell is getting worse.
                    You can contact me on 07123 456789.
                    """;
        }

        return "Uploaded file: " + filename
                + ". Resident council document submitted for summarisation, sensitivity detection, redaction, routing and translation.";
    }

    private Map<String, Object> buildDemoResult(String id, String filename, String originalText, String summary) {
        String lowerText = originalText.toLowerCase();
        boolean housing = lowerText.contains("damp") || lowerText.contains("mould") || lowerText.contains("housing");
        boolean waste = lowerText.contains("bin") || lowerText.contains("waste") || lowerText.contains("collection");
        boolean prescription = lowerText.contains("patient name") || lowerText.contains("paracetamol") || lowerText.contains("rx :");
        boolean urgent = lowerText.contains("child") || lowerText.contains("medical") || lowerText.contains("asthma") || lowerText.contains("urgent");
        String department = prescription ? "Public Health Review" : housing ? "Housing Repairs" : waste ? "Waste Management" : "Customer Services";
        String documentType = prescription ? "Medical Prescription" : housing ? "Housing Complaint" : waste ? "Missed Bin Collection" : "Resident Correspondence";
        String urgency = urgent ? "High" : "Medium";
        String redactedText = redactDemoText(originalText);
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));

        List<Map<String, String>> sensitiveItems = new ArrayList<>();
        sensitiveItems.add(Map.of("type", "Name", "value", "Possible resident name", "riskLevel", "Medium", "action", "Redacted"));
        if (prescription) {
            sensitiveItems.add(Map.of("type", "Reference ID", "value", "DOB [REDACTED]", "riskLevel", "High", "action", "Redacted"));
            sensitiveItems.add(Map.of("type", "Medical Info", "value", "Fever; Paracetamol dosage", "riskLevel", "High", "action", "Flagged"));
        } else {
            sensitiveItems.add(Map.of("type", "Address", "value", "Possible postal address", "riskLevel", "High", "action", "Redacted"));
            sensitiveItems.add(Map.of("type", "Phone", "value", "Possible contact number", "riskLevel", "Medium", "action", "Redacted"));
            if (urgent) {
                sensitiveItems.add(Map.of("type", "Medical Info", "value", "Health or safeguarding detail", "riskLevel", "High", "action", "Flagged"));
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", id);
        result.put("filename", filename);
        result.put("source", "Resident");
        result.put("documentType", documentType);
        result.put("documentCondition", "Uploaded demo document");
        result.put("language", "English");
        result.put("historicDocument", false);
        result.put("handwritingDetected", false);
        result.put("referenceId", "CP-" + id.substring(4).toUpperCase());
        result.put("urgency", urgency);
        result.put("ocrConfidence", 92);
        result.put("handwritingConfidence", null);
        result.put("residentName", "Detected resident");
        result.put("address", "Detected address");
        result.put("aiSummary", summary);
        result.put("residentFriendlySummary", "We have received this document and prepared a plain-English summary for council staff to review.");
        result.put("gdprScore", 92);
        result.put("gdprStatus", "Safe after redaction");
        result.put("riskBeforeRedaction", urgent ? "High" : "Medium");
        result.put("riskAfterRedaction", "Low");
        result.put("gdprWarnings", List.of("Personal data detected", "Share-safe copy generated", "Manual review recommended before external sharing"));
        result.put("suggestedDepartment", department);
        result.put("routingConfidence", prescription || housing || waste ? 88 : 74);
        result.put("routingReason", "Local Ollama summary and keyword checks were used for demo routing.");
        result.put("suggestedNextAction", "Review the redacted copy and assign it to " + department + ".");
        result.put("staffNoteSuggestion", "Use the redacted version for sharing and keep the original visible only to authorised staff.");
        result.put("sensitiveItems", sensitiveItems);
        result.put("extractedFields", prescription
                ? List.of(
                        Map.of("label", "Patient", "value", "John Doe"),
                        Map.of("label", "Age", "value", "23"),
                        Map.of("label", "DOB", "value", "[REDACTED DOB]"),
                        Map.of("label", "RX", "value", "Fever"),
                        Map.of("label", "Medication", "value", "Paracetamol"),
                        Map.of("label", "Dosage", "value", "2000 mg three times daily"),
                        Map.of("label", "Prescription Date", "value", "29/04/2026"),
                        Map.of("label", "Suggested Department", "value", department)
                )
                : List.of(
                        Map.of("label", "Case Type", "value", documentType),
                        Map.of("label", "Suggested Department", "value", department),
                        Map.of("label", "Urgency", "value", urgency),
                        Map.of("label", "Reference ID", "value", "CP-" + id.substring(4).toUpperCase())
                ));
        result.put("originalText", originalText);
        result.put("redactedText", redactedText);
        result.put("translatedText", "Choose a language to translate the redacted document.");
        result.put("auditTrail", List.of(
                now + " - Document uploaded",
                now + " - Local Ollama analysis requested",
                now + " - Sensitive data detection completed",
                now + " - Redacted demo copy generated"
        ));
        return result;
    }

    private String redactDemoText(String text) {
        return redactDateOfBirth(text)
                .replaceAll("[A-Z][a-z]+[ \\t]+[A-Z][a-z]+", "[REDACTED NAME]")
                .replaceAll("\\b\\d{1,4}\\s+[A-Z][A-Za-z\\s]+(?:Road|Street|Lane|Avenue|Close|Drive)\\b", "[REDACTED ADDRESS]")
                .replaceAll("\\b(?:\\+44\\s?7\\d{3}|07\\d{3})\\s?\\d{3}\\s?\\d{3}\\b", "[REDACTED PHONE]")
                .replaceAll("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}", "[REDACTED EMAIL]");
    }

    private String redactDateOfBirth(String text) {
        return text
                .replaceAll("(?i)DOB\\s*:?\\s*\\d{1,2}/\\d{1,2}/\\d{2,4}", "DOB : [REDACTED DOB]")
                .replaceAll("(?i)Date of Birth \\(DOB\\) - [A-Za-z]+ \\d{1,2}(?:st|nd|rd|th)?, \\d{4}", "DOB : [REDACTED DOB]");
    }
}
