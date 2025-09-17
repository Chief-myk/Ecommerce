import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Login from "./pages/Login";
import List from "./pages/List";
import Add from "./pages/Add";
import AuthContext from "./context/AuthContext";
import AdminAuth, { AdminAuthData } from "./context/AdminAuth";
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <BrowserRouter>
      <AuthContext>
        <AdminAuth>
          <AppRoutes />
        </AdminAuth>
      </AuthContext>
    </BrowserRouter>
  );
};

const AppRoutes = () => {
  const { adminData } = useContext(AdminAuthData);
  
  return (
    <>
      <ToastContainer />
      {!adminData ? <Login /> : (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/list' element={<List />} />
          <Route path='/add' element={<Add />} />
          <Route path='/order' element={<Order />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      )}
    </>
  );
};

export default App;