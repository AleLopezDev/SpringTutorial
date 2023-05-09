import React from "react";

const Creador = () => {
  return (
    <div className="flex flex-col items-center mt-56 md:mt-[350px] text-center">
      <strong className="font-poppins text-4xl mx-auto">
        <p className="">¿ Quien soy ?</p>
      </strong>

      <div className="flex w-full justify-center mt-8">
        {/* Contenedor Imagen */}
        <div className="w-1/2 p-4">
          <img
            src="URL_DE_IMAGEN" // Reemplaza con la URL de la imagen que deseas mostrar
            alt="Descripción de la imagen" // Reemplaza con la descripción de la imagen
            className="w-full h-auto"
          />
        </div>

        {/* Contenedor Texto */}
        <div className="w-1/2 p-4">
          <p className="text-lg leading-relaxed">
            Aquí va el texto que quieres mostrar a la derecha de la imagen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Creador;
