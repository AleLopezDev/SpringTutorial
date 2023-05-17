import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface Leccion {
  id: number;
  seccion_id: number;
  nombre: string;
  video_url: string;
  contenido: string;
}

const LeccionPage = () => {
  const { id } = useParams();
  const [leccion, setLeccion] = useState<Leccion | null>(null);

  useEffect(() => {
    const fetchLeccion = async () => {
      const response = await axios.get(
        `http://localhost:5001/api/lecciones/${id}`
      );
      setLeccion(response.data);
    };

    fetchLeccion();
  }, [id]);

  if (!leccion) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{leccion.nombre}</h1>
      <video src={leccion.video_url} controls autoPlay />
      <ReactMarkdown>{leccion.contenido}</ReactMarkdown>
    </div>
  );
};

export default LeccionPage;
