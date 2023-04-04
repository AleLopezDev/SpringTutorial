import React from "react";
import logo from "../assets/spring-logo.png";
import { Fade } from "react-awesome-reveal";
import { comenzarCurso } from "../funciones/comenzarCurso";

const Inicio = () => {
  return (
    <Fade triggerOnce={false} duration={3000}>
      <div>
        <div
          id="inicio"
          className="flex-col items-center justify-center mt-52 mx-auto"
        >
          <img
            src={logo}
            className="mt-32 w-[200px] mx-auto"
            width="200"
            alt="Logo"
            height="200"
          />
          <p className="text-center text-4xl text-black font-poppins">
            Aprende <strong>SpringBoot</strong>
            <br />
            gratis y de forma práctica
          </p>
          <div className="flex justify-center mt-10">
            <button
              onClick={comenzarCurso}
              className="border-2 rounded-full px-8 py-4 bg-green-400 border-transparent"
            >
              ! Empezar Curso !
            </button>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Inicio;