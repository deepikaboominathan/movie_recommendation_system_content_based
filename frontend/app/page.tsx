"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import Navbar from "@/components/Navbar";
import {
  getAllMovies,
  getRecommendations,
  Movie,
  RecommendResponse,
} from "@/lib/api";

const has = (m: Movie, g: string) => m.Genre.toLowerCase().includes(g);

export default function Home() {
  const [all, setAll] = useState<Movie[]>([]);
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllMovies()
      .then(setAll)
      .catch(() =>
        setError("Could not reach the backend. Is it running on port 8000?")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleSelect(name: string) {
    setError("");
    try {
      setData(await getRecommendations(name, 15));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Could not load recommendations.");
    }
  }

  const featured = useMemo(
    () =>
      [...all].sort(
        (a, b) => b.Rating - a.Rating || b.PeopleVote - a.PeopleVote
      )[0],
    [all]
  );

  const rows = useMemo(() => {
    const byRating = [...all].sort((a, b) => b.Rating - a.Rating);
    const byVotes = [...all].sort((a, b) => b.PeopleVote - a.PeopleVote);
    const top = (list: Movie[], n = 20) => list.slice(0, n);

    return [
      { title: "Top Rated", movies: top(byRating) },
      { title: "Most Watched", movies: top(byVotes) },
      {
        title: "Action Blockbusters",
        movies: top(byVotes.filter((m) => has(m, "action"))),
      },
      {
        title: "Critically Acclaimed Dramas",
        movies: top(byRating.filter((m) => has(m, "drama"))),
      },
      {
        title: "Romance",
        movies: top(byRating.filter((m) => has(m, "romance"))),
      },
      {
        title: "Thrillers & Crime",
        movies: top(
          byRating.filter((m) => has(m, "thriller") || has(m, "crime"))
        ),
      },
      {
        title: "Comedy",
        movies: top(byRating.filter((m) => has(m, "comedy"))),
      },
      {
        title: "Timeless Classics",
        movies: top(byRating.filter((m) => m.Year < 2000)),
      },
      {
        title: "New Releases",
        movies: top(
          all
            .filter((m) => m.Year >= 2022)
            .sort((a, b) => b.Year - a.Year || b.Rating - a.Rating)
        ),
      },
    ].filter((r) => r.movies.length > 0);
  }, [all]);

  const sameDirector = data
    ? all.filter(
        (m) =>
          m.Director === data.selected.Director &&
          m.MovieName !== data.selected.MovieName
      )
    : [];
  const sameActor = data
    ? all.filter(
        (m) =>
          m.Actor === data.selected.Actor &&
          m.MovieName !== data.selected.MovieName
      )
    : [];

  const heroMovie = data?.selected ?? featured;

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <Navbar onSelect={handleSelect} onHome={() => setData(null)} />

      {loading && (
        <div className="px-6 pt-32 sm:px-12">
          <div className="h-10 w-64 animate-pulse rounded bg-white/10" />
          <div className="mt-6 flex gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] w-[150px] animate-pulse rounded-md bg-white/10 sm:w-[180px]"
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="px-6 pt-28 text-[#E50914] sm:px-12">{error}</p>
      )}

      {heroMovie && (
        <Hero
          movie={heroMovie}
          picked={!!data}
          onMoreLikeThis={() => handleSelect(heroMovie.MovieName)}
          onClear={() => setData(null)}
        />
      )}

      <div className="relative z-10 -mt-20">
        {data && (
          <>
            <MovieRow
              title={`Because you picked ${data.selected.MovieName}`}
              movies={data.recommendations}
              onSelect={handleSelect}
            />
            {sameDirector.length > 0 && (
              <MovieRow
                title={`More from ${data.selected.Director}`}
                movies={sameDirector}
                onSelect={handleSelect}
              />
            )}
            {sameActor.length > 0 && (
              <MovieRow
                title={`More with ${data.selected.Actor}`}
                movies={sameActor}
                onSelect={handleSelect}
              />
            )}
          </>
        )}

        {rows.map((r) => (
          <MovieRow
            key={r.title}
            title={r.title}
            movies={r.movies}
            onSelect={handleSelect}
          />
        ))}

        <footer className="px-6 pb-10 pt-4 text-xs text-neutral-500 sm:px-12">
          Content-based filtering · TF-IDF + cosine similarity on genre,
          director, actor and ratings
        </footer>
      </div>
    </main>
  );
}