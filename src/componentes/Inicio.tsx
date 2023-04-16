import React, { useState } from "react";
import logo from "../assets/spring-logo.png";
import { Fade } from "react-awesome-reveal";
import { Link as RouterLink } from "react-router-dom";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCursoClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/curso");
    }, 5000);
  };

  return (
    <Fade triggerOnce={false} duration={3000}>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
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
            <p className="text-center text-2xl md:text-4xl text-black font-poppins ">
              Aprende <strong>SpringBoot</strong>
              <br />
              gratis y de forma práctica
            </p>
            <div className="flex justify-center mt-10">
              <button
                className="border-2 rounded-full px-8 py-4 bg-green-400 border-transparent"
                onClick={handleCursoClick}
              >
                ¡Empezar Curso!
              </button>
            </div>
          </div>
        </div>
      )}
    </Fade>
  );
};

export default Inicio;
