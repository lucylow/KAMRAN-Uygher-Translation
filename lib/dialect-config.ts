export type DialectLanguage = "ug" | "zh";

export interface DialectConfig {
  id: string;
  name: string;
  nativeName: string;
  region: string;
  language: DialectLanguage;
  script: "arabic" | "chinese";
  guidance: string;
}

export const DIALECTS: readonly DialectConfig[] = [
  { id: "ug_urumqi", name: "Urumqi Uyghur", nativeName: "ئۈرۈمچى ئۇيغۇرچىسى", region: "Urumqi", language: "ug", script: "arabic", guidance: "Uses the standard Uyghur Arabic script profile." },
  { id: "ug_kashgar", name: "Kashgar Uyghur", nativeName: "قەشقەر ئۇيغۇرچىسى", region: "Kashgar", language: "ug", script: "arabic", guidance: "Keeps regional wording visible while using the current Uyghur translation engine." },
  { id: "ug_turpan", name: "Turpan Uyghur", nativeName: "تۇرپان ئۇيغۇرچىسى", region: "Turpan", language: "ug", script: "arabic", guidance: "Uses the same safe fallback profile until dialect-specific voice support is available." },
  { id: "zh_mandarin", name: "Mandarin Chinese", nativeName: "普通话", region: "Mainland China", language: "zh", script: "chinese", guidance: "Default simplified-Chinese profile for the current MVP." },
  { id: "zh_cantonese", name: "Cantonese", nativeName: "廣東話", region: "Guangdong · Hong Kong", language: "zh", script: "chinese", guidance: "Dialect selection is stored as metadata; translation remains on the deterministic MVP boundary." },
];

export function getDialectsForDirection(direction: "ug-zh" | "zh-ug"): DialectConfig[] {
  const language: DialectLanguage = direction === "ug-zh" ? "ug" : "zh";
  return DIALECTS.filter((dialect) => dialect.language === language);
}

export function getDefaultDialect(direction: "ug-zh" | "zh-ug"): DialectConfig {
  return getDialectsForDirection(direction)[0];
}

export function getDialectById(id: string): DialectConfig | undefined {
  return DIALECTS.find((dialect) => dialect.id === id);
}

export function getDialectFallbackMessage(dialect: DialectConfig): string {
  return `${dialect.name} selected · ${dialect.guidance}`;
}
