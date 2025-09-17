import React, { useContext, useEffect, useState } from 'react'
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import { AuthContextData } from '../context/AuthContext'
import axios from 'axios'
import { Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

const List = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const { serverUrl } = useContext(AuthContextData)

  const fetchList = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get(`${serverUrl}/api/products/listProducts`, {
        withCredentials: true,
      })
      setList(res.data.reverse())
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (id) => {
    try {
      setDeletingId(id)
      const res = await axios.delete(`${serverUrl}/api/products/removeProduct/${id}`, {
        withCredentials: true,
      })
      
      if (res.data) {
        // Remove the item from local state instead of refetching the entire list
        setList(prevList => prevList.filter(item => item._id !== id))
        toast.success("Item Removed Successfully")
      } else {
        setError('Failed to remove product')
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.error('Error removing product:', error)
      setError('Failed to remove product. Please try again.')
      toast.error("Something went wrong")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-l from-slate-700 to-slate-900 text-white'>
        <NavBar />
        <SideBar />
        <div className="ml-20 p-6 mt-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-l from-slate-700 to-slate-900 text-white flex'>
      <NavBar />
      <SideBar />
      <div className='flex-1 mt-20 p-6'>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Product List</h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {list.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found</p>
              <p className="text-gray-500 text-sm mt-2">Add some products to see them listed here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((item) => (
                <div key={item._id} className='bg-slate-600/50 backdrop-blur-sm flex justify-between items-center rounded-xl w-full p-5 border border-slate-500/30 hover:bg-slate-600/70 transition-colors'>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg overflow-hidden">
                      {item.image1 ? (
                        <img 
                          src={item.image1} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-600">
                          <span className="text-xs text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="text-sm text-gray-300 capitalize">{item.category}</div>
                      <div className="text-blue-300 font-medium">${item.price}</div>
                      {item.quantity && (
                        <div className="text-xs text-gray-400">Stock: {item.quantity}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={() => removeItem(item._id)}
                      disabled={deletingId === item._id}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete product"
                    >
                      {deletingId === item._id ? (
                        <div className="w-5 h-5 border-t-2 border-red-400 rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default List