import React, { useEffect, useState, useRef } from "react";
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
  const videoRef = useRef<HTMLVideoElement | null>(null); // Obtener tiempo de video

  useEffect(() => {
    const fetchLeccion = async () => {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5001/api/lecciones/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeccion(response.data);
    };
    fetchLeccion();
  }, [id]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (currentTime >= duration / 2) {
        alert("Ya pasaste la mitad del video");
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    // No olvides eliminar el controlador de eventos cuando el componente se desmonte
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  if (!leccion) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-#00a86b"></div>
        <p className="text-lg text-#4abf6b mt-4">Cargando lección...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#12111C] min-h-screen flex flex-col items-start justify-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="md:ml-96 w-full space-y-8">
        <div>
          <h2 className="mt-6 text-2xl md:text-4xl font-extrabold text-[#3ECC1B] ml-4 font-poppins mb-8 md:mb-8">
            {leccion.nombre}
          </h2>
          <div className="mt-2 md:w-[900px] ml-4">
            <video
              ref={videoRef}
              className="w-full h-full rounded"
              src={leccion.video_url}
              controls
              autoPlay
            />
          </div>
        </div>
        <div className="mt-4 bg-#c3e0ae p-4 rounded-lg shadow-md ml-4 md:w-[900px]">
          <ReactMarkdown
            skipHtml={false}
            className="text-white text-lg"
            components={{
              h1: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/heading-has-content
                <h1
                  className="md:mt-10 text-2xl md:text-4xl font-extrabold text-[#3ECC1B] font-poppins mb-8 md:mb-12"
                  {...props}
                />
              ), // Estilo para h1

              h2: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/heading-has-content
                <h2
                  className=" mt-6 text-lg md:text-xl font-bold text-[#F7C30E] font-poppins mb-4 md:mb-3"
                  {...props}
                />
              ), // Estilo para h2
            }}
          >
            {leccion.contenido}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default LeccionPage;
