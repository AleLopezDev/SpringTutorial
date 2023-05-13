import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registrar = async (event: any) => {
    event.preventDefault();
    setError("");

    // Validación básica en el cliente
    if (!nombre) {
      setError("Por favor, introduce tu nombre.");
      return;
    }
    if (!correoElectronico) {
      setError("Por favor, introduce tu correo electrónico.");
      return;
    } else if (
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(correoElectronico)
    ) {
      setError("Por favor, introduce un correo electrónico válido.");
      return;
    }
    if (!contrasena) {
      setError("Por favor, introduce tu contraseña.");
      return;
    } else if (contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const response = await fetch("http://localhost:5001/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        correo_electronico: correoElectronico,
        contrasena,
      }),
    });

    if (response.ok) {
      // Almacenar usuario en localstorage
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));

      // Recargar la página
      window.location.reload();

      // Navegar a la página de inicio
      navigate("/");
    } else {
      // Hubo un error al registrar al usuario
      const errorData = await response.json();
      if (errorData.error) {
        // Aquí puedes manejar diferentes tipos de errores
        setError(errorData.error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-[500px] space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Registro</h1>
        <form onSubmit={registrar}>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Correo electrónico"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border mt-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          {error && <p className="text-red-600 mt-2">{error}</p>}

          <button className="bg-blue-400 w-full mt-4 py-2 rounded-sm">
            Registrarme
          </button>
        </form>
        <div className="mt-4 text-left">
          <span className="font-bold">¿Ya tienes una cuenta?</span>
          <Link
            to="/login"
            className="font-bold text-blue-500 hover:underline ml-1"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;
