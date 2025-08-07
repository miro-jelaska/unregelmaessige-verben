import yaml
import copy
from dataclasses import dataclass
from collections import defaultdict

YML_RELATIVE_PATH = './data/unregelmaessige_verben.yml'

@dataclass
class Example:
    de: str
    en: str

@dataclass
class Verb:
    pre_example: str
    verb: str
    post_example: str
    hilfsverb: list[str]
    is_reflexive: bool
    praesens: str
    praeteritum: str
    perfekt: str
    vowel_change_from: str
    vowel_change_to: str
    examples: list[Example]
    
    @classmethod
    def from_record(cls, record):
        examples = []
        for e in record.get('examples'):
            examples.append(
                Example(
                    de = e['de'],
                    en = e['en']
                )
            )
        return cls(
            pre_example = record.get('pre_example'),
            verb = record.get('verb'),
            post_example = record.get('post_example'),
            hilfsverb = record.get('hilfsverb'),
            is_reflexive = record.get('is_reflexive'),
            praesens = record.get('praesens'),
            praeteritum = record.get('praeteritum'),
            perfekt = record.get('perfekt'),
            vowel_change_from = record.get('vowel_change_from'),
            vowel_change_to = record.get('vowel_change_to'),
            examples = examples,
        )

def map_to_anki_csv_row(v: Verb) -> None:
    examples = "<br/><br/>".join([
        f"<b>{_.de}</b><br/>{_.en}"
        for _ in v.examples
    ])
    h = (
        "/".join(v.hilfsverb) 
        .replace("sein", "ist")
        .replace("haben", "hat")
    )
    return f"{v.verb}<br/>{{{{c1::{v.praesens}}}}}<br/>{{{{c1::{v.praeteritum}}}}}<br/>{{{{c1::{h} {v.perfekt}}}}}\t{examples}"

def main():
    print("Running generate_notes.py")

    with open(YML_RELATIVE_PATH, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    # Map loaded data to Verb object.
    all_verbs_by_verb = defaultdict(list)
    for item in data:
        v = Verb.from_record(item)
        all_verbs_by_verb[v.verb].append(v)

    # There are verbs that have more than one entry. 
    # Merge these values.
    verbs_dedup = []
    for key, values in all_verbs_by_verb.items():
        all_examples = [
            example
            for a in values
            for example in a.examples
        ]
        all_hilfsverbs = [
            _.hilfsverb for _ in values
        ]
        all_hilfsverbs.sort()
        dedup_hilfsverbs = list(set(all_hilfsverbs))
        result = copy.deepcopy(values[0])
        result.hilfsverb = dedup_hilfsverbs
        result.examples = all_examples
        verbs_dedup.append(result)

    # Write CSV for Anki.
    with open("anki_import.csv", 'w', encoding='utf-8') as csv_file:
        for v in verbs_dedup:
            csv_file.write(f"{map_to_anki_csv_row(v)}\n")

    # Write all MD notes for Obsidian.
    for v in verbs_dedup:
        with open(f"./generated_obsidian_notes/\"{v.verb}\".md", 'w', encoding='utf-8') as md:
            md.write('---\n')
            md.write(f"tags:\n")
            md.write(f"  - de/grammar/unregelmaessige-verb\n")
            md.write(f"praesens: {v.praesens}\n")
            md.write(f"praeteritum: {v.praeteritum}\n")
            md.write(f"perfekt: {v.perfekt}\n")
            md.write(f"hilfsverb:\n")
            for h in v.hilfsverb:
                md.write(f"  - {h}\n")
            md.write(f"pre_example: {v.pre_example}\n")
            md.write(f"post_example: {v.post_example}\n")
            md.write('---\n')
            md.write('\n# Examples\n')
            for e in v.examples:
                md.write(f"- . {e.de}\n".replace("<em>", "**").replace("</em>", "**"))
                md.write(f"\t- .e {e.en}\n".replace("<em>", "**").replace("</em>", "**"))

if __name__ == '__main__':
    main()
