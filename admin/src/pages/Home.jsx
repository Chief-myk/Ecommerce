import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import { AuthContextData } from "../context/AuthContext"

const Home = () => {
  const [orders, setOrders] = useState(0)
  const [products, setProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { serverUrl } = useContext(AuthContextData)

  const fetchCount = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch products and orders in parallel
      const [productsResponse, ordersResponse] = await Promise.all([
        axios.get(`${serverUrl}/api/products/listProducts`, {
          withCredentials: true,
        }),
        axios.get(`${serverUrl}/api/orders/allOrders`, {
          withCredentials: true,
        })
      ])

      setProducts(productsResponse.data.length || 0)
      setOrders(ordersResponse.data.length || 0)
    } catch (error) {
      console.error('Error fetching count:', error)
      setError('Failed to fetch dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (serverUrl) {
      fetchCount()
    }
  }, [serverUrl])

  const StatCard = ({ title, value, icon, bgColor = "bg-slate-800" }) => (
    <div className={`${bgColor} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-white">
            {loading ? (
              <div className="animate-pulse bg-slate-600 h-8 w-16 rounded"></div>
            ) : (
              value
            )}
          </p>
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  )

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  )

  const ErrorMessage = () => (
    <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
      <div className="flex items-center">
        <span className="text-xl mr-2">⚠️</span>
        <div>
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchCount}
            className="mt-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen flex bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white'>
      <NavBar />
      <SideBar />
      
      <div className='flex-1 mt-20 p-6'>
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              OneCart Admin Panel
            </h1>
            <p className="text-slate-300 text-lg">
              Welcome to your dashboard overview
            </p>
          </div>

          {/* Error Message */}
          {error && <ErrorMessage />}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Products"
              value={products}
              icon="📦"
              bgColor="bg-gradient-to-r from-blue-600 to-blue-700"
            />
            
            <StatCard
              title="Total Orders"
              value={orders}
              icon="🛒"
              bgColor="bg-gradient-to-r from-green-600 to-green-700"
            />
            
            <StatCard
              title="Success Rate"
              value={orders > 0 ? "98.5%" : "N/A"}
              icon="📈"
              bgColor="bg-gradient-to-r from-purple-600 to-purple-700"
            />
            
            <StatCard
              title="Revenue"
              value="$0.00"
              icon="💰"
              bgColor="bg-gradient-to-r from-orange-600 to-orange-700"
            />
          </div>

          {/* Recent Activity Section */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Dashboard Overview
            </h2>
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-blue-300">Products</h3>
                  <p className="text-slate-300">
                    You have <span className="font-bold text-white">{products}</span> products in your inventory.
                  </p>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-300">Orders</h3>
                  <p className="text-slate-300">
                    You have processed <span className="font-bold text-white">{orders}</span> orders to date.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {/* <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors font-medium">
                Add New Product
              </button>
              <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors font-medium">
                View Orders
              </button>
              <button 
                onClick={fetchCount}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors font-medium"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Home