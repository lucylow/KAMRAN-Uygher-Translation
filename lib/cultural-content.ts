export type CulturalCategory = "music" | "poetry" | "cuisine" | "calligraphy";

export interface CulturalLearningCard {
  id: string;
  category: CulturalCategory;
  title: string;
  nativeTitle: string;
  region: string;
  description: string;
  lessonLabel: string;
  detailBody: string;
  takeaway: string;
  icon: "book.fill" | "sparkles" | "camera.fill" | "heart.fill";
}

export const CULTURAL_LEARNING_CARDS: readonly CulturalLearningCard[] = [
  { id: "muqam", category: "music", title: "Twelve Muqam", nativeTitle: "ئون ئىككى مۇقام", region: "Across Xinjiang", description: "Meet the instruments and story behind a foundational Uyghur musical tradition.", lessonLabel: "5 min lesson", detailBody: "Listen for the dutar, rebab, and dap in this introduction to a living Uyghur musical tradition.", takeaway: "Sound can carry place, memory, and community.", icon: "sparkles" },
  { id: "poetry", category: "poetry", title: "Wisdom in verse", nativeTitle: "ھىكمەت", region: "Literature", description: "Read a short bilingual poetry excerpt and learn the words that carry its meaning.", lessonLabel: "3 min reading", detailBody: "Read the bilingual excerpt slowly, then tap one phrase in your phrasebook to hear its meaning in context.", takeaway: "Words become easier to remember when they stay connected to a story.", icon: "book.fill" },
  { id: "cuisine", category: "cuisine", title: "Lagman table talk", nativeTitle: "لەڭمەن", region: "Everyday culture", description: "Practice the phrases used when sharing a meal and asking what is on the table.", lessonLabel: "4 min practice", detailBody: "Practice the polite phrases used when sharing a meal, asking what is served, and thanking your host.", takeaway: "Everyday language is an invitation to connect.", icon: "camera.fill" },
  { id: "calligraphy", category: "calligraphy", title: "Arabic-script forms", nativeTitle: "ئۇيغۇر يېزىقى", region: "Writing & art", description: "Explore letter shapes while reinforcing the Uyghur words from your phrasebook.", lessonLabel: "6 min activity", detailBody: "Explore the shapes of Uyghur Arabic-script letters and compare them with the words in your current vocabulary list.", takeaway: "Writing practice strengthens recognition and recall.", icon: "heart.fill" },
];

export function getCulturalLearningCards(category: CulturalCategory | "all"): CulturalLearningCard[] {
  return category === "all" ? [...CULTURAL_LEARNING_CARDS] : CULTURAL_LEARNING_CARDS.filter((card) => card.category === category);
}
