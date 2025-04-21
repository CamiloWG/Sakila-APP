import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getCustomers } from "../services/api";

const UserList = () => {
  const navigate = useNavigate();
  const { setSelectedUser } = useUser();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setUsers(data);
      } catch (err) {
        console.error("Error loading customers:", err);
        setError("No se pudieron cargar los usuarios. Intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser({
      customer_id: user.customer_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
    navigate("/rental");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Selecciona tu usuario</h1>
      
      {users.map((user) => (
        <div
          key={user.customer_id}
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserSelect(user);
                  navigate("/rentals");
                }}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer"
              >
                Ver rentas
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
            <button
              onClick={() => handleUserSelect(user)}
              className="w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer"
            >
              Rentar Pelicula
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;