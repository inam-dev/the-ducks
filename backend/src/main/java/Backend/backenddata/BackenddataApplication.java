package Backend.backenddata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import Backend.backenddata.entity.Document;     // ❗ You forgot this import
import Backend.backenddata.security.EncryptionService;

@SpringBootApplication
public class BackenddataApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackenddataApplication.class, args);
    }

    @Autowired
	public void setEncryptionService(EncryptionService encryptionService) {
   	 Document.setEncryptionService(encryptionService);
}

}
