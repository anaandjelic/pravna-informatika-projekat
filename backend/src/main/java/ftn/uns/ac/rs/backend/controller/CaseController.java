package ftn.uns.ac.rs.backend.controller;

import ftn.uns.ac.rs.backend.CaseService;
import ftn.uns.ac.rs.backend.dto.CaseBasedReasoningDTO;
import ftn.uns.ac.rs.backend.dto.MetadataDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
        List<String> predefinedCaseNumbers = Arrays.asList("K 29 2010", "K 60 2019", "K 82 2013", "K 96 2020", "K 103 2018", "K 108 2022", "K 131 2010", "K 144 2020", "K 298 2021", "K 309 2010", "K 457 2012", "K 772 2010", "K 788 2017", "K 834 2012", "K 855 2015");
        if (predefinedCaseNumbers.contains(caseNumber)) {
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
        else {
            MetadataDTO metadataDTO = caseService.extractNewCaseMetadata(caseNumber);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(metadataDTO);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createNewCase(@RequestBody CaseBasedReasoningDTO caseBasedReasoningDTO) {
        caseService.createNewCase(caseBasedReasoningDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
