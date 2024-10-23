export type VerbDetails = {
  verb: string,
  hilfsverb: "haben" | "sein"
  duden_url: string
  duden_word_frequency: 1 | 2 | 3 | 4 | 5
  praeteritum: string
  praesens: string
  perfekt: string
  is_reflexive: boolean
  vowel_change_from: string
  vowel_change_to: string
  examples: [{
    de: string
    en: string
  }]
}