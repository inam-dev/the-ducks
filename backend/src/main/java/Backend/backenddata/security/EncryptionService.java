package Backend.backenddata.security;

import org.jasypt.util.text.AES256TextEncryptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EncryptionService {

    private final AES256TextEncryptor encryptor;

    public EncryptionService(@Value("${jasypt.encryptor.password}") String password) {
        encryptor = new AES256TextEncryptor();
        encryptor.setPassword(password);
    }

    public String encrypt(String plain) {
        if (plain == null) return null;
        return encryptor.encrypt(plain);
    }

    public String decrypt(String encrypted) {
        if (encrypted == null) return null;
        return encryptor.decrypt(encrypted);
    }
}
