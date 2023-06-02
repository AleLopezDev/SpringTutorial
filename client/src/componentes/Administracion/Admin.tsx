import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Notyf } from "notyf";

interface Usuario {
  id: number;
  nombre: string;
  correo_electronico: string;
  contrasena: string;
  ultima_leccion_vista: number;
  imagen_url: string;
  admin: boolean;
}

interface Examen {
  id: number;
  seccion_id: number;
  nombre: string;
}

interface PreguntaExamenes {
  id: number;
  idExamen: number;
  Pregunta: string;
}

interface RespuestaExamenes {
  id: number;
  idPregunta: number;
  Respuesta: string;
  Correcta: boolean;
}

interface LeccionesCompletadas {
  id: number;
  leccion_id: number;
  usuario_id: number;
  fecha_completada: string;
  nombre: string;
}
interface Seccion {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Leccion {
  id: number;
  nombre: string;
  descripcion: string;
  seccion_id: number;
}

interface SeccionesCompletadas {
  id: number;
  leccion_id: number;
  usuario_id: number;
  fecha_completada: string;
}

interface ExamenesCompletados {
  id: number;
  examen_id: number;
  usuario_id: number;
  fecha_completado: string;
}

const Admin = () => {
  const notyf = new Notyf({
    duration: 4000,
    position: { x: "right", y: "top" },
  });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [esAdmin, setEsAdmin] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(
    null
  );
  const [listaVisible, setListaVisible] = useState<boolean>(true);
  const [LeccionesCompletadas, setLeccionesCompletadas] = useState<
    LeccionesCompletadas[]
  >([]);
  const [seccionesCompletadas, setSeccionesCompletadas] = useState<
    SeccionesCompletadas[]
  >([]);
  const [examenesCompletados, setExamenesCompletados] = useState<
    ExamenesCompletados[]
  >([]);
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const navegar = useNavigate();

  /* ----------- Usuarios ------------- */

  // Comprobar si esta autenticado como administrador
  useEffect(() => {
    console.log(usuario);
    if (!usuario.admin) {
      navegar("/loginadmin");
    }
  }, [navegar, usuario]);

  // Comprobar si el usuario es administrador

  const handleUserClick = (userId: number) => {
    if (usuarioSeleccionado === userId) {
      setUsuarioSeleccionado(null);
    } else {
      setUsuarioSeleccionado(userId);

      // Obtener las lecciones completadas por el usuario
      axios
        .get(`http://localhost:5001/api/lecciones_completadas/${userId}`)
        .then((response) => {
          console.log(response.data);
          setLeccionesCompletadas(response.data);
        })
        .catch((error) => {
          if (error === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navegar("/login");
            window.location.reload();
          }
          console.error("Error fetching completed lessons", error);
        });

      // Obtener las secciones completadas por el usuario
      axios
        .get(`http://localhost:5001/api/secciones_completadas/${userId}`)
        .then((response) => {
          setSeccionesCompletadas(response.data);
        })
        .catch((error) => {
          if (error === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navegar("/login");
            window.location.reload();
          }
          console.error("Error fetching completed sections", error);
        });

      // Obtener los exámenes completados por el usuario
      axios
        .get(`http://localhost:5001/api/examenes_completados/${userId}`)
        .then((response) => {
          setExamenesCompletados(response.data);
        })
        .catch((error) => {
          if (error === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navegar("/login");
            window.location.reload();
          }
          console.error("Error fetching completed exams", error);
        });
    }
  };

  const manejarUsuarioVisible = () => {
    setListaVisible(!listaVisible);
    setEsVisibleAgregarSeccion(false);
    setEsVisibleAgregarLeccion(false);
    setEsVisibleAgregarExamen(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/secciones")
      .then((response) => {
        setSecciones(response.data);
      })
      .catch((error) => {
        if (error === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navegar("/login");
          window.location.reload();
        }
        console.error("Error fetching sections", error);
      });
  }, [navegar]);

  /********** Secciones **********/
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<number>(0);

  const [esVisibleAgregarSeccion, setEsVisibleAgregarSeccion] =
    useState<boolean>(false);
  const [nombreNuevaSeccion, setNombreNuevaSeccion] = useState<string>("");
  const [descripcionNuevaSeccion, setDescripcionNuevaSeccion] =
    useState<string>("");
  const [nombreSeccionEditada, setNombreSeccionEditada] = useState<string>("");
  const [descripcionSeccionEditada, setDescripcionSeccionEditada] =
    useState<string>("");

  const manejarClickBotonSecciones = () => {
    setEsVisibleAgregarSeccion(!esVisibleAgregarSeccion);
    setListaVisible(false);
    setEsVisibleAgregarLeccion(false);
  };

  const manejarBorradoSecciones = (id: number) => {
    axios
      .delete(`http://localhost:5001/api/secciones/${id}`)
      .then((response) => {
        // Actualizar el estado de las secciones para reflejar la eliminación
        setSecciones(secciones.filter((seccion) => seccion.id !== id));
      })
      .catch((error) => {
        if (error === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navegar("/login");
          window.location.reload();
        }
        console.error("Error deleting section", error);
      });
  };

  const manejarAgregarSeccion = () => {
    axios
      .post("http://localhost:5001/api/secciones", {
        nombre: nombreNuevaSeccion,
        descripcion: descripcionNuevaSeccion,
      })
      .then((response) => {
        // Refetch secciones
        axios
          .get("http://localhost:5001/api/secciones")
          .then((response) => {
            setSecciones(response.data);
            setNombreNuevaSeccion("");
            setDescripcionNuevaSeccion("");
          })
          .catch((error) => {
            if (error === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navegar("/login");
              window.location.reload();
            }
            console.error("Error fetching sections", error);
          });
      })
      .catch((error) => {
        if (error === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navegar("/login");
          window.location.reload();
        }
        console.error("Error adding section", error);
      });
  };

  const manejarEditarSeccion = () => {
    axios
      .put(`http://localhost:5001/api/secciones/${seccionSeleccionada}`, {
        nombre: nombreSeccionEditada,
        descripcion: descripcionSeccionEditada,
      })
      .then((response) => {
        // Actualizar el estado de las secciones para reflejar la edición
        setSecciones(
          secciones.map((seccion) =>
            seccion.id === seccionSeleccionada
              ? {
                  ...seccion,
                  nombre: nombreSeccionEditada,
                  descripcion: descripcionSeccionEditada,
                }
              : seccion
          )
        );
        setNombreSeccionEditada("");
        setDescripcionSeccionEditada("");
      })
      .catch((error) => {
        if (error === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navegar("/login");
          window.location.reload();
        }
        console.error("Error editing section", error);
      });
  };

  // ********** Lecciones **********
  const [lecciones, setLecciones] = useState<Leccion[]>([]);

  // Leccion - Agregar
  const [leccionSeleccionada, setLeccionSeleccionada] = useState<number>(0);
  const [contenidoLeccionSeleccionada, setContenidoLeccionSeleccionada] =
    useState<string>("");
  const [esVisibleAgregarLeccion, setEsVisibleAgregarLeccion] =
    useState<boolean>(false);
  const [nombreNuevaLeccion, setNombreNuevaLeccion] = useState<string>("");
  const [videoNuevaLeccion, setVideoNuevaLeccion] = useState<string>("");

  // Leccion - Editar
  const [nombreLeccionEditada, setNombreLeccionEditada] = useState<string>("");
  const [seccionIdParaNuevaLeccion, setSeccionIdParaNuevaLeccion] =
    useState<number>(0);
  const [nuevaUrlVideo, setNuevaUrlVideo] = useState<string>("");
  const [contenidoLeccionEditada, setContenidoLeccionEditada] =
    useState<string>("");
  const [leccionBorrar, setLeccionBorrar] = useState<number>(0);

  // Obtener contenido de la lección seleccionada
  useEffect(() => {
    if (leccionSeleccionada !== 0) {
      const token = localStorage.getItem("token");
      if (token) {
        axios
          .get(`http://localhost:5001/api/lecciones/${leccionSeleccionada}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setContenidoLeccionEditada(response.data.contenido);
          })
          .catch((error) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navegar("/login");
            window.location.reload();
          });
      } else {
        console.error("No se encontraron token");
      }
    }
  }, [leccionSeleccionada, navegar]);

  useEffect(() => {
    if (secciones.length > 0) {
      setSeccionSeleccionada(secciones[0].id);
      setSeccionIdParaNuevaLeccion(secciones[0].id);
    }
  }, [secciones]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/lecciones")
      .then((response) => {
        setLecciones(response.data);
      })
      .catch((error) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navegar("/login");
        window.location.reload();
      });
  }, [navegar]);

  const manejarClickBotonLecciones = () => {
    setEsVisibleAgregarLeccion(!esVisibleAgregarLeccion);
    setListaVisible(false);
    setEsVisibleAgregarSeccion(false);
  };

  const manejarBorradoLecciones = (id: number) => {
    axios
      .delete(`http://localhost:5001/api/lecciones/${id}`)
      .then((response) => {
        setLecciones(lecciones.filter((leccion) => leccion.id !== id));
      })
      .catch((error) => {
        if (error === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navegar("/login");
          window.location.reload();
        }
      });
  };

  const manejarAgregarLeccion = () => {
    axios
      .post("http://localhost:5001/api/lecciones", {
        nombre: nombreNuevaLeccion,
        seccion_id: seccionIdParaNuevaLeccion,
        video_url: videoNuevaLeccion,
        contenido: contenidoLeccionSeleccionada,
      })
      .then((response) => {
        // Refetch lecciones
        axios
          .get("http://localhost:5001/api/lecciones")
          .then((response) => {
            setLecciones(response.data);
            const nuevaLeccion = response.data.find(
              (leccion: Leccion) => leccion.nombre === nombreNuevaLeccion
            );
            if (nuevaLeccion) {
              setLeccionSeleccionada(nuevaLeccion.id);
            }
            setNombreNuevaLeccion("");
            setVideoNuevaLeccion("");
            setContenidoLeccionSeleccionada("");
          })
          .catch((error) => {
            if (error === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navegar("/login");
              window.location.reload();
            }
            console.error("Error fetching lessons", error);
          });
      })
      .catch((error) => {
        if (error === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navegar("/login");
          window.location.reload();
        }
        console.error("Error adding lesson", error);
      });
  };

  const manejarEditarLeccion = () => {
    axios
      .put(`http://localhost:5001/api/lecciones/${leccionSeleccionada}`, {
        nombre: nombreLeccionEditada,
        seccion_id: seccionIdParaNuevaLeccion,
        video_url: nuevaUrlVideo,
        contenido: contenidoLeccionEditada,
      })
      .then((response) => {
        // Refetch lecciones
        axios
          .get("http://localhost:5001/api/lecciones")
          .then((response) => {
            setLecciones(response.data);
            setNombreLeccionEditada("");
            setNuevaUrlVideo("");
            setContenidoLeccionEditada("");
          })
          .catch((error) => {
            if (error === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navegar("/login");
              window.location.reload();
            }
            console.error("Error fetching lessons", error);
          });
      })
      .catch((error) => {
        if (error === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navegar("/login");
          window.location.reload();
        }
        console.error("Error editing lesson", error);
      });
  };

  /* ------------ Examenes ------------ */
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [nombreNuevoExamen, setNombreNuevoExamen] = useState("");
  const [
    seccionSeleccionadaParaNuevoExamen,
    setSeccionSeleccionadaParaNuevoExamen,
  ] = useState(0);
  const [examenSeleccionado, setExamenSeleccionado] = useState(0);
  const [nombreExamenEditado, setNombreExamenEditado] = useState("");
  const [esVisibleAgregarExamen, setEsVisibleAgregarExamen] = useState(false);
  const [examenBorrar, setExamenBorrar] = useState(0);

  // Relacionado con preguntas y respuestas
  const [preguntaActual, setPreguntaActual] = useState("");
  const [numeroDeRespuestas, setNumeroDeRespuestas] = useState<number | null>(
    null
  );

  const [respuestasActuales, setRespuestasActuales] = useState<string[]>([]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(0);
  const [seccionExamenSeleccionado, setSeccionExamenSeleccionado] =
    useState("");

  useEffect(() => {
    if (examenSeleccionado !== 0) {
      const examen = examenes.find(
        (examen) => examen.id === examenSeleccionado
      );
      if (examen) {
        const seccion = secciones.find(
          (seccion) => seccion.id === examen.seccion_id
        );
        if (seccion) {
          setSeccionExamenSeleccionado(seccion.nombre);
        }
      }
    }
  }, [examenSeleccionado, examenes, secciones]);

  useEffect(() => {
    if (secciones.length > 0) {
      setSeccionSeleccionadaParaNuevoExamen(secciones[0].id);
    }
  }, [secciones]);

  useEffect(() => {
    // Si no hay ningún examen seleccionado y hay exámenes disponibles, selecciona el primero
    if (examenSeleccionado === 0 && examenes.length > 0) {
      setExamenSeleccionado(examenes[0].id);
    }
  }, [examenSeleccionado, examenes]);

  // Obtener examenes
  useEffect(() => {
    // Fetch the list of exams when the component mounts
    axios
      .get("http://localhost:5001/api/examenes")
      .then((response) => {
        setExamenes(response.data);
      })
      .catch((error) => {
        console.error("Error obteniendo", error);
      });
  }, []);

  const manejarClickBotonExamenes = () => {
    setEsVisibleAgregarExamen(!esVisibleAgregarExamen);
    setListaVisible(false);
    setEsVisibleAgregarSeccion(false);
    setEsVisibleAgregarLeccion(false);
  };

  const manejarAgregarExamen = () => {
    axios
      .get(
        `http://localhost:5001/api/examenes/seccion/${seccionSeleccionadaParaNuevoExamen}`
      )
      .then((response) => {
        axios
          .post("http://localhost:5001/api/examenes", {
            nombre: nombreNuevoExamen,
            seccion_id: seccionSeleccionadaParaNuevoExamen,
          })
          .then((response) => {
            // Refetch the list of exams
            axios
              .get("http://localhost:5001/api/examenes")
              .then((response) => {
                setExamenes(response.data);
              })
              .catch((error) => {
                console.error("Error obteniendo", error);
              });
            setNombreNuevoExamen("");
          })
          .catch((error) => {
            console.error("Error añadiendo examen", error);
          });
        notyf.success("Examen añadido correctamente.");
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          // Si el error es 409, significa que ya existe un examen para esta sección
          notyf.error("Ya existe un examen para esta sección.");
        } else {
          // Si el error es cualquier otro, lo tratamos como un error inesperado
          console.error("Error comprobando si existe el examen", error);
        }
      });
  };

  const manejarEditarExamen = () => {
    axios
      .put(`http://localhost:5001/api/examenes/${examenSeleccionado}`, {
        nombre: nombreExamenEditado,
      })
      .then((response) => {
        // Refetch the list of exams
        axios
          .get("http://localhost:5001/api/examenes")
          .then((response) => {
            setExamenes(response.data);
          })
          .catch((error) => {
            console.error("Error obteniendo", error);
          });
        setNombreExamenEditado("");
      })
      .catch((error) => {
        console.error("Error editando examen", error);
      });
  };

  const manejarBorrarExamen = () => {
    if (examenSeleccionado !== 0) {
      axios
        .delete(`http://localhost:5001/api/examenes/${examenSeleccionado}`)
        .then((response) => {
          // Refetch the list of exams
          axios
            .get("http://localhost:5001/api/examenes")
            .then((response) => {
              setExamenes(response.data);
              // Reset the selected exam
              if (examenes.length > 0) {
                setExamenSeleccionado(examenes[0].id);
              } else {
                setExamenSeleccionado(0);
              }
            })
            .catch((error) => {
              console.error("Error obteniendo", error);
            });
        })
        .catch((error) => {
          console.error("Error borrando examen", error);
        });
    }
  };

  const manejarAgregarPreguntaExamen = () => {
    // Se agrega la pregunta
    axios
      .post("http://localhost:5001/api/preguntasExamen", {
        idExamen: examenSeleccionado,
        pregunta: preguntaActual,
      })
      .then((response) => {
        // Luego, para cada respuesta, agrega la respuesta
        respuestasActuales.forEach((respuesta, i) => {
          axios
            .post("http://localhost:5001/api/respuestasExamen", {
              idPregunta: response.data.id,
              respuesta: respuesta,
              correcta: i + 1 === respuestaCorrecta,
            })
            .catch((error) => {
              console.error("Error añadiendo respuesta", error);
            });
        });

        // Se limpian los campos
        setPreguntaActual("");
        setRespuestasActuales([]);
        setRespuestaCorrecta(0);
      })
      .catch((error) => {
        console.error("Error añadiendo pregunta", error);
      });
  };

  const manejarEditarPreguntaExamen = () => {
    // Lógica para editar una pregunta de examen
  };

  const manejarBorrarPreguntaExamen = () => {
    // Lógica para borrar una pregunta de examen
  };

  const manejarEditarRespuestaExamen = () => {
    // Lógica para editar una respuesta de examen
  };

  const manejarBorrarRespuestaExamen = () => {
    // Lógica para borrar una respuesta de examen
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 h-screen">
      <div className="w-full md:w-64 bg-white p-4 shadow-lg mt-1 h-screen overflow-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Administración
        </h2>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          onClick={manejarUsuarioVisible}
        >
          Usuarios
        </button>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          onClick={manejarClickBotonSecciones}
        >
          Secciones
        </button>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          onClick={manejarClickBotonLecciones}
        >
          Lecciones
        </button>

        <button
          className="w-full bg-blue-500 text-white p-2 mb-2 rounded"
          onClick={manejarClickBotonExamenes}
        >
          Examenes
        </button>

        <button className="w-full bg-blue-500 text-white p-2 mb-2 rounded">
          Mini-Tests
        </button>
      </div>
      <main className="flex-1 p-4 h-screen overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <div className="border-4 border-dashed border-gray-200 rounded-lg mt-4 p-4 h-full overflow-auto">
          {listaVisible && (
            <div className="flex flex-col">
              {usuarios.map((user) => (
                <div key={user.id}>
                  <div
                    className="flex items-center p-2 bg-white rounded shadow-md mb-2 cursor-pointer"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <img
                      src={user.imagen_url}
                      alt={user.nombre}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <h2 className="text-xl font-bold">{user.nombre}</h2>
                    <FontAwesomeIcon icon={faCaretDown} className="ml-auto" />
                  </div>
                  {usuarioSeleccionado === user.id && (
                    <div className="p-4 bg-white rounded shadow-md mb-5">
                      <h2 className="text-xl font-bold mb-2">
                        Lecciones completadas por {user.nombre}:{" "}
                        {LeccionesCompletadas.length}
                      </h2>
                      {LeccionesCompletadas.map((lesson) => (
                        <p key={lesson.id}>
                          Lección {lesson.id} completada ( {lesson.nombre} )
                        </p>
                      ))}
                      <h2 className="text-xl font-bold mb-2">
                        Secciones completadas por {user.nombre}:{" "}
                        {seccionesCompletadas.length}
                      </h2>
                      {seccionesCompletadas.map((section) => (
                        <p key={section.id}>
                          Sección {section.id} completada el{" "}
                          {section.fecha_completada}
                        </p>
                      ))}
                      <h2 className="text-xl font-bold mb-2">
                        Exámenes completados por {user.nombre}:{" "}
                        {examenesCompletados.length}
                      </h2>
                      {examenesCompletados.map((exam) => (
                        <p key={exam.id}>
                          Examen {exam.id} completado el {exam.fecha_completado}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* CRUD  seccion*/}
          {esVisibleAgregarSeccion && (
            <div>
              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-2">
                  Agregar nueva sección
                </h2>
                <input
                  type="text"
                  placeholder="Nombre de la sección"
                  value={nombreNuevaSeccion}
                  onChange={(e) => setNombreNuevaSeccion(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  placeholder="Descripción de la sección"
                  value={descripcionNuevaSeccion}
                  onChange={(e) => setDescripcionNuevaSeccion(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button
                  onClick={manejarAgregarSeccion}
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  Agregar sección
                </button>
              </div>

              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-2">Editar sección</h2>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={seccionSeleccionada}
                  onChange={(e) =>
                    setSeccionSeleccionada(Number(e.target.value))
                  }
                >
                  {secciones.map((seccion) => (
                    <option key={seccion.id} value={seccion.id}>
                      {seccion.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nuevo nombre de la sección"
                  value={nombreSeccionEditada}
                  onChange={(e) => setNombreSeccionEditada(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  placeholder="Nueva descripción de la sección"
                  value={descripcionSeccionEditada}
                  onChange={(e) => setDescripcionSeccionEditada(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button
                  onClick={manejarEditarSeccion}
                  className="w-full bg-green-500 text-white p-2 rounded"
                >
                  Editar sección
                </button>
              </div>

              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-2">Eliminar sección</h2>

                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={seccionSeleccionada}
                  onChange={(e) =>
                    setSeccionSeleccionada(Number(e.target.value))
                  }
                >
                  {secciones.map((seccion) => (
                    <option key={seccion.id} value={seccion.id}>
                      {seccion.nombre}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    if (seccionSeleccionada !== 0) {
                      manejarBorradoSecciones(seccionSeleccionada);
                    }
                  }}
                  className="w-full bg-red-500 text-white p-2 rounded"
                >
                  Eliminar sección
                </button>
              </div>
            </div>
          )}

          {/* CRUD  leccion*/}
          {esVisibleAgregarLeccion && (
            <div>
              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-4">
                  Agregar nueva lección
                </h2>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={seccionSeleccionada}
                  onChange={(e) => {
                    const selectedSectionId = Number(e.target.value);
                    setSeccionSeleccionada(selectedSectionId);
                  }}
                >
                  {secciones.map((seccion) => (
                    <option key={seccion.id} value={seccion.id}>
                      {seccion.nombre}
                    </option>
                  ))}
                </select>
                <p className="mb-2">
                  ↑ Selecciona la nueva seccion a la que pertenece la lección
                </p>

                <input
                  type="text"
                  placeholder="Nombre de la lección"
                  value={nombreNuevaLeccion}
                  onChange={(e) => setNombreNuevaLeccion(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="URL video ( Sube tu video (mp4) a un servidor ftp y pon la url )"
                  value={videoNuevaLeccion}
                  onChange={(e) => setVideoNuevaLeccion(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <MDEditor
                  className="mb-2"
                  value={contenidoLeccionSeleccionada}
                  onChange={(value) =>
                    setContenidoLeccionSeleccionada(value || "")
                  }
                />

                <button
                  onClick={manejarAgregarLeccion}
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  Agregar lección
                </button>
              </div>

              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-4">Editar lección</h2>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={leccionSeleccionada}
                  onChange={(e) =>
                    setLeccionSeleccionada(Number(e.target.value))
                  }
                >
                  {lecciones.map((leccion) => (
                    <option key={leccion.id} value={leccion.id}>
                      {leccion.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nuevo nombre de la lección"
                  value={nombreLeccionEditada}
                  onChange={(e) => setNombreLeccionEditada(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={seccionIdParaNuevaLeccion}
                  onChange={(e) => {
                    const selectedSectionId = Number(e.target.value);
                    setSeccionIdParaNuevaLeccion(selectedSectionId);
                  }}
                >
                  {secciones.map((seccion) => (
                    <option key={seccion.id} value={seccion.id}>
                      {seccion.nombre}
                    </option>
                  ))}
                </select>
                {secciones
                  .filter((seccion) => seccion.id === seccionSeleccionada)
                  .map((seccion) => (
                    <p className="mb-2">
                      ↑ Selecciona la nueva seccion a la que pertenece la
                      lección ( Opcional )
                    </p>
                  ))}
                <input
                  type="text"
                  placeholder="Nueva url del video ( Opcional )"
                  value={nuevaUrlVideo}
                  onChange={(e) => setNuevaUrlVideo(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <MDEditor
                  className="mb-2"
                  value={contenidoLeccionEditada}
                  onChange={(value) => setContenidoLeccionEditada(value || "")}
                />
                <button
                  onClick={manejarEditarLeccion}
                  className="w-full bg-green-500 text-white p-2 rounded"
                >
                  Editar lección
                </button>
              </div>

              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-4">Eliminar lección</h2>

                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={leccionBorrar}
                  onChange={(e) => setLeccionBorrar(Number(e.target.value))}
                >
                  {lecciones.map((leccion) => (
                    <option key={leccion.id} value={leccion.id}>
                      {leccion.nombre}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    if (leccionBorrar !== 0) {
                      manejarBorradoLecciones(leccionBorrar);
                    }
                  }}
                  className="w-full bg-red-500 text-white p-2 rounded"
                >
                  Eliminar lección
                </button>
              </div>
            </div>
          )}

          {/* CRUD  Examen*/}
          {esVisibleAgregarExamen && (
            <div>
              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-2">Agregar nuevo examen</h2>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={seccionSeleccionadaParaNuevoExamen}
                  onChange={(e) => {
                    const selectedSectionId = Number(e.target.value);
                    setSeccionSeleccionadaParaNuevoExamen(selectedSectionId);
                  }}
                >
                  {secciones.map((seccion) => (
                    <option key={seccion.id} value={seccion.id}>
                      {seccion.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nombre del examen"
                  value={nombreNuevoExamen}
                  onChange={(e) => setNombreNuevoExamen(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button
                  onClick={manejarAgregarExamen}
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  Agregar examen
                </button>
              </div>

              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-2">Editar examen</h2>
                <p>Sección: {seccionExamenSeleccionado}</p>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={examenSeleccionado}
                  onChange={(e) =>
                    setExamenSeleccionado(Number(e.target.value))
                  }
                >
                  {examenes.map((examen) => (
                    <option key={examen.id} value={examen.id}>
                      {examen.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nuevo nombre del examen"
                  value={nombreExamenEditado}
                  onChange={(e) => setNombreExamenEditado(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button
                  onClick={manejarEditarExamen}
                  className="w-full bg-green-500 text-white p-2 rounded"
                >
                  Editar examen
                </button>
              </div>

              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-2">Eliminar examen</h2>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={examenBorrar}
                  onChange={(e) => setExamenBorrar(Number(e.target.value))}
                >
                  {examenes.map((examen) => (
                    <option key={examen.id} value={examen.id}>
                      {examen.nombre}
                    </option>
                  ))}
                </select>
                <button
                  onClick={manejarBorrarExamen}
                  className="w-full bg-red-500 text-white p-2 rounded"
                >
                  Eliminar examen
                </button>
              </div>

              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-2">
                  Agregar nueva pregunta
                </h2>
                <p>Sección: {seccionExamenSeleccionado}</p>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={examenSeleccionado}
                  onChange={(e) =>
                    setExamenSeleccionado(Number(e.target.value))
                  }
                >
                  {examenes.map((examen) => (
                    <option key={examen.id} value={examen.id}>
                      {examen.nombre}
                    </option>
                  ))}
                </select>
                <p className="mb-2">
                  ↑ Selecciona el examen al que pertenece la pregunta
                </p>
                <input
                  type="text"
                  placeholder="Pregunta"
                  value={preguntaActual}
                  onChange={(e) => setPreguntaActual(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Número de respuestas"
                  value={numeroDeRespuestas || ""}
                  onChange={(e) =>
                    setNumeroDeRespuestas(Number(e.target.value))
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
                {Array.from(
                  { length: numeroDeRespuestas || 0 },
                  (_, i) => i + 1
                ).map((i) => (
                  <div key={i}>
                    <input
                      type="text"
                      placeholder={`Respuesta ${i}`}
                      value={respuestasActuales[i - 1] || ""}
                      onChange={(e) => {
                        const newAnswers = [...respuestasActuales];
                        newAnswers[i - 1] = e.target.value;
                        setRespuestasActuales(newAnswers);
                      }}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={respuestaCorrecta === i}
                      onChange={() => setRespuestaCorrecta(i)}
                    />
                    <label>Es esta la respuesta correcta?</label>
                  </div>
                ))}
                <button
                  onClick={manejarAgregarPreguntaExamen}
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  Agregar pregunta
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
