package ftn.uns.ac.rs.backend.dto;

public class CaseBasedReasoningDTO {
    private String court;
    private String caseNumber;
    private String judge;
    private String defendant;
    private String plaintiff;
    private Float valueOfStolenThings;
    private String criminalAct;
    private String articlesCriminalAct;
    private String articlesCondemnation;

    public CaseBasedReasoningDTO() {
    }

    public CaseBasedReasoningDTO(String court, String caseNumber, String judge, String defendant, String plaintiff, Float valueOfStolenThings, String criminalAct, String articlesCriminalAct, String articlesCondemnation, String punishment) {
        this.court = court;
        this.caseNumber = caseNumber;
        this.judge = judge;
        this.defendant = defendant;
        this.plaintiff = plaintiff;
        this.valueOfStolenThings = valueOfStolenThings;
        this.criminalAct = criminalAct;
        this.articlesCriminalAct = articlesCriminalAct;
        this.articlesCondemnation = articlesCondemnation;
    }

    public String getCourt() {
        return court;
    }

    public void setCourt(String court) {
        this.court = court;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getJudge() {
        return judge;
    }

    public void setJudge(String judge) {
        this.judge = judge;
    }

    public String getDefendant() {
        return defendant;
    }

    public void setDefendant(String defendant) {
        this.defendant = defendant;
    }

    public String getPlaintiff() {
        return plaintiff;
    }

    public void setPlaintiff(String plaintiff) {
        this.plaintiff = plaintiff;
    }

    public Float getValueOfStolenThings() {
        return valueOfStolenThings;
    }

    public void setValueOfStolenThings(Float valueOfStolenThings) {
        this.valueOfStolenThings = valueOfStolenThings;
    }

    public String getCriminalAct() {
        return criminalAct;
    }

    public void setCriminalAct(String criminalAct) {
        this.criminalAct = criminalAct;
    }

    public String getArticlesCriminalAct() {
        return articlesCriminalAct;
    }

    public void setArticlesCriminalAct(String articlesCriminalAct) {
        this.articlesCriminalAct = articlesCriminalAct;
    }

    public String getArticlesCondemnation() {
        return articlesCondemnation;
    }

    public void setArticlesCondemnation(String articlesCondemnation) {
        this.articlesCondemnation = articlesCondemnation;
    }

}
