package Backend.backenddata.entity;

import Backend.backenddata.security.EncryptionService;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Document {

    @Transient
    private static EncryptionService encryptionService;

    public static void setEncryptionService(EncryptionService service) {
        encryptionService = service;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String fileType;
    private String status;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private LocalDateTime uploadDate;
    private LocalDateTime lastUpdated;

    // Encrypt before saving
    @PrePersist
    @PreUpdate
    private void encryptFields() {
        if (encryptionService != null) {
            this.title = encryptionService.encrypt(title);
            this.fileType = encryptionService.encrypt(fileType);
            this.status = encryptionService.encrypt(status);
            this.summary = encryptionService.encrypt(summary);
        }
    }

    // Decrypt after loading
    @PostLoad
    private void decryptFields() {
        if (encryptionService != null) {
            this.title = encryptionService.decrypt(title);
            this.fileType = encryptionService.decrypt(fileType);
            this.status = encryptionService.decrypt(status);
            this.summary = encryptionService.decrypt(summary);
        }
    }
}
