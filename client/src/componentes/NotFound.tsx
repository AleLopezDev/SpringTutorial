const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-700 mb-2">404</h1>
        <h2 className="text-2xl text-gray-500 mb-6">Página no encontrada</h2>
        <a href="/" className="text-blue-500 hover:underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
