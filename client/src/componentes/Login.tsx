import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const clientId =
  "328797629300-rk5fh38vfl6eqsnd2sf0c52n58qbbapa.apps.googleusercontent.com";

const Login = ({ setUser }: { setUser: (user: any) => void }) => {
  const [correo_electronico, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

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
        const data = await respuesta.json();

        setUser(data.user); // Actualizar el estado del usuario
        navigate("/"); // Navegar a la página de inicio
      } else {
        console.error("Error al iniciar sesión");
      }
    } catch (error) {
      // Manejar el error de red
      console.error("Error de red al iniciar sesión:", error);
    }
  };

  const handleGoogleAuthSuccess = (response: any) => {
    if (response.error) {
      console.log("Error al iniciar sesión con Google");
      return;
    }
    console.log("Inicio de sesión con Google exitoso");
    setUser(response.profileObj); // Actualizar el estado del usuario
    navigate("/"); // Navegar a la página de inicio
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-[500px] space-y-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            Iniciar sesión
          </h1>
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

          <button
            className="w-full bg-green-600 py-2 text-white rounded-sm"
            onClick={handleLogin}
          >
            Iniciar sesión
          </button>
          <GoogleLogin
            className="w-full justify-center rounded-sm"
            clientId={clientId}
            onSuccess={handleGoogleAuthSuccess}
            onFailure={handleGoogleAuthSuccess}
            cookiePolicy={"single_host_origin"}
            isSignedIn={false}
          />
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
    </GoogleOAuthProvider>
  );
};

export default Login;
