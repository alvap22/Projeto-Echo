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

  const [selectedGenre, setSelectedGenre] =
    useState("Todos");

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(
          "http://localhost:3000/reviews"
        );

        setReviews(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(
    (review) => {
      const matchSearch = review.titulo
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchGenre =
        selectedGenre === "Todos" ||
        review.genero === selectedGenre;

      return matchSearch && matchGenre;
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
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
          />

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
        </div>
      </div>
    </>
  );
}

export default Home;