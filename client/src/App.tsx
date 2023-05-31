import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import Creador from "componentes/Creador";
import AcercaDe from "componentes/AcercaDe";
import Perfil from "componentes/Perfil";
import Registro from "componentes/Registro";
import LeccionPagina from "componentes/LeccionPagina";
import NotFound from "componentes/NotFound";
import FAQ from "componentes/FAQ";
import Examen from "componentes/ExamenComponente";
import Admin from "componentes/Administracion/Admin";

const Navbar = lazy(() => import("./componentes/Navbar"));
const Login = lazy(() => import("./componentes/Login"));
const Infospring = lazy(() => import("./componentes/Infospring"));
const PaginaCurso = lazy(() => import("./componentes/PaginaCurso"));
const Paginaprincipal = lazy(() => import("./componentes/Inicio"));

function App() {
  const [user, setUser] = useState<any>(null);

  // Carga inicial del usuario desde localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Actualización de localStorage cuando cambia el estado del usuario
  useEffect(() => {
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
          <Creador />
          <AcercaDe />
        </Suspense>
      </>
    );
  };

  return (
    <Router>
      {/* Configuracion de Rutas */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <UseAnimations animation={loading} size={56} />
            <br />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar user={user} />
                <InicioConInfospring />
              </>
            }
          />
          <Route
            path="/curso"
            element={
              <>
                <Navbar user={user} />
                <PaginaCurso />
              </>
            }
          />
          <Route
            path="/perfil"
            element={
              <>
                <Navbar user={user} />
                <Perfil user={user} />
              </>
            }
          />
          <Route
            path="/leccion/:id"
            element={
              <>
                <LeccionPagina />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar user={user} />
                <Login />
              </>
            }
          />
          <Route
            path="/registro"
            element={
              <>
                <Navbar user={user} />
                <Registro />
              </>
            }
          />
          <Route
            path="/FAQ"
            element={
              <>
                <Navbar user={user} />
                <FAQ />
              </>
            }
          />
          <Route path="/examen/:id" element={<Examen />} />
          <Route path="/paneladministración" element={<Admin />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
