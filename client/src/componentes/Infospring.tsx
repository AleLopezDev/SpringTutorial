import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";

const Infospring = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <Fade triggerOnce={false} duration={2000}>
      <div className="flex flex-initial  mt-56 md:mt-[350px] text-center">
        <strong className="font-poppins text-4xl mx-auto">
          <p className="">¿ Por qué Spring ?</p>
        </strong>
      </div>

      <div id="info" className="flex justify-center mt-20 mb-[100px] ">
        {/* Contenedor columnas */}
        <div className="flex flex-col">
          {/* Primera Linea */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 justify-center">
            {/* Primera tarjeta */}
            <div
              onMouseEnter={handleHover}
              onMouseLeave={handleHover}
              className="px-8 py-4 border-[1px] mx-auto max-w-[340px]"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/7991/7991055.png"
                className="w-[85px] h-[85px] mb-4 mt-4 mx-auto block"
                alt="Primera tarjeta"
              />
              <strong className={isHovered ? "text-green-700" : ""}>
                {" "}
                <p className="text-2xl text-center">MicroServicios</p>
                <br />
              </strong>
              <p className="text-center">
                Ofrezca rápidamente funciones de nivel de producción con
                microservicios evolutivos <br />
                independientes.
              </p>
            </div>

            {/* Segunda tarjeta */}
            <div className="px-8 py-4 border-[1px] mx-auto max-w-[340px]">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3334/3334886.png"
                className="w-[85px] h-[85px] mb-4 mt-4 mx-auto block"
                alt="Segunda tarjeta"
              />
              <strong>
                {" "}
                <p className="text-2xl text-center">Reactive</p>
                <br />
              </strong>
              <p className="text-center whitespace-pre-line">
                La arquitectura asíncrona y no bloqueante de Spring le permite
                sacar más partido a sus recursos <br />
                informáticos.
              </p>
            </div>

            {/* Tercera tarjeta */}
            <div className="px-8 py-4 border-[1px] mx-auto max-w-[340px]">
              <img
                src="https://cdn-icons-png.flaticon.com/128/2282/2282188.png"
                className="w-[85px] h-[85px] mb-4 mt-4 mx-auto block"
                alt="Tercera tarjeta"
              />
              <strong>
                {" "}
                <p className="text-2xl text-center">Desarrollo rápido</p>
                <br />
              </strong>
              <p className="text-center">
                Facilita la creación rápida de aplicaciones web con herramientas
                y características
                <br />
                integradas
              </p>
            </div>

            {/* Cuarta tarjeta */}
            <div className="px-8 py-4 border-[1px] mx-auto max-w-[340px]">
              <img
                src="https://cdn-icons-png.flaticon.com/128/1927/1927746.png"
                className="w-[85px] h-[85px] mb-4 mt-4 mx-auto block"
                alt="Cuarta tarjeta"
              />
              <strong>
                {" "}
                <p className="text-2xl text-center">Aplicaciones Web</p>
                <br />
              </strong>
              <p className="text-center">
                Frameworks para aplicaciones web rápidas, seguras y con
                capacidad de respuesta conectadas a cualquier almacén de <br />{" "}
                datos.
              </p>
            </div>
          </div>

          {/* Segunda Linea */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 justify-center mx-auto">
            {/* Primera tarjeta */}
            <div className="px-8 py-4 border-[1px] mx-auto max-w-[340px] lg:col-span-1">
              <img
                src="https://cdn-icons-png.flaticon.com/128/1161/1161388.png"
                className="w-[85px] h-[85px] mb-4 mt-4 mx-auto block"
                alt="Quinta tarjeta"
              />
              <strong>
                {" "}
                <p className="text-2xl text-center">Seguridad</p>
                <br />
              </strong>
              <p className="text-center">
                Ofrece características de seguridad avanzadas, como
                autenticación y autorización, protegiendo las aplicaciones de
                ataques <br />
                malintencionados
              </p>
            </div>

            {/* Segunda tarjeta */}
            <div className="px-8 py-4 border-[1px] mx-auto max-w-[340px] lg:col-span-1">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3374/3374237.png"
                className="w-[85px] h-[85px] mb-4 mt-4 mx-auto block"
                alt="Sexta tarjeta"
              />
              <strong>
                {" "}
                <p className="text-2xl text-center">Escalabilidad</p>
                <br />
              </strong>
              <p className="text-center">
                Permite la creación de aplicaciones escalables y altamente
                disponibles mediante la provisión de herramientas y
                características para la gestión de <br />
                carga
              </p>
            </div>

            {/* Tercera tarjeta */}
            <div className="px-8 py-4 border-[1px] mx-auto max-w-[340px] lg:col-span-1">
              <img
                src="https://cdn-icons-png.flaticon.com/128/1541/1541416.png"
                className="w-[85px] h-[85px] mb-4 mt-4 mx-auto block"
                alt="Septima tarjeta"
              />
              <strong>
                {" "}
                <p className="text-2xl text-center">Integración</p>
                <br />
              </strong>
              <p className="text-center">
                Integración sencilla con diferentes componentes de la
                aplicación, como bases de datos, herramientas de construcción y
                marcos de <br />
                trabajo
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Infospring;
