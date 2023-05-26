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
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(correoElectronico) // Comprobar que el correo electrónico tenga un formato válido
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

    const respuesta = await fetch("http://localhost:5001/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        correo_electronico: correoElectronico,
        contrasena,
        imagen_url: "https://vestal-parenthesis.000webhostapp.com/user.png",
      }),
    });

    if (respuesta.ok) {
      const { token, user } = await respuesta.json();

      // Guarda el token de autenticación en el almacenamiento local
      localStorage.setItem("token", token);

      const userObject = {
        ...user,
        name: nombre,
        email: correoElectronico,
        imageUrl: "https://vestal-parenthesis.000webhostapp.com/user.png",
      };

      localStorage.setItem("user", JSON.stringify(userObject));

      // Navegar a la página de inicio
      navigate("/");
      window.location.reload();
    } else {
      if (respuesta.status === 400) {
        setError("El correo electrónico ya está registrado.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-[500px] space-y-4">
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
