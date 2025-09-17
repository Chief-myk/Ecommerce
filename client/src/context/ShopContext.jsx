import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextData } from './AuthContext'
import axios from "axios"
import { UserContextData } from './UserContext';

export const ShopDataContext = createContext();

const ShopContext = ({ children }) => {
    const [products, setProducts] = useState([])
    const [cartItem, setCartItem] = useState({})
    const currency = "$"
    let serverUrl = useContext(AuthContextData);
    const delivery_fee = 50;
    const [search, setSearch] = useState("")
    const { userData } = useContext(UserContextData);

    const getProducts = async () => {
        try {
            const res = await axios.get(`${serverUrl}api/products/listProducts`, {
                withCredentials: true,
            })
            setProducts(res.data)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    const addToCart = async (itemId, size) => {
        if (!size) {
            console.log('Please select a size');
            return;
        }

        let cartData = structuredClone(cartItem);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItem(cartData);

        if (userData) {
            try {
                console.log('Sending cart update to server:', { itemId, size });

                const response = await axios.post(
                    `${serverUrl}api/cart/addToCart`,
                    { itemId, size },
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Server response:', response.data);

            } catch (error) {
                console.error('Error updating cart on server:', error.response?.data || error.message);

                // Revert local cart if server update fails
                let revertCartData = structuredClone(cartItem);
                setCartItem(revertCartData);

                alert('Failed to add item to cart. Please try again.');
            }
        } else {
            console.log('User not logged in, cart only stored locally');
        }
    };

    const getCountItem = () => {
        let totalCount = 0;
        for (const itemId in cartItem) {
            for (const size in cartItem[itemId]) {
                try {
                    if (cartItem[itemId][size] > 0) {
                        totalCount += cartItem[itemId][size]
                    }
                } catch (error) {
                    console.error("Error in getting count of items in cart", error)
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        try {
            let cartData = structuredClone(cartItem);
            
            if (quantity <= 0) {
                // Remove the item if quantity is 0
                if (cartData[itemId]) {
                    delete cartData[itemId][size];
                    if (Object.keys(cartData[itemId]).length === 0) {
                        delete cartData[itemId];
                    }
                }
            } else {
                // Update quantity
                if (!cartData[itemId]) {
                    cartData[itemId] = {};
                }
                cartData[itemId][size] = quantity;
            }
            
            setCartItem(cartData);

            if (userData) {
                await axios.put(`${serverUrl}api/cart/updateCartItem`, { itemId, size, quantity }, {
                    withCredentials: true,
                });
            }
        } catch (error) {
            console.error("Error in updating quantity", error);
            // Revert changes if server update fails
            getUserCart();
        }
    }

    const removeFromCart = async (itemId, size) => {
        try {
            let cartData = structuredClone(cartItem);
            
            // Update local cart
            if (cartData[itemId]) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
            setCartItem(cartData);

            if (userData) {
                await axios.delete(`${serverUrl}api/cart/removeFromCart`, {
                    data: { itemId, size },
                    withCredentials: true,
                });
            }
        } catch (error) {
            console.error("Error in removing item from cart", error);
            // Revert changes if server update fails
            getUserCart();
        }
    }

    const getUserCart = async () => {
        try {
            if (userData) {
                const res = await axios.post(`${serverUrl}api/cart/getUserCart`, {}, {
                    withCredentials: true,
                });
                setCartItem(res.data); // Backend now returns cart data directly
            }
        } catch (error) {
            console.error("Error in getting user cart", error);
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItem) {
            let itemInfo = products.find((product) => product._id === itemId)
            if (itemInfo) {
                for (const size in cartItem[itemId]) {
                    try {
                        if (cartItem[itemId][size] > 0) {
                            totalAmount += itemInfo.price * cartItem[itemId][size]
                        }
                    } catch (error) {
                        console.error("Error calculating cart amount", error)
                    }
                }
            }
        }
        return totalAmount;
    }

    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        if (userData) {
            getUserCart()
        }
    }, [userData])

    const value = {
        products,
        currency,
        delivery_fee,
        getProducts,
        search,
        setSearch,
        cartItem,
        setCartItem,
        addToCart,
        getCountItem,
        updateQuantity,
        getCartAmount,
        getUserCart,
        removeFromCart
    }

    return (
        <ShopDataContext.Provider value={value}>
            {children}
        </ShopDataContext.Provider>
    )
}

export default ShopContext