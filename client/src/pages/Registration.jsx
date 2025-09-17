// Registration.jsx

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, LogIn, Phone } from 'lucide-react';
import { useContext } from 'react';
import axios from 'axios';
import { AuthContextData } from '../context/AuthContext';
import { UserContextData } from '../context/UserContext';
import { auth, provider } from '../utils/Firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mobile: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  let { getUser } = useContext(UserContextData);
  const serverUrl = useContext(AuthContextData);
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

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

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

    if (!formData.mobile) {
      newErrors.mobile = 'Phone Number is required';
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = 'Enter Valid Phone Number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        setIsSubmitting(true);
        const registrationData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile || "0000000000"
        };
        const result = await axios.post(`${serverUrl}api/user/register`, registrationData, { withCredentials: true });
        console.log('Registration data:', result);
        getUser();
        navigate("/");
        setIsSubmitting(false);
        // alert('Registration successful!');
        toast.success("User Created Successfully !!!")
      }
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
      // alert('Registration failed!');
      toast.error("Something went wrong")
    }
  };

  const googleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const formData = {
        username: result.user.displayName,
        email: result.user.email,
      }
      const response = await axios.post(`${serverUrl}api/user/google-signup`, formData, { withCredentials: true });
      console.log(response);
      getUser();
       toast.success("User Created Successfully !!!")
      navigate("/");
    }
    catch (err) {
      console.log(err)
        toast.error("Something went wrong")
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className='min-h-screen pt-18 bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col items-center justify-center text-white py-8 px-4'>
        <div className='text-center mb-6'>
          <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300'>
            Create Your Account
          </h1>
          <p className='text-lg mt-4 text-gray-300'>
            Welcome to OneCart. Please register to place your order
          </p>
        </div>

        <div className='w-full max-w-md bg-[#00000025] border border-[#96969635] backdrop-blur-md rounded-xl p-8 shadow-2xl'>
          <div className='flex flex-col items-center'>
            <button
              className='w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors'
              onClick={googleSignUp}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className='w-5 h-5'
              />
              Sign up with Google
            </button>

            <div className='relative w-full my-6'>
              {/* <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-600'></div>
              </div> */}
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-transparent text-gray-400'>Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='w-full'>
              <div className='space-y-4'>
                <div>
                  <label htmlFor="username" className='block text-sm font-medium text-gray-300 mb-1'>
                    Username
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <User size={18} className='text-gray-500' />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`bg-[#ffffff15] border ${errors.username ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                      placeholder="Enter your username"
                    />
                  </div>
                  {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                </div>

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
                  <label htmlFor="number" className='block text-sm font-medium text-gray-300 mb-1'>
                    Number
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Phone size={18} className='text-gray-500' />
                    </div>
                    <input
                      type="number"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                       className={`bg-[#ffffff15] border ${errors.email ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                      placeholder="Enter your Number"
                    />

                  </div>
                  {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}

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
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className='mt-6 text-center text-gray-400'>
              Already have an account?{' '}
              <a href="/login" className='text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors'>
                Sign in here
              </a>
            </div>
          </div>
        </div>

        <p className='mt-8 text-sm text-gray-500 text-center max-w-md'>
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </>
  );
};

export default Registration;