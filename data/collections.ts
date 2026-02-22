import type { Category, Difficulty, Game, ResetType } from "@/data/games";

export type CollectionFAQ = {
  question: string;
  answer: string;
};

export type CollectionCriteria = {
  category?: Category;
  difficulty?: Difficulty;
  resetType?: ResetType;
  requiredTags?: string[];
  requiredNameIncludes?: string[];
};

export type CollectionConfig = {
  slug:
    | "games-like-wordle"
    | "geography-like-wordle"
    | "hard-word-games"
    | "daily-puzzle-games";
  title: string;
  description: string;
  intro: string;
  faq: CollectionFAQ[];
  criteria: CollectionCriteria;
  maxItems?: number;
};

export const collectionConfigs: CollectionConfig[] = [
  {
    slug: "games-like-wordle",
    title: "Games Like Wordle: Daily Brain Teasers",
    description:
      "A curated set of games like Wordle, including semantic, multi-grid, and logic-first variants.",
    intro:
      "If Wordle is your anchor habit, this list expands it with daily and endlessly replayable alternatives that preserve the same short-feedback loop.",
    faq: [
      {
        question: "What makes a game similar to Wordle?",
        answer:
          "We prioritize short rounds, guess-feedback loops, and daily reset cadence so each game fits a morning routine.",
      },
      {
        question: "Are these all daily games?",
        answer:
          "Most are daily, but a few include unlimited modes for additional practice once you finish your daily run.",
      },
    ],
    criteria: {
      requiredTags: ["wordle-like"],
    },
    maxItems: 14,
  },
  {
    slug: "geography-like-wordle",
    title: "Geography Games Like Wordle",
    description:
      "Daily geography games inspired by Wordle-style deduction and quick iterative guesses.",
    intro:
      "These geography picks use familiar Wordle pacing, but the clues are maps, countries, direction, and distance instead of letter positions.",
    faq: [
      {
        question: "Which game is best for beginners?",
        answer:
          "Worldle is the easiest entry because silhouette recognition is fast and each round is only a few minutes.",
      },
      {
        question: "Do I need a paid subscription?",
        answer:
          "Most entries are free to play daily, while some platforms offer optional premium modes for extra rounds.",
      },
    ],
    criteria: {
      category: "Geography",
    },
    maxItems: 10,
  },
  {
    slug: "hard-word-games",
    title: "Hard Word Games for Advanced Players",
    description:
      "A shortlist of difficult word games for players who want higher challenge and longer solve times.",
    intro:
      "When basic daily puzzles feel too easy, this set raises complexity through adversarial rules, semantic distance, or multi-grid pressure.",
    faq: [
      {
        question: "Are hard games still beginner-friendly?",
        answer:
          "Yes, but expect longer solve times and steeper learning curves than standard five-letter word games.",
      },
      {
        question: "What should I try first from this list?",
        answer:
          "Contexto is a good stepping stone before moving into Semantle or Octordle.",
      },
    ],
    criteria: {
      category: "Word Games",
      difficulty: "Hard",
    },
  },
  {
    slug: "daily-puzzle-games",
    title: "Daily Puzzle Games Directory",
    description:
      "A broad set of daily puzzle games across word, geography, logic, strategy, and trivia categories.",
    intro:
      "This collection is designed as a practical daily index: quick starts, clear categories, and enough range to build a consistent puzzle routine.",
    faq: [
      {
        question: "How many games should I play each morning?",
        answer:
          "Most people do best with two to five games, balancing quick wins with one deeper challenge.",
      },
      {
        question: "Can I save favorites?",
        answer:
          "Yes. Star any game on the homepage and it appears in your My Morning Menu list.",
      },
    ],
    criteria: {
      resetType: "Daily",
    },
    maxItems: 20,
  },
];

export const collectionBySlug = Object.fromEntries(
  collectionConfigs.map((collection) => [collection.slug, collection]),
) as Record<CollectionConfig["slug"], CollectionConfig>;

export function getCollectionGames(collection: CollectionConfig, allGames: Game[]): Game[] {
  const matches = allGames.filter((game) => {
    const { criteria } = collection;

    if (criteria.category && game.category !== criteria.category) {
      return false;
    }
    if (criteria.difficulty && game.difficulty !== criteria.difficulty) {
      return false;
    }
    if (criteria.resetType && game.resetType !== criteria.resetType) {
      return false;
    }
    if (criteria.requiredTags && !criteria.requiredTags.some((tag) => game.tags.includes(tag))) {
      return false;
    }
    if (
      criteria.requiredNameIncludes &&
      !criteria.requiredNameIncludes.some((needle) => game.name.toLowerCase().includes(needle.toLowerCase()))
    ) {
      return false;
    }

    return true;
  });

  const sorted = [...matches].sort((a, b) => a.popularityRank - b.popularityRank);

  if (collection.maxItems) {
    return sorted.slice(0, collection.maxItems);
  }

  return sorted;
}
