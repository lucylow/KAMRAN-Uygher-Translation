export interface DialectPhraseSuggestion {
  id: string;
  dialectId: string;
  source: string;
  translation: string;
  category: "greeting" | "travel" | "thanks";
}

const PHRASES: readonly DialectPhraseSuggestion[] = [
  { id: "urumqi-greeting", dialectId: "ug_urumqi", source: "سالام، قانداقسىز؟", translation: "你好，你好吗？", category: "greeting" },
  { id: "kashgar-travel", dialectId: "ug_kashgar", source: "قەشقەرگە بارامسىز؟", translation: "你要去喀什吗？", category: "travel" },
  { id: "turpan-travel", dialectId: "ug_turpan", source: "تۇرپانغا بارامسىز؟", translation: "你要去吐鲁番吗？", category: "travel" },
  { id: "mandarin-greeting", dialectId: "zh_mandarin", source: "你好，你好吗？", translation: "سالام، قانداقسىز؟", category: "greeting" },
  { id: "cantonese-thanks", dialectId: "zh_cantonese", source: "多謝", translation: "رەھمەت سىزگە", category: "thanks" },
];

export function getDialectPhraseSuggestions(dialectId: string): DialectPhraseSuggestion[] {
  return PHRASES.filter((phrase) => phrase.dialectId === dialectId);
}
