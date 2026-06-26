import "../styles/reviewImagePlaceholder.css";

const GENRE_MAP = {
  // Jogos / Games
  "Ação": { icon: "⚔️", label: "AÇÃO" },
  "Aventura": { icon: "🗺️", label: "AVENTURA" },
  "RPG": { icon: "🐉", label: "RPG" },
  "Estratégia": { icon: "♟️", label: "ESTRATÉGIA" },
  "Esporte": { icon: "⚽", label: "ESPORTE" },
  "Corrida": { icon: "🏎️", label: "CORRIDA" },
  "Luta": { icon: "🥊", label: "LUTA" },
  "Plataforma": { icon: "🎮", label: "PLATAFORMA" },
  "Puzzle": { icon: "🧩", label: "PUZZLE" },
  "Simulação": { icon: "🏗️", label: "SIMULAÇÃO" },

  // Filmes / Séries
  "Terror": { icon: "👻", label: "TERROR" },
  "Comédia": { icon: "😂", label: "COMÉDIA" },
  "Drama": { icon: "🎭", label: "DRAMA" },
  "Ficção Científica": { icon: "🚀", label: "FICÇÃO CIENTÍFICA" },
  "Anime": { icon: "🌸", label: "ANIME" },
  "Documentário": { icon: "🎞️", label: "DOCUMENTÁRIO" },
  "Romance": { icon: "💜", label: "ROMANCE" },
  "Thriller": { icon: "🔪", label: "THRILLER" },
  "Fantasia": { icon: "🧙", label: "FANTASIA" },
  "Suspense": { icon: "🕵️", label: "SUSPENSE" },
  "Musical": { icon: "🎵", label: "MUSICAL" },
  "Animação": { icon: "✨", label: "ANIMAÇÃO" },
  "Faroeste": { icon: "🤠", label: "FAROESTE" },
  "Guerra": { icon: "🎖️", label: "GUERRA" },
  "Crime": { icon: "🔍", label: "CRIME" },
  "Super-Herói": { icon: "🦸", label: "SUPER-HERÓI" },
  "Biografia": { icon: "📖", label: "BIOGRAFIA" },

  // Música / Álbuns
  "Rock": { icon: "🎸", label: "ROCK" },
  "Pop": { icon: "🎤", label: "POP" },
  "Hip-Hop": { icon: "🎧", label: "HIP-HOP" },
  "Jazz": { icon: "🎷", label: "JAZZ" },
  "Clássica": { icon: "🎻", label: "CLÁSSICA" },
  "Eletrônica": { icon: "🎛️", label: "ELETRÔNICA" },
  "Metal": { icon: "🤘", label: "METAL" },
  "Funk": { icon: "🕺", label: "FUNK" },
  "Sertanejo": { icon: "🪗", label: "SERTANEJO" },

  // Livros
  "Literatura": { icon: "📚", label: "LITERATURA" },
  "Ficção": { icon: "🌌", label: "FICÇÃO" },
  "Mangá": { icon: "📓", label: "MANGÁ" },
  "HQ": { icon: "💥", label: "HQ" },
};

const DEFAULT_GENRE = { icon: "🎮", label: "OUTROS" };

function ReviewImagePlaceholder({ genero }) {
  const { icon, label } = GENRE_MAP[genero] || DEFAULT_GENRE;

  return (
    <div className="review-placeholder" aria-hidden="true">
      {/* Padrão de fundo discreto */}
      <svg
        className="review-placeholder-pattern"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={`dots-${label}`}
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${label})`} />
      </svg>

      {/* Iluminação radial atrás do ícone */}
      <div className="review-placeholder-glow" />

      {/* Conteúdo central */}
      <div className="review-placeholder-content">
        <span className="review-placeholder-icon">{icon}</span>
        <span className="review-placeholder-label">{label}</span>
        <span className="review-placeholder-hint">Sem imagem</span>
      </div>
    </div>
  );
}

export default ReviewImagePlaceholder;
