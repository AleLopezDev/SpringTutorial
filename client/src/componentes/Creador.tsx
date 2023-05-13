import React from "react";
import yoImage from "../assets/yo.jpeg";

const Creador = () => {
  return (
    <div className="flex flex-col items-center mt-80 md:mt-[350px] text-center">
      <strong className="font-poppins text-4xl mx-auto">
        <p className="">¿ Quien soy ?</p>
      </strong>

      <div className="flex flex-col lg:flex-row w-full justify-center lg:mt-24">
        {/* Contenedor Imagen */}
        <div className="w-full lg:w-2/5 py-4">
          <img
            src={yoImage}
            alt="Imagen de Alejandro"
            className="w-[250px] h-[320px] rounded-lg md:w-[430px] md:h-[550px] md:rounded-lg mx-auto my-auto object-cover"
          />
        </div>

        {/* Contenedor Texto */}
        <div className="w-full lg:w-[400px] py-4 ">
          <p className="text-lg leading-relaxed lg:max-w-[400px] mx-auto my-auto">
            ¡Hola! Soy Alejandro, tengo 20 años y actualmente vivo en Málaga,
            España. Soy un gran apasionado de la informática y estudio en el
            Colegio San José. Me encanta explorar nuevas tecnologías y aprender
            más sobre ellas, estoy muy ilusionado de ver lo que el futuro nos
            depara en el mundo de la tecnología. Aparte de mi pasión por la
            informática, también disfruto jugando al fútbol y otros deportes de
            equipo. Me encanta la emoción de la competición y trabajar con mis
            compañeros de equipo para lograr metas juntos. Siempre he encontrado
            que los deportes de equipo me ayudan a desarrollar habilidades
            importantes como la comunicación, el liderazgo y el trabajo en
            equipo. En general, diría que soy una persona comprometida y
            apasionada en lo que hago, tanto en mis estudios como en mis
            actividades deportivas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Creador;
