import React, { useState } from 'react';

// --- SVG Icon Components ---
const StarIcon = ({ filled, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth={filled ? "0" : "1.5"} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" 
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const HeartIcon = ({ filled = false, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" strokeWidth={filled ? "0" : "1.5"} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" 
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const ShoppingBagIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </svg>
);

const TruckIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const ShieldCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

// --- Main Component ---
export default function ProductDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Product data
  const product = {
    name: "Modern Minimalist Backpack",
    price: 129.99,
    rating: 4.8,
    reviewCount: 124,
    description: "Our flagship backpack combines style, durability, and functionality. Crafted from water-resistant materials with premium leather accents, it features multiple compartments including a padded laptop sleeve that fits up to a 16\" laptop.",
    highlights: [
      "Water-resistant polyester with genuine leather trim",
      "Padded 16\" laptop compartment",
      "Anti-theft back pocket",
      "Ergonomic shoulder straps with breathable mesh",
      "Two water bottle side pockets"
    ],
    details: "Dimensions: 18\" × 12\" × 6\" (H×W×D)\nCapacity: 24L\nWeight: 2.2 lbs\nMaterial: 900D Polyester, YKK Zippers, Genuine Leather accents",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541267732407-8f7acf38d122?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Black", value: "#2C3038" },
      { name: "Navy", value: "#2B4353" },
      { name: "Olive", value: "#5B6D5B" },
      { name: "Burgundy", value: "#862B35" }
    ],
    sizes: ["S", "M", "L"]
  };

  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Generate stars for rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon key={i} filled={i <= Math.round(rating)} className="w-4 h-4 text-amber-400" />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-1 text-sm">
            <li>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Home</a>
            </li>
            <li className="text-gray-500 dark:text-gray-400">/</li>
            <li>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Bags</a>
            </li>
            <li className="text-gray-500 dark:text-gray-400">/</li>
            <li>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Backpacks</a>
            </li>
            <li className="text-gray-500 dark:text-gray-400">/</li>
            <li className="text-gray-900 dark:text-gray-200 font-medium">Modern Minimalist Backpack</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          {/* Product Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
              <img 
                src={product.images[currentImageIndex]} 
                alt={`${product.name} - View ${currentImageIndex + 1}`}
                className="object-cover h-full w-full"
              />
              
              {/* Navigation buttons */}
              <button 
                onClick={prevImage} 
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Previous image"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              
              <button 
                onClick={nextImage} 
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Next image"
              >
                <ArrowRightIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    currentImageIndex === idx 
                      ? 'ring-2 ring-indigo-600 dark:ring-indigo-400' 
                      : 'ring-1 ring-gray-200 dark:ring-gray-700'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="object-cover h-full w-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2 flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-full ${
                  isWishlisted 
                    ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400'
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <HeartIcon filled={isWishlisted} className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-4 mb-6">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
              <span className="ml-2 text-sm text-green-600 dark:text-green-400">In stock</span>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8" aria-label="Product information tabs">
                {['description', 'details', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab content */}
            <div className="mb-8">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Highlights</h3>
                  <ul className="space-y-2">
                    {product.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckIcon className="text-green-500 dark:text-green-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {product.details}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TruckIcon className="text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Free shipping</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheckIcon className="text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">30-day returns</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Hassle-free returns</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Color</h3>
              <div className="flex items-center space-x-3 mt-2">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative rounded-full h-8 w-8 flex items-center justify-center ${
                      selectedColor === color.name 
                        ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-900' 
                        : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Color: ${color.name}`}
                  >
                    {selectedColor === color.name && (
                      <span className="text-white">
                        <CheckIcon className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Size</h3>
                <a href="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Size guide</a>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border rounded-md py-2 px-3 flex items-center justify-center text-sm font-medium ${
                      selectedSize === size
                        ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500'
                        : 'border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    disabled={quantity <= 1}
                  >
                    <span className="sr-only">Decrease quantity</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border-0 focus:ring-0 bg-transparent text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <span className="sr-only">Increase quantity</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  Add to cart
                </button>
              </div>
              <button
                type="button"
                className="mt-4 w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}