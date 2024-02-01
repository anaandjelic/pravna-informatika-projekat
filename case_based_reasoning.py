import os
import pathlib
import re
import sys

import pandas as pd

current_path = pathlib.Path(__file__).parent.resolve()

df = pd.read_csv(str(current_path) + '/primer.csv')

avg_vr_ukradenih_stvari = df['vr_ukradenih_stvari'].mean()
threshold = avg_vr_ukradenih_stvari/5

attributes_to_compare = ['sud', 'tuzilac', 'kriv_delo', 'clanovi_kriv_dela', 'clanovi_osude']

parameters = sys.stdin.readline().strip().split('|')
court, prosecutor, value_of_stolen_things, criminal_act, articles_used, articles_condemnation = parameters


def calculate_jaccard_similarity(set1, set2):
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))

    jaccard_similarity = intersection / union if union != 0 else 0
    return jaccard_similarity


columns_to_exclude = ['broj_slucaja', 'sudija', 'optuzeni', 'vr_ukradenih_stvari', 'kazna']

file_input = ''

cases = []
jaccard_similarities = []

for index, row in df.iterrows():
    
    existing_values = [str(val) for col, val in row.items() if
                       col not in columns_to_exclude]
    entered_values = [court, prosecutor, criminal_act, articles_used, articles_condemnation]

    existing_set = set(re.split(r'[.,\s]', ' '.join(existing_values)))
    entered_set = set(re.split(r'[.,\s]', ' '.join(entered_values)))
    jaccard_similarity = calculate_jaccard_similarity(existing_set, entered_set)

    exisiting_value = row['vr_ukradenih_stvari']
    value_diff = abs(exisiting_value - float(value_of_stolen_things))

    if value_diff <= threshold:
        modified_diff = (1 - (value_diff / threshold)) / 1000  # max +0.1
        jaccard_similarity += modified_diff
    else:
        modified_diff = value_diff / (10*avg_vr_ukradenih_stvari)  # if diff = 10*avg, then -1
        jaccard_similarity -= modified_diff
    

    row_values = df.iloc[index].astype(str)
    result_string = ', '.join(f'{col_name}: {col_value}' for col_name, col_value in zip(row_values.index, row_values))

    jaccard_similarities.append(jaccard_similarity)
    cases.append(result_string)

combined_data = list(zip(cases, jaccard_similarities))
sorted_data = sorted(combined_data, key=lambda x: x[1], reverse=True)
sorted_case_names, sorted_jaccard_similarities = zip(*sorted_data)

for i in range(4):
    file_input += (sorted_case_names[i] + ' | Modifikovana Jaccard-ova sličnost: ' + str(round(sorted_jaccard_similarities[i], 2)) + '\n')

with open(str(current_path) + "/cbr.txt", 'w', encoding='utf-8') as f:
    f.write(file_input)
    