import "./App.css";
import Login from "./componentes/Login";
import Navbar from "./componentes/Navbar";
import Infospring from "./componentes/Infospring";
import Paginaprincipal from "./componentes/Inicio";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
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

  return (
    <Router>
      {/* Pasamos al usuario como parametro*/}
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Paginaprincipal />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
      <Infospring />
    </Router>
  );
}

export default App;
