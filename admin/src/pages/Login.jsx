import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import axios from 'axios';
import { AdminAuthData } from '../context/AdminAuth';
import { AuthContextData } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { adminData, getAdmin } = useContext(AdminAuthData);
    const { serverUrl } = useContext(AuthContextData);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const result = await axios.post(
                    `${serverUrl}/api/user/adminLogin`,
                    formData,
                    { withCredentials: true }
                );
                console.log('Response:', result.data);
                
                // Check if we got a token (login successful)
                if (result.data.token) {
                    await getAdmin(); // This will fail if endpoint doesn't exist
                    navigate("/");
                    toast.success("Admin Login Successfully")
                    // alert('Login successful!');
                } else {
                    alert('Login failed - no token received!');
                    toast.error("Admin Login Failed")
                }
            } catch (err) {
                console.error('Login failed:', err);
                console.error('Error details:', err.response?.data);
                
                // Check if it's actually successful but axios thinks it's an error due to status code
                if (err.response?.data?.token) {
                    console.log('Login actually successful, got token:', err.response.data.token);
                    navigate("/");
                    alert('Login successful!');
                } else {
                    // alert('Login failed!');
                    toast.error("Admin Login Failed")
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col items-center justify-center text-white py-8 px-4'>
            <div className='text-center mb-6'>
                <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300'>
                    Login for Admin Access
                </h1>
                <p className='text-lg mt-4 text-gray-300'>
                    Welcome BOSS. Have a Look!
                </p>
            </div>

            <div className='w-full max-w-md bg-[#00000025] border border-[#96969635] backdrop-blur-md rounded-xl p-8 shadow-2xl'>
                <div className='flex flex-col items-center'>
                    <form onSubmit={handleSubmit} className='w-full'>
                        <div className='space-y-4'>
                            <div>
                                <label htmlFor="email" className='block text-sm font-medium text-gray-300 mb-1'>
                                    Email
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Mail size={18} className='text-gray-500' />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`bg-[#ffffff15] border ${errors.email ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className='block text-sm font-medium text-gray-300 mb-1'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Lock size={18} className='text-gray-500' />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`bg-[#ffffff15] border ${errors.password ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg block w-full pl-10 pr-10 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} className='text-gray-500 hover:text-gray-300' />
                                        ) : (
                                            <Eye size={18} className='text-gray-500 hover:text-gray-300' />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isSubmitting
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Login to Your Account
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;