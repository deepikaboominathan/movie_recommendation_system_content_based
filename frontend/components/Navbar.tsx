"use client";

import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";

export default function Navbar({
  onSelect,
  onHome,
}: {
  onSelect: (name: string) => void;
  onHome: () => void;
}) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-6 py-4 transition-colors duration-300 sm:px-12 ${
        solid ? "bg-[#141414]" : "bg-gradient-to-b from-black/90 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onHome}
          className="text-2xl font-black tracking-tight text-[#E50914] sm:text-3xl"
        >
          TAMILFLIX
        </button>
        <SearchBox onSelect={onSelect} />
      </div>
    </header>
  );
}