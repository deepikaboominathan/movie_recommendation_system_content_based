"use client";

import { Movie } from "@/lib/api";
import { posterStyle } from "@/lib/theme";

export default function MovieCard({
  movie,
  match,
  onSelect,
}: {
  movie: Movie;
  match?: number;
  onSelect: (name: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(movie.MovieName)}
      style={posterStyle(movie.Genre)}
      className="group relative aspect-[2/3] w-[150px] shrink-0 overflow-hidden rounded-md text-left shadow-lg transition duration-300 hover:z-20 hover:scale-110 hover:shadow-2xl hover:shadow-black sm:w-[180px]"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <span className="absolute left-2 top-2 text-lg font-black leading-none text-[#E50914]">
        T
      </span>

      {match !== undefined && (
        <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-bold text-[#46d369]">
          {match}% Match
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="text-base font-extrabold leading-tight sm:text-lg">
          {movie.MovieName}
        </h3>
        <p className="mt-1 text-[11px] text-neutral-300">
          {movie.Year} · {movie.Genre.split("/")[0]}
        </p>
      </div>

      {/* hover details */}
      <div className="absolute inset-0 flex flex-col justify-end gap-1.5 bg-black/90 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-base font-extrabold leading-tight">
          {movie.MovieName}
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-[#46d369]">★ {movie.Rating}</span>
          <span className="rounded border border-neutral-500 px-1 text-[10px]">
            {movie.content_rating}
          </span>
          <span className="text-neutral-400">{movie.Year}</span>
        </div>
        <p className="text-[11px] text-neutral-300">
          {movie.Genre.split("/").join(" • ")}
        </p>
        <p className="text-[11px] text-neutral-400">
          <span className="text-neutral-500">Dir:</span> {movie.Director}
        </p>
        <p className="text-[11px] text-neutral-400">
          <span className="text-neutral-500">Cast:</span> {movie.Actor}
        </p>
        <p className="text-[10px] text-neutral-500">
          {movie.PeopleVote.toLocaleString()} votes · {movie.movie_rating}
        </p>
      </div>
    </button>
  );
}