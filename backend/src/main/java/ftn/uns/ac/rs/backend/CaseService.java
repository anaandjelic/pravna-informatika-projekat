package ftn.uns.ac.rs.backend;

import ftn.uns.ac.rs.backend.dto.CaseBasedReasoningDTO;
import lombok.AllArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

	public String getCaseText(String caseNumber) throws IOException {
		Resource resource = resourceLoader.getResource("classpath:cases/" + caseNumber + ".pdf");
		Path path = Paths.get(resource.getURI());
		File file = new File(path.toString());
		PDDocument document = PDDocument.load(file);
		PDFTextStripper stripper = new PDFTextStripper();
		String text = stripper.getText(document);
		document.close();
		return text.replaceAll("[\s\n\r]+", " ");
	}

	private String extractFirstParagraph(String caseText) {
		Pattern pattern = Pattern.compile("U IME CRNE GORE[-– ,.A-ZČĆŠĐŽa-zčćšđž0-9/]+P R E S U D U");
		Matcher matcher = pattern.matcher(caseText);
		if(matcher.find()) {
			return matcher.group();
		} else {
			return "Match not found";
		}
	}

	public String extractCourtName(String caseText) {
		caseText = extractFirstParagraph(caseText);
		Pattern pattern = Pattern.compile("([A-ZČĆŠĐŽ]+ SUD U [A-ZČĆŠĐŽ]+)|[A-ZČĆŠĐŽa-zčćšđž]+ sud u [A-ZČĆŠĐŽa-zčćšđž]+");
		Matcher matcher = pattern.matcher(caseText);
		if(matcher.find()) {
			return matcher.group().trim();
		}
		return "Not found";
	}

	public String extractCaseNumber(String caseText) {
		Pattern pattern = Pattern.compile("K *[0-9]{1,5} */ *[0-9]{2,4}");
		Matcher matcher = pattern.matcher(caseText);
		if(matcher.find()) {
			return matcher.group().trim();
		}
		return "Not found";
	}

	public String extractJudgeName(String caseText) {
		caseText = extractFirstParagraph(caseText);
		Pattern pattern = Pattern.compile("sudij[aei] +(pojedincu +)?(pojedinac +)?[A-ZČĆŠĐŽa-zčćšđž]+.? *[A-ZČĆŠĐŽa-zčćšđž]+.? *(-[A-ZČĆŠĐŽa-zčćšđž]+.? *)?,");
		Matcher matcher = pattern.matcher(caseText);
		if(matcher.find()) {
			String judge = matcher.group();
			pattern = Pattern.compile("[A-ZČĆŠĐŽ].?[a-zčćšđž]* *[A-ZČĆŠĐŽ].?[a-zčćšđž]* *(- *[A-ZČĆŠĐŽ][a-zčćšđž]*)?");
			matcher = pattern.matcher(judge);
			if (matcher.find())
				return matcher.group().trim().replaceAll(" +", " ");
		}
		return "Not found";
	}

	public String extractCourtType(String caseText) {
		caseText = extractFirstParagraph(caseText);
		Pattern pattern = Pattern.compile("([A-ZČĆŠĐŽ]+ SUD U [A-ZČĆŠĐŽ]+)|[A-ZČĆŠĐŽa-zčćšđž]+ sud u [A-ZČĆŠĐŽa-zčćšđž]+");
		Matcher matcher = pattern.matcher(caseText);
		if(matcher.find()) {
			return matcher.group().trim().split(" ")[0].toLowerCase().replace('š', 's');
		}
		return "Not found";
	}

	public String extractDefendant(String caseText) {
		caseText = extractFirstParagraph(caseText);
		Pattern pattern = Pattern.compile("((okrivljenog)|(optuženog)|(okrivljene)) +[A-ZČĆŠĐŽ] *\\.? *[A-ZČĆŠĐŽ] *\\.?");
		Matcher matcher = pattern.matcher(caseText);
		if(matcher.find()) {
			String defendant = matcher.group();
			pattern = Pattern.compile("[A-ZČĆŠĐŽ] *\\.? *[A-ZČĆŠĐŽ] *\\.?");
			matcher = pattern.matcher(defendant);
			if (matcher.find())
				return matcher.group().trim();
		}
		return "Not found";
	}

	public float extractItemsValue(String caseText) {
		float value = 0;
		Pattern pattern = Pattern.compile("K R I V (A )?J E[-– ,.A-ZČĆŠĐŽa-zčćšđž0-9/’()„“”:;€\"!+]+O S U Đ U J E");
		Matcher matcher = pattern.matcher(caseText);
		if(matcher.find()) {
			String paragraph = matcher.group();
			pattern = Pattern.compile("[0-9]+([.,][0-9]+)? ?((€)|(eura))");
			matcher = pattern.matcher(paragraph);
			while (matcher.find()) {
				value += valueToFloat(matcher.group().trim());
			}

			return value;
		}
		return 0;
	}

	private float valueToFloat(String value) {
		String numeric = value.replaceAll("[^\\d,.]", "");
		numeric = numeric.replace(',', '.');
		return (float) Double.parseDouble(numeric);
	}

	public String extractCriminalAct(String caseText) {
		String criminalAct = "";
		String temp;
		Pattern pattern = Pattern.compile("((krivično djelo)|(kriv.djelo)) -?–? ?[a-zčćšđž ]+ iz");
		Matcher matcher = pattern.matcher(caseText);
		while (matcher.find()) {
			temp = matcher.group();
			if (temp.contains("krivično djelo")) temp = temp.split("krivično djelo")[1];
			else temp = temp.split("kriv.djelo")[1];
			if (temp.contains("–")) temp = temp.split("–")[1];
			else if (temp.contains("-")) temp = temp.split("-")[1];
			temp = temp.split("iz")[0].trim();

			if (!criminalAct.contains(temp)) {
				criminalAct = criminalAct.concat(";").concat(temp);
			}
		}
		return criminalAct.substring(1);
	}

	public String extractCriminalActArticles(String caseText) {
		String articleList ="";
		String temp;
		Pattern pattern = Pattern.compile("((krivično djelo)|(kriv.djelo)) -?–? ?[a-zčćšđž ]+ iz [A-ZČĆŠĐŽa-zčćšđž .0-9]+((Krivičnog [Zz]akonika( Crne Gore)?)|(KZCG)|(KZ(-a)?))");
		Matcher matcher = pattern.matcher(caseText);
		while (matcher.find()) {
			temp = matcher.group();
			temp = temp.split("iz")[1].trim();
			if (!articleList.contains(temp)) {
				articleList = articleList.concat(";").concat(temp);
			}
		}
		return articleList.substring(1);
	}

	public String extractPunishmentArticles(String caseText) {
		String articleList ="";
		String temp;
		Pattern pattern = Pattern.compile("[Pp]a ((ga [Ss]ud)|(mu [Ss]ud)|([Ss]ud)|(ga)|(je [Ss]ud)),? [-()A-ZČĆŠĐŽa-zčćšđž .,:;0-9]+O S U Đ U J E");
		Matcher matcher = pattern.matcher(caseText);
		if(matcher.find()) {
			String articles = matcher.group();
			pattern = Pattern.compile("čl.[0-9člstavi .,]+((Krivičnog [Zz]akonika( Crne Gore)?)|(Zakonika o krivičnom postupku)|(KZCG)|(KZ-a)|(ZKP(-a)?))");
			matcher = pattern.matcher(articles);
			while (matcher.find()) {
				temp = matcher.group().trim();
				if (!articleList.contains(temp)) {
					articleList = articleList.concat(";").concat(temp);
				}
			}
			return articleList.substring(1);
		}
		return "Not found";
	}

	public String extractPunishment(String caseText) {
		Pattern pattern = Pattern.compile("O S U Đ U J E[ ,.A-ZČĆŠĐŽa-zčćšđž0-9()]+");
		Matcher matcher = pattern.matcher(caseText);
		if(matcher.find()) {
			String paragraph = matcher.group();
			pattern = Pattern.compile("kaznu zatvora u trajanju od [0-9]+ \\([a-zčćšđž ]+\\) ?[a-zčćšđž]*( i [0-9]+ \\([a-zčćšđž]+\\) [a-zčćšđž]+)?");
			matcher = pattern.matcher(paragraph);
			if (matcher.find()) {
				return matcher.group().trim();
			}
				
		}
		return "Not found";
	}

	public void createNewCase(CaseBasedReasoningDTO caseBasedReasoningDTO) {
		String backendPath = System.getProperty("user.dir");
		Path backendPathObject = Paths.get(backendPath);

		Path rootPathObject = backendPathObject.getParent();
		String rootPath = rootPathObject.toString();

		String pathToCases = rootPath + "/nlp-output.csv";

		List<String[]> cases = new ArrayList<>();
		cases.add(new String[] {
				caseBasedReasoningDTO.getCourt(),
				caseBasedReasoningDTO.getCaseNumber(),
				caseBasedReasoningDTO.getJudge(),
				caseBasedReasoningDTO.getDefendant(),
				caseBasedReasoningDTO.getPlaintiff(),
				String.valueOf(caseBasedReasoningDTO.getValueOfStolenThings()),
				caseBasedReasoningDTO.getCriminalAct(),
				caseBasedReasoningDTO.getArticlesCriminalAct(),
				caseBasedReasoningDTO.getArticlesCondemnation(),
				caseBasedReasoningDTO.getPunishment(),
				caseBasedReasoningDTO.getIntention(),
				caseBasedReasoningDTO.getStealWay()
		});

		try (PrintWriter pw = new PrintWriter(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(pathToCases, true), StandardCharsets.UTF_8)))) {
			cases.stream()
					.map(this::convertToCSV)
					.forEach(pw::println);
		} catch (FileNotFoundException e) {
			throw new RuntimeException(e);
		}

	}

	public String escapeSpecialCharacters(String data) {
		if (data == null) {
			throw new IllegalArgumentException("Input data cannot be null");
		}
		String escapedData = data.replaceAll("\\R", " ");
		if (data.contains(",") || data.contains("\"") || data.contains("'")) {
			data = data.replace("\"", "\"\"");
			escapedData = "\"" + data + "\"";
		}
		return escapedData;
	}


	public String convertToCSV(String[] data) {
		return Stream.of(data)
				.map(this::escapeSpecialCharacters)
				.collect(Collectors.joining(","));
	}

}
