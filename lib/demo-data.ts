import type { TranslationEntry } from "@/lib/translation-store";

/**
 * Local-only sample content used when the user explicitly enables Demo mode.
 * It contains no network data and is safe to clear from Settings.
 */
export const DEMO_TRANSLATIONS: Array<
  Omit<TranslationEntry, "id" | "createdAt" | "isFavorite">
> = [
  {
    source: "ياخشىمۇسىز؟",
    result: "你好！",
    direction: "Uyghur → Chinese",
  },
  {
    source: "رەھمەت سىزگە",
    result: "谢谢你。",
    direction: "Uyghur → Chinese",
  },
  {
    source: "请问，车站在哪里？",
    result: "كەچۈرۈڭ، ۋوگزال قەيەردە؟",
    direction: "Chinese → Uyghur",
  },
];
