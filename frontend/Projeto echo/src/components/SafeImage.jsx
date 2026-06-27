import { useState, useEffect } from "react";
import api from "../services/api";

function SafeImage({ src, alt, className, ...props }) {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (!src) return;

    // Se não for uma URL do Ngrok (ex: blob local de preview, placeholder ou outra origem), usa diretamente
    const isNgrokUrl =
      src.includes("ngrok-free.app") ||
      src.includes("ngrok-free.dev") ||
      src.includes("ngrok.io") ||
      src.startsWith("/"); // Caminho relativo da API se houver

    if (!isNgrokUrl) {
      setImageSrc(src);
      return;
    }

    let isMounted = true;
    let objectUrl = "";

    async function loadImage() {
      try {
        const response = await api.get(src, { responseType: "blob" });
        if (isMounted) {
          objectUrl = URL.createObjectURL(response.data);
          setImageSrc(objectUrl);
        }
      } catch (error) {
        console.error("Erro ao carregar imagem via API segura do Ngrok:", error);
        // Em caso de falha (ex: CORS ou rede), faz fallback para a URL direta original
        if (isMounted) {
          setImageSrc(src);
        }
      }
    }

    loadImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return <img src={imageSrc} alt={alt} className={className} {...props} />;
}

export default SafeImage;
