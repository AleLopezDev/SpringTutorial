import React from "react";

const AcercaDe = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-80 bg-white mb-40">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl sm:leading-9 lg:text-4xl">
        Acerca De
      </h2>
      <hr className="w-2/3 mt-4 border-gray-400" />
      <div className="mt-8 text-center">
        <p className="text-base leading-6 text-gray-500">
          Este es un proyecto de final de ciclo realizado por Alejandro López
          Aguilar para el Colegio San José.
        </p>
      </div>
    </div>
  );
};

export default AcercaDe;
