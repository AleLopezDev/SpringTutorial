import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const Perfil = ({ user }: { user: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user ? user.name : "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const saveChanges = () => {
    if (user) {
      user.name = editedName;
      localStorage.setItem("user", JSON.stringify(user));
    }
    setIsEditing(false);
    window.location.reload();
  };

  const cancelChanges = () => {
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <h1>Por favor, inicie sesión para ver su perfil</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-[500px] space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Mi perfil</h1>
        <img
          src={user.imageUrl}
          alt={user.name}
          className="w-24 h-24 rounded-full mx-auto"
        />
        <div className="text-center">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={handleNameChange}
              className="text-xl font-bold text-center w-full"
            />
          ) : (
            <div className="flex justify-center items-center">
              <h2 className="text-xl font-bold text-center">{user.name}</h2>
              <FontAwesomeIcon
                icon={faPencil}
                className="ml-2 text-blue-600 cursor-pointer"
                onClick={() => setIsEditing(true)}
              />
            </div>
          )}
          <p className="text-center">{user.email}</p>
          {/* Aquí puedes agregar más información sobre el usuario */}
          {isEditing && (
            <div className="flex justify-between mt-5">
              <button
                className="bg-green-600 py-2 text-white w-1/2 mr-2 rounded-md"
                onClick={saveChanges}
              >
                Guardar
              </button>
              <button
                className="bg-red-600 py-2 text-white w-1/2 ml-2 rounded-md"
                onClick={cancelChanges}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
