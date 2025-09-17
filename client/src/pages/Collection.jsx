import React, { useContext, useState, useEffect, useMemo } from 'react';
import { ShopDataContext } from "../context/ShopContext";
import Title from '../components/Title';
import { Link } from 'react-router-dom';

const Collection = () => {
  const { products, currency, search, setSearch } = useContext(ShopDataContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Apply filters and sorting
  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setFilterProducts([]);
      return;
    }

    let filtered = [...products];


    // Apply category filter
    if (categories.length > 0) {
      filtered = filtered.filter(item =>
        item.category && categories.includes(item.category)
      );
    }

    // Apply subcategory filter
    if (subCategories.length > 0) {
      filtered = filtered.filter(item =>
        item.subCategory && subCategories.includes(item.subCategory)
      );
    }

    if (search) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }


    // Apply sorting
    switch (sortType) {
      case "low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // Relevant sorting (no change)
        break;
    }

    setFilterProducts(filtered);
  }, [products, categories, subCategories, sortType, search]);

  const toggleCategory = (category) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const toggleSubCategory = (subCategory) => {
    setSubCategories(prev =>
      prev.includes(subCategory)
        ? prev.filter(item => item !== subCategory)
        : [...prev, subCategory]
    );
  };

  const FilterSection = ({ title, items, selectedItems, toggleFunction }) => (
    <div className="bg-slate-800 p-4 rounded-lg mb-4">
      <h2 className="text-lg font-semibold mb-3 text-white">{title}</h2>
      <div className="space-y-2">
        {items.map(item => (
          <label key={item} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-slate-700 rounded-md transition-colors">
            <input
              type="checkbox"
              value={item}
              checked={selectedItems.includes(item)}
              onChange={() => toggleFunction(item)}
              className="w-5 h-5 accent-teal-500 cursor-pointer"
            />
            <span className="text-white">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <Link to={`/productDetail/${product._id}`}>
    <div className="group w-full sm:w-64 h-80 bg-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={product.image1 || product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
          }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-blue-100 font-medium text-sm truncate">{product.name}</h3>
        <p className="text-teal-300 font-bold text-lg mt-2">{currency}{product.price}</p>
      </div>
    </div>
      </Link>

  );

  // Get unique categories and subcategories
  const uniqueCategories = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return [...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  const uniqueSubCategories = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return [...new Set(products.map(p => p.subCategory).filter(Boolean))];
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-l from-slate-700 p-4 pt-24 to-slate-900 text-white">
      <div className="flex flex-col lg:flex-row gap-6 mx-auto">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-slate-800 text-white px-4 py-3 rounded-lg w-full flex justify-between items-center hover:bg-slate-700 transition-colors"
          >
            <span className="font-medium">Filters</span>
            <span className="text-teal-400">{isFilterOpen ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* Filters sidebar */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block lg:w-1/5`}>
          <div className="sticky top-28 space-y-4">
            <div className="bg-slate-800 p-5 rounded-lg shadow-lg">
              <h1 className="text-xl font-semibold mb-5 text-white border-b border-slate-600 pb-2">Filters</h1>

              <FilterSection
                title="Categories"
                items={uniqueCategories}
                selectedItems={categories}
                toggleFunction={toggleCategory}
              />

              <FilterSection
                title="Sub Categories"
                items={uniqueSubCategories}
                selectedItems={subCategories}
                toggleFunction={toggleSubCategory}
              />
            </div>

            {/* Clear filters button */}
            {(categories.length > 0 || subCategories.length > 0) && (
              <button
                onClick={() => {
                  setCategories([]);
                  setSubCategories([]);
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Products section */}
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">All Collections</h1>
              {/* <p className="text-slate-300 mt-1">
                {filterProducts.length} product{filterProducts.length !== 1 ? 's' : ''} found
              </p> */}
            </div>

            <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg">
              <span className="text-slate-300 text-sm">Sort by:</span>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="relevant">Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filterProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-800 rounded-lg">
              <p className="text-slate-300 text-lg mb-4">No products found with the current filters.</p>
              <button
                onClick={() => {
                  setCategories([]);
                  setSubCategories([]);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterProducts.map((product, index) => (
                <ProductCard key={product.id || index} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;