import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faVial } from "@fortawesome/free-solid-svg-icons";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";

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
  const [leccionSiguiente, setLeccionSiguiente] = useState<Leccion | null>(
    null
  );
  const [leccionAnterior, setLeccionAnterior] = useState<Leccion | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<
    Record<number, string>
  >({});

  const navegar = useNavigate();
  const contenidoSanitizado = DOMPurify.sanitize(leccion?.contenido || ""); // ANTI XSS

  const handleVuelta = () => {
    navegar("/curso");
  };

  const { id } = useParams(); // Id de la lección de la URL

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
    const fetchPreguntaAleatoria = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://localhost:5001/api/pregunta_aleatoria/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPreguntas(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreguntaAleatoria();
  }, [id]);

  useEffect(() => {
    const fetchLeccionSiguiente = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://localhost:5001/api/lecciones/${Number(id) + 1}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLeccionSiguiente(response.data);
      } catch (error) {
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

  const handleSeleccionarRespuesta = (preguntaId: any, respuesta: any) => {
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [preguntaId]: respuesta,
    }));
  };

  // Convierte el ID a un número
  const idNumber = Number(id);

  // Verifica si el ID de la lección es un número válido y mayor que cero
  if (isNaN(idNumber) || idNumber <= 0) {
    navegar("/curso"); // Redirige al usuario a la página principal
    return null; // No renderiza nada
  }

  return (
    <div className="bg-[#12111C] min-h-screen flex flex-col items-start justify-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="md:ml-80 space-y-8">
        <div>
          <div className="flex md:mb-6">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-[#F7C30E] rounded-lg border-2 py-1 px-1 border-[#F7C30E] ml-4 cursor-pointer"
              onClick={handleVuelta}
            />
            <p className="text-white w-full text-sm font-bold tracking-wider uppercase text-transform text-white/7 bg-[#13111C] m-0 left-0 md:left-auto pl-2 md:pl-0 pt-1 md:ml-3">
              INTRODUCCIÓN
            </p>
          </div>
          <h2 className="mt-6 text-2xl md:text-4xl font-extrabold text-[#32FF00] ml-4 font-poppins mb-8 md:mb-8">
            {leccion?.nombre}
          </h2>

          <div className="mt-2 md:w-[900px] ml-4">
            <video
              className="w-full h-full rounded"
              src={leccion?.video_url}
              controls
            />
          </div>
        </div>
        <div className="mt-4 bg-#c3e0ae p-4 rounded-lg shadow-md md:w-[900px]">
          <ReactMarkdown
            className="text-white text-lg"
            components={{
              h1: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/heading-has-content
                <h1
                  className="md:mt-10 text-2xl md:text-4xl font-extrabold text-[#32FF00] font-poppins mb-8 mt-10 md:mb-12"
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

              a: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  className="text-[#5f8ae9] font-bold cursor-pointer"
                  {...props}
                />
              ), // Estilo para enlaces
            }}
            rehypePlugins={[rehypeRaw]}
          >
            {contenidoSanitizado}
          </ReactMarkdown>
        </div>

        {/* Aquí es donde agregamos el div para el minitest */}
        <div className="mt-8 p-4 rounded-lg shadow-md md:w-[900px] relative border-2 border-white">
          <h2 className="text-2xl font-bold text-center mb-4 flex justify-center items-center absolute top-[-22px] bg-[#12111C] px-2 text-orange-500">
            <FontAwesomeIcon icon={faVial} className="mr-2 text-orange-500" />{" "}
            Minitest
          </h2>
          {preguntas.map((pregunta) => (
            <div key={pregunta.id}>
              <p className="text-white mb-2">{pregunta.pregunta}</p>
              {[
                "respuesta_correcta",
                "respuesta_incorrecta1",
                "respuesta_incorrecta2",
                "respuesta_incorrecta3",
              ].map((respuesta) => (
                <button
                  key={respuesta}
                  className={`my-2 p-2 w-full text-left ${
                    respuestasSeleccionadas[pregunta.id] === respuesta
                      ? respuesta === "respuesta_correcta"
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-gray-200"
                  }`}
                  onClick={() =>
                    handleSeleccionarRespuesta(pregunta.id, respuesta)
                  }
                >
                  {pregunta[respuesta as keyof Pregunta]}
                </button>
              ))}
            </div>
          ))}
        </div>

        <footer className="flex justify-between pt-8 mt-8 border-t border-white/10 ml-4">
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
