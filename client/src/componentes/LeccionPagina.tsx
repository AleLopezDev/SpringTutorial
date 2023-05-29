import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faVial } from "@fortawesome/free-solid-svg-icons";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import "../cssPersonalizado/leccionpagina.css";
import { getTiempoMinitest } from "../modelo/modelo";

interface Leccion {
  id: number;
  seccion_id: number;
  nombre: string;
  video_url: string;
  contenido: string;
}

interface Pregunta {
  id: number;
  leccion_id: number;
  pregunta: string;
  respuesta_correcta: string;
  respuesta_incorrecta1: string;
  respuesta_incorrecta2: string;
  respuesta_incorrecta3: string;
}

const LeccionPage = () => {
  const [leccion, setLeccion] = useState<Leccion | null>(null);
  const [leccionSiguiente, setLeccionSiguiente] = useState<Leccion | null>();
  const [leccionAnterior, setLeccionAnterior] = useState<Leccion | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<
    Record<number, string>
  >({});
  const [respuestasMezcladas, setRespuestasMezcladas] = useState<
    Record<number, { texto: string; esCorrecta: boolean }[]>
  >({});
  const [showMinitest, setShowMinitest] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const navegar = useNavigate();
  const contenidoSanitizado = DOMPurify.sanitize(leccion?.contenido || ""); // ANTI XSS

  const { id } = useParams(); // Id de la lección de la URL

  const handleVuelta = () => {
    navegar("/curso");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setUsuario(JSON.parse(localStorage.getItem("user") || "{}"));
    };

    // Escucha los cambios en el almacenamiento local
    window.addEventListener("storage", handleStorageChange);

    // Limpia el oyente cuando se desmonta el componente
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.id) {
      navegar("/login");
    }
  }, [navegar, usuario]);

  const mezclarRespuestas = (pregunta: Pregunta) => {
    const respuestas = [
      { texto: pregunta.respuesta_correcta, esCorrecta: true },
      { texto: pregunta.respuesta_incorrecta1, esCorrecta: false },
      { texto: pregunta.respuesta_incorrecta2, esCorrecta: false },
      { texto: pregunta.respuesta_incorrecta3, esCorrecta: false },
    ];

    return respuestas.sort(() => Math.random() - 0.5);
  };

  const handleLeccionCompletada = async (leccionId: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const usuario_id = JSON.parse(localStorage.getItem("user") || "{}").id;

    try {
      await axios.post(
        `http://localhost:5001/api/lecciones_completadas`,
        { leccion_id: leccionId, usuario_id, completada: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Actualiza el estado o haz algo más aquí
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        console.log("Lección ya completada");
      } else {
        console.error("Error al registrar lección completada:", error);
      }
    }
  };

  // MANEJADOR LECCIONES ANTERIOR Y SIGUIENTE (PAGINACIÓN)
  const handleLeccionAnterior = () => {
    if (leccionAnterior) {
      if (leccionAnterior.nombre === "Curso") {
        navegar("/curso");
      } else {
        navegar(`/leccion/${leccionAnterior.id}`);
      }
    }
  };

  const handleLeccionSiguiente = () => {
    if (leccionSiguiente) {
      navegar(`/leccion/${leccionSiguiente.id}`);
    }
  };

  useEffect(() => {
    const fetchLeccionSiguiente = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://localhost:5001/api/lecciones/${Number(id) + 1}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLeccionSiguiente(response.data);
      } catch (error: any) {
        if (error.response.status === 404) {
          setLeccionSiguiente(null);
        }
        console.error(error);
      }
    };
    fetchLeccionSiguiente();
  }, [id]);

  useEffect(() => {
    const fetchLeccionAnterior = async () => {
      const token = localStorage.getItem("token");
      const anteriorId = Number(id) - 1;

      if (anteriorId <= 0) {
        setLeccionAnterior({ nombre: "Curso" } as Leccion);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/api/lecciones/${anteriorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLeccionAnterior(response.data);
        // Recarga pagina
      } catch (error) {
        console.error(error);
      }
    };
    fetchLeccionAnterior();
  }, [id]);

  useEffect(() => {
    const fetchLeccion = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://localhost:5001/api/lecciones/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLeccion(response.data);
      } catch (error) {
        console.error(error);
        // Si hay un error al cargar la lección, borra el usuario del localStorage y establece el estado de error
        localStorage.removeItem("user");
        // window.location.reload();
        navegar("/login"); // Redirige al usuario a la página de inicio de sesión
      }
    };
    fetchLeccion();
  }, [id, navegar]);

  // MANEJADOR DE PREGUNTAS Aleatorias

  useEffect(() => {
    const fetchPreguntaAleatoria = async () => {
      const token = localStorage.getItem("token");

      // Limpia el estado de las preguntas
      setPreguntas([]);

      try {
        const response = await axios.get(
          `http://localhost:5001/api/pregunta_aleatoria/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPreguntas(response.data);

        // Mezcla las respuestas para cada pregunta y almacénalas en el estado
        const nuevasRespuestasMezcladas: Record<
          number,
          { texto: string; esCorrecta: boolean }[]
        > = {};
        response.data.forEach((pregunta: Pregunta) => {
          nuevasRespuestasMezcladas[pregunta.id] = mezclarRespuestas(pregunta);
        });
        setRespuestasMezcladas(nuevasRespuestasMezcladas);

        // Verifica si el minitest está bloqueado para esta lección
        const bloqueoMinitest = localStorage.getItem(`bloqueoMinitest_${id}`);
        if (bloqueoMinitest && Number(bloqueoMinitest) > Date.now()) {
          setShowMinitest(false);
        } else {
          setShowMinitest(true);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.error("No hay preguntas para esta lección");
        }
      }
    };
    fetchPreguntaAleatoria();
  }, [id]);

  // MANEJADOR TIEMPO DE ESPERA PARA EL MINITEST, y UseEffect para bloquear el minitest durante 5 minutos si el usuario responde incorrectamente
  const handleSeleccionarRespuesta = (preguntaId: any, respuesta: any) => {
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [preguntaId]: respuesta,
    }));

    const pregunta = preguntas.find((pregunta) => pregunta.id === preguntaId);
    if (pregunta && pregunta.respuesta_correcta === respuesta) {
      handleLeccionCompletada(id); // Llama a handleLeccionCompletada si la respuesta es correcta
    } else {
      // Temporizador de 5 minutos para evitar que el usuario intente el minitest de nuevo
      const timestamp = Date.now() + getTiempoMinitest();
      localStorage.setItem(`bloqueoMinitest_${id}`, timestamp.toString()); // Guarda el tiempo de bloqueo en el almacenamiento local

      // Oculta el minitest y muestra el mensaje de error
      setShowMinitest(false);
      setErrorMessage(
        "La respuesta es incorrecta. Por favor, vuelve a leer la lección y espera " +
          getTiempoMinitest() / 60000 +
          " minutos antes de intentar el minitest de nuevo."
      );
    }
  };

  useEffect(() => {
    const bloqueoHasta = localStorage.getItem(`bloqueoMinitest_${id}`);
    if (bloqueoHasta && new Date().getTime() < Number(bloqueoHasta)) {
      setErrorMessage(
        "La respuesta es incorrecta. Por favor, vuelve a leer la lección y espera " +
          getTiempoMinitest() / 60000 +
          " minutos antes de intentar el minitest de nuevo."
      );
      setShowMinitest(false);
    } else {
      setShowMinitest(true);
    }
  }, [id]);

  // Convierte el ID a un número
  const idNumber = Number(id);

  // Verifica si el ID de la lección es un número válido y mayor que cero
  if (isNaN(idNumber) || idNumber <= 0) {
    navegar("/curso"); // Redirige al usuario a la página principal
    return null; // No renderiza nada
  }

  return (
    <div className="bg-[#12111C] min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="space-y-8 mx-auto max-w-screen-xl w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2">
        <div>
          <div className="flex items-center mb-4">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-[#F7C30E] rounded-lg border-2 py-1 px-1 border-[#F7C30E] cursor-pointer"
              onClick={handleVuelta}
            />
            <p className="text-white text-sm font-bold tracking-wider uppercase text-transform text-white/7 bg-[#13111C] m-0 pl-2 pt-1 ml-3 inline-block">
              INTRODUCCIÓN
            </p>
          </div>

          <h2 className="mt-6 text-2xl md:text-4xl font-extrabold text-[#32FF00] font-poppins mb-8 md:mb-8 inline-block">
            {leccion?.nombre}
          </h2>

          <div className="mt-2 w-full">
            <video
              className="h-full w-full rounded mx-auto"
              src={leccion?.video_url}
              controls
            />
          </div>
        </div>
        <div className="mt-4 rounded-lg shadow-md w-full ">
          <ReactMarkdown
            className="text-white text-lg"
            components={{
              h1: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/heading-has-content
                <h1
                  className="md:mt-10 text-2xl md:text-4xl font-extrabold text-[#32FF00] font-poppins mb-8 mt-10 md:mb-12 inline-block"
                  {...props}
                />
              ), // Estilo para h1

              h2: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/heading-has-content
                <h2
                  className=" mt-6 text-lg md:text-xl font-bold text-[#F7C30E] font-poppins mb-4 md:mb-3 inline-block"
                  {...props}
                />
              ), // Estilo para h2

              h3: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/heading-has-content
                <h3
                  className="mt-6 text-lg md:text-lg font-bold text-green-600 font-poppins mb-4 md:mb-3"
                  {...props}
                />
              ), // Estilo para h3

              a: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  className="text-[#5f8ae9] font-bold cursor-pointer"
                  {...props}
                />
              ), // Estilo para enlaces
              pre: ({ node, ...props }) => (
                <pre
                  className="whitespace-pre-wrap overflow-x-auto word-break"
                  {...props}
                />
              ), // Estilo para pre
            }}
            rehypePlugins={[rehypeRaw]}
          >
            {contenidoSanitizado}
          </ReactMarkdown>
        </div>

        {/* Aquí es donde agregamos el div para el minitest */}
        {showMinitest ? (
          <div className="mt-8 p-4 rounded-lg shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-2/3 xl:w-[900px] mx-auto relative border-2 border-white">
            <h2 className="text-2xl font-bold text-center mb-4 flex justify-center items-center absolute top-[-22px] bg-[#12111C] px-2 text-orange-500">
              <FontAwesomeIcon icon={faVial} className="mr-2 text-orange-500" />{" "}
              Minitest
            </h2>
            {preguntas.map((pregunta) => (
              <div key={pregunta.id}>
                <p className="text-white mb-2">{pregunta.pregunta}</p>
                {respuestasMezcladas[pregunta.id].map((respuesta) => (
                  <button
                    key={respuesta.texto}
                    className={`my-2 p-2 w-full text-left ${
                      respuestasSeleccionadas[pregunta.id] === respuesta.texto
                        ? respuesta.esCorrecta
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      handleSeleccionarRespuesta(pregunta.id, respuesta.texto)
                    }
                  >
                    {respuesta.texto}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Oculta el minitest
          <div>
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          </div>
        )}

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row justify-between pt-8 mt-8 border-t border-white/10">
          <div className="flex flex-col justify-between w-full md:w-[40%] ml-2 mr-2">
            <p className="text-xs tracking-widest uppercase text-medium text-white">
              Clase Anterior
            </p>
            <p className="mt-2">
              <span
                className="text-white font-bold cursor-pointer hover:text-[#F7C30E]"
                onClick={handleLeccionAnterior}
              >
                {leccionAnterior?.nombre}
              </span>
            </p>
          </div>

          <div className="flex flex-col justify-between w-full md:w-[60%] ml-2 mr-2">
            <p className="text-xs tracking-widest uppercase text-medium text-white md:ml-56">
              Clase Siguiente
            </p>
            <p className="mt-2 md:ml-56">
              <span
                className="font-bold text-white cursor-pointer hover:text-[#F7C30E] "
                onClick={handleLeccionSiguiente}
              >
                {leccionSiguiente?.nombre}
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LeccionPage;
