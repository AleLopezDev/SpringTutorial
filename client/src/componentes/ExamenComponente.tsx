import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Examen {
  id: number;
  nombre: string;
}

interface Pregunta {
  id: number;
  Pregunta: string;
}

interface Respuesta {
  id: number;
  Respuesta: string;
  correcta: boolean;
  idPregunta: number;
}

const ExamenComponente = () => {
  const [examen, setExamen] = useState<Examen[]>([]);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const { id } = useParams<{ id: string }>();
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<{
    [key: number]: number;
  }>({});
  const [resultadosRespuestas, setResultadosRespuestas] = useState<{
    [key: number]: boolean;
  }>({});
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const navigate = useNavigate();

  // Evitar que si se recarga la página se pierda el usuario
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

  // Comprobar si esta autenticado
  useEffect(() => {
    // Si no hay usuario, redirecciona a la página de inicio de sesión
    if (!usuario || !usuario.id) {
      navigate("/login");
    }
  }, [navigate, usuario]);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/examen/${id}`).then((res) => {
      setExamen(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (examen.length > 0) {
      axios
        .get(`http://localhost:5001/api/PreguntasExamen/${examen[0].id}`)
        .then((res) => {
          setPreguntas(res.data);
        });
    }
  }, [examen]);

  useEffect(() => {
    if (preguntas.length > 0) {
      Promise.all(
        preguntas.map((pregunta) =>
          axios.get(`http://localhost:5001/api/RespuestasExamen/${pregunta.id}`)
        )
      ).then((results) => {
        const nuevasRespuestas = results.flatMap((result) => result.data);
        setRespuestas(nuevasRespuestas);
      });
    }
  }, [preguntas]);

  const manejarCambioRespuesta = (idPregunta: any, idRespuesta: any) => {
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [idPregunta]: idRespuesta,
    }));
  };

  const manejarEnvio = () => {
    const nuevosResultadosRespuestas: { [key: number]: boolean } = {};
    let respuestasCorrectas = 0; // Inicializa la variable aquí
    for (const idPregunta in respuestasSeleccionadas) {
      const idRespuestaSeleccionada = respuestasSeleccionadas[idPregunta];
      const respuestaCorrecta = respuestas.find(
        (respuesta) =>
          respuesta.idPregunta === Number(idPregunta) && respuesta.correcta
      );
      const esCorrecta =
        !!respuestaCorrecta && respuestaCorrecta.id === idRespuestaSeleccionada;
      nuevosResultadosRespuestas[idPregunta] = esCorrecta;
      if (esCorrecta) {
        respuestasCorrectas++; // Incrementa el contador si la respuesta es correcta
      }
    }
    setResultadosRespuestas(nuevosResultadosRespuestas);

    // Guardar la hora en que el usuario envió el examen
    localStorage.setItem("horaEnvioExamen", Date.now().toString());

    // Comprobar si el usuario tiene más de la mitad de las respuestas correctas
    if (respuestasCorrectas > preguntas.length / 2) {
      axios.post(`http://localhost:5001/api/secciones_completadas`, {
        seccion_id: examen[0].id, // Asegúrate de tener el id de la sección disponible
        usuario_id: usuario.id, // Asegúrate de tener el id del usuario disponible
      });
    }
  };

  useEffect(() => {
    // Comprobar si han pasado 30 minutos desde que el usuario envió el examen
    const horaEnvioExamen = Number(localStorage.getItem("horaEnvioExamen"));
    if (Date.now() - horaEnvioExamen < 30 * 60 * 1000) {
      // Si no han pasado 30 minutos, redirigir al usuario a otra página
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {examen.map((examen) => (
        <div
          key={examen.id}
          className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md z-10"
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {examen.nombre}
            </h2>
          </div>
          {preguntas.map((pregunta) => (
            <div key={pregunta.id} className="mt-8 space-y-6">
              <p className="text-2xl font-semibold text-gray-900 mt">
                {pregunta.Pregunta}
                {resultadosRespuestas[pregunta.id] === true && (
                  <span className="ml-2">✅</span>
                )}
                {resultadosRespuestas[pregunta.id] === false && (
                  <span className="ml-2">❌</span>
                )}
              </p>
              {respuestas
                .filter((respuesta) => respuesta.idPregunta === pregunta.id)
                .map((respuesta) => (
                  <div
                    key={respuesta.id}
                    className="mt-1 rounded-md shadow-sm -space-y-px"
                  >
                    <div>
                      <label className="px-3 py-2 text-xl text-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300">
                        <input
                          type="radio"
                          name={`pregunta_${pregunta.id}`}
                          value={respuesta.id}
                          checked={
                            respuestasSeleccionadas[pregunta.id] ===
                            respuesta.id
                          }
                          onChange={() =>
                            manejarCambioRespuesta(pregunta.id, respuesta.id)
                          }
                        />
                        {respuesta.Respuesta}
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          ))}
          <button
            className="mt-8 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={manejarEnvio}
          >
            Enviar Examen
          </button>
        </div>
      ))}
    </div>
  );
};
export default ExamenComponente;
