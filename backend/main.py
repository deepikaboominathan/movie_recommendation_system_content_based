from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from recommender import MovieRecommender

app = FastAPI(title="Tamil Movie Recommender")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

rec = MovieRecommender()


@app.get("/api/health")
def health():
    return {"status": "ok", "movies": len(rec.records)}


@app.get("/api/movies")
def movies(q: str = "", limit: int = Query(10, ge=1, le=200)):
    return rec.search(q, limit)


@app.get("/api/recommend")
def recommend(movie: str, n: int = Query(8, ge=1, le=20)):
    result = rec.recommend(movie, n)
    if result is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return result