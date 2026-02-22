export type TrendingItem = {
  gameId: string;
  note: string;
};

export const trendingThisWeek: TrendingItem[] = [
  { gameId: "nyt-connections", note: "Streak culture and shareable emoji summaries." },
  { gameId: "worldle", note: "Fast global trivia format works well on mobile." },
  { gameId: "the-mini-crossword", note: "Sub-5-minute morning habit for commuters." },
  { gameId: "chesscom-daily-puzzle", note: "Daily tactical themes are easy to discuss in clubs." },
  { gameId: "travle", note: "Country pathfinding twist gives geography players novelty." },
];
