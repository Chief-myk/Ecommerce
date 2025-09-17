import React, { use, useState } from 'react'
import { useContext } from 'react'
import { ShopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import { useEffect } from 'react'
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Heart } from 'lucide-react'
import { UserContextData } from '../context/UserContext'

const Cart = () => {
    const navigate = useNavigate()
    const [cartData, setCartData] = useState([])
    const [loading, setLoading] = useState(false)
    const { userData } = useContext(UserContextData)
    const [error, setError] = useState(null)
    const {
        products,
        currency,
        delivery_fee,
        getProducts,
        cartItem,
        getCountItem,
        updateQuantity,
        getCartAmount,
        getUserCart,
        removeFromCart,
    } = useContext(ShopDataContext)

    useEffect(() => {
        const tempData = [];
        for (const itemId in cartItem) {
            for (const size in cartItem[itemId]) {
                if (cartItem[itemId][size] > 0) {
                    tempData.push({
                        id: itemId,
                        size: size,
                        quantity: cartItem[itemId][size],
                        info: products.find((product) => product._id === itemId)
                    });
                }
            }
        }
        setCartData(tempData);
    }, [cartItem, products])

  

    const handleQuantityChange = async (itemId, size, newQuantity) => {
        setLoading(true)
        try {
            await updateQuantity(itemId, size, newQuantity)
        } catch (error) {
            setError('Failed to update quantity')
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveItem = async (itemId, size) => {
        setLoading(true)
        try {
            await removeFromCart(itemId, size)
        } catch (error) {
            setError('Failed to remove item')
        } finally {
            setLoading(false)
        }
    }

    const totalItems = getCountItem()
    const cartTotal = getCartAmount()
    const grandTotal = cartTotal + (cartTotal > 0 ? delivery_fee : 0)

    if (cartData.length === 0) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
                <div className="container mx-auto px-4 py-8">
                    <Title text1={"Your"} text2={"Cart"} />
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-12 border border-slate-600/30 shadow-2xl">
                            <ShoppingBag className="w-24 h-24 text-slate-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">Your cart is empty</h3>
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
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
            <div className="container mx-auto px-4 py-8">
                <Title text1={"Your"} text2={"Cart"} />
                
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-200">
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                            </h3>
                        </div>

                        {cartData.map((item, index) => {
                            const productData = products.find((product) => product._id === item.id);
                            if (!productData) return null;

                            return (
                                <div key={`${item.id}-${item.size}-${index}`} 
                                     className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 shadow-lg">
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-700">
                                                <img 
                                                    src={productData?.image1} 
                                                    alt={productData?.name}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white mb-1">
                                                        {productData?.name}
                                                    </h4>
                                                    <p className="text-2xl font-bold text-blue-400">
                                                        {currency}{productData?.price}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id, item.size)}
                                                    disabled={loading}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Size */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 text-sm">Size:</span>
                                                    <span className="bg-slate-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                        {item.size}
                                                    </span>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                                                        disabled={loading || item.quantity <= 1}
                                                        className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-white font-semibold text-lg min-w-[2rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                                                        disabled={loading}
                                                        className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Item Total */}
                                            <div className="mt-3 pt-3 border-t border-slate-600/30">
                                                <p className="text-right text-slate-300">
                                                    Subtotal: <span className="text-xl font-bold text-white">
                                                        {currency}{(productData?.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 shadow-lg sticky top-8">
                            <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-slate-300">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span>{currency}{cartTotal.toFixed(2)}</span>
                                </div>
                                
                                <div className="flex justify-between text-slate-300">
                                    <span>Shipping</span>
                                    <span>{cartTotal > 0 ? `${currency}${delivery_fee}` : 'Free'}</span>
                                </div>
                                
                                <div className="h-px bg-slate-600/30"></div>
                                
                                <div className="flex justify-between text-xl font-bold text-white">
                                    <span>Total</span>
                                    <span>{currency}{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => navigate('/placeOrder')}
                                    disabled={loading || cartData.length === 0}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:transform-none"
                                >
                                    Proceed to Checkout
                                </button>
                                
                                <button 
                                    onClick={() => navigate('/collections')}
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Continue Shopping
                                </button>
                            </div>

                            {/* Promo Code */}
                            <div className="mt-6 pt-6 border-t border-slate-600/30">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Promo code"
                                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Products */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-white mb-6">You might also like</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {products.slice(0, 4).map((product) => (
                            <div key={product._id} 
                                 onClick={() => navigate(`/productDetail/${product._id}`)}
                                 className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 cursor-pointer group">
                                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                                    <img 
                                        src={product.image1} 
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <h4 className="text-white font-medium mb-1 truncate">{product.name}</h4>
                                <p className="text-blue-400 font-bold">{currency}{product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart