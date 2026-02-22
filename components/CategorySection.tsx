"use client";

import type { Game } from "@/data/games";
import GameCard from "@/components/GameCard";

type CategorySectionProps = {
  title: string;
  games: Game[];
  favorites: string[];
  dailyResetHours: number;
  headerNote?: string;
  onToggleFavorite: (id: string) => void;
};

export default function CategorySection({
  title,
  games,
  favorites,
  dailyResetHours,
  headerNote,
  onToggleFavorite,
}: CategorySectionProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`section-${title}`} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={`section-${title}`} className="text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        {headerNote && (
          <p className="rounded-full border border-index-line bg-index-paper px-3 py-1 text-xs font-medium text-index-muted">
            {headerNote.replace("{hours}", String(dailyResetHours))}
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isFavorite={favorites.includes(game.id)}
            dailyResetHours={dailyResetHours}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}
