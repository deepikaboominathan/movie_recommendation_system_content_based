
const BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://movie-recommendation-ashy.vercel.app";

export type Movie = {
  MovieName: string;
  Genre: string;
  Rating: number;
  Director: string;
  Actor: string;
  PeopleVote: number;
  Year: number;
  Hero_Rating: number;
  movie_rating: string;
  content_rating: string;
};

export type Recommendation = Movie & {
  similarity: number;
};

export type RecommendResponse = {
  selected: Movie;
  recommendations: Recommendation[];
};

export async function getAllMovies(): Promise<Movie[]> {
  const res = await fetch(`${BASE}/api/movies?q=&limit=200`);

  if (!res.ok) {
    throw new Error("Failed to load movies");
  }

  return res.json();
}

export async function searchMovies(q: string): Promise<Movie[]> {
  const res = await fetch(
    `${BASE}/api/movies?q=${encodeURIComponent(q)}&limit=8`
  );

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
}

export async function getRecommendations(
  movie: string,
  n = 15
): Promise<RecommendResponse> {
  const res = await fetch(
    `${BASE}/api/recommend?movie=${encodeURIComponent(movie)}&n=${n}`
  );

  if (!res.ok) {
    throw new Error("Recommendation failed");
  }

  return res.json();
}