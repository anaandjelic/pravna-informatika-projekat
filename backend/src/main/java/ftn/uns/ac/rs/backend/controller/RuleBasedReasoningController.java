package ftn.uns.ac.rs.backend.controller;

import ftn.uns.ac.rs.backend.dto.RuleBasedReasoningDTO;
import ftn.uns.ac.rs.backend.service.RuleBasedReasoningService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping(value="/rbr")
public class RuleBasedReasoningController {

    private final RuleBasedReasoningService ruleBasedReasoningService;

    @PostMapping("/generate-reasoning")
    public ResponseEntity<String> generateReasoning(@RequestBody RuleBasedReasoningDTO ruleBasedReasoningDTO) throws IOException, InterruptedException {
        String reasoning = ruleBasedReasoningService.generateReasoning(ruleBasedReasoningDTO);
        return new ResponseEntity<>(reasoning, HttpStatus.OK);
    }
}
