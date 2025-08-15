import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = ({ token: loginToken, user: loginUser }) => {
    localStorage.setItem("token", loginToken);
    localStorage.setItem("user", JSON.stringify(loginUser));
    setToken(loginToken);
    setUser(loginUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

 const updateUser = (updatedUser) => {
  setUser(updatedUser); 
  localStorage.setItem("user", JSON.stringify(updatedUser));
};


  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
