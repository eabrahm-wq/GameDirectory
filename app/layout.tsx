import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://eabrahm-wq.github.io/GameDirectory"),
  title: {
    default: "Daily Mind Games Directory",
    template: "%s | Daily Mind Games Directory",
  },
  description:
    "A curated daily games directory for word, geography, logic, strategy, trivia, visual, and math puzzle players.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Daily Mind Games Directory",
    description:
      "Launch your daily puzzle routine with a clean index of Wordle-style, crossword, logic, geography, and strategy games.",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
