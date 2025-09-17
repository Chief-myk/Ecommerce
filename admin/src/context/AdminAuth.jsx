import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContextData } from './AuthContext';
import axios from 'axios';

export const AdminAuthData = createContext();

const AdminAuth = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const { serverUrl } = useContext(AuthContextData);

  const getAdmin = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/admin`,
        { withCredentials: true }
      );
      
      // Check if response is successful
      if (result.data.success) {
        setAdminData(result.data);
        console.log('Admin data:', result.data);
      } else {
        setAdminData(null);
      }
    } catch (err) {
      console.error('getAdmin error:', err);
      // If error, user is not authenticated as admin
      setAdminData(null);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  const value = {
    adminData, 
    setAdminData, 
    getAdmin
  };

  return (
    <AdminAuthData.Provider value={value}>
      {children}
    </AdminAuthData.Provider>
  );
};

export default AdminAuth;