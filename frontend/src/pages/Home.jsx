import UserList from "../components/UserList";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
      {/* Header con logo y descripción */}
      <div className="text-center max-w-2xl mb-10">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-600 p-3 rounded-lg shadow-md">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Sakila Movie Rentals
        </h1>
        
        <p className="text-lg text-gray-600 leading-relaxed">
          Selecciona tu perfil de usuario para comenzar a explorar nuestro catálogo 
          de películas. Disfruta de alquileres instantáneos y descubre los últimos 
          éxitos cinematográficos.
        </p>
      </div>
      
      {/* Tarjeta de selección de usuario */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            Selecciona tu usuario
          </h2>
        </div>
        
        <div className="p-6">
          <UserList />
          
          <div className="mt-6 text-center">
          </div>
        </div>
      </div>
      
      {/* Footer simple */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Sakila Movies. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Home;