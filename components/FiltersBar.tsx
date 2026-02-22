"use client";

import type { Category, Difficulty, ResetType } from "@/data/games";

type TimeBucket = "any" | "lte3" | "4to10" | "gt10";
type SortBy = "popular" | "avgTime" | "difficulty";

type FiltersBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  category: Category | "all";
  onCategoryChange: (value: Category | "all") => void;
  resetType: ResetType | "all";
  onResetTypeChange: (value: ResetType | "all") => void;
  difficulty: Difficulty | "all";
  onDifficultyChange: (value: Difficulty | "all") => void;
  timeBucket: TimeBucket;
  onTimeBucketChange: (value: TimeBucket) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  categories: Category[];
};

export type { TimeBucket, SortBy };

export default function FiltersBar(props: FiltersBarProps) {
  return (
    <section className="rounded-xl border border-index-line bg-index-paper p-4 shadow-card sm:p-5" aria-label="Filter games">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-index-ink">Search</span>
          <input
            value={props.search}
            onChange={(event) => props.onSearchChange(event.target.value)}
            placeholder="Search by name"
            className="w-full rounded-md border border-index-line bg-white px-3 py-2 text-index-ink placeholder:text-index-muted/80"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-index-ink">Category</span>
          <select
            value={props.category}
            onChange={(event) => props.onCategoryChange(event.target.value as Category | "all")}
            className="w-full rounded-md border border-index-line bg-white px-3 py-2 text-index-ink"
          >
            <option value="all">All</option>
            {props.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-index-ink">Reset</span>
          <select
            value={props.resetType}
            onChange={(event) => props.onResetTypeChange(event.target.value as ResetType | "all")}
            className="w-full rounded-md border border-index-line bg-white px-3 py-2 text-index-ink"
          >
            <option value="all">All</option>
            <option value="Daily">Daily</option>
            <option value="Unlimited">Unlimited</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-index-ink">Difficulty</span>
          <select
            value={props.difficulty}
            onChange={(event) => props.onDifficultyChange(event.target.value as Difficulty | "all")}
            className="w-full rounded-md border border-index-line bg-white px-3 py-2 text-index-ink"
          >
            <option value="all">All</option>
            <option value="Easy">Easy</option>
            <option value="Med">Med</option>
            <option value="Hard">Hard</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-index-ink">Avg Time</span>
          <select
            value={props.timeBucket}
            onChange={(event) => props.onTimeBucketChange(event.target.value as TimeBucket)}
            className="w-full rounded-md border border-index-line bg-white px-3 py-2 text-index-ink"
          >
            <option value="any">Any</option>
            <option value="lte3">≤3 min</option>
            <option value="4to10">4-10 min</option>
            <option value="gt10">10+ min</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-index-ink">Sort</span>
          <select
            value={props.sortBy}
            onChange={(event) => props.onSortByChange(event.target.value as SortBy)}
            className="w-full rounded-md border border-index-line bg-white px-3 py-2 text-index-ink"
          >
            <option value="popular">Popular</option>
            <option value="avgTime">Avg Time</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </label>
      </div>
    </section>
  );
}
