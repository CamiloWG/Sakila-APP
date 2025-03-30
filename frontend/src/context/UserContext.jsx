// src/context/UserContext.js
import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(() => {
    // Opcional: Cargar usuario desde localStorage si existe
    const savedUser = localStorage.getItem('selectedUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const updateSelectedUser = (user) => {
    setSelectedUser(user);
    // Opcional: Guardar en localStorage
    localStorage.setItem('selectedUser', JSON.stringify(user));
  };

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser: updateSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);