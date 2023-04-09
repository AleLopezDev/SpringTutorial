import "./App.css";
import Login from "./componentes/Login";
import Navbar from "./componentes/Navbar";
import Infospring from "./componentes/Infospring";
import Paginaprincipal from "./componentes/Inicio";
import PaginaCurso from "./componentes/PaginaCurso";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const clientId =
  "328797629300-rk5fh38vfl6eqsnd2sf0c52n58qbbapa.apps.googleusercontent.com";

function App() {
  /* Permitir inicio de sesion en google*/
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  });
  /* */

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verifica si hay información de usuario en localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Guarda la información de usuario en localStorage cuando cambia el estado del usuario

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Crea un nuevo componente que incluye Paginaprincipal e Infospring
  const InicioConInfospring = () => {
    return (
      <>
        <Paginaprincipal />
        <Infospring />
      </>
    );
  };

  return (
    <Router>
      {/* Pasamos al usuario como parametro*/}
      <Navbar user={user} />
      <Routes>
        {/* Utiliza el nuevo componente en la ruta raíz */}
        <Route path="/" element={<InicioConInfospring />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/curso" element={<PaginaCurso />} />
      </Routes>
    </Router>
  );
}

export default App;
