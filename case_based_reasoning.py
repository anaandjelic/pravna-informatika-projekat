import argparse
import json
import re
from pathlib import Path
from typing import Any
from typing import Dict
from typing import Iterable
from typing import List
from typing import Set

import pandas as pd

ROOT_DIR = Path(__file__).parent.resolve()

ATTRIBUTES_TO_COMPARE = ['sud', 'tuzilac', 'kriv_delo', 'clanovi_kriv_dela', 'clanovi_osude']
COLUMNS_TO_EXCLUDE = ['broj_slucaja', 'sudija', 'optuzeni', 'vr_ukradenih_stvari', 'kazna']


def calc_jaccard_similarity(set1: Set[str], set2: Set[str]) -> float:
    union = len(set1 | set2)
    if union == 0:
        return 0

    return len(set1 & set2) / union  # intersection / union


def calc_modified_jaccard_similarity(
    jaccard_similarity: float, avg_value_of_stolen_things: float, threshold: float, value_diff
) -> float:
    if value_diff <= threshold:
        modified_diff = (1 - (value_diff / threshold)) / 1000  # max +0.1
        jaccard_similarity += modified_diff
    else:
        modified_diff = value_diff / (10 * avg_value_of_stolen_things)  # if diff = 10*avg, then -1
        jaccard_similarity -= modified_diff

    return jaccard_similarity


def get_case_set(values: Iterable[str]) -> Set[str]:
    return set(re.split(r'[.,\s]', string=' '.join(values)))


def get_case_dict(df: pd.DataFrame, index, jaccard_similarity) -> Dict[str, Any]:
    case: Dict[str, Any] = df.iloc[index].astype(str).to_dict()
    case['jaccard_similarity'] = f"{jaccard_similarity:.3f}"
    return case


def process_cases(
    court: str,
    prosecutor: str,
    value_of_stolen_things: float,
    criminal_act: str,
    articles_used: str,
    articles_condemnation: str,
):
    df = pd.read_csv(ROOT_DIR / 'primer.csv')

    avg_value_of_stolen_things = df['vr_ukradenih_stvari'].mean()
    threshold = avg_value_of_stolen_things / 5

    cases: List[Dict[str, Any]] = []
    for index, row in df.iterrows():

        jaccard_similarity = calc_jaccard_similarity(
            get_case_set(values=(str(val) for col, val in row.items() if col not in COLUMNS_TO_EXCLUDE)),
            get_case_set(values=(court, prosecutor, criminal_act, articles_used, articles_condemnation)),
        )

        jaccard_similarity = calc_modified_jaccard_similarity(
            jaccard_similarity,
            avg_value_of_stolen_things,
            threshold,
            value_diff=abs(row['vr_ukradenih_stvari'] - value_of_stolen_things),
        )

        cases.append(get_case_dict(df, index, jaccard_similarity))

    cases.sort(key=lambda x: float(x['jaccard_similarity']), reverse=True)

    with open(ROOT_DIR / 'cbr.txt', 'w', encoding='utf-8') as f:
        json.dump(cases[:4], f, indent=4, ensure_ascii=False)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Case-based reasoning')
    parser.add_argument('court', type=str, help='Court')
    parser.add_argument('prosecutor', type=str, help='Prosecutor')
    parser.add_argument('value_of_stolen_things', type=float, help='Value of stolen things')
    parser.add_argument('criminal_act', type=str, help='Criminal act')
    parser.add_argument('articles_used', type=str, help='Articles used')
    parser.add_argument('articles_condemnation', type=str, help='Articles condemnation')

    args = parser.parse_args()
    process_cases(**vars(args))
