import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Notyf } from "notyf";

const Certificacion = () => {
  const navegar = useNavigate();
  const [ultimoSeccionCompletada, setUltimoSeccionCompletada] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const notyf = new Notyf({
    duration: 4000,
    position: { x: "right", y: "top" },
  });

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

  useEffect(() => {
    const userId = usuario.id;
    console.log("userId", userId);
    axios
      .get(`http://localhost:5001/api/estado_curso/${userId}`)
      .then((response) => {
        setUltimoSeccionCompletada(response.data.ultimoSeccionCompletada);
        setCargando(false);
      })
      .catch((error) => {
        if (error.response) {
          // El servidor respondió con un estado de error
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió ninguna respuesta
          console.log(error.request);
        } else {
          // Algo sucedió en la configuración de la solicitud que disparó un error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }, [usuario.id]);

  if (cargando) {
    return <div>Cargando...</div>; // Aquí puedes renderizar un spinner o algo similar
  }

  if (!ultimoSeccionCompletada) {
    navegar("/");
    notyf.error(
      "Debes completar todas las secciones para descargar el certificado"
    );
    // Redirige a la página de inicio si la última sección no se ha completado
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-center">
          <img
            className="h-24 w-24 object-cover rounded-full"
            src="https://via.placeholder.com/150"
            alt="ChitChat Logo"
          />
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Certificado: "Aprende a programar en Spring Boot"
          </h2>
          <p className="text-gray-500 mb-2">
            Otorgado por: AprendeSpringBoot Academy
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full">
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificacion;
