// Updated Login.jsx - Key changes marked with comments

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, LogIn } from 'lucide-react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContextData } from '../context/AuthContext';
import { UserContextData } from '../context/UserContext';
import { auth, provider } from '../utils/Firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serverUrl = useContext(AuthContextData);
  let { getUser } = useContext(UserContextData);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const formData = {
        username: result.user.displayName,
        email: result.user.email,
      }
      const response = await axios.post(`${serverUrl}api/user/google-signup`, formData, { withCredentials: true });
      console.log(response);

      // FIXED: Wait for getUser to complete before navigating
      await getUser();

      // Add small delay to ensure context updates
      setTimeout(() => {
        navigate("/");
      }, 100);
      toast.success("Login Succesfully")
    }
    catch (err) {
      console.log(err);
      toast.error("Something Went wrong")
    }
  }

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
      const registrationData = {
        email: formData.email,
        password: formData.password,
      };

      try {
        const result = await axios.post(`${serverUrl}api/user/login`, registrationData, { withCredentials: true });
        console.log('Login data:', result);

        // FIXED: Wait for getUser to complete and add error handling
        try {
          // Save token in localStorage or context
          localStorage.setItem("token", result.data.token);

          // Then fetch user
          await getUser();

          // Add small delay to ensure context updates
          setTimeout(() => {
            // alert('Login successful!');
            t
            navigate("/");
          }, 100);

          toast.success("Login Successfully")

        } catch (userFetchError) {
          console.error('Error fetching user data:', userFetchError);
          // Still navigate but show warning
          // alert('Login successful, but there was an issue loading user data. Please refresh the page.');
          navigate("/");
          toast.error("Something Went wrong")
        }

      } catch (err) {
        console.log(err);
        setIsSubmitting(false);
          toast.error("Something Went wrong")

        // IMPROVED: Better error handling
        // const errorMessage = err.response?.data?.message || 'Login failed!';
        // alert(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className='min-h-screen pt-18 bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col items-center justify-center text-white py-8 px-4'>
        <div className='text-center mb-6'>
          <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300'>
            Login to Your Account
          </h1>
          <p className='text-lg mt-4 text-gray-300'>
            Welcome to OneCart. Please login to place your order
          </p>
        </div>

        <div className='w-full max-w-md bg-[#00000025] border border-[#96969635] backdrop-blur-md rounded-xl p-8 shadow-2xl'>
          <div className='flex flex-col items-center'>
            <button
              className='w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors'
              onClick={googleLogin}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className='w-5 h-5'
              />
              Sign in with Google
            </button>

            <div className='relative w-full my-6'>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-transparent text-gray-400'>Or continue with email</span>
              </div>
            </div>

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

            <div className='mt-6 text-center text-gray-400'>
              Don't have an account?{' '}
              <a href="/register" className='text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors'>
                Sign up here
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;