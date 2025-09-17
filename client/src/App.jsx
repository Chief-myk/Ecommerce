// app.jsx

import React, { useContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Home from './pages/Home'
import AuthContext from './context/AuthContext'
import UserContext from './context/UserContext'
import Navbar from './components/Navbar'
import Footbar from './components/Footbar'
import { UserContextData } from './context/UserContext'
import About from './pages/About'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Order from './pages/Order'
import ShopContext from "./context/ShopContext"
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import { ToastContainer, toast } from 'react-toastify';
import PlaceOrder from './pages/PlaceOrder'
import NotFound from './components/NotFound'
import Ai from './components/Ai'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthContext>
          <UserContext>
           <ShopContext> 
            <AppContent />
           </ShopContext>
          </UserContext>
        </AuthContext>
      </BrowserRouter>
    </>
  )
}

const AppContent = () => {
  const userData = useContext(UserContextData);

  return (
    <>
<ToastContainer/>
      {<Navbar/>}
      <Routes>
        <Route path='/register' element={<Registration />} />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/collections' element={<Collection />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/productDetail/:productId' element={<ProductDetail />} />
        <Route path='/order' element={<Order />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/placeOrder' element={<PlaceOrder />} />
        <Route path='*' element={<NotFound />} />
        
      </Routes>
      <Ai/>
      <Footbar/>
    </>
  )
}

export default App


// // app.jsx

// import React, { useContext } from "react";
// import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

// import Registration from "./pages/Registration";
// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import AuthContext from "./context/AuthContext";
// import UserContext from "./context/UserContext";
// import Navbar from "./components/Navbar";
// import Footbar from "./components/Footbar";
// import { UserContextData } from "./context/UserContext";
// import About from "./pages/About";
// import Collection from "./pages/Collection";
// import Contact from "./pages/Contact";
// import Order from "./pages/Order";
// import ShopContext from "./context/ShopContext";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <AuthContext>
//         <UserContext>
//           <ShopContext>
//             <AppContent />
//           </ShopContext>
//         </UserContext>
//       </AuthContext>
//     </BrowserRouter>
//   );
// };

// const AppContent = () => {
//   const { userData, loading } = useContext(UserContextData);
//   const location = useLocation();

//   // ✅ Show loader while fetching user data
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-lg font-semibold">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* ✅ Show Navbar & Footbar only if logged in */}
//       {userData && <Navbar />}

//       <Routes>
//         {/* Auth Pages */}
//         <Route
//           path="/login"
//           element={
//             userData ? (
//               <Navigate to={location.state?.from || "/"} replace />
//             ) : (
//               <Login />
//             )
//           }
//         />
//         <Route
//           path="/register"
//           element={
//             userData ? (
//               <Navigate to={location.state?.from || "/"} replace />
//             ) : (
//               <Registration />
//             )
//           }
//         />

//         {/* Protected Pages */}
//         <Route
//           path="/"
//           element={
//             userData ? (
//               <Home />
//             ) : (
//               <Navigate to="/login" state={{ from: location.pathname }} replace />
//             )
//           }
//         />
//         <Route
//           path="/about"
//           element={
//             userData ? (
//               <About />
//             ) : (
//               <Navigate to="/login" state={{ from: location.pathname }} replace />
//             )
//           }
//         />
//         <Route
//           path="/collections"
//           element={
//             userData ? (
//               <Collection />
//             ) : (
//               <Navigate to="/login" state={{ from: location.pathname }} replace />
//             )
//           }
//         />
//         <Route
//           path="/contact"
//           element={
//             userData ? (
//               <Contact />
//             ) : (
//               <Navigate to="/login" state={{ from: location.pathname }} replace />
//             )
//           }
//         />
        
//         <Route
//           path="/order"
//           element={
//             userData ? (
//               <Order />
//             ) : (
//               <Navigate to="/login" state={{ from: location.pathname }} replace />
//             )
//           }
//         />
//       </Routes>

//       {userData && <Footbar />}
//     </>
//   );
// };

// export default App;
