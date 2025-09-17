// AuthContext.jsx

import React from 'react'
import { createContext, useState, useEffect } from 'react'

export const AuthContextData = createContext()
const AuthContext = ({ children }) => {
    let serverUrl = "https://ecommerce-backend-e18a.onrender.com/"
    // let serverUrl = "http://localhost:3000/"
    let value = {
        serverUrl
    }
    return (
        <AuthContextData.Provider value={serverUrl}>
            {children}
        </AuthContextData.Provider>
    )
}

export default AuthContext