"use client";

import { useEffect, useRef, useState } from "react";
import { Movie, searchMovies } from "@/lib/api";

export default function SearchBox({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setResults(await searchMovies(query));
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (name: string) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onSelect(name);
  };

  return (
    <div ref={box} className="relative w-full max-w-xs sm:max-w-sm">
      <div className="flex items-center gap-2 rounded border border-white/40 bg-black/70 px-3 py-2 focus-within:border-white">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) pick(results[0].MovieName);
          }}
          placeholder="Search Tamil movies"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-400"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute right-0 z-50 mt-2 w-full overflow-hidden rounded border border-white/10 bg-[#181818] shadow-2xl">
          {results.map((m) => (
            <li
              key={m.MovieName}
              onClick={() => pick(m.MovieName)}
              className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm hover:bg-[#2a2a2a]"
            >
              <span className="font-medium">{m.MovieName}</span>
              <span className="text-xs text-neutral-400">{m.Year}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}