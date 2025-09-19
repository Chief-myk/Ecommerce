import React, { createContext } from 'react';

export const AuthContextData = createContext();

const AuthContext = ({ children }) => {
    const serverUrl = "http://localhost:3000";
    // const serverUrl = "https://ecommerce-backend-e18a.onrender.com";
    
    const value = {
        serverUrl
    };

    return (
        <AuthContextData.Provider value={value}>
            {children}
        </AuthContextData.Provider>
    );
};

export default AuthContext;