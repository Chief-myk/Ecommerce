import React, { useState, useEffect, useContext } from 'react'
import Title from '../components/Title'
import { ShopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CreditCard, DollarSign } from 'lucide-react'
import axios from 'axios'
import {toast} from "react-toastify"

const PlaceOrder = () => {
    const [method, setMethod] = useState('COD')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    })
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const {
        products,
        currency,
        delivery_fee,
        cartItem,
        getCartAmount,
         setCartItem,
    } = useContext(ShopDataContext)
    const navigate = useNavigate();
    

    // Calculate cart totals
    const cartTotal = getCartAmount();
    const totalItems = Object.values(cartItem).reduce((total, item) => {
        return total + Object.values(item).reduce((sum, qty) => sum + qty, 0);
    }, 0);
    const grandTotal = cartTotal > 0 ? cartTotal + delivery_fee : 0;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    }

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) errors.email = 'Invalid email format';
        if (!formData.street.trim()) errors.street = 'Street address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.state.trim()) errors.state = 'State is required';
        if (!formData.zipCode.trim()) errors.zipCode = 'Zip code is required';
        if (!formData.country.trim()) errors.country = 'Country is required';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        else if (!phoneRegex.test(formData.phone)) errors.phone = 'Invalid phone number';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const initRazorpayPayment = (orderData) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount.toString(),
            currency: 'INR',
            name: "Ecommerce Order Payment",
            description: "Test Transaction",
            order_id: orderData.id,
            handler: async function (response) {
                try {
                    console.log('Payment successful:', response);
                    
                    // Verify payment on your server
                    const {data} = await axios.post('http://localhost:3000/api/orders/verify-payment', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    }, { withCredentials: true });

                    if (data && data.message === 'Payment verified and order placed successfully') {
                        setCartItem({});
                        navigate('/order');
                        toast.success("Yayyyyy Congratulations")
                    } else {
                         toast.error("Something went wrong")
                        setError('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Payment verification failed:', error);
                    setError('Payment verification failed. Please try again.');
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: '#0ea5e9'
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setError('Please fix the form errors');
            return;
        }

        if (totalItems === 0) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderItems = [];
            for (const itemId in cartItem) {
                for (const size in cartItem[itemId]) {
                    if (cartItem[itemId][size] > 0) {
                        const itemInfo = structuredClone(products.find((product) => product._id === itemId));
                        if (itemInfo) {
                            itemInfo.size = size;
                            itemInfo.quantity = cartItem[itemId][size];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            // FIXED: Changed field names to match backend expectations
            const orderData = {
                item: orderItems, // Backend expects "item" not "items"
                amount: grandTotal,
                address: formData, // Backend expects address object directly
                paymentMethod: method
            }

            switch (method) {
                case 'COD':
                    const res = await axios.post('http://localhost:3000/api/orders/placeOrder', orderData, { withCredentials: true });
                    console.log('Order placed successfully:', res.data);
                    if (res.data && res.data._id) {
                        setCartItem({});
                        navigate('/order', { state: { orderId: res.data._id } });
                           toast.success("Yayyyyy Congratulations")
                    } else {
                        setError('Failed to place order');
                        toast.error("Something went wrong")
                    }
                    break;
                
                case 'razorpay':
                    const razorRes = await axios.post('http://localhost:3000/api/orders/razorpay', orderData, { withCredentials: true });
                    if (razorRes.data) {
                        setCartItem({})
                        initRazorpayPayment(razorRes.data);
                        console.log('Razorpay order created:', razorRes.data);
                    }
                    break;
                
                default:
                    setError('Selected payment method is not available');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error.response?.data?.message || 'An error occurred while placing your order');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-slate-900 text-white py-8 px-4'>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 shadow-lg">
                            <Title text1={"SHIPPING"} text2={"INFORMATION"} />

                            <form onSubmit={onSubmitHandler} className="space-y-4 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${formErrors.firstName ? 'border-red-500' : 'border-slate-600'}`}
                                            placeholder='First Name'
                                        />
                                        {formErrors.firstName && <p className="text-red-400 text-sm mt-1">{formErrors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${formErrors.lastName ? 'border-red-500' : 'border-slate-600'}`}
                                            placeholder='Last Name'
                                        />
                                        {formErrors.lastName && <p className="text-red-400 text-sm mt-1">{formErrors.lastName}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${formErrors.email ? 'border-red-500' : 'border-slate-600'}`}
                                        placeholder='Email'
                                    />
                                    {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="street" className="block text-sm font-medium text-slate-300 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        id="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${formErrors.street ? 'border-red-500' : 'border-slate-600'}`}
                                        placeholder='Street Address'
                                    />
                                    {formErrors.street && <p className="text-red-400 text-sm mt-1">{formErrors.street}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${formErrors.city ? 'border-red-500' : 'border-slate-600'}`}
                                            placeholder='City'
                                        />
                                        {formErrors.city && <p className="text-red-400 text-sm mt-1">{formErrors.city}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            id="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${formErrors.state ? 'border-red-500' : 'border-slate-600'}`}
                                            placeholder='State'
                                        />
                                        {formErrors.state && <p className="text-red-400 text-sm mt-1">{formErrors.state}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-medium text-slate-300 mb-1">Zip Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            id="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${formErrors.zipCode ? 'border-red-500' : 'border-slate-600'}`}
                                            placeholder='Zip Code'
                                        />
                                        {formErrors.zipCode && <p className="text-red-400 text-sm mt-1">{formErrors.zipCode}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            id="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${formErrors.country ? 'border-red-500' : 'border-slate-600'}`}
                                            placeholder='Country'
                                        />
                                        {formErrors.country && <p className="text-red-400 text-sm mt-1">{formErrors.country}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${formErrors.phone ? 'border-red-500' : 'border-slate-600'}`}
                                        placeholder='Phone Number'
                                    />
                                    {formErrors.phone && <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>}
                                </div>
                            </form>
                        </div>

                    {/* Right Column - Order Summary & Payment */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 shadow-lg">
                            <Title text1={"ORDER"} text2={"SUMMARY"} />

                            <div className="space-y-4 mt-6">
                                <div className="flex justify-between text-slate-300">
                                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                                    <span>{currency}{cartTotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-slate-300">
                                    <span>Shipping</span>
                                    <span>{cartTotal > 0 ? `${currency}${delivery_fee.toFixed(2)}` : 'Free'}</span>
                                </div>

                                <div className="h-px bg-slate-600/30"></div>

                                <div className="flex justify-between text-xl font-bold text-white">
                                    <span>Total</span>
                                    <span>{currency}{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 shadow-lg">
                            <Title text1={"PAYMENT"} text2={"METHOD"} />

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${method === 'razorpay' ? 'border-sky-500 bg-sky-500/10' : 'border-slate-600 hover:border-slate-500'}`}
                                    onClick={() => setMethod('razorpay')}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <CreditCard className="w-5 h-5" />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'razorpay' ? 'border-sky-500 bg-sky-500' : 'border-slate-500'}`}>
                                            {method === 'razorpay' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                        </div>
                                    </div>
                                    <span className="text-sm">Razorpay</span>
                                </div>

                                <div
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${method === 'COD' ? 'border-sky-500 bg-sky-500/10' : 'border-slate-600 hover:border-slate-500'}`}
                                    onClick={() => setMethod('COD')}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <DollarSign className="w-5 h-5" />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'COD' ? 'border-sky-500 bg-sky-500' : 'border-slate-500'}`}>
                                            {method === 'COD' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                        </div>
                                    </div>
                                    <span className="text-sm">Cash on Delivery</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={onSubmitHandler}
                                disabled={loading}
                                className="w-full mt-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 rounded-lg font-medium flex items-center justify-center transition"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <span>Place Order</span>
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder