import React, { useContext, useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { ShopDataContext } from "../context/ShopContext"
import { Star, StarHalf, Heart, Share2, Truck, RotateCcw, ShieldCheck, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react"
import RelatedProducts from '../components/RelatedProducts'
import { useNavigate } from 'react-router-dom'
import { UserContextData } from '../context/UserContext'
import {toast} from "react-toastify"


const ProductDetail = () => {
    let { productId } = useParams()
    let { products, currency } = useContext(ShopDataContext)
    const [productData, setProductData] = useState(null)
    const [selectedImage, setSelectedImage] = useState('')
    const [size, setSize] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [activeTab, setActiveTab] = useState('description')
    const navigate = useNavigate()
    const { addToCart } = useContext(ShopDataContext)
    const { userData } = useContext(UserContextData)




    useEffect(() => {
        if (products && products.length > 0) {
            const fetchProductData = () => {
                let foundProduct = null

                // Use for loop instead of forEach to avoid issues with undefined products
                for (let i = 0; i < products.length; i++) {
                    if (products[i]._id === productId) {
                        foundProduct = products[i]
                        break
                    }
                }

                if (foundProduct) {
                    setProductData(foundProduct)
                    setSelectedImage(foundProduct.image1)
                }
            }

            fetchProductData()
        }
    }, [products, productId])

    useEffect(() => {
        if (productData) {
            setSelectedImage(productData.image1);
            setSize('');
            setQuantity(1);
            setIsWishlisted(false);
        }
    }, [productData?._id]);

    const handleSizeSelect = (selectedSize) => {
        setSize(selectedSize)
    }

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1)
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }


    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted)
    }

    const handleSubmit = () => {
        if (!userData) {
            toast.error('Please log in to add items to your cart.');
            return;
        }
        else if (!size) {
            toast.error('Please select a size before adding to cart.');
            return;
        }
        addToCart(productData._id, size);
        setTimeout(() => {
            // alert('Item added to cart!');
            toast.success("Item added to cart!!!")
        }, 1000);
    }

    if (!products) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-slate-700 to-slate-900">
                <div className="text-white text-xl">Loading products...</div>
                </div>
            )
        }

        if (!productData) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-slate-700 to-slate-900">
                    <div className="text-white text-xl">Product not found</div>
                </div>
            )
        }





        return (
            <div className="min-h-screen bg-gradient-to-l from-slate-700 to-slate-900 text-white pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Breadcrumb Navigation */}
                    <nav className="flex mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-teal-300 hover:text-teal-200 transition-colors"
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            Back to Products
                        </button>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* Product Images */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Thumbnails */}
                            <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1">
                                {[productData.image1, productData.image2, productData.image3, productData.image4].map((img, index) => (
                                    img && (
                                        <div
                                            key={index}
                                            className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === img ? 'border-teal-400' : 'border-gray-600'}`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`${productData.name} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="w-full order-1 md:order-2">
                                <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-square">
                                    <img
                                        src={selectedImage}
                                        alt={productData.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                    <button
                                        onClick={toggleWishlist}
                                        className="absolute top-4 right-4 p-2 bg-slate-800/80 rounded-full hover:bg-slate-700 transition-colors"
                                    >
                                        <Heart
                                            size={24}
                                            className={isWishlisted ? "fill-red-500 text-red-500" : "text-white"}
                                        />
                                    </button>
                                    <button className="absolute top-16 right-4 p-2 bg-slate-800/80 rounded-full hover:bg-slate-700 transition-colors">
                                        <Share2 size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-blue-100">{productData.name.toUpperCase()}</h1>
                                <div className="flex items-center mt-2">
                                    <div className="flex text-yellow-400 mr-2">
                                        <Star size={18} className="fill-current" />
                                        <Star size={18} className="fill-current" />
                                        <Star size={18} className="fill-current" />
                                        <Star size={18} className="fill-current" />
                                        <StarHalf size={18} className="fill-current" />
                                    </div>
                                    <span className="text-gray-300">(124 reviews)</span>
                                </div>
                            </div>

                            <div className="text-2xl font-bold text-teal-300">
                                {currency}{productData.price}
                                {productData.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through ml-2">
                                        {currency}{productData.originalPrice}
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-300 leading-relaxed">
                                {productData.description}
                            </p>

                            {/* Size Selection */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-blue-100">Select Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {productData.sizes && productData.sizes.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSizeSelect(item)}
                                            className={`px-4 py-2 rounded-lg border-2 transition-all ${size === item ? 'border-teal-400 bg-teal-400/10 text-white' : 'border-gray-600 text-gray-300 hover:border-teal-400'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-blue-100">Quantity</h3>
                                <div className="flex items-center">
                                    <button
                                        onClick={decrementQuantity}
                                        className="p-2 bg-slate-800 rounded-l-lg border border-gray-600 hover:bg-slate-700"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="px-4 py-2 bg-slate-800 border-t border-b border-gray-600 min-w-[3rem] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={incrementQuantity}
                                        className="p-2 bg-slate-800 rounded-r-lg border border-gray-600 hover:bg-slate-700"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button

                                onClick={() => handleSubmit()}
                                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${!size ? 'bg-gray-600 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-500'}`}
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>

                            {/* Policy Highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                                <div className="flex items-center">
                                    <Truck size={20} className="text-teal-400 mr-2" />
                                    <span className="text-sm">Free Shipping</span>
                                </div>
                                <div className="flex items-center">
                                    <RotateCcw size={20} className="text-teal-400 mr-2" />
                                    <span className="text-sm">7-Day Returns</span>
                                </div>
                                <div className="flex items-center">
                                    <ShieldCheck size={20} className="text-teal-400 mr-2" />
                                    <span className="text-sm">1-Year Warranty</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <div className="mb-16">
                        <div className="border-b border-gray-700">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`py-3 px-4 font-medium ${activeTab === 'description' ? 'text-teal-300 border-b-2 border-teal-300' : 'text-gray-400'}`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`py-3 px-4 font-medium ${activeTab === 'details' ? 'text-teal-300 border-b-2 border-teal-300' : 'text-gray-400'}`}
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`py-3 px-4 font-medium ${activeTab === 'reviews' ? 'text-teal-300 border-b-2 border-teal-300' : 'text-gray-400'}`}
                                >
                                    Reviews (124)
                                </button>
                            </nav>
                        </div>

                        <div className="py-6">
                            {activeTab === 'description' && (
                                <div className="text-gray-300 space-y-4">
                                    <p>{productData.description}</p>
                                    <p>Our premium product is crafted with attention to detail and made from high-quality materials to ensure durability and comfort. Designed for everyday use while maintaining style and functionality.</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>100% Original Product</li>
                                        <li>Cash on Delivery available</li>
                                        <li>Easy return and exchange policy within 7 days</li>
                                        <li>1-year manufacturer warranty</li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'details' && (
                                <div className="text-gray-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-blue-100 mb-2">Product Details</h4>
                                            <p><span className="font-medium">Material:</span> Premium quality fabric</p>
                                            <p><span className="font-medium">Care:</span> Machine wash cold</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-100 mb-2">Dimensions</h4>
                                            <p><span className="font-medium">Weight:</span> 450g</p>
                                            <p><span className="font-medium">SKU:</span> {productData._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'reviews' && (
                                <div className="text-gray-300">
                                    <div className="flex items-center mb-6">
                                        <div className="mr-4">
                                            <div className="text-3xl font-bold">4.5</div>
                                            <div className="flex text-yellow-400">
                                                <Star size={16} className="fill-current" />
                                                <Star size={16} className="fill-current" />
                                                <Star size={16} className="fill-current" />
                                                <Star size={16} className="fill-current" />
                                                <StarHalf size={16} className="fill-current" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm">Based on 124 reviews</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="border-b border-gray-700 pb-4">
                                            <div className="flex justify-between mb-2">
                                                <div className="font-semibold">Rahul Sharma</div>
                                                <div className="text-sm text-gray-400">2 days ago</div>
                                            </div>
                                            <div className="flex text-yellow-400 mb-2">
                                                <Star size={14} className="fill-current" />
                                                <Star size={14} className="fill-current" />
                                                <Star size={14} className="fill-current" />
                                                <Star size={14} className="fill-current" />
                                                <Star size={14} className="fill-current" />
                                            </div>
                                            <p>Excellent product quality! Fits perfectly and the material is very comfortable. Will definitely purchase again.</p>
                                        </div>

                                        <div className="border-b border-gray-700 pb-4">
                                            <div className="flex justify-between mb-2">
                                                <div className="font-semibold">Priya Patel</div>
                                                <div className="text-sm text-gray-400">1 week ago</div>
                                            </div>
                                            <div className="flex text-yellow-400 mb-2">
                                                <Star size={14} className="fill-current" />
                                                <Star size={14} className="fill-current" />
                                                <Star size={14} className="fill-current" />
                                                <Star size={14} className="fill-current" />
                                                <Star size={14} className="fill-current" />
                                            </div>
                                            <p>Fast delivery and the product exceeded my expectations. The size chart was accurate too!</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    <RelatedProducts currentProductId={productId} Category={productData.Category} subCategory={productData.subCategory} currentPrroductId={productData._id} />
                </div>
            </div>
        )
    }

    export default ProductDetail