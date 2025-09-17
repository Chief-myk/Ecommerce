import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import { AuthContextData } from '../context/AuthContext'
import { ShopDataContext } from '../context/ShopContext'
import { ShoppingBag, ArrowRight, Clock, CheckCircle, Truck, Package, RefreshCw } from 'lucide-react'
import axios from 'axios'

const Order = () => {
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currency } = useContext(ShopDataContext)
  const serverUrl = useContext(AuthContextData)
  const navigate = useNavigate()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <Clock className="w-5 h-5 text-blue-400" />
      case 'Processing':
        return <Package className="w-5 h-5 text-yellow-400" />
      case 'Shipped':
        return <Truck className="w-5 h-5 text-orange-400" />
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      default:
        return <Clock className="w-5 h-5 text-blue-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-500/20 text-blue-300'
      case 'Processing':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'Shipped':
        return 'bg-orange-500/20 text-orange-300'
      case 'Delivered':
        return 'bg-green-500/20 text-green-300'
      default:
        return 'bg-blue-500/20 text-blue-300'
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const loadOrderData = async () => {
    try {
      setLoading(true)
      setError(null)
      // const res = await axios.get(`http://localhost:3000/api/orders/userOrders`, { 
      //   withCredentials: true 
      // })
      const res = await axios.get(`${serverUrl}api/orders/userOrders`, { 
        withCredentials: true 
      })
      
      if (res.data && res.data.length > 0) {
        const allOrderItems = []
        res.data.forEach((order) => {
          order.items.forEach((item) => {
            const orderItem = {
              ...item,
              orderId: order._id,
              date: order.date,
              status: order.status,
              paymentMethod: order.paymentMethod,
              payment: order.payment
            }
            allOrderItems.push(orderItem)
          })
        })
        setOrderData(allOrderItems.reverse())
      } else {
        setOrderData([])
      }
    } catch (error) {
      console.error("Error loading order data:", error)
      // setError('Failed to load orders. Please try again.')
      setError("No orders found. Start shopping now!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [])

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className="container mx-auto px-4 py-8">
          <Title text1={"MY"} text2={"ORDERS"} />
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500"></div>
            <p className="text-slate-400 mt-4">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className="container mx-auto px-4 py-8">
          <Title text1={"MY"} text2={"ORDERS"} />
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/30 shadow-2xl max-w-md w-full">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Cant Find Any Product</h3>
              <p className="text-slate-400 mb-6">{error}</p>
              <button 
                // onClick={loadOrderData}
                onClick={() => navigate('/collections')}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                {/* <RefreshCw className="w-4 h-4" /> Try Again */}
                Start Shopping Now <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (orderData.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className="container mx-auto px-4 py-8">
          <Title text1={"MY"} text2={"ORDERS"} />
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-12 border border-slate-600/30 shadow-2xl">
              <ShoppingBag className="w-24 h-24 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No Orders Placed Yet!</h3>
              <p className="text-slate-400 mb-8 text-lg">Discover amazing products and start shopping!</p>
              <button 
                onClick={() => navigate('/collections')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto"
              >
                Start Shopping <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8'>
      <div className="container mx-auto pt-16">
        <Title text1={"MY"} text2={"ORDERS"} />
        
        <div className="mt-8 space-y-6">
          {orderData.map((item, index) => (
            <div 
              key={`${item.orderId}-${item._id}-${item.size}-${index}`} 
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden bg-slate-700">
                    <img 
                      src={item.image1} 
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {item.name}
                      </h4>
                      <p className="text-2xl font-bold text-sky-400">
                        {currency}{item.price}
                      </p>
                    </div>
                    
                    {/* Order Status */}
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Size and Quantity */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">Size:</span>
                        <span className="bg-slate-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {item.size}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">Quantity:</span>
                        <span className="text-white font-semibold">
                          {item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">Order Date:</span>
                        <span className="text-white text-sm">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">Payment:</span>
                        <span className="text-white text-sm">
                          {item.paymentMethod} {item.payment ? '(Paid)' : '(Pending)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="pt-4 border-t border-slate-600/30">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Item Total:</span>
                      <span className="text-xl font-bold text-white">
                        {currency}{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="mt-4 pt-4 border-t border-slate-600/30 flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  Order ID: {item.orderId}
                </span>
                {/* <button  */}
                  {/* onClick={() => Add track order functionality} */}
                  {/* className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2" */}
                {/* > */}
                  {/* <Truck className="w-4 h-4" /> */}
                  {/* Track Order */}
                {/* </button> */}
              </div>
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={loadOrderData}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Orders
          </button>
        </div>
      </div>
    </div>
  )
}

export default Order