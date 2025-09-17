// UserContext.jsx
import React, { useContext } from 'react'
import { createContext, useState, useEffect } from 'react'
import { AuthContextData } from './AuthContext'
import axios from "axios"

export const UserContextData = createContext()
const UserContext = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    let serverUrl = useContext(AuthContextData);

    const getUser = async () => {
        try {
            console.log('Fetching user data...');
            const response = await axios.get(`${serverUrl}api/user/getCurrentUser`, { 
                withCredentials: true 
            });
            console.log('User data received:', response.data);
            setUserData(response.data);
        } catch (error) {
            console.log('Failed to fetch user data:', error);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    let value = {
        userData, 
        setUserData, 
        getUser,
        loading
    }
    
    return (
        <UserContextData.Provider value={value}>
            {children}
        </UserContextData.Provider>
    )
}

export default UserContext