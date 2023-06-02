import { Notyf } from "notyf";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FormularioLogin() {
  interface Usuario {
    id: number;
    nombre: string;
    correo_electronico: string;
    contrasena: string;
    ultima_leccion_vista: number;
    imagen_url: string;
    admin: boolean;
  }

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navegar = useNavigate();
  const notyf = new Notyf();
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

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
    if (Object.keys(usuario).length === 0) {
      navegar("/login");
    }
  }, [navegar, usuario]);

  const manejarEnvio = async (e: any) => {
    e.preventDefault();
    if (nombreUsuario === "admin" && contrasena === "passworddeladmin") {
      // Guarda el objeto de usuario con la propiedad admin
      const usuarioAdmin = {
        ...usuario, // Esto mantiene todas las propiedades existentes del usuario
        admin: true, // Añadimos la propiedad admin
      };

      // Guarda el objeto de usuario en el almacenamiento local
      localStorage.setItem("user", JSON.stringify(usuarioAdmin));
      navegar("/paneladministracion");
    } else {
      notyf.error("Nombre de usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicio de sesión de administrador
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={manejarEnvio}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nombreUsuario" className="sr-only">
                Nombre de usuario
              </label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
              />
            </div>
            <div>
              <label htmlFor="contrasena" className="sr-only">
                Contraseña
              </label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md "
              onClick={manejarEnvio}
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioLogin;
