from pathlib import Path

import pandas as pd
from scipy.sparse import csr_matrix, hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

DATA_PATH = Path(__file__).parent / "data" / "tamil_movies_dataset.csv"

# How much each feature group matters in the final similarity
W_GENRE, W_DIRECTOR, W_ACTOR, W_NUMERIC = 1.0, 0.7, 0.8, 0.5


class MovieRecommender:
    def __init__(self, csv_path: Path = DATA_PATH):
        self.df = pd.read_csv(csv_path).dropna(subset=["MovieName"]).reset_index(drop=True)
        self.df["MovieName"] = self.df["MovieName"].str.strip()
        self.records = self.df.to_dict(orient="records")
        self._build()

    @staticmethod
    def _tfidf(series: pd.Series):
        vec = TfidfVectorizer(token_pattern=r"\S+", lowercase=True)
        return vec.fit_transform(series)

    def _build(self):
        df = self.df

        # "Dark Comedy/Drama" -> "Dark_Comedy Drama"
        genre = df["Genre"].fillna("").apply(
            lambda g: " ".join(x.strip().replace(" ", "_") for x in g.split("/"))
        )
        director = df["Director"].fillna("").str.replace(" ", "_")
        actor = df["Actor"].fillna("").str.replace(" ", "_")

        numeric = df[["Rating", "Year", "Hero_Rating"]].fillna(0)
        numeric = MinMaxScaler().fit_transform(numeric)
        cats = pd.get_dummies(df[["movie_rating", "content_rating"]]).astype(float)

        features = hstack([
            self._tfidf(genre) * W_GENRE,
            self._tfidf(director) * W_DIRECTOR,
            self._tfidf(actor) * W_ACTOR,
            csr_matrix(numeric) * W_NUMERIC,
            csr_matrix(cats.values) * W_NUMERIC,
        ]).tocsr()

        self.sim = cosine_similarity(features)
        self.index = {name.lower(): i for i, name in enumerate(df["MovieName"])}

    def search(self, q: str = "", limit: int = 10):
        q = q.strip().lower()
        if not q:
            return self.records[:limit]
        hits = [r for r in self.records if q in r["MovieName"].lower()]
        return hits[:limit]

    def recommend(self, movie: str, n: int = 8):
        i = self.index.get(movie.strip().lower())
        if i is None:
            return None
        scores = sorted(enumerate(self.sim[i]), key=lambda x: x[1], reverse=True)
        results = []
        for j, s in scores:
            if j == i:
                continue
            results.append({**self.records[j], "similarity": round(float(s), 3)})
            if len(results) == n:
                break
        return {"selected": self.records[i], "recommendations": results}