import React from 'react'
import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center px-4'>
            <div className='text-center max-w-md mx-auto'>
                {/* 404 Animation */}
                <div className='mb-8'>
                    <h1 className='text-9xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text animate-pulse'>
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <div className='mb-8'>
                    <h2 className='text-3xl font-bold text-white mb-4'>
                        Oops! Page Not Found
                    </h2>
                    <p className='text-slate-300 text-lg mb-2'>
                        The page you're looking for doesn't exist.
                    </p>
                    <p className='text-slate-400 text-sm'>
                        It might have been moved, deleted, or you entered the wrong URL.
                    </p>
                </div>

                {/* Illustration */}
                <div className='mb-8 text-6xl opacity-20'>
                    🔍
                </div>

                {/* Action Buttons */}
                <div className='space-y-4'>
                    <button 
                        onClick={() => navigate("/")}
                        className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
                    >
                        🏠 Go Back to Home
                    </button>
                    
                    <button 
                        onClick={() => navigate(-1)}
                        className='w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-slate-600 hover:border-slate-500'
                    >
                        ← Go Back
                    </button>
                </div>

                {/* Additional Help */}
                <div className='mt-8 pt-6 border-t border-slate-700'>
                    <p className='text-slate-400 text-sm'>
                        Need help? Contact support or check our documentation.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NotFound