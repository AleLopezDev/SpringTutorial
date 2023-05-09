import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface Seccion {
  id: number;
  nombre: string;
}

interface Leccion {
  id: number;
  seccion_id: number;
  nombre: string;
  video_url: string;
}

const PaginaCurso = () => {
  const navigate = useNavigate();

  const estaAutenticado = () => {
    const user = localStorage.getItem("user");
    return user !== null;
  };

  useEffect(() => {
    if (!estaAutenticado()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seccionesResponse = await axios.get<Seccion[]>(
          "http://localhost:5001/api/secciones"
        );
        setSecciones(seccionesResponse.data);

        const leccionesResponse = await axios.get<Leccion[]>(
          "http://localhost:5001/api/lecciones"
        );
        setLecciones(leccionesResponse.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const [videoSeleccionado, setVideoSeleccionado] = useState<string | null>();
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [lecciones, setLecciones] = useState<Leccion[]>([]);

  const handleLeccionClick = (videoUrl: string) => {
    setVideoSeleccionado(videoUrl);
  };

  return (
    <div>
      {/* ... */}
      <div className="space-y-8 md:ml-80 md:my-20">
        {secciones.map((seccion) => (
          <div key={seccion.id}>
            <h3 className="text-2xl font-bold md:my-3 text-green-700">
              {seccion.nombre}
            </h3>
            <div className="md:ml-4">
              <ul className="list-decimal list-inside">
                {lecciones
                  .filter((leccion) => leccion.seccion_id === seccion.id)
                  .map((leccion) => (
                    <li
                      key={leccion.id}
                      className="border border-gray-300 rounded p-2 md:w-[1000px] my-2 cursor-pointer flex justify-end"
                      onClick={() => handleLeccionClick(leccion.video_url)}
                    >
                      <span className="mr-auto">{leccion.nombre}</span>
                      <FontAwesomeIcon
                        icon={faCirclePlay}
                        className="ml-auto mt-1"
                      />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}

        {videoSeleccionado && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div
              className="bg-black bg-opacity-50 w-full h-full absolute"
              onClick={() => setVideoSeleccionado(null)}
            ></div>
            <video
              src={videoSeleccionado}
              controls
              autoPlay
              className="z-10"
            ></video>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaCurso;
