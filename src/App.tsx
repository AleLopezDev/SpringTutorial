import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { gapi } from "gapi-script";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

const clientId =
  "328797629300-rk5fh38vfl6eqsnd2sf0c52n58qbbapa.apps.googleusercontent.com";

const Navbar = lazy(() => import("./componentes/Navbar"));
const Login = lazy(() => import("./componentes/Login"));
const Infospring = lazy(() => import("./componentes/Infospring"));
const PaginaCurso = lazy(() => import("./componentes/PaginaCurso"));
const Paginaprincipal = lazy(() => import("./componentes/Inicio"));

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

  const InicioConInfospring = () => {
    return (
      <>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <UseAnimations animation={loading} size={56} />
              <br />
            </div>
          }
        >
          <Paginaprincipal />
          <Infospring />
        </Suspense>
      </>
    );
  };

  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <UseAnimations animation={loading} size={56} />
            <br />
          </div>
        }
      >
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<InicioConInfospring />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/curso" element={<PaginaCurso />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
