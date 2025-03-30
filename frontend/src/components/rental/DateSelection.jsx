// src/components/rental/DateSelection.jsx
const DateSelection = ({ rentalDate, returnDate, onDateChange }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rentalDate" className="block text-sm font-medium text-gray-700">
            Fecha de renta
          </label>
          <input
            type="date"
            id="rentalDate"
            value={rentalDate}
            onChange={(e) => onDateChange('rentalDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
            Fecha de devolución
          </label>
          <input
            type="date"
            id="returnDate"
            value={returnDate}
            onChange={(e) => onDateChange('returnDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min={rentalDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    );
  };
  
  export default DateSelection;