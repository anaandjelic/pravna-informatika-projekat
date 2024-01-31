package ftn.uns.ac.rs.backend;

import lombok.AllArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@AllArgsConstructor
public class CaseService {

	private final ResourceLoader resourceLoader;

	public byte[] getCasePDF(String caseNumber) throws IOException {
		caseNumber = caseNumber.replace('-', ' ');
		Resource resource = resourceLoader.getResource("classpath:cases/" + caseNumber + ".pdf");
		Path path = Paths.get(resource.getURI());

		return Files.readAllBytes(path);
	}

}
