// src/hooks/useRental.js
import { useState } from 'react';
import { createRental } from '../services/api';

export const useRental = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitRental = async (rentalData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Enviamos los datos reales a la API
      const response = await createRental({
        rental_date: rentalData.rental_date,
        customer_id: rentalData.customer_id,
        return_date: rentalData.return_date,
        film_id: rentalData.film_id
      });

      console.log('Renta creada exitosamente:', response);
      setSuccess(true);
      
    } catch (err) {
      console.error('Error al crear renta:', err);
      
      // Manejo de errores específicos
      let errorMessage = 'Error al procesar la renta';
      
      if (err.response) {
        // Error de la API (4xx, 5xx)
        if (err.response.status === 400) {
          errorMessage = 'Datos inválidos: ' + (err.response.data?.detail || 'Verifica los datos ingresados');
        } else if (err.response.status === 404) {
          errorMessage = 'Recurso no encontrado: ' + (err.response.data?.detail || 'Película o cliente no existe');
        } else if (err.response.status === 409) {
          errorMessage = 'Conflicto: ' + (err.response.data?.detail || 'La película ya está rentada');
        } else {
          errorMessage = `Error del servidor (${err.response.status}): ${err.response.data?.detail || 'Intente más tarde'}`;
        }
      } else if (err.request) {
        // La petición fue hecha pero no hubo respuesta
        errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
      } else {
        // Error al configurar la petición
        errorMessage = 'Error al configurar la solicitud: ' + err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    submitRental, 
    isSubmitting, 
    error, 
    success, 
    reset: () => {
      setSuccess(false);
      setError(null);
    }
  };
};