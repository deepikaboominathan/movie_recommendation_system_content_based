# app.py
import streamlit as st
import joblib

# ---------------------- PAGE CONFIG ----------------------
st.set_page_config(
    page_title=" Tamil Movie Recommendation System",
    page_icon="🎥",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ---------------------- CUSTOM CSS -----------------------
st.markdown("""
    <style>
        /* Background gradient */
        body {
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            color: #fff;
        }

        /* Title style */
        .main-title {
            text-align: center;
            font-size: 45px;
            font-weight: 800;
            color: #00FFFF;
            text-shadow: 2px 2px 15px #00FFFF;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }

        /* Subtitle */
        .sub-title {
            text-align: center;
            font-size: 18px;
            color: #cfcfcf;
            margin-bottom: 50px;
        }

        /* Select box */
        div[data-baseweb="select"] > div {
            background-color: #1c1c1c;
            border: 1px solid #00FFFF;
            border-radius: 10px;
        }

        /* Button style */
        div.stButton > button:first-child {
            background: linear-gradient(45deg, #00FFFF, #1e90ff);
            color: black;
            font-weight: bold;
            border-radius: 10px;
            height: 3em;
            width: 100%;
            box-shadow: 0px 0px 20px #00FFFF;
            transition: 0.3s;
        }
        div.stButton > button:first-child:hover {
            transform: scale(1.05);
            box-shadow: 0px 0px 30px #1e90ff;
        }

        /* Movie cards */
        .movie-card {
            background-color: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 20px;
            margin: 10px;
            text-align: center;
            box-shadow: 0px 0px 10px rgba(0,255,255,0.4);
            transition: 0.4s;
        }
        .movie-card:hover {
            background-color: rgba(255,255,255,0.2);
            transform: scale(1.03);
        }
        .movie-title {
            font-size: 22px;
            font-weight: 700;
            color: #00FFFF;
        }
    </style>
""", unsafe_allow_html=True)

# ---------------------- LOAD MODEL -----------------------
df = joblib.load('movie_data.pkl')
similarity = joblib.load('similarity.pkl')

# ---------------------- HEADER ---------------------------
st.markdown("<h1 class='main-title'> Tamil Movie Recommendation System</h1>", unsafe_allow_html=True)
st.markdown("<p class='sub-title'>Find movies similar to your favorites based on genre, actors, and directors </p>",
            unsafe_allow_html=True)

# ---------------------- SELECT BOX -----------------------
movie_list = df['MovieName'].values
selected_movie = st.selectbox("Select a movie:", movie_list, index=0)


# ---------------------- RECOMMEND FUNCTION ----------------
def recommend(movie):
    index = df[df['MovieName'] == movie].index[0]
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    recommended_movies = []
    for i in distances[1:6]:
        recommended_movies.append(df.iloc[i[0]].MovieName)
    return recommended_movies


# ---------------------- SHOW RESULTS ----------------------
if st.button("Show Recommendations "):
    recommendations = recommend(selected_movie)
    st.markdown("<h2 style='text-align:center; color:#00FFFF;'>Recommended Movies for You 🍿</h2>",
                unsafe_allow_html=True)

    cols = st.columns(5)
    for idx, movie in enumerate(recommendations):
        with cols[idx]:
            st.markdown(f"<div class='movie-card'><p class='movie-title'>{movie}</p></div>", unsafe_allow_html=True)
