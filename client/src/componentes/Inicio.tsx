import React, { useEffect, useState } from "react";
import logo from "../assets/spring-logo.png";
import { Fade } from "react-awesome-reveal";
import { Link as RouterLink } from "react-router-dom";

const Inicio = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usuario = localStorage.getItem("user");
    if (usuario) {
      setUser(JSON.parse(usuario));
    }
  }, []);

  return (
    <Fade triggerOnce={false} duration={3000}>
      <div className="">
        <div
          id="inicio"
          className=" flex-col items-center justify-center mt-64 mx-auto"
        >
          <img
            src={logo}
            className="mt-32 w-[200px] mx-auto"
            width="200"
            alt="Logo"
            height="200"
          />
          <p className="text-center text-2xl md:text-4xl  font-poppins ">
            Aprende <strong>SpringBoot</strong>
            <br />
            gratis y de forma práctica
          </p>
          <div className="flex justify-center mt-10">
            <RouterLink to="/curso">
              <button className="border-2 rounded-full px-8 py-4 bg-green-400 border-transparent">
                {user ? "¡ Continuar Curso !" : "¡ Empezar Curso !"}
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Inicio;
