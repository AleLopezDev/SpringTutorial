import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "rc-progress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface Seccion {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Leccion {
  id: number;
  seccion_id: number;
  nombre: string;
  video_url: string;
}

const PaginaCurso = () => {
  const [seccionExpandida, setSeccionExpandida] = useState<number | null>(null); // Obtiene el id de la seccion expandida

  const navigate = useNavigate();

  const estaAutenticado = () => {
    const user = localStorage.getItem("user");
    return user !== null;
  };

  useEffect(() => {
    if (!estaAutenticado()) {
      navigate("/login");
    }
  }, [navigate]);

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
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-4 w-full md:w-3/4 lg:w-[1100px] mx-auto">
        <div className="mb-8" style={{ width: "100%" }}>
          <Line
            percent={20}
            strokeColor="#3ECC1B"
            strokeWidth={1}
            className="h-4"
          />
        </div>
        {secciones.map((seccion) => (
          <div
            key={seccion.id}
            className="border-black border border-collapse  py-4 px-4"
          >
            <h3
              className="text-2xl font-bold text-black cursor-pointer hover:text-green-500 flex justify-between items-center"
              onClick={() =>
                setSeccionExpandida(
                  seccion.id === seccionExpandida ? null : seccion.id
                )
              }
            >
              <span>{seccion.nombre}</span>
              <FontAwesomeIcon
                icon={
                  seccionExpandida === seccion.id ? faChevronUp : faChevronDown
                }
                className="ml-4"
              />
            </h3>
            <p className="my-1">{seccion.descripcion}</p>
            {seccionExpandida === seccion.id && (
              <div className="md:ml-4 mt-4">
                <ul className="list-decimal list-inside">
                  {lecciones
                    .filter((leccion) => leccion.seccion_id === seccion.id)
                    .map((leccion) => (
                      <li
                        key={leccion.id}
                        className="rounded p-2 mt-1 cursor-pointer flex justify-between hover:text-yellow-600"
                        onClick={() => handleLeccionClick(leccion.video_url)}
                      >
                        <span>{leccion.nombre}</span>
                        <FontAwesomeIcon icon={faCirclePlay} className="mt-1" />
                      </li>
                    ))}
                </ul>
              </div>
            )}
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
