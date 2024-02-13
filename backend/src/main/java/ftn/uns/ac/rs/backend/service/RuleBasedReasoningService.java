package ftn.uns.ac.rs.backend.service;

import ftn.uns.ac.rs.backend.dto.RuleBasedReasoningDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class RuleBasedReasoningService {

    public String generateReasoning(RuleBasedReasoningDTO ruleBasedReasoningDTO) throws IOException, InterruptedException {

        String backendPath = System.getProperty("user.dir");
        Path backendPathObject = Paths.get(backendPath);

        Path rootPathObject = backendPathObject.getParent();
        String rootPath = rootPathObject.toString();

        String outputFilePath = rootPath + "/dr-device/facts.rdf";

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputFilePath))) {
            writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n");
            writer.write("<rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n");
            writer.write("  xmlns:rdfs=\"http://www.w3.org/2000/01/rdf-schema#\"\n");
            writer.write("  xmlns:xsd=\"http://www.w3.org/2001/XMLSchema#\"\n");
            writer.write("  xmlns:lc=\"http://informatika.ftn.uns.ac.rs/legal-case.rdf#\">\n");

            writer.write("  <lc:case rdf:about=\"http://informatika.ftn.uns.ac.rs/legal-case.rdf#" +
                    ruleBasedReasoningDTO.getName() + "\">\n");
            writer.write("      <lc:name>" + ruleBasedReasoningDTO.getName() + "</lc:name>\n");
            writer.write("      <lc:defendant>" + ruleBasedReasoningDTO.getDefendant() + "</lc:defendant>\n");
            writer.write("      <lc:money rdf:datatype=\"http://www.w3.org/2001/XMLSchema#integer\">" +
                    ruleBasedReasoningDTO.getMoney() + "</lc:money>\n");
            writer.write("      <lc:steal_type>" + ruleBasedReasoningDTO.getStealType() + "</lc:steal_type>\n");
            writer.write("      <lc:intention>" + ruleBasedReasoningDTO.getIntention() + "</lc:intention>\n");
            writer.write("      <lc:steal_way>" + ruleBasedReasoningDTO.getStealWay() + "</lc:steal_way>\n");
            writer.write("  </lc:case>\n");
            writer.write("</rdf:RDF>");
        } catch (IOException e) {
            e.printStackTrace();
        }

        String batFilePath = rootPath + "/dr-device/start.bat";
        File batFile = new File(batFilePath);

        if (batFile.exists()) {
            ProcessBuilder processBuilder = new ProcessBuilder("cmd", "/c", batFile.getAbsolutePath());
            processBuilder.directory(batFile.getParentFile());
            Process process = processBuilder.start();
            process.waitFor();
        }

        String exportFilePath = rootPath + "/dr-device/export.rdf";
        String raw_reasoning = new String(Files.readAllBytes(Paths.get(exportFilePath)));
        String reasoning = "PREKRŠEN ZAKON: ";

        if (StringUtils.substringBetween(raw_reasoning, "<export:robbery_lv1", "</export:robbery_lv1>") != null) {
            reasoning += "Član 241 Stavka 1: Upotreba sile protiv nekog lica ili pretnja da će neposredno napasti na život ili telo." +
                    " Oduzimanje tuđe pokretne stvari u nameri da njenim prisvajanjem sebi ili drugom pribavi" +
                    " protivpravnu imovinsku korist.";
        }

        else if (StringUtils.substringBetween(raw_reasoning, "<export:robbery_lv2", "</export:robbery_lv2>") != null) {
            reasoning += "Član 241 Stavka 2: Upotreba sile protiv nekog lica ili pretnja da će neposredno napasti na život ili telo." +
                    " Oduzimanje tuđe pokretne stvari u nameri da njenim prisvajanjem sebi ili drugom pribavi" +
                    " protivpravnu imovinsku korist. Vrednost ukradenih stvari iznad 3000e." ;
        }

        else if (StringUtils.substringBetween(raw_reasoning, "<export:robbery_lv3", "</export:robbery_lv3>") != null) {
            reasoning += "Član 241 Stavka 3: Upotreba sile protiv nekog lica ili pretnja da će neposredno napasti na život ili telo." +
                    " Oduzimanje tuđe pokretne stvari u nameri da njenim prisvajanjem sebi ili drugom pribavi" +
                    " protivpravnu imovinsku korist. Vrednost ukradenih stvari iznad 30000e." ;
        }

        else if (StringUtils.substringBetween(raw_reasoning, "<export:robbery_lv4", "</export:robbery_lv4>") != null) {
            reasoning += "Član 241 Stavka 4: Upotreba sile protiv nekog lica ili pretnja da će neposredno napasti na život ili telo." +
                    " Oduzimanje tuđe pokretne stvari u nameri da njenim prisvajanjem sebi ili drugom pribavi" +
                    " protivpravnu imovinsku korist. Učinjeno od strane grupe ili je nekom licu sa umišljanjem nanesena" +
                    " teška telesna povreda." ;
        }

        else if (StringUtils.substringBetween(raw_reasoning, "<export:robbery_lv5", "</export:robbery_lv5>") != null) {
            reasoning += "Član 241 Stavka 5: Upotreba sile protiv nekog lica ili pretnja da će neposredno napasti na život ili telo." +
                    " Oduzimanje tuđe pokretne stvari u nameri da njenim prisvajanjem sebi ili drugom pribavi" +
                    " protivpravnu imovinsku korist. Neko lice je sa umišljanjem lišeno života." ;
        }

        else if (StringUtils.substringBetween(raw_reasoning, "<export:robbery_lv6", "</export:robbery_lv6>") != null) {
            reasoning += "Član 241 Stavka 6: Upotreba sile protiv nekog lica ili pretnja da će neposredno napasti na život ili telo." +
                    " Oduzimanje tuđe pokretne stvari u nameri da njenim prisvajanjem sebi ili drugom pribavi" +
                    " protivpravnu imovinsku korist. Vrednost ukradenih stvari ne prelazi 150e, a učinilac je išao za tim" +
                    " da pribavi malu imovinsku korist." ;
        }

        else if (StringUtils.substringBetween(raw_reasoning, "<export:competition_outcome_arrangement_lv1", "</export:competition_outcome_arrangement_lv1>") != null) {
            reasoning += "Član 244a Stavka 1: Dogovoren ishod sportskog ili drugog takmičenja u nameri da se sebi ili drugom pribavi korist." ;
        }

        else if (StringUtils.substringBetween(raw_reasoning, "<export:competition_outcome_arrangement_lv2", "</export:competition_outcome_arrangement_lv2>") != null) {
            reasoning += "Član 244a Stavka 2: Dogovoren ishod sportskog ili drugog takmičenja u nameri da se sebi ili drugom pribavi korist." +
                         " Vrednost pribavljene imovinske koristi prelazi iznos od 10000e.";
        }


        else if (StringUtils.substringBetween(raw_reasoning, "<export:competition_outcome_arrangement_lv3", "</export:competition_outcome_arrangement_lv3>") != null) {
            reasoning += "Član 244a Stavka 3: Dogovoren ishod sportskog ili drugog takmičenja u nameri da se sebi ili drugom pribavi korist." +
                    " Vrednost pribavljene imovinske koristi prelazi iznos od 40000e.";
        }

        reasoning += " KAZNA: ";

        if (StringUtils.substringBetween(raw_reasoning, "<export:min_imprisonment_robbery_1", "</export:min_imprisonment_robbery_1>") != null) {
            reasoning += " Minimalan broj godina u zatvoru je 1 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:max_imprisonment_robbery_1", "</export:max_imprisonment_robbery_1>") != null) {
            reasoning += " Maksimalan broj godina u zatvoru je 8 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:min_imprisonment_robbery_2", "</export:min_imprisonment_robbery_2>") != null) {
            reasoning += " Minimalan broj godina u zatvoru je 2 godine.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:max_imprisonment_robbery_2", "</export:max_imprisonment_robbery_2>") != null) {
            reasoning += " Maksimalan broj godina u zatvoru je 10 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:max_imprisonment_robbery_3", "</export:max_imprisonment_robbery_3>") != null) {
            reasoning += " Maksimalan broj godina u zatvoru je 12 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:min_imprisonment_robbery_3", "</export:min_imprisonment_robbery_3>") != null) {
            reasoning += " Minimalan broj godina u zatvoru je 3 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:max_imprisonment_robbery_4", "</export:max_imprisonment_robbery_4>") != null) {
            reasoning += " Maksimalan broj godina u zatvoru je 15 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:min_imprisonment_robbery_4", "</export:min_imprisonment_robbery_3>") != null) {
            reasoning += " Minimalan broj godina u zatvoru je 10 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:max_imprisonment_robbery_5", "</export:max_imprisonment_robbery_5>") != null) {
            reasoning += " Maksimalan broj godina u zatvoru je doživotna kazna.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:max_imprisonment_robbery_6", "</export:max_imprisonment_robbery_6>") != null) {
            reasoning += " Maksimalan broj godina u zatvoru je 3 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:min_imprisonment_competition_outcome_arrangement_1",
                "</min_imprisonment_competition_outcome_arrangement_1>") != null) {
            reasoning += " Minimalan broj meseci u zatvoru je 6 meseci.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:max_imprisonment_competition_outcome_arrangement_1",
                "</max_imprisonment_competition_outcome_arrangement_1>") != null) {
            reasoning += " Maksimalan broj godina u zatvoru je 3 godine.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:max_imprisonment_competition_outcome_arrangement_2",
                "</export:max_imprisonment_competition_outcome_arrangement_2>") != null) {
            reasoning += " Maksimalan broj godina u zatvoru je 10 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:min_imprisonment_competition_outcome_arrangement_2",
                "</export:min_imprisonment_competition_outcome_arrangement_2>") != null) {
            reasoning += " Minimalan broj godina u zatvoru je 1 godina.";
        }
        if (StringUtils.substringBetween(raw_reasoning, "<export:max_imprisonment_competition_outcome_arrangement_3",
                "</export:max_imprisonment_competition_outcome_arrangement_3>") != null) {
            reasoning += " Maksimalan broj godina u zatvoru je 10 godina.";
        }
        return reasoning;
    }
}
