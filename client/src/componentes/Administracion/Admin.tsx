import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

interface Usuario {
  id: number;
  nombre: string;
  correo_electronico: string;
  contrasena: string;
  ultima_leccion_vista: number;
  imagen_url: string;
  admin: boolean;
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
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
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

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/secciones")
      .then((response) => {
        setSecciones(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sections", error);
      });
  }, []);

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
            console.error("Error fetching sections", error);
          });
      })
      .catch((error) => {
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
        console.error("Error editing section", error);
      });
  };

  // ********** Lecciones **********
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [leccionSeleccionada, setLeccionSeleccionada] = useState<number>(0);
  const [contenidoLeccionSeleccionada, setContenidoLeccionSeleccionada] =
    useState<string>("");
  const [esVisibleAgregarLeccion, setEsVisibleAgregarLeccion] =
    useState<boolean>(false);
  const [nombreNuevaLeccion, setNombreNuevaLeccion] = useState<string>("");
  const [videoNuevaLeccion, setVideoNuevaLeccion] = useState<string>("");
  const [descripcionNuevaLeccion, setDescripcionNuevaLeccion] =
    useState<string>("");
  const [nombreLeccionEditada, setNombreLeccionEditada] = useState<string>("");
  const [descripcionLeccionEditada, setDescripcionLeccionEditada] =
    useState<string>("");
  const [seccionIdParaNuevaLeccion, setSeccionIdParaNuevaLeccion] =
    useState<number>(0);

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
        console.error("Error fetching lessons", error);
      });
  }, []);

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
        console.error("Error deleting lesson", error);
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
        setLecciones([...lecciones, response.data]);
        setNombreNuevaLeccion("");
        setVideoNuevaLeccion("");
        setContenidoLeccionSeleccionada("");
      })
      .catch((error) => {
        console.error("Error adding lesson", error);
      });
  };

  const manejarEditarLeccion = () => {
    axios
      .put(`http://localhost:5001/api/lecciones/${leccionSeleccionada}`, {
        nombre: nombreLeccionEditada,
        descripcion: descripcionLeccionEditada,
      })
      .then((response) => {
        // Actualizar el estado de las lecciones para reflejar la edición
        setLecciones(
          lecciones.map((leccion) =>
            leccion.id === leccionSeleccionada
              ? {
                  ...leccion,
                  nombre: nombreLeccionEditada,
                  descripcion: descripcionLeccionEditada,
                }
              : leccion
          )
        );
        setNombreLeccionEditada("");
        setDescripcionLeccionEditada("");
      })
      .catch((error) => {
        console.error("Error editing lesson", error);
      });
  };

  // Si el usuario no está autenticado, redirigirlo a la página de inicio de sesión
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
    if (!usuario || !usuario.id) {
      navegar("/login");
    }
  }, [navegar, usuario]);

  // Comprobar si es admin
  useEffect(() => {
    console.log(usuario.admin);
    if (usuario && usuario.admin) {
      console.log("El usuario es administrador");
    } else {
      console.log("El usuario no es administrador");
    }
  }, [usuario]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/usuarios")
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users", error);
      });
  }, []);

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
          console.error("Error fetching completed lessons", error);
        });

      // Obtener las secciones completadas por el usuario
      axios
        .get(`http://localhost:5001/api/secciones_completadas/${userId}`)
        .then((response) => {
          setSeccionesCompletadas(response.data);
        })
        .catch((error) => {
          console.error("Error fetching completed sections", error);
        });

      // Obtener los exámenes completados por el usuario
      axios
        .get(`http://localhost:5001/api/examenes_completados/${userId}`)
        .then((response) => {
          setExamenesCompletados(response.data);
        })
        .catch((error) => {
          console.error("Error fetching completed exams", error);
        });
    }
  };

  const manejarUsuarioVisible = () => {
    setListaVisible(!listaVisible);
    setEsVisibleAgregarSeccion(false);
    setEsVisibleAgregarLeccion(false);
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

        <button className="w-full bg-blue-500 text-white p-2 mb-2 rounded">
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
                <h2 className="text-xl font-bold mb-2">
                  Agregar nueva lección
                </h2>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={seccionSeleccionada}
                  onChange={(e) => {
                    const selectedSectionId = Number(e.target.value);
                    setSeccionSeleccionada(selectedSectionId);
                    setSeccionIdParaNuevaLeccion(selectedSectionId);
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
                  placeholder="Nombre de la lección"
                  value={nombreNuevaLeccion}
                  onChange={(e) => setNombreNuevaLeccion(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  placeholder="Descripción de la lección"
                  value={descripcionNuevaLeccion}
                  onChange={(e) => setDescripcionNuevaLeccion(e.target.value)}
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
                <h2 className="text-xl font-bold mb-2">Editar lección</h2>
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
                <textarea
                  placeholder="Nueva descripción de la lección"
                  value={descripcionLeccionEditada}
                  onChange={(e) => setDescripcionLeccionEditada(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button
                  onClick={manejarEditarLeccion}
                  className="w-full bg-green-500 text-white p-2 rounded"
                >
                  Editar lección
                </button>
              </div>

              <div className="p-4 bg-white rounded shadow-md mb-5">
                <h2 className="text-xl font-bold mb-2">Eliminar lección</h2>

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

                <button
                  onClick={() => {
                    if (leccionSeleccionada !== 0) {
                      manejarBorradoLecciones(leccionSeleccionada);
                    }
                  }}
                  className="w-full bg-red-500 text-white p-2 rounded"
                >
                  Eliminar lección
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
