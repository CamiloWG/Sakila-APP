// src/components/rental/MovieSelection.jsx
const MovieSelection = ({ movies = [], selectedMovie, onSelectMovie }) => {
    if (!Array.isArray(movies) || movies.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No hay películas disponibles
        </div>
      );
    }
  
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Películas Disponibles
        </label>
        <div className="grid grid-cols-1 gap-3">
          {movies.map((movie) => (
            <div
              key={movie.film_id}
              onClick={() => onSelectMovie(movie)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMovie?.film_id === movie.film_id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{movie.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {movie.description}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>{movie.release_year}</span>
                    <span className="mx-2">•</span>
                    <span>{movie.rating}</span>
                  </div>
                </div>
                <span className="font-medium text-gray-900">
                  ${movie.rental_rate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default MovieSelection;