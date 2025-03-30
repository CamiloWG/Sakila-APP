// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const getCustomers = async () => {
  try {
    const response = await api.get('/customers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const createRental = async (rentalData) => {
  try {
    const response = await api.post('/rentals/', rentalData);
    return response.data;
  } catch (error) {
    console.error('Error creating rental:', error);
    throw error;
  }
};

export const deleteRental = async (rental_id) => {
    try {
      const response = await api.delete(`/rentals/${rental_id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting rental:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  };
export const getAvailableMovies = async () => {
  try {
    const response = await api.get('/film/');
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const getCustomerRentals = async (customerId) => {
    try {
      const response = await api.get(`/rentals-by-customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer rentals:', error);
      throw error;
    }
};

  export const getFilmDetails = async (filmId) => {
    try {
      const response = await api.get(`/film/${filmId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching film details:', error);
      throw error;
    }
  };