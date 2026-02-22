"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import CategorySection from "@/components/CategorySection";
import FiltersBar, { type SortBy, type TimeBucket } from "@/components/FiltersBar";
import type { Category, Difficulty, Game, ResetType } from "@/data/games";
import { CATEGORY_ORDER, ESSENTIAL_GAME_IDS } from "@/data/games";
import { trendingThisWeek } from "@/data/trending";
import { loadFavorites, saveFavorites, toggleFavorite } from "@/lib/favorites";

type HomeDashboardProps = {
  games: Game[];
};

const difficultyWeight: Record<Difficulty, number> = {
  Easy: 1,
  Med: 2,
  Hard: 3,
};

function matchesTimeBucket(avgTimeMin: number, timeBucket: TimeBucket): boolean {
  if (timeBucket === "any") {
    return true;
  }
  if (timeBucket === "lte3") {
    return avgTimeMin <= 3;
  }
  if (timeBucket === "4to10") {
    return avgTimeMin >= 4 && avgTimeMin <= 10;
  }
  return avgTimeMin > 10;
}

function sortGames(a: Game, b: Game, sortBy: SortBy): number {
  if (sortBy === "avgTime") {
    return a.avgTimeMin - b.avgTimeMin;
  }
  if (sortBy === "difficulty") {
    const diffOrder = difficultyWeight[a.difficulty] - difficultyWeight[b.difficulty];
    return diffOrder === 0 ? a.popularityRank - b.popularityRank : diffOrder;
  }
  return a.popularityRank - b.popularityRank;
}

function getHoursUntilLocalMidnight(nowMs: number): number {
  const now = new Date(nowMs);
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const msLeft = midnight.getTime() - now.getTime();
  return Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60)));
}

export default function HomeDashboard({ games }: HomeDashboardProps) {
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [resetType, setResetType] = useState<ResetType | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [timeBucket, setTimeBucket] = useState<TimeBucket>("any");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 60000);

    return () => window.clearInterval(timerId);
  }, []);

  const todayLabel = useMemo(
    () => new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(new Date()),
    [],
  );
  const dailyResetHours = useMemo(() => getHoursUntilLocalMidnight(nowMs), [nowMs]);

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => game.name.toLowerCase().includes(search.trim().toLowerCase()))
      .filter((game) => (category === "all" ? true : game.category === category))
      .filter((game) => (resetType === "all" ? true : game.resetType === resetType))
      .filter((game) => (difficulty === "all" ? true : game.difficulty === difficulty))
      .filter((game) => matchesTimeBucket(game.avgTimeMin, timeBucket))
      .sort((a, b) => sortGames(a, b, sortBy));
  }, [games, search, category, resetType, difficulty, timeBucket, sortBy]);

  const morningMenu = useMemo(
    () => games.filter((game) => favorites.includes(game.id)).sort((a, b) => a.popularityRank - b.popularityRank),
    [favorites, games],
  );

  const essentials = useMemo(() => {
    const essentialsSet = new Set(ESSENTIAL_GAME_IDS);
    return filteredGames.filter((game) => essentialsSet.has(game.id as (typeof ESSENTIAL_GAME_IDS)[number]));
  }, [filteredGames]);

  const trending = useMemo(() => {
    return trendingThisWeek
      .map((item) => {
        const game = games.find((entry) => entry.id === item.gameId);
        return game ? { game, note: item.note } : null;
      })
      .filter((entry): entry is { game: Game; note: string } => Boolean(entry));
  }, [games]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="space-y-2 border-b border-index-line/80 pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-index-muted">Today&apos;s Puzzles</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Daily Mind Games Directory</h1>
        <p className="text-sm text-index-muted">{todayLabel}</p>
      </header>

      <section className="rounded-xl border border-index-line bg-index-paper px-4 py-3 shadow-card sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-index-muted">Today&apos;s Session</p>
            <p className="mt-1 text-base font-medium text-index-ink">
              {filteredGames.length} games in your current view
            </p>
          </div>
          <p className="rounded-full border border-index-line px-3 py-1 text-xs font-medium text-index-muted">
            Daily resets in ~{dailyResetHours}h
          </p>
        </div>
      </section>

      {morningMenu.length > 0 && (
        <section className="space-y-3 rounded-xl border border-index-line bg-index-paper p-4 shadow-card sm:p-5">
          <h2 className="text-2xl font-semibold">My Morning Menu</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {morningMenu.map((game) => (
              <a
                key={game.id}
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-index-line bg-white p-3 transition-colors hover:border-index-accent/45 focus-visible:border-index-accent"
              >
                <p className="font-medium">{game.name}</p>
                <p className="text-sm text-index-muted">
                  {game.avgTimeMin} min · {game.difficulty}
                  {game.resetType === "Daily" ? ` · Resets in ~${dailyResetHours}h` : ""}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Find Today&apos;s Games</h2>
        <p className="text-sm text-index-muted">Filter by format, time, and difficulty to build a focused run.</p>
        <FiltersBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          resetType={resetType}
          onResetTypeChange={setResetType}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          timeBucket={timeBucket}
          onTimeBucketChange={setTimeBucket}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          categories={CATEGORY_ORDER}
        />
      </section>

      <CategorySection
        title="Essentials"
        games={essentials}
        favorites={favorites}
        dailyResetHours={dailyResetHours}
        headerNote="Daily resets in ~{hours}h"
        onToggleFavorite={(id) => setFavorites((prev) => toggleFavorite(prev, id))}
      />

      <section
        className="space-y-3 rounded-xl border border-index-accent/30 bg-index-accentSoft p-4 sm:p-5"
        aria-labelledby="trending-week"
      >
        <h2 id="trending-week" className="text-2xl font-semibold tracking-tight">
          Trending this week
        </h2>
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {trending.map(({ game, note }) => (
            <li key={game.id} className="rounded-lg border border-index-line bg-index-paper p-3">
              <p className="font-medium">{game.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-index-muted">{note}</p>
              <a
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-index-accent underline-offset-2 hover:underline"
              >
                Play
              </a>
            </li>
          ))}
        </ul>
      </section>

      {CATEGORY_ORDER.map((sectionCategory) => (
        <CategorySection
          key={sectionCategory}
          title={sectionCategory}
          games={filteredGames.filter((game) => game.category === sectionCategory)}
          favorites={favorites}
          dailyResetHours={dailyResetHours}
          onToggleFavorite={(id) => setFavorites((prev) => toggleFavorite(prev, id))}
        />
      ))}

      <section className="rounded-xl border border-index-line bg-index-paper p-4 shadow-card sm:p-5" aria-labelledby="collections-links">
        <h2 id="collections-links" className="text-2xl font-semibold tracking-tight">Explore Collections</h2>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <Link className="underline decoration-index-line underline-offset-4 hover:text-index-accent" href="/collections/games-like-wordle">
            Games Like Wordle
          </Link>
          <Link className="underline decoration-index-line underline-offset-4 hover:text-index-accent" href="/collections/geography-like-wordle">
            Geography Like Wordle
          </Link>
          <Link className="underline decoration-index-line underline-offset-4 hover:text-index-accent" href="/collections/hard-word-games">
            Hard Word Games
          </Link>
          <Link className="underline decoration-index-line underline-offset-4 hover:text-index-accent" href="/collections/daily-puzzle-games">
            Daily Puzzle Games
          </Link>
        </div>
      </section>
    </div>
  );
}
