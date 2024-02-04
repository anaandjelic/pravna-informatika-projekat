package ftn.uns.ac.rs.backend.controller;

import ftn.uns.ac.rs.backend.CaseService;
import ftn.uns.ac.rs.backend.dto.MetadataDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping(value="/case", produces = MediaType.APPLICATION_JSON_VALUE)
public class CaseController {

    private final CaseService caseService;

    @GetMapping("/pdf/{caseNumber}")
    public ResponseEntity<byte[]> getCasePDF(@PathVariable String caseNumber) throws IOException {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(caseService.getCasePDF(caseNumber));
    }

    @GetMapping("/extract/{caseNumber}")
    public ResponseEntity<MetadataDTO> extractMetadata(@PathVariable String caseNumber) throws IOException {
        String caseText = caseService.getCaseText(caseNumber);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(
                new MetadataDTO(
                        caseService.extractCourtName(caseText),
                        caseService.extractCaseNumber(caseText),
                        caseService.extractJudgeName(caseText),
                        caseService.extractDefendant(caseText),
                        caseService.extractCourtType(caseText),
                        caseService.extractItemsValue(caseText),
                        caseService.extractCriminalAct(caseText),
                        caseService.extractCriminalActArticles(caseText),
                        caseService.extractPunishmentArticles(caseText),
                        caseService.extractPunishment(caseText))
        );
    }

}
