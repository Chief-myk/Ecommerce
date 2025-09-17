import React, { useState, useContext, useEffect } from 'react'
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import axios from "axios"
import { Box, Package, User, MapPin, Calendar, CreditCard, RefreshCw, AlertCircle, CheckCircle, Clock, Truck } from 'lucide-react'
import { AuthContextData } from '../context/AuthContext'

const Order = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState({})
  const { serverUrl } = useContext(AuthContextData)

  console.log('serverUrl:', serverUrl); // Debugging line
  
  const getOrders = async () => {
    if (!serverUrl) {
      setError('Server URL not available')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Fixed: Use proper URL format
      const url = serverUrl.endsWith('/') ? `${serverUrl}api/orders/allOrders` : `${serverUrl}/api/orders/allOrders`
      
      const res = await axios.get(url, { 
        withCredentials: true 
      })
      setOrders(res.data.reverse())
    } catch (err) {
      console.error('Error fetching orders:', err)
      if (err.response) {
        setError(`Failed to fetch orders: ${err.response.status} - ${err.response.data?.message || 'Server error'}`)
      } else if (err.request) {
        setError('Unable to connect to server. Please check your connection.')
      } else {
        setError('Failed to fetch orders. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (e, orderId) => {
    const newStatus = e.target.value
    
    if (!serverUrl) {
      setError('Server URL not available')
      return
    }
    
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }))
      setError('') // Clear any previous errors
      
      // Fixed: Use proper URL format
      const url = serverUrl.endsWith('/') ? `${serverUrl}api/orders/updateStatus` : `${serverUrl}/api/orders/updateStatus`
      
      const res = await axios.post(url, 
        { orderId, status: newStatus }, 
        { withCredentials: true }
      )
      
      if (res.data) {
        // Update local state instead of refetching all orders
        setOrders(prev => prev.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        ))
      }
    } catch (error) {
      console.error('Error updating status:', error)
      if (error.response) {
        setError(`Failed to update order status: ${error.response.status} - ${error.response.data?.message || 'Server error'}`)
      } else if (error.request) {
        setError('Unable to connect to server. Please check your connection.')
      } else {
        setError('Failed to update order status. Please try again.')
      }
      
      // Revert the select dropdown to previous value on error
      e.target.value = orders.find(order => order._id === orderId)?.status || 'Order Placed'
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'Order Packing':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'Order Shipped':
        return <Truck className="w-4 h-4 text-purple-500" />
      case 'Order Out for Delivery':
        return <Truck className="w-4 h-4 text-orange-500" />
      case 'Delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'text-green-400 bg-green-900/30'
      case 'Order Packing':
        return 'text-blue-400 bg-blue-900/30'
      case 'Order Shipped':
        return 'text-purple-400 bg-purple-900/30'
      case 'Order Out for Delivery':
        return 'text-orange-400 bg-orange-900/30'
      case 'Delivered':
        return 'text-green-400 bg-green-900/30'
      default:
        return 'text-gray-400 bg-gray-900/30'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    getOrders()
  }, [serverUrl]) // Fixed: Added serverUrl as dependency

  if (loading) {
    return (
      <>
        <div className='min-h-screen bg-gradient-to-l from-slate-700 to-slate-900 flex text-white'>
          <NavBar />
          <SideBar />
          <div className='flex-1 mt-20 p-6'>
            <div className="max-w-6xl ml-14">
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
                <span className="ml-3 text-lg">Loading orders...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='min-h-screen bg-gradient-to-l from-slate-700 to-slate-900 flex text-white'>
        <NavBar />
        <SideBar />
        <div className='flex-1 mt-20 p-6'>
          <div className="max-w-6xl ml-14">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Orders Management</h1>
              <button
                onClick={getOrders}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-200">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-red-300 hover:text-red-100"
                >
                  ✕
                </button>
              </div>
            )}

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Orders Found</h3>
                <p className="text-gray-400">There are no orders to display at the moment.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <div key={order._id || index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Order Items */}
                      <div className="space-y-4">
                        <div className="flex items-center mb-3">
                          <Box className="w-5 h-5 text-blue-400 mr-2" />
                          <h3 className="font-semibold text-lg">Order Items</h3>
                        </div>
                        <div className="space-y-2">
                          {order.items?.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                              <div>
                                <p className="font-medium">{item.name?.toUpperCase()}</p>
                                {item.size && (
                                  <span className="text-sm text-gray-400">Size: {item.size}</span>
                                )}
                              </div>
                              <span className="text-blue-300 font-medium">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-600">
                          <p className="text-sm text-gray-300">
                            Total Items: <span className="font-medium text-white">{order.items?.length || 0}</span>
                          </p>
                        </div>
                      </div>

                      {/* Customer & Address Info */}
                      <div className="space-y-4">
                        <div className="flex items-center mb-3">
                          <User className="w-5 h-5 text-green-400 mr-2" />
                          <h3 className="font-semibold text-lg">Customer Details</h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-white">
                              {order.address?.firstName} {order.address?.lastName}
                            </p>
                            <p className="text-sm text-gray-400">{order.address?.phone}</p>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                            <div className="text-sm text-gray-300">
                              <p>{order.address?.street}</p>
                              <p>
                                {order.address?.city}, {order.address?.state}
                              </p>
                              <p>
                                {order.address?.country} - {order.address?.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Details & Status */}
                      <div className="space-y-4">
                        <div className="flex items-center mb-3">
                          <CreditCard className="w-5 h-5 text-purple-400 mr-2" />
                          <h3 className="font-semibold text-lg">Order Details</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Amount:</span>
                            <span className="font-bold text-xl text-green-400">
                              {formatCurrency(order.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Payment Method:</span>
                            <span className="text-white">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Payment Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.payment 
                                ? 'text-green-300 bg-green-900/30' 
                                : 'text-orange-300 bg-orange-900/30'
                            }`}>
                              {order.payment ? "Paid" : "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(order.date)}
                          </div>
                        </div>

                        {/* Status Update */}
                        <div className="pt-4 border-t border-slate-600">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Order Status:
                          </label>
                          <div className="flex items-center space-x-3">
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-2">{order.status}</span>
                            </div>
                          </div>
                          <select 
                            value={order.status || 'Order Placed'}
                            onChange={(e) => updateStatus(e, order._id)}
                            disabled={updatingStatus[order._id]}
                            className="mt-3 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Order Packing">Order Packing</option>
                            <option value="Order Shipped">Order Shipped</option>
                            <option value="Order Out for Delivery">Order Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          {updatingStatus[order._id] && (
                            <div className="flex items-center mt-2 text-sm text-blue-400">
                              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                              Updating status...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Order