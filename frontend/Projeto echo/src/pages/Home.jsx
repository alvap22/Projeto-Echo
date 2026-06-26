import { useState, useEffect } from "react";

import axios from "axios";

import Header from "../components/Header";
import ReviewCard from "../components/ReviewCard";

import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";

import "../styles/home.css";

import {
  useNavigate
} from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");

  const [selectedGenres, setSelectedGenres] = useState([]);

  const [reviews, setReviews] = useState([]);

  const token = localStorage.getItem("token");
const logado = !!token;

  useEffect(() => {
    async function fetchReviews() {
      try {
        const params = {};
        if (selectedGenres.length > 0) {
          params.generos = selectedGenres.join(",");
        }
        const response = await axios.get(
          "http://localhost:3000/reviews",
          { params }
        );

        setReviews(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchReviews();
  }, [selectedGenres]);

  const filteredReviews = reviews.filter(
    (review) => {
      const matchSearch = review.titulo
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchSearch;
    }
  );

  return (
    <>
      <Header />

      <div className="home">
        <div className="home-content">
          <h1>Reviews da Comunidade</h1>

          <p>
            Descubra análises e opiniões da
            comunidade
          </p>

          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <GenreFilter
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
          />

         {!logado ? (
            <div className="login-required-banner">
              <h2>🔒 Faça login para visualizar as reviews</h2>

              <p>
                Entre na sua conta para acessar os conteúdos da comunidade.
              </p>
            </div>
          ) : (

  <div className="review-list">
    {filteredReviews.map((review) => (
      <ReviewCard
        key={review.id}
        id={review.id}
        titulo={review.titulo}
        nota={review.nota}
        autor={review.autor}
        genero={review.genero}
        imagem={review.imagem}
      />
    ))}
  </div>

)}
        </div>
      </div>
    </>
  );
}

export default Home;