// src/pages/MovieRental.jsx
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRental } from "../hooks/useRental";
import MovieSelection from "../components/rental/MovieSelection";
import DateSelection from "../components/rental/DateSelection";
import RentalSummary from "../components/rental/RentalSummary";
import { useNavigate } from 'react-router-dom';
import { getAvailableMovies } from "../services/api";

const MovieRental = () => {
  const navigate = useNavigate();
  const { selectedUser } = useUser();
  const { submitRental, isSubmitting, error, success, reset } = useRental();
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dates, setDates] = useState({
    rentalDate: "",
    returnDate: "",
  });
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        const data = await getAvailableMovies();
        
        // Verifica que la respuesta sea un array
        if (!Array.isArray(data)) {
          throw new Error("La API no devolvió un array de películas");
        }
        
        setMovies(data);
      } catch (err) {
        console.error("Error loading films:", err);
        setApiError(err.response?.data?.message || 
                   "No se pudieron cargar las películas. Intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const handleDateChange = (field, value) => {
    setDates((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMovie || !dates.rentalDate || !dates.returnDate) return;

    const rentalData = {
      rental_date: new Date(dates.rentalDate).toISOString(),
      customer_id: selectedUser.customer_id,
      return_date: new Date(dates.returnDate).toISOString(),
      film_id: selectedMovie.film_id,
    };

    try {
      await submitRental(rentalData);
    } catch (err) {
      console.error("Error submitting rental:", err);
    }
  };

  if (!selectedUser || !selectedUser.customer_id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">
          Por favor selecciona un usuario primero
        </h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Seleccionar Usuario
        </button>
      </div>
    );
  }

  return (
    
    <div className="bg-[#9790e4] full-w ">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Encabezado con info del usuario */}
          <div className="bg-[#555b93] px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-xl">
                  {selectedUser.first_name?.charAt(0) || "U"}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium text-white">
                    Renta de Película
                  </h2>
                  <p className="text-indigo-100">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/rentals")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Ver mis rentas
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6">
            {apiError ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{apiError}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  ¡Renta exitosa!
                </h3>
                <p className="text-green-600">
                  {selectedMovie.title} ha sido rentada por{" "}
                  {selectedUser.first_name}.
                </p>
                <button
                  onClick={reset}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Hacer otra renta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <MovieSelection
                      movies={movies}
                      selectedMovie={selectedMovie}
                      onSelectMovie={setSelectedMovie}
                    />
                  )}

                  <DateSelection
                    rentalDate={dates.rentalDate}
                    returnDate={dates.returnDate}
                    onDateChange={handleDateChange}
                  />

                  {selectedMovie && (
                    <RentalSummary
                      movie={selectedMovie}
                      rentalDate={dates.rentalDate}
                      returnDate={dates.returnDate}
                      rentalRate={selectedMovie.rental_rate}
                    />
                  )}

                  {error && (
                    <div className="text-red-600 text-sm mt-2">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      !selectedMovie ||
                      !dates.rentalDate ||
                      !dates.returnDate ||
                      isSubmitting
                    }
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      (!selectedMovie ||
                        !dates.rentalDate ||
                        !dates.returnDate ||
                        isSubmitting) &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </>
                    ) : "Confirmar Renta"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieRental;