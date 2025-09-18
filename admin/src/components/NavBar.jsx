import React, { useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { AdminAuthData } from '../context/AdminAuth';
import { AuthContextData } from '../context/AuthContext';
import { toast } from 'react-toastify';

const NavBar = () => {
  const { getAdmin } = useContext(AdminAuthData);
  const { serverUrl } = useContext(AuthContextData);

  async function handleLogout() {
    try {
      const result = await axios.get(`${serverUrl}/api/user/logout`, { withCredentials: true });
      await getAdmin(); 
      toast.success("Logout Successfully");
    } catch (err) {
      console.log('Logout Failed !', err);
      toast.error("Error while Logout")
    }
  }

  return (
    <div className="w-full h-20 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 z-50 fixed top-0 flex items-center justify-between shadow-lg px-4 md:px-8 border-b border-blue-500">
      {/* Logo Section */}
      <Link to={"/"} className="flex items-center group">
        <div className="flex items-center transform transition-transform duration-200 group-hover:scale-105">
          <img src="/logo.png" alt="Logo" className="h-40 w-30 mt-2 object-contain filter brightness-0 invert" />
          <h1 className="text-white text-2xl font-bold -ml-2 tracking-tight drop-shadow-md">One Cart</h1>
        </div>
      </Link>
      
      {/* Logout Button */}
      <Link to={"/login"}>
        <button 
          onClick={handleLogout}
          className="bg-white text-blue-700 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
        >
          Log Out
        </button>
      </Link>
    </div>
  );
};

export default NavBar;