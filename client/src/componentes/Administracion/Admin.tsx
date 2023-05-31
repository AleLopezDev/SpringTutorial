import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface Usuario {
  id: number;
  nombre: string;
  correo_electronico: string;
  contrasena: string;
  ultima_leccion_vista: number;
  imagen_url: string;
}

interface LeccionesCompletadas {
  id: number;
  leccion_id: number;
  usuario_id: number;
  fecha_completada: string;
  nombre: string;
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

  const handleUsersButtonClick = () => {
    setListaVisible(!listaVisible);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 h-screen">
      <div className="w-full md:w-64 bg-white p-4 shadow-lg mt-1 h-screen overflow-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Administración
        </h2>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          onClick={handleUsersButtonClick}
        >
          Usuarios
        </button>
        <button className="w-full bg-blue-500 text-white p-2 rounded mb-2">
          Lecciones/Secciones
        </button>
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Examenes
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
        </div>
      </main>
    </div>
  );
};

export default Admin;
