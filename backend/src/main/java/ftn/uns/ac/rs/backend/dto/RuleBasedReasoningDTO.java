package ftn.uns.ac.rs.backend.dto;

public class RuleBasedReasoningDTO {
    private String name;
    private String defendant;
    private Integer money;
    private String stealType;
    private String intention;
    private String stealWay;

    public RuleBasedReasoningDTO() {

    }

    public RuleBasedReasoningDTO(String name, String defendant, Integer money, String stealType, String intention, String stealWay) {
        this.name = name;
        this.defendant = defendant;
        this.money = money;
        this.stealType = stealType;
        this.intention = intention;
        this.stealWay = stealWay;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDefendant() {
        return defendant;
    }

    public void setDefendant(String defendant) {
        this.defendant = defendant;
    }

    public Integer getMoney() {
        return money;
    }

    public void setMoney(Integer money) {
        this.money = money;
    }

    public String getStealType() {
        return stealType;
    }

    public void setStealType(String stealType) {
        this.stealType = stealType;
    }

    public String getIntention() {
        return intention;
    }

    public void setIntention(String intention) {
        this.intention = intention;
    }

    public String getStealWay() {
        return stealWay;
    }

    public void setStealWay(String stealWay) {
        this.stealWay = stealWay;
    }
}
