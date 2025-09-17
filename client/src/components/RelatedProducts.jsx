import React, { useContext, useState, useEffect } from 'react'
import { ShopDataContext } from "../context/ShopContext"
import Title from "../components/Title"
import { Star, StarHalf, ShoppingCart, Heart } from "lucide-react"
import { Link } from "react-router-dom"

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products, currency, addToCart } = useContext(ShopDataContext)
  const [related, setRelated] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])

  useEffect(() => {
    if (products && products.length > 0) {
      let productsCopy = [...products]
      
      // Filter by category if provided
      if (category) {
        productsCopy = productsCopy.filter(item => category === item.category)
      }
      
      // Filter by subcategory if provided
      if (subCategory) {
        productsCopy = productsCopy.filter(item => subCategory === item.subCategory)
      }
      
      // Exclude current product
      productsCopy = productsCopy.filter(item => currentProductId !== item._id)
      
      // Limit to 4 related products
      setRelated(productsCopy.slice(0, 4))
    }
  }, [products, category, subCategory, currentProductId])

  const toggleWishlist = (productId) => {
    if (wishlistItems.includes(productId)) {
      setWishlistItems(wishlistItems.filter(id => id !== productId))
    } else {
      setWishlistItems([...wishlistItems, productId])
    }
  }

  const handleAddToCart = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const itemToAdd = {
      ...product,
      quantity: 1
    }
    
    addToCart(itemToAdd)
    // You might want to show a notification here instead of alert
  }

  if (!related || related.length === 0) {
    return null // Don't render anything if no related products
  }

  return (
    <div className="mb-16">
      <Title text1={"Related"} text2={"Products"} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
        {related.map((item, index) => (
          <div key={index} className="group bg-slate-800/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <Link to={`/productDetail/${item._id}`} className="block">
              <div className="relative overflow-hidden">
                <img 
                  src={item.image1} 
                  alt={item.name} 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Wishlist button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleWishlist(item._id)
                  }}
                  className="absolute top-3 right-3 p-2 bg-slate-900/70 rounded-full hover:bg-slate-800 transition-colors"
                >
                  <Heart 
                    size={18} 
                    className={wishlistItems.includes(item._id) ? "fill-red-500 text-red-500" : "text-white"} 
                  />
                </button>
                
                {/* Add to cart button */}
                <button 
                  onClick={(e) => handleAddToCart(item, e)}
                  className="absolute bottom-3 right-3 p-2 bg-teal-600 rounded-full hover:bg-teal-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ShoppingCart size={18} className="text-white" />
                </button>
                
                {/* Discount badge */}
                {item.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-blue-100 mb-2 line-clamp-1 hover:text-teal-300 transition-colors">
                  {item.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <StarHalf size={14} className="fill-current" />
                  </div>
                  <span className="text-xs text-gray-400">(42)</span>
                </div>
                
                {/* Price */}
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-lg font-bold text-teal-300">
                      {currency}{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        {currency}{item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts