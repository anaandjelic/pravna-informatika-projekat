package ftn.uns.ac.rs.backend.controller;

import ftn.uns.ac.rs.backend.CaseService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping(value="/case")
public class CaseController {

    private final CaseService caseService;

    @GetMapping("/pdf/{caseNumber}")
    public ResponseEntity<byte[]> getCasePDF(@PathVariable String caseNumber) throws IOException {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(caseService.getCasePDF(caseNumber));
    }
}
