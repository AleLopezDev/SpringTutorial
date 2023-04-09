import React from "react";
import "../cssPersonalizado/curso.css";

const PaginaCurso = () => {
  return (
    <div>
      <div className="space-y-8 md:ml-80 md: my-20 ">
        {/* Introducción */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700 text-green-700">
            Introducción
          </h3>
          <div className="md:ml-4">
            <ul className="list-decimal list-inside">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Historia y evolución de Spring Boot
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Ventajas y características principales
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Ecosistema Spring
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Arquitectura de una aplicación Spring Boot
              </li>
            </ul>
          </div>
        </div>

        {/* Test Introducción */}
        <div>
          <h2 className="text-xl font-bold md:my-3 ">Test Introducción</h2>
          {/* Preguntas y respuestas del test */}
        </div>

        {/* Primeros pasos */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700">
            Primeros pasos
          </h3>
          <div className="md:ml-4">
            <ul className="list-decimal list-inside">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Instalación y configuración del entorno de desarrollo
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Creación de un proyecto Spring Boot
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Estructura de un proyecto Spring Boot
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Spring Initializr
              </li>
            </ul>
          </div>
        </div>

        {/* Test Primeros pasos */}
        <div>
          <h2 className="text-xl font-bold md:my-3 ">Test Primeros pasos</h2>
          {/* Preguntas y respuestas del test */}
        </div>

        {/* Fundamentos */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700">
            Fundamentos
          </h3>
          <div className="md:ml-4">
            <ul className="list-decimal list-inside ">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Inyección de dependencias y contenedor Spring
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Anotaciones principales
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Configuración de la aplicación
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Perfiles de configuración
              </li>
            </ul>
          </div>
        </div>

        {/* Test Fundamentos */}
        <div>
          <h2 className="text-xl font-bold md:my-3 ">Test Fundamentos</h2>
          {/* Preguntas y respuestas del test */}
        </div>

        {/* Desarrollo web */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700">
            Desarrollo web
          </h3>
          <div className="md:ml-4">
            <ul className="list-decimal list-inside">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Controladores y mapeo de solicitudes
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Plantillas (Thymeleaf, etc.)
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Validación de datos y manejo de errores
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Sesiones y autenticación
              </li>
            </ul>
          </div>
        </div>

        {/* Test Desarrollo web */}
        <div>
          <h2 className="text-xl font-bold md:my-3 ">Test Desarrollo web</h2>
          {/* Preguntas y respuestas del test */}
        </div>

        {/* Acceso a datos */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700">
            Acceso a datos
          </h3>
          <div className="md:ml-4">
            <ul className="list-decimal list-inside">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Spring Data JPA
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Repositorios y operaciones CRUD
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Configuración y uso de bases de datos
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Consultas personalizadas y paginación
              </li>
            </ul>
          </div>
        </div>
        {/* Test Acceso a datos */}
        <div>
          <h2 className="text-xl font-bold">Test Acceso a datos</h2>
          {/* Preguntas y respuestas del test */}
        </div>

        {/* APIs REST */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700">
            APIs REST
          </h3>
          <div className="md:ml-4">
            <ul className="list-decimal list-inside">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Principios de las APIs REST
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Creación de controladores REST
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Serialización y deserialización de objetos
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Seguridad y autenticación en APIs REST
              </li>
            </ul>
          </div>
        </div>

        {/* Test APIs REST */}
        <div>
          <h2 className="text-xl font-bold">Test APIs REST</h2>
          {/* Preguntas y respuestas del test */}
        </div>

        {/* Pruebas */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700">Pruebas</h3>
          <div className="md:ml-4">
            <ul className="list-decimal list-inside">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Pruebas unitarias
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Pruebas de integración
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Mockito y JUnit
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Pruebas de controladores y servicios
              </li>
            </ul>
          </div>
        </div>

        {/* Test Pruebas */}
        <div>
          <h2 className="text-xl font-bold">Test Pruebas</h2>
          {/* Preguntas y respuestas del test */}
        </div>

        {/* Seguridad */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700">
            Seguridad
          </h3>
          <div className="md:ml-4">
            <ul className="list-decimal list-inside">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Spring Security
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Autenticación y autorización
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Protección contra ataques comunes (CSRF, XSS, etc.)
              </li>
            </ul>
          </div>
        </div>

        {/* Test Seguridad */}
        <div>
          <h2 className="text-xl font-bold">Test Seguridad</h2>
          {/* Preguntas y respuestas del test */}
        </div>

        {/* Implementación y despliegue */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700">
            Implementación y despliegue
          </h3>

          <ul className="list-decimal list-inside">
            <div className="md:ml-4">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Empaquetado y despliegue
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Despliegue en servidores locales y en la nube
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Monitorización y mantenimiento de aplicaciones en producción
              </li>
            </div>
          </ul>
        </div>

        {/* Test Implementación y despliegue */}
        <div>
          <h2 className="text-xl font-bold">
            Test Implementación y despliegue
          </h2>
          {/* Preguntas y respuestas del test */}
        </div>

        {/* Temas avanzados y buenas prácticas */}
        <div>
          <h3 className="text-2xl font-bold md:my-3 text-green-700">
            Temas avanzados y buenas prácticas
          </h3>
          <div className="md:ml-4">
            <ul className="list-decimal list-inside">
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Caching
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Programación reactiva con Spring WebFlux
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Integración con otros servicios y bibliotecas (por ejemplo,
                mensajería, búsqueda, etc.)
              </li>
              <li className="border border-gray-3 00 rounded p-2 md:w-[1000px] my-1">
                Patrones de diseño y arquitectura en aplicaciones Spring Boot
              </li>
            </ul>
          </div>
        </div>

        {/* Test Temas avanzados y buenas prácticas */}
        <div>
          <h2 className="text-xl font-bold">
            Test Temas avanzados y buenas prácticas
          </h2>
          {/* Preguntas y respuestas del test */}
        </div>
      </div>
    </div>
  );
};

export default PaginaCurso;
