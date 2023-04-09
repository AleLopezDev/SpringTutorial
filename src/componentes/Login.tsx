import React, { useState, useEffect } from "react";

import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import Alert from "react-daisyui/dist/Alert";

const clientId =
  "328797629300-rk5fh38vfl6eqsnd2sf0c52n58qbbapa.apps.googleusercontent.com";

const Login = ({ setUser }: { setUser: (user: any) => void }) => {
  const navigate = useNavigate();

  const handleGoogleAuthSuccess = (response: any) => {
    if (response.error) {
      console.log("Error al iniciar sesión con Google");
      return;
    }
    console.log("Inicio de sesión con Google exitoso");
    setUser(response.profileObj); // Actualizar el estado del usuario
    navigate("/"); // Navegar a la página de inicio
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState(null);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-[500px] space-y-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            Iniciar sesión
          </h1>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Correo electrónico"
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="password"
            placeholder="Contraseña"
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-900 transition-colors"
            type="submit"
            onClick={() => {
              <Alert
                status="warning"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 mx-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                }
              >
                Lorem ipsum dolor sit amet, consectetur adip!
              </Alert>;
            }}
          >
            Iniciar sesión
          </button>

          <GoogleLogin
            className="w-full justify-center"
            clientId={clientId}
            onSuccess={handleGoogleAuthSuccess}
            onFailure={handleGoogleAuthSuccess}
            cookiePolicy={"single_host_origin"}
            isSignedIn={false}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
