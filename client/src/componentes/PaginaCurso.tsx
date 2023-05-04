import React, { useState, useEffect } from "react";
import axios from "axios";

interface Seccion {
  id: number;
  nombre: string;
}

interface Leccion {
  id: number;
  seccion_id: number;
  nombre: string;
  video_url: string;
}

const PaginaCurso = () => {
  const [videoSeleccionado, setVideoSeleccionado] = useState<string | null>();
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [lecciones, setLecciones] = useState<Leccion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seccionesResponse = await axios.get<Seccion[]>(
          "http://localhost:5001/api/secciones"
        );
        setSecciones(seccionesResponse.data);

        const leccionesResponse = await axios.get<Leccion[]>(
          "http://localhost:5001/api/lecciones"
        );
        setLecciones(leccionesResponse.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleLeccionClick = (videoUrl: string) => {
    alert("Lección seleccionada: " + videoUrl);
    setVideoSeleccionado(videoUrl);
  };

  return (
    <div>
      {/* ... */}
      <div className="space-y-8 md:ml-80 md:my-20">
        {secciones.map((seccion) => (
          <div key={seccion.id}>
            <h3 className="text-2xl font-bold md:my-3 text-green-700">
              {seccion.nombre}
            </h3>
            <div className="md:ml-4">
              <ul className="list-decimal list-inside">
                {lecciones
                  .filter((leccion) => leccion.seccion_id === seccion.id)
                  .map((leccion) => (
                    <li
                      key={leccion.id}
                      className="border border-gray-300 rounded p-2 md:w-[1000px] my-1"
                      onClick={() => handleLeccionClick(leccion.video_url)}
                    >
                      {leccion.nombre}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}

        {videoSeleccionado && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div
              className="bg-black bg-opacity-50 w-full h-full absolute"
              onClick={() => setVideoSeleccionado(null)}
            ></div>
            <video
              src={videoSeleccionado}
              controls
              autoPlay
              className="z-10"
            ></video>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaCurso;
