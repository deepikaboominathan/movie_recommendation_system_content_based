import { Movie } from "@/lib/api";
import { posterStyle } from "@/lib/theme";

export default function Hero({
  movie,
  picked,
  onMoreLikeThis,
  onClear,
}: {
  movie: Movie;
  picked: boolean;
  onMoreLikeThis: () => void;
  onClear: () => void;
}) {
  return (
    <section
      className="relative flex min-h-[75vh] items-end overflow-hidden"
      style={posterStyle(movie.Genre)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#141414] to-transparent" />

      <div className="relative z-10 max-w-2xl px-6 pb-28 pt-40 sm:px-12">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#E50914]">
          {picked ? "You picked" : "Featured"}
        </p>
        <h1 className="text-5xl font-black leading-none drop-shadow-lg sm:text-7xl">
          {movie.MovieName}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <span className="font-bold text-[#46d369]">★ {movie.Rating}</span>
          <span className="text-neutral-300">{movie.Year}</span>
          <span className="rounded border border-neutral-400 px-1.5 text-xs">
            {movie.content_rating}
          </span>
          <span className="text-neutral-300">
            {movie.Genre.split("/").join(" • ")}
          </span>
        </div>

        <p className="mt-4 text-base text-neutral-200 sm:text-lg">
          Directed by <b>{movie.Director}</b>, starring <b>{movie.Actor}</b>.
          Rated {movie.Rating}/10 by {movie.PeopleVote.toLocaleString()} viewers.
        </p>

        <div className="mt-7 flex gap-3">
          {picked ? (
            <button
              onClick={onClear}
              className="rounded bg-white/25 px-6 py-2.5 font-bold backdrop-blur transition hover:bg-white/40"
            >
              ← Back to Browse
            </button>
          ) : (
            <button
              onClick={onMoreLikeThis}
              className="flex items-center gap-2 rounded bg-white px-6 py-2.5 font-bold text-black transition hover:bg-white/80"
            >
              ▶ More Like This
            </button>
          )}
        </div>
      </div>
    </section>
  );
}