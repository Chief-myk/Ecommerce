// Updated Navbar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { UserContextData } from "../context/UserContext";
import { AuthContextData } from '../context/AuthContext';
import axios from 'axios';
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify"
import { ShopDataContext } from "../context/ShopContext"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const serverUrl = useContext(AuthContextData);
    const { getUser, userData, loading } = useContext(UserContextData);
    const navigate = useNavigate();
    const { search, setSearch, getCountItem } = useContext(ShopDataContext);

    function toggleSearch() {
        setShowSearch(prev => !prev);
        navigate("/collections")
    }

    function toggleProfile() {
        setShowProfile(prev => !prev);
    }

    async function handleLogout() {
        try {
            const result = await axios.get(`${serverUrl}api/user/logout`, { withCredentials: true });
            await getUser(); // Refresh user data
            setShowProfile(false);
            // alert('LogOut successful!');
            toast.success("Logout successfully !!!")
            navigate('/');
        } catch (err) {
            console.log('Logout Failed !', err);
             toast.error("Something went wrong !!!")
        }
    }

    // Helper function to get user display info
    const getUserDisplayInfo = () => {
        if (!userData) return null;

        // Try different possible property names
        const name = userData.name || userData.username || userData.displayName || userData.email;
        return {
            initial: name ? name.charAt(0).toUpperCase() : 'U',
            name: name
        };
    };

    const userInfo = getUserDisplayInfo();

    if (loading) {
        return (
            // <div className="w-full h-18 bg-gradient-to-r  from-blue-600 to-purple-600 z-50 fixed top-0 flex items-center justify-between shadow-lg px-4 md:px-8">
            <div className="w-full h-18 bg-black z-50 fixed top-0 flex items-center justify-between shadow-lg px-4 md:px-8">
                <div className="flex items-center">
                    <Link to={"/"}>
                        <img src="/logo.png" alt="Logo" className="mt-2 h-50 w-40 object-contain" />
                    </Link>
                </div>
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-18 bg-black z-50 fixed top-0 flex items-center justify-between shadow-lg px-4 md:px-8">
                {/* Logo Section */}
                <Link to={"/"}>
                    <div className="flex items-center">
                        <img src="/logo.png" alt="Logo" className="mt-2 w-30 -ml-4 md:w-40 object-contain" />
                        <h1 className="text-white text-xl font-bold hidden sm:block -ml-4">One Cart</h1>
                    </div>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:block">
                    <ul className="flex space-x-8 text-white">
                        <Link to={"/"} className="hover:text-blue-200 transition-colors duration-200 cursor-pointer font-medium">Home</Link>
                        <Link to={"/collections"} className="hover:text-blue-200 transition-colors duration-200 cursor-pointer font-medium">Collection</Link>
                        <Link to={"/about"} className="hover:text-blue-200 transition-colors duration-200 cursor-pointer font-medium">About</Link>
                        <Link to={"/contact"} className="hover:text-blue-200 transition-colors duration-200 cursor-pointer font-medium">Contact</Link>
                    </ul>
                </div>

                {/* Right Section - Search, SignUp, Cart */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    {/* Search */}
                    <div className="hidden md:flex items-center bg-white/20 rounded-full px-3 py-1.5 transition-all duration-300 hover:bg-white/30">
                        <Search size={18} className="text-white mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none text-white placeholder-white/70 focus:outline-none w-32"
                            onClick={toggleSearch}
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>

                    {/* Profile Button */}
                    <button
                        className="hidden sm:block bg-white text-blue-600 px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                        onClick={toggleProfile}
                    >
                        <div className="relative cursor-pointer">
                            {!userData ? (
                                <User size={24} className="text-blue-600" />
                            ) : (
                                <div className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full">
                                    {userInfo?.initial || 'U'}
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Cart */}
                    <div className="relative cursor-pointer hidden md:block">
                        <button
                            onClick={() => {
                                if (!userData) {
                                    alert("Please log in to view your cart");
                                    navigate("/login");
                                } else {
                                    navigate("/cart");
                                }
                            }}
                        >
                            <ShoppingCart size={24} className="text-white" />
                            {userData && getCountItem() > 0 && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                    {getCountItem()}
                                </div>
                            )}
                        </button>
                    </div>



                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed top-16 left-0 w-full bg-white z-40 shadow-lg md:hidden">
                    <div className="flex flex-col p-4 space-y-4">
                        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                            <Link to={"/collections"}>
                                <Search size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none text-gray-800 placeholder-gray-500 focus:outline-none w-full"
                                />
                            </Link>
                        </div>

                        <ul className="space-y-3 flex flex-col">
                            <Link to={"/"} className="text-gray-800 font-medium py-2 border-b border-gray-100">Home</Link>
                            <Link to={"/collections"} className="text-gray-800 font-medium py-2 border-b border-gray-100">Collection</Link>
                            <Link to={"/about"} className="text-gray-800 font-medium py-2 border-b border-gray-100">About</Link>
                            <Link to={"/contact"} className="text-gray-800 font-medium py-2 border-b border-gray-100">Contact</Link>
                            <Link to={"/order"} className="text-gray-800 font-medium py-2 border-b border-gray-100">Orders</Link>
                        </ul>

                        <div className="border-t border-gray-200 pt-4">
                            {userData ? (
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium w-full"
                                    onClick={() => {
                                        handleLogout();
                                        setShowProfile(false);
                                    }}
                                >
                                    Logout
                                </button>
                            ) : (
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium w-full">
                                    <Link to={"/login"}>
                                        LogIn
                                    </Link>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Dropdown */}
            {showProfile && (
                <div className="fixed right-4 top-16 bg-white shadow-lg rounded-lg z-50 p-4 min-w-40">
                    <ul className="space-y-2">
                        {userData ? (
                            <>
                                <li className="px-3 py-2 text-sm text-gray-600 border-b">
                                    {userInfo?.name || 'User'}
                                </li>
                                <li
                                    className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer text-red-600"
                                    onClick={() => {
                                        handleLogout();
                                        setShowProfile(false);
                                    }}
                                >
                                    LogOut
                                </li>
                                <Link to={"/order"} onClick={() => setShowProfile(false)} className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">Orders</Link>
                            </>
                        ) : (
                            <>
                                <li className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                                    <Link to={"/login"}>
                                        SignIn
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Navbar;