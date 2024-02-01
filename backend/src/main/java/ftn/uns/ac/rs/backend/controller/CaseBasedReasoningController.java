package ftn.uns.ac.rs.backend.controller;

import ftn.uns.ac.rs.backend.dto.CaseBasedReasoningDTO;
import ftn.uns.ac.rs.backend.service.CaseBasedReasoningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
@RequestMapping(value="/cbr")
@CrossOrigin
public class CaseBasedReasoningController {

    @Autowired
    CaseBasedReasoningService caseBasedReasoningService;

    @PostMapping("/generate-reasoning")
    public ResponseEntity<String> generateReasoning(@RequestBody CaseBasedReasoningDTO caseBasedReasoningDTO) throws IOException {
        String reasoning = caseBasedReasoningService.generateReasoning(caseBasedReasoningDTO);
        return new ResponseEntity<>(reasoning, HttpStatus.OK);
    }
}
