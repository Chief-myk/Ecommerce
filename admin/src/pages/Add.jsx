import React, { useContext, useState } from 'react';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Upload, X, Plus, Check } from 'lucide-react';
import { AuthContextData } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
  const { serverUrl } = useContext(AuthContextData);
  const [sizes, setSizes] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState({
    Image1: null, // Changed to match backend (capital I)
    Image2: null,
    Image3: null,
    Image4: null
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '', // Changed to match backend (capital C)
    color: '',
    brand: '',
    quantity: ''
  });

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setImages(prev => ({ ...prev, [imageKey]: file }));
    }
  };

  const removeImage = (imageKey) => {
    setImages(prev => ({ ...prev, [imageKey]: null }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSize = (size) => {
    setSizes(prev =>
      prev.includes(size)
        ? prev.filter(item => item !== size)
        : [...prev, size]
    );
  };

  const handleCheckBoxToggle = () => {
    setIsBestSeller(prev => !prev);
  };

  const submitFormData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.brand || !formData.price || !formData.category) {
        alert('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Validate that at least one image is uploaded
      const hasImages = Object.values(images).some(img => img !== null);
      if (!hasImages) {
        alert('Please upload at least one product image');
        setIsLoading(false);
        return;
      }

      // Create FormData object to handle file uploads
      const data = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      // Append images (only non-null ones) - FIXED: Use correct field names
      Object.keys(images).forEach(key => {
        if (images[key]) {
          data.append(key, images[key]); // Use the actual key (Image1, Image2, etc.)
        }
      });

      // Append sizes and bestseller status - FIXED: Use correct field names
      data.append('sizes', JSON.stringify(sizes));
      data.append('bestSeller', isBestSeller); // Changed to match backend

      const res = await axios.post(`${serverUrl}/api/products/addproduct`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        alert('Product added successfully!');
        // Reset form
        setFormData({
          name: '',
          brand: '',
          color: '',
          description: '',
          price: '',
          category: '',
          subCategory: '', // Changed to match
          quantity: ''
        });
        setImages({
          Image1: null, // Changed to match
          Image2: null,
          Image3: null,
          Image4: null
        });
        setSizes([]);
        setIsBestSeller(false);
        toast.success("Product Added Successfullt")
      } else {
        // alert('Failed to add product: ' + res.data.message);
        toast.error("Failed to add product")
      }
    } catch (error) {
      console.error('Error adding product:', error);
        toast.error("Failed to add product")

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Unknown server error';
        alert(`Error (${status}): ${message}`);
      } else if (error.request) {
        alert('Network error. Please check your connection and server status.');
      } else {
        alert('Error adding product. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className='min-h-screen bg-gradient-to-l from-slate-700 to-slate-900 text-white flex'>
      <SideBar />

      <NavBar />
      <div className="flex-1 mt-10 ml-20 p-6">

        <div className="max-w-4xl mx-auto mt-8">
          <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

          <form onSubmit={submitFormData} className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Product Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Image1', 'Image2', 'Image3', 'Image4'].map((imageKey, index) => ( // Changed to capital
                  <div key={imageKey} className="relative">
                    <label
                      htmlFor={imageKey}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-40 cursor-pointer transition-colors ${images[imageKey]
                          ? 'border-slate-600'
                          : 'border-slate-500 hover:border-blue-500'
                        }`}
                    >
                      {images[imageKey] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={URL.createObjectURL(images[imageKey])}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeImage(imageKey);
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center p-4">
                          <Upload size={24} className="mb-2 text-slate-400" />
                          <span className="text-sm text-slate-400">Upload Image</span>
                        </div>
                      )}
                    </label>
                    <input
                      type="file"
                      id={imageKey}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, imageKey)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium mb-2">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label htmlFor="subCategory" className="block text-sm font-medium mb-2"> {/* Changed id */}
                  Sub Category *
                </label>
                <select
                  id="subCategory" // Changed to match backend
                  name="subCategory" // Changed to match backend
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a sub category</option>
                  <option value="Upper Wear">Upper Wear</option>
                  <option value="Lower Wear">Lower Wear</option>
                  <option value="Inner Wear">Inner Wear</option>
                </select>
              </div>


              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(size => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-md transition-colors ${sizes.includes(size)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="bestseller"
                  name="bestseller"
                  checked={isBestSeller}
                  onChange={handleCheckBoxToggle}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="bestseller" className="ml-2 text-sm">
                  Mark as Best Seller
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  'Adding Product...'
                ) : (
                  <>
                    <Plus size={20} className="mr-2" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;