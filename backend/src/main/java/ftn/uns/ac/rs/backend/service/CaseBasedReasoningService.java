package ftn.uns.ac.rs.backend.service;

import ftn.uns.ac.rs.backend.dto.CaseBasedReasoningDTO;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class CaseBasedReasoningService {

    public String generateReasoning(CaseBasedReasoningDTO caseBasedReasoningDTO) throws IOException {

        String backendPath = System.getProperty("user.dir");
        Path backendPathObject = Paths.get(backendPath);

        Path rootPathObject = backendPathObject.getParent();
        String rootPath = rootPathObject.toString();

        String pathToPythonScript = rootPath + "/case_based_reasoning.py";

        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "python",
                    pathToPythonScript,
                    caseBasedReasoningDTO.getCourt(),
                    caseBasedReasoningDTO.getPlaintiff(),
                    caseBasedReasoningDTO.getValueOfStolenThings().toString(),
                    caseBasedReasoningDTO.getCriminalAct(),
                    caseBasedReasoningDTO.getArticlesCriminalAct(),
                    caseBasedReasoningDTO.getArticlesCondemnation());
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            process.waitFor();

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        String exportFilePath = rootPath + "/cbr.txt";

        return new String(Files.readAllBytes(Paths.get(exportFilePath)));
    }
}
