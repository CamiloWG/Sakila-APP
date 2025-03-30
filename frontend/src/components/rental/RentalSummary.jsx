// src/components/rental/RentalSummary.jsx
const RentalSummary = ({ movie, rentalDate, returnDate, rentalRate }) => {
    if (!movie) return null;
  
    const calculateTotal = () => {
      if (!rentalDate || !returnDate) return 0;
      const days = (new Date(returnDate) - new Date(rentalDate));
      return (days / (1000 * 60 * 60 * 24)) * rentalRate;
    };
  
    return (
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-2">Resumen</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">{movie.title}</p>
          <p className="text-gray-600">${rentalRate} por día</p>
          {rentalDate && returnDate && (
            <>
              <p className="text-gray-600 mt-2">
                Periodo: {new Date(rentalDate).toLocaleDateString()} al {new Date(returnDate).toLocaleDateString()}
              </p>
              <p className="font-medium mt-2">
                Total: ${calculateTotal().toFixed(2)}
              </p>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default RentalSummary;