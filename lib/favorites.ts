const FAVORITES_KEY = "daily-mind-games:favorites";

export function loadFavorites(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function toggleFavorite(current: string[], id: string): string[] {
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
}
