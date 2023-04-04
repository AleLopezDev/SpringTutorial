import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

/* Definimo un parametro llamado user de tipo any, esta esperando recibir el objeto user */
const Navbar = ({ user }: { user: any }) => {
  return (
    <nav className="bg-black px-4 flex justify-between items-center font-poppins py-4 lg:py-7">
      <div className="flex items-center md:ml-5 lg:ml-10">
        <FontAwesomeIcon icon={faLeaf} className="text-green-500 text-lg " />
        <div className="text-white text-sm md:text-base lg:text-lg ml-2 md:ml-3">
          Aprende Spring Boot
        </div>
      </div>
      <ul className="hidden lg:flex lg:gap-4 lg:items-center">
        <li>
          <a
            href="#acerca-de"
            className="text-white font-poppins py-4 px-6 transition-colors border-transparent hover:text-green-500 hover:border-green-500 hover:border-2 hover:border-solid duration-700"
          >
            Acerca de
          </a>
        </li>
        <li>
          <RouterLink to="/">
            <span className="text-white py-4 px-6 transition-colors duration-700 hover:text-green-500 hover:border-green-500 hover:border-2 hover:border-solid">
              Inicio
            </span>
          </RouterLink>
        </li>
        <li>
          <Link
            activeClass="active"
            to="info"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="text-white text-base py-4 px-6 transition-colors duration-700 hover:text-green-500 hover:border-green-500 hover:border-2 hover:border-solid cursor-pointer "
          >
            ¿Que es Spring Boot?
          </Link>
        </li>
        <li>
          <Link
            activeClass="active"
            to="contacto"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="text-white text-base py-4 px-6 transition-colors duration-700 hover:text-green-500 hover:border-green-500 hover:border-2 hover:border-solid cursor-pointer "
          >
            Creador
          </Link>
        </li>
      </ul>

      {/* Si el usuario es nulo */}
      {!user ? (
        <div className="flex items-center md:mr-5 lg:mr-10">
          <RouterLink
            to="/login"
            className="text-white text-sm md:text-lg hover:text-green-500 transition-colors duration-300"
          >
            <FontAwesomeIcon
              icon={faUser}
              className="mr-1 md:mr-2 text-green-500"
            />
            Iniciar sesión
          </RouterLink>
          <FontAwesomeIcon
            icon={faBars}
            className="text-white text-lg ml-4 cursor-pointer lg:hidden"
          />
        </div>
      ) : (
        <div className="flex items-center space-x-4  md:mr-12">
          <img
            src={user.imageUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="text-white">{user.name}</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;