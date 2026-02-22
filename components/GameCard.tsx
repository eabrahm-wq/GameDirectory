"use client";

import type { Game } from "@/data/games";

type GameCardProps = {
  game: Game;
  isFavorite: boolean;
  dailyResetHours: number;
  onToggleFavorite: (id: string) => void;
};

export default function GameCard({ game, isFavorite, dailyResetHours, onToggleFavorite }: GameCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-index-line bg-index-paper p-4 shadow-card transition-colors duration-150 hover:border-index-accent/40 hover:bg-white focus-within:border-index-accent focus-within:ring-1 focus-within:ring-index-accent">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-index-ink">{game.name}</h3>
        <button
          type="button"
          aria-label={isFavorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
          onClick={() => onToggleFavorite(game.id)}
          className="rounded-md p-1 text-xl leading-none text-index-muted transition-colors hover:text-index-accent"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-index-muted">{game.description}</p>

      <ul className="mb-4 flex flex-wrap gap-2 text-xs">
        <li className="rounded-full border border-index-line px-2 py-1">{game.category}</li>
        <li className="rounded-full border border-index-line px-2 py-1">{game.difficulty}</li>
        <li className="rounded-full border border-index-line px-2 py-1">{game.avgTimeMin} min</li>
        <li className="rounded-full border border-index-line px-2 py-1">{game.resetType}</li>
        {game.resetType === "Daily" && (
          <li className="rounded-full border border-index-accent/30 bg-index-accentSoft px-2 py-1 text-index-ink">
            Resets in ~{dailyResetHours}h
          </li>
        )}
      </ul>

      <a
        href={game.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex w-fit items-center rounded-md border border-index-accent bg-index-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Play
      </a>
    </article>
  );
}
