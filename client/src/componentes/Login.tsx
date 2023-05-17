import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [correo_electronico, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [errorMensaje, setErrorMensaje] = useState("");

  const handleEmailChange = (event: any) => {
    setCorreo(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setContrasena(event.target.value);
  };

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const respuesta = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo_electronico, contrasena }),
      });

      if (respuesta.ok) {
        const { token, user } = await respuesta.json();

        // Guarda el token de autenticación en el almacenamiento local
        localStorage.setItem("token", token);

        // Fusiona la información del usuario existente con la información del usuario de la API
        const datosUsuario = {
          ...user,
          name: user.nombre,
          email: user.correo_electronico,
          id: user.id,
        };

        localStorage.setItem("user", JSON.stringify(datosUsuario));
        navigate("/"); // Navegar a la página de inicio
        window.location.reload();
      } else {
        // Establecer el mensaje de error según el código de estado de la respuesta
        if (respuesta.status === 401) {
          setErrorMensaje("Contraseña incorrecta");
        } else if (respuesta.status === 404) {
          setErrorMensaje("Usuario no encontrado");
        } else {
          setErrorMensaje("Error al iniciar sesión");
        }
      }
    } catch (error) {
      // Manejar el error de red
      console.error("Error de red al iniciar sesión:", error);
      setErrorMensaje("Error de red al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-[500px] space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h1>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          type="text"
          placeholder="Correo electrónico"
          onChange={handleEmailChange}
        />
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          type="password"
          placeholder="Contraseña"
          onChange={handlePasswordChange}
        />
        {errorMensaje && (
          <div className="text-red-500 text-left mb-2">{errorMensaje}</div>
        )}
        <button
          className="w-full bg-green-600 py-2 text-white rounded-sm"
          onClick={handleLogin}
        >
          Iniciar sesión
        </button>

        <div className="mt-4 text-left">
          <span className="font-bold">¿No tienes una cuenta?</span>
          <Link
            to="/registro"
            className="font-bold text-blue-500 hover:underline ml-1"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
