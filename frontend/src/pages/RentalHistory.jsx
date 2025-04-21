import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getCustomerRentals, getFilmDetails, deleteRental } from '../services/api';

const RentalHistory = () => {
  const { selectedUser } = useUser();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    // En lugar de hacer una llamada por cada película, puedes:
const fetchRentals = async () => {
  if (!selectedUser?.customer_id) return;

  try {
    setIsLoading(true);
    setError(null);
    
    // 1. Primero obtén todas las rentas
    const rentalsData = await getCustomerRentals(selectedUser.customer_id);
    
    // 2. Obtén todos los IDs de películas únicas
    const filmIds = [...new Set(rentalsData.map(rental => rental.film_id))];
    
    // 3. Haz una sola llamada para obtener todos los detalles de las películas
    const filmsDetails = await Promise.all(
      filmIds.map(id => getFilmDetails(id).catch(() => null))
    );
    
    // 4. Crea un mapa de películas para acceso rápido
    const filmsMap = filmsDetails.reduce((acc, film) => {
      if (film) acc[film.film_id] = film.title;
      return acc;
    }, {});
    
    // 5. Combina los datos
    const rentalsWithFilmTitles = rentalsData.map(rental => ({
      ...rental,
      film_title: filmsMap[rental.film_id] || 'Película no disponible'
    }));
    
    setRentals(rentalsWithFilmTitles);
    
  } catch (err) {
    // Manejo de errores...
  } finally {
    setIsLoading(false);
  }
};

    fetchRentals();
  }, [selectedUser]);

  const handleDeleteRental = async (rentalId) => {
    if (!window.confirm(`¿Estás seguro de eliminar la renta #${rentalId}?`)) return;

    try {
      setDeletingId(rentalId);
      await deleteRental(rentalId);
      
      setRentals(prevRentals => prevRentals.filter(rental => rental.rental_id !== rentalId));
      setError(null);
      
      // Mostrar mensaje de éxito
      alert(`Renta #${rentalId} eliminada correctamente`);
      
    } catch (error) {
      let errorMessage = 'Error al eliminar la renta';
      
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = `La renta #${rentalId} no existe`;
            setRentals(prev => prev.filter(rental => rental.rental_id !== rentalId));
            break;
          case 422:
            errorMessage = error.response.data?.message || 'No se puede eliminar esta renta';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage = `Error ${error.response.status}: ${error.response.data?.message || error.message}`;
        }
      }
      
      setError(errorMessage);
      console.error('Error completo:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!selectedUser || !selectedUser.customer_id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">Por favor selecciona un usuario primero</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Seleccionar Usuario
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium text-white">Historial de Rentas</h2>
              <p className="text-indigo-100">
                {selectedUser.first_name} {selectedUser.last_name}
              </p>
            </div>
            <button
              onClick={() => navigate('/rental')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Nueva Renta
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : rentals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No tienes rentas registradas</p>
              <button
                onClick={() => navigate('/rental')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Realizar primera renta
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Película</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Renta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Devolución</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rentals.map((rental) => (
                    <tr key={rental.rental_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{rental.film_title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(rental.rental_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(rental.return_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteRental(rental.rental_id)}
                          disabled={deletingId === rental.rental_id}
                          className={`${deletingId === rental.rental_id ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'} transition-colors`}
                          title={deletingId === rental.rental_id ? 'Eliminando...' : 'Eliminar renta'}
                        >
                          {deletingId === rental.rental_id ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalHistory;