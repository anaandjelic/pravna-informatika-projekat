package ftn.uns.ac.rs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MetadataDTO {
    String courtName;
    String caseNumber;
    String judge;
    String defendant;
    String courtType;
    float stolenItemsValue;
    String criminalAct;
    String criminalActArticles;
    String punishmentArticles;
    String punishment;
}
