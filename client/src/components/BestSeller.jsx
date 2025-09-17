import React, { useContext, useEffect, useState } from 'react';
import { ShopDataContext } from '../context/ShopContext';
import Title from './Title';

const BestSeller = () => {
    const { currency, products } = useContext(ShopDataContext);
    const [BestSeller, setBestSeller] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (products && Array.isArray(products)) {
        const filterProducts = products.filter((item)=>item.bestSeller)
        setBestSeller(filterProducts.slice(0, 5));
        // setBestSeller(filterProducts);

        setIsLoading(false);
      } else {
        setBestSeller([]);
        setIsLoading(false);
      }
    }, [products]);
  
  
    const ProductCard = ({ product }) => {
      return (
        <div className='group w-64 h-96 bg-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer'>
          <a href={`/productDetail/${product._id}`}>
          <div className='relative w-full h-64 overflow-hidden'>
            <img
              src={product.image1}
              alt={product.name}
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
              }}
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </div>
          <div className='p-4'>
            <h3 className='text-blue-100 font-medium text-lg truncate'>{product.name}</h3>
            <p className='text-teal-300 font-bold text-xl mt-2'>{currency}{product.price}</p>
          </div>
          </a>
        </div>
      );
    };
  
    const SkeletonLoader = () => {
      return (
        <div className='animate-pulse w-64 h-96 bg-gray-700/30 rounded-xl overflow-hidden'>
          <div className='w-full h-64 bg-gray-600/50'></div>
          <div className='p-4 space-y-2'>
            <div className='h-4 bg-gray-600/50 rounded'></div>
            <div className='h-6 w-16 bg-gray-600/50 rounded'></div>
          </div>
        </div>
      );
    };
  
    if (isLoading) {
      return (
        <section className='container mx-auto px-4 py-12'>
          <header className='text-center mb-12'>
            <Title text1={"Latest"} text2={"Collection"} />
            <p className='text-blue-100/80 max-w-2xl mx-auto'>
              Step Into Style - New Collection Dropping this Season
            </p>
          </header>
          <div className='flex flex-wrap justify-center gap-8'>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        </section>
      );
    }
  return (
    <section className='container mx-auto px-4 py-12'>
      <header className='text-center mb-12'>
        <Title text1={"Best"} text2={"Products"} />
        <p className='text-blue-100/80 max-w-2xl mx-auto'>
         Tried, Tasted And Loved - Try All time Favouite
        </p>
      </header>

      {BestSeller.length > 0 ? (
        <div className='flex flex-wrap ml-8 gap-8'>
          {BestSeller.map((item, index) => (
            <ProductCard key={item.id || index} product={item} />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-blue-100/80 text-lg'>No Best products available at the moment.</p>
        </div>
      )}
    </section>
  )
}

export default BestSeller