"use client";

import { useRef } from "react";
import { Movie } from "@/lib/api";
import MovieCard from "./MovieCard";

type Item = Movie & { similarity?: number };

export default function MovieRow({
  title,
  movies,
  onSelect,
}: {
  title: string;
  movies: Item[];
  onSelect: (name: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) =>
    ref.current?.scrollBy({
      left: dir * ref.current.clientWidth * 0.8,
      behavior: "smooth",
    });

  return (
    <section className="group/row relative mb-10">
      <h2 className="mb-3 px-6 text-lg font-bold text-neutral-100 sm:px-12 sm:text-xl">
        {title}
      </h2>

      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-0 top-10 z-30 hidden h-[calc(100%-2.5rem)] w-10 items-center justify-center bg-black/50 text-3xl opacity-0 transition hover:bg-black/80 group-hover/row:opacity-100 sm:flex"
      >
        ‹
      </button>

      <div
        ref={ref}
        className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth px-6 py-6 sm:px-12"
      >
        {movies.map((m) => (
          <MovieCard
            key={m.MovieName}
            movie={m}
            match={
              m.similarity !== undefined
                ? Math.round(m.similarity * 100)
                : undefined
            }
            onSelect={onSelect}
          />
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-0 top-10 z-30 hidden h-[calc(100%-2.5rem)] w-10 items-center justify-center bg-black/50 text-3xl opacity-0 transition hover:bg-black/80 group-hover/row:opacity-100 sm:flex"
      >
        ›
      </button>
    </section>
  );
}