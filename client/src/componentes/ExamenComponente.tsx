import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getTiempoExamen, getTiempoEsperaExamen } from "modelo/modelo";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

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
  const [examenEnviado, setExamenEnviado] = useState(false);
  const navigate = useNavigate();
  const [tiempoRestante, setTiempoRestante] = useState<number | null>(
    () => Number(localStorage.getItem("tiempoRestante")) || getTiempoExamen()
  );

  useEffect(() => {
    // Guarda el tiempo restante en localStorage por si se recarga la página
    localStorage.setItem("tiempoRestante", String(tiempoRestante));
  }, [tiempoRestante]);

  const manejarEnvio = useCallback(() => {
    localStorage.setItem("horaUltimoIntentoExamen", Date.now().toString());

    const nuevosResultadosRespuestas: { [key: number]: boolean } = {};
    let respuestasCorrectas = 0;

    preguntas.forEach((pregunta) => {
      const idPregunta = pregunta.id;
      const idRespuestaSeleccionada = respuestasSeleccionadas[idPregunta];

      if (idRespuestaSeleccionada === undefined) {
        nuevosResultadosRespuestas[idPregunta] = false;
        return;
      }

      const respuestaCorrecta = respuestas.find(
        (respuesta) =>
          respuesta.idPregunta === Number(idPregunta) && respuesta.correcta
      );
      const esCorrecta =
        !!respuestaCorrecta && respuestaCorrecta.id === idRespuestaSeleccionada;
      nuevosResultadosRespuestas[idPregunta] = esCorrecta;

      if (esCorrecta) {
        respuestasCorrectas++;
      }
    });

    setExamenEnviado(true);

    setResultadosRespuestas(nuevosResultadosRespuestas);

    // Verificar si el usuario tiene más de la mitad de las respuestas correctas
    if (respuestasCorrectas <= preguntas.length / 2) {
      localStorage.setItem("horaSuspensionExamen", Date.now().toString());
    }

    localStorage.setItem("examenTomado", "true");
    setTiempoRestante(0);
    localStorage.removeItem("tiempoRestante");
  }, [preguntas, respuestas, respuestasSeleccionadas]);

  const terminarExamen = useCallback(() => {
    console.log("Terminando el examen...");
    setTiempoRestante(null);
    localStorage.removeItem("tiempoRestante");
    setExamenEnviado(true);
    manejarEnvio();
  }, [manejarEnvio]);

  useEffect(() => {
    const notyf = new Notyf({
      duration: 4000,
      position: { x: "right", y: "top" },
    });

    const horaSuspensionExamen = localStorage.getItem("horaSuspensionExamen");
    const examenTomado = localStorage.getItem("examenTomado");

    if (
      examenTomado &&
      Date.now() - Number(horaSuspensionExamen) < getTiempoEsperaExamen()
    ) {
      // El usuario ha intentado tomar el examen recientemente
      notyf.error(
        "No puedes volver a realizar el examen hasta que pasen " +
          getTiempoEsperaExamen() / 1000 +
          " segundos"
      );
    }
  }, [navigate]);

  useEffect(() => {
    // Si el tiempo restante llega a 0, termina el examen
    if (tiempoRestante === 0 || tiempoRestante === null || tiempoRestante < 0) {
      terminarExamen();
      return;
    }

    // Actualiza el tiempo restante cada segundo
    const id = setInterval(() => {
      setTiempoRestante(
        (tiempoRestante) => (tiempoRestante ? tiempoRestante - 1 : null) // Si el tiempo restante es 0, lo deja en null
      );
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(id);
  }, [tiempoRestante, terminarExamen]);

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

  // Obtener el examen
  useEffect(() => {
    axios.get(`http://localhost:5001/api/examen/${id}`).then((res) => {
      setExamen(res.data);
    });
  }, [id]);

  // Obtener las preguntas del examen
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

  useEffect(() => {
    if (examenEnviado) {
      const nuevosResultadosRespuestas: { [key: number]: boolean } = {};
      let respuestasCorrectas = 0;

      preguntas.forEach((pregunta) => {
        const idPregunta = pregunta.id;
        const idRespuestaSeleccionada = respuestasSeleccionadas[idPregunta];

        if (idRespuestaSeleccionada === undefined) {
          nuevosResultadosRespuestas[idPregunta] = false;
        }

        const respuestaCorrecta = respuestas.find(
          (respuesta) =>
            respuesta.idPregunta === Number(idPregunta) && respuesta.correcta
        );
        const esCorrecta =
          !!respuestaCorrecta &&
          respuestaCorrecta.id === idRespuestaSeleccionada;
        nuevosResultadosRespuestas[idPregunta] = esCorrecta;
        if (esCorrecta) {
          respuestasCorrectas++;
        }
      });

      setResultadosRespuestas(nuevosResultadosRespuestas);

      if (respuestasCorrectas > preguntas.length / 2) {
        const urlExamenCompletado = `http://localhost:5001/api/examenes_completados`;

        axios
          .post(urlExamenCompletado, {
            examen_id: examen[0].id,
            usuario_id: usuario.id,
          })
          .then(() => {
            console.log("Examen completado correctamente.");
          })
          .catch((error) => {
            console.error("Hubo un error al completar el examen.", error);
          });

        // Insertar en secciones_completadas
        const urlSeccionCompletada = `http://localhost:5001/api/secciones_completadas`;

        axios
          .post(urlSeccionCompletada, {
            examen_id: examen[0].id,
            usuario_id: usuario.id,
          })
          .then(() => {
            console.log("Sección completada correctamente.");
            // Puedes navegar a una página de éxito aquí, si es necesario
          })
          .catch((error) => {
            console.error("Hubo un error al completar la sección.", error);
          });
      }
    }
  }, [
    examenEnviado,
    preguntas,
    respuestas,
    respuestasSeleccionadas,
    usuario,
    examen,
  ]);

  return (
    <div className="min-h-screen py-2 bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500">
          Tiempo restante: {tiempoRestante} segundos
        </h2>
      </div>
      {examen.map((examen) => (
        <div
          key={examen.id}
          className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {examen.nombre}
            </h2>
          </div>
          {preguntas.map((pregunta, index) => (
            <div key={pregunta.id} className="mt-8">
              <p className="text-2xl font-semibold text-gray-900">
                {index + 1}. {pregunta.Pregunta}
                {(tiempoRestante === null || examenEnviado) && (
                  <>
                    {resultadosRespuestas[pregunta.id] === true && (
                      <span className="ml-2">✅</span>
                    )}
                    {resultadosRespuestas[pregunta.id] === false && (
                      <span className="ml-2">❌</span>
                    )}
                  </>
                )}
              </p>
              {respuestas
                .filter((respuesta) => respuesta.idPregunta === pregunta.id)
                .map((respuesta) => (
                  <label
                    key={respuesta.id}
                    className="block mt-3 text-lg text-gray-700"
                  >
                    <input
                      className="mr-2 leading-tight"
                      type="radio"
                      name={`pregunta_${pregunta.id}`}
                      value={respuesta.id}
                      checked={
                        respuestasSeleccionadas[pregunta.id] === respuesta.id
                      }
                      onChange={() =>
                        manejarCambioRespuesta(pregunta.id, respuesta.id)
                      }
                    />
                    <span className="text-base leading-normal">
                      {respuesta.Respuesta}
                    </span>
                  </label>
                ))}
            </div>
          ))}
          <button
            className="w-full py-2 px-4 mt-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={manejarEnvio}
            disabled={tiempoRestante === null}
          >
            Enviar Examen
          </button>
          {(tiempoRestante === null || examenEnviado) && (
            <button
              className="w-full py-2 px-4 mt-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => navigate("/curso")}
            >
              Volver al inicio
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
export default ExamenComponente;
