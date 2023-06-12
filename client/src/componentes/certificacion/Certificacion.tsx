import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Notyf } from "notyf";
import certificado from "../../assets/certificado.png";
import jsPDF from "jspdf";
import { v4 as uuidv4 } from "uuid";

const Certificacion = () => {
  const navegar = useNavigate();
  const [progreso, setProgreso] = useState(0);
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [isLoading, setIsLoading] = useState(true);
  const notyf = new Notyf({
    duration: 4000,
    position: { x: "right", y: "top" },
  });

  const generarCertificado = () => {
    const doc = new jsPDF();
    const certificadoId = uuidv4();

    doc.setFontSize(22);
    doc.text("Certificado de Finalización", 105, 50, { align: "center" });
    doc.setFontSize(16);
    doc.text(`Este certificado se otorga a ${usuario.nombre}`, 105, 60, {
      align: "center",
    });
    doc.text("por completar el curso de React", 105, 70, { align: "center" });
    doc.text(`ID del Certificado: ${certificadoId}`, 105, 80, {
      align: "center",
    });

    doc.save("certificado.pdf");
  };

  useEffect(() => {
    const fetchProgreso = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const id = user.id;

      setIsLoading(true); // comienza la solicitud
      try {
        const response = await axios.get(
          `http://localhost:5001/api/progreso/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgreso(response.data.porcentajeCompletado);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false); // finaliza la solicitud
    };
    fetchProgreso();
  }, [navegar]);
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

  // Obtener progreso
  useEffect(() => {
    const fetchProgreso = async () => {
      const token = localStorage.getItem("token");
      // ID
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const id = user.id;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/progreso/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgreso(response.data.porcentajeCompletado);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProgreso();
  }, [navegar]);

  if (!isLoading && progreso < 100) {
    navegar("/");
    notyf.error(
      "Debes completar el 100% del curso para descargar el certificado"
    );
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="p-8 bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-center">
          <img
            className="h-24 w-24 object-cover "
            src={certificado}
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
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
            onClick={generarCertificado}
          >
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificacion;
