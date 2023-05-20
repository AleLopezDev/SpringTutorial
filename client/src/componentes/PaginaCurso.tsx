import React, { useState, useEffect } from "react";
import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faChevronDown,
  faChevronUp,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
  const [ultimaLeccion, setUltimaLeccion] = useState<Leccion | null>(null);
  const navigate = useNavigate();
  const [progreso, setProgreso] = useState(0);

  const estaAutenticado = () => {
    const user = localStorage.getItem("user");
    return user !== null;
  };

  const fetchProgreso = async () => {
    const token = localStorage.getItem("token");
    // ID
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const id = user.id;

    try {
      const response = await axios.get(
        `http://localhost:5001/api/progreso/${id}`, // Asegúrate de tener el id del usuario
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgreso(response.data.porcentajeCompletado);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProgreso();
  }, []);

  const handleContinueClick = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const id = user.id;
    const token = localStorage.getItem("token");
    if (user && token) {
      // Obtén el id del usuario del almacenamiento local
      try {
        const response = await axios.get(
          `http://localhost:5001/api/ultima_leccion_vista/${id}`,
          { headers: { Authorization: `Bearer ${token}` } } // Aquí es donde se incluye el token
        );
        const { leccionId } = response.data;
        navigate(`/leccion/${leccionId}`);
      } catch (error) {
        console.error("Error al obtener la última lección vista:", error);
      }
    } else {
      // Aquí puedes manejar el caso en el que el usuario no esté en el almacenamiento local
      console.error("No se encontró al usuario en el almacenamiento local");
    }
  };

  const handleLeccionClick = async (leccionId: number) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Aquí puedes manejar la respuesta de la API
        navigate(`/leccion/${leccionId}`);
      } catch (error) {
        console.error("Error al obtener la lección:", error);
      }
    } else {
      // Aquí puedes manejar el caso en el que el token no esté en el almacenamiento local
      console.error("No se encontró el token en el almacenamiento local");
    }
  };
  const leccionCompletada = (leccionId: number) => {
    // Aquí es donde buscarías en la base de datos o en el estado del componente para ver si la lección ha sido completada
    // Por ahora, solo devolveremos `false` para todas las lecciones
    return false;
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

  useEffect(() => {
    const fetchUltimaLeccion = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}"); // Obtén el usuario del localStorage
      const userId = user.id;
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/ultima_leccion_vista/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const { leccionId } = response.data;
          const leccionResponse = await axios.get(
            `http://localhost:5001/api/lecciones/${leccionId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUltimaLeccion(leccionResponse.data);
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Si expira el token, elimina el usuario y el token del almacenamiento local y redirige al usuario a la página de inicio de sesión
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.reload();
            navigate("/login");
          } else {
            console.error("Error al obtener la última lección vista:", error);
          }
        }
      }
    };
    fetchUltimaLeccion();
  }, [navigate]);

  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [lecciones, setLecciones] = useState<Leccion[]>([]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-green ">
      <div className="p-4 w-full md:w-3/4 lg:max-w-screen-lg mx-auto">
        <div className="flex justify-between items-center">
          <p className="font-poppins text-2xl mb-5 font-bold">Tu progreso :</p>
          <button
            className="bg-green-500 hover:bg-green-700 text-white text-sm md:text-base font-bold py-2 px-4 rounded mb-6 flex items-center justify-center"
            onClick={handleContinueClick}
          >
            <div className="hidden md:block">
              Continuar
              <br />
              {ultimaLeccion?.nombre}
            </div>
            <div className="md:hidden">Continuar</div>
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>

        <div className="mb-8 w-full mx-auto ">
          <ProgressBar completed={progreso} bgColor="#3ECC1B" height="20px" />
        </div>

        {secciones.map((seccion, index) => (
          <div
            key={seccion.id}
            className={`py-4 px-4 border-t border-l border-r ${
              index === secciones.length - 1 ? "border-b" : ""
            } border-black`}
          >
            <h3
              className="text-2xl font-bold text-black cursor-pointer hover:text-green-500 flex justify-between items-center"
              onClick={() =>
                setSeccionExpandida(
                  seccion.id === seccionExpandida ? null : seccion.id
                )
              }
            >
              <span className="font-source-sans-pro">{seccion.nombre}</span>
              <FontAwesomeIcon
                icon={
                  seccionExpandida === seccion.id ? faChevronUp : faChevronDown
                }
                className="ml-4"
              />
            </h3>
            <p className="my-1">{seccion.descripcion}</p>
            {seccionExpandida === seccion.id && (
              <div className="mt-4">
                <ul className="list-decimal list-inside">
                  {lecciones
                    .filter((leccion) => leccion.seccion_id === seccion.id)
                    .map((leccion) => (
                      <li
                        key={leccion.id}
                        className="rounded p-2 mt-1 cursor-pointer flex justify-between hover:text-yellow-600"
                        onClick={() => handleLeccionClick(leccion.id)}
                      >
                        <div className="flex items-center">
                          {leccionCompletada(leccion.id) ? (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-green-500"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faCircle}
                              className="text-transparent border border-black mr-2"
                            />
                          )}
                          <span>{leccion.nombre}</span>
                        </div>
                        <FontAwesomeIcon icon={faCirclePlay} className="mt-1" />
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaginaCurso;
