const GENRE_COLORS: Record<string, [string, string]> = {
  action: ["#7f1d1d", "#1a0a0a"],
  thriller: ["#1e3a5f", "#050b14"],
  crime: ["#3f3f46", "#09090b"],
  horror: ["#3b0764", "#0a0210"],
  romance: ["#9d174d", "#1a0a12"],
  comedy: ["#a16207", "#1a1205"],
  "sci-fi": ["#0f766e", "#031a18"],
  historical: ["#92400e", "#1a0f05"],
  period: ["#92400e", "#1a0f05"],
  war: ["#365314", "#0a1204"],
  sports: ["#1d4ed8", "#050a1a"],
  political: ["#6b21a8", "#0f0518"],
  biography: ["#0e7490", "#041419"],
  fantasy: ["#7e22ce", "#0d0518"],
  adventure: ["#b45309", "#1a0e04"],
  family: ["#be185d", "#1a0a12"],
  drama: ["#44403c", "#0c0a09"],
};

export function posterStyle(genre: string) {
  const g = genre.toLowerCase();
  const key = Object.keys(GENRE_COLORS).find((k) => g.includes(k)) ?? "drama";
  const [a, b] = GENRE_COLORS[key];
  return { backgroundImage: `linear-gradient(160deg, ${a} 0%, ${b} 100%)` };
}