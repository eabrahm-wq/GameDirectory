import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { collectionBySlug, collectionConfigs, getCollectionGames } from "@/data/collections";
import { games } from "@/data/games";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return collectionConfigs.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = collectionBySlug[slug as keyof typeof collectionBySlug];

  if (!collection) {
    return {
      title: "Collection Not Found",
      description: "The collection page you requested was not found.",
    };
  }

  return {
    title: collection.title,
    description: collection.description,
    alternates: {
      canonical: `/collections/${collection.slug}`,
    },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = collectionBySlug[slug as keyof typeof collectionBySlug];

  if (!collection) {
    notFound();
  }

  const collectionGames = getCollectionGames(collection, games);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: collection.faq.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-index-muted">Collection</p>
        <h1 className="text-3xl font-semibold tracking-tight">{collection.title}</h1>
        <p className="max-w-3xl text-index-muted">{collection.intro}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {collectionGames.map((game) => (
          <article key={game.id} className="rounded-xl border border-index-line bg-index-paper p-4 shadow-card">
            <h2 className="text-lg font-semibold">{game.name}</h2>
            <p className="mt-1 text-sm text-index-muted">{game.description}</p>
            <p className="mt-2 text-xs text-index-muted">
              {game.category} · {game.difficulty} · {game.avgTimeMin} min · {game.resetType}
            </p>
            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex rounded-md border border-index-accent bg-index-accent px-3 py-1.5 text-sm font-medium text-white"
            >
              Play
            </a>
          </article>
        ))}
      </section>

      <section className="space-y-2 rounded-xl border border-index-line bg-index-paper p-4">
        <h2 className="text-xl font-semibold">Related Collections</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="underline underline-offset-4 hover:text-index-accent" href="/">
            Home Directory
          </Link>
          {collectionConfigs
            .filter((item) => item.slug !== collection.slug)
            .map((item) => (
              <Link
                key={item.slug}
                className="underline underline-offset-4 hover:text-index-accent"
                href={`/collections/${item.slug}`}
              >
                {item.title}
              </Link>
            ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-index-line bg-index-paper p-4" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-xl font-semibold">FAQ</h2>
        {collection.faq.map((faq) => (
          <article key={faq.question}>
            <h3 className="font-medium">{faq.question}</h3>
            <p className="text-sm text-index-muted">{faq.answer}</p>
          </article>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
