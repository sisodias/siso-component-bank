import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Sun, Moon } from 'lucide-react';

const ProductCard = ({ 
  product, 
  isDark = false,
  onAddToCart,
  onToggleWishlist 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product.id, !isWishlisted);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  // Theme classes
  const cardClasses = isDark 
    ? 'bg-gray-800 text-white border-gray-700' 
    : 'bg-white text-gray-900 border-gray-200';
  
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const buttonPrimary = isDark 
    ? 'bg-blue-600 hover:bg-blue-700' 
    : 'bg-blue-500 hover:bg-blue-600';
  const wishlistButton = isDark 
    ? 'bg-gray-700 hover:bg-gray-600' 
    : 'bg-white hover:bg-gray-50';

  return (
    <div className={`
      max-w-sm mx-auto rounded-xl border shadow-lg hover:shadow-xl 
      transition-all duration-300 overflow-hidden group transform hover:scale-[1.02]
      ${cardClasses}
    `}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`
            absolute top-4 right-4 p-2.5 rounded-full transition-all duration-200 
            ${wishlistButton} ${isWishlisted ? 'text-red-500' : textMuted} 
            hover:scale-110 shadow-lg backdrop-blur-sm
          `}
        >
          <Heart 
            size={20} 
            fill={isWishlisted ? 'currentColor' : 'none'} 
          />
        </button>

        {/* Sale Badge */}
        {product.salePrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
          </div>
        )}

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <p className={`text-xs uppercase tracking-wider font-semibold mb-2 ${textMuted}`}>
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="font-bold text-xl mb-3 leading-tight line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                size={16}
                className={`${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : textMuted
                }`}
              />
            ))}
          </div>
          <span className={`text-sm font-medium ${textSecondary}`}>
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-red-500">
                  ${product.salePrice}
                </span>
                <span className={`text-lg line-through ${textMuted}`}>
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                ${product.price}
              </span>
            )}
          </div>
          
          {product.inStock && (
            <span className="text-sm text-green-500 font-semibold bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
              ✓ In Stock
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`
            w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 
            flex items-center justify-center space-x-2 text-white
            ${product.inStock
              ? `${buttonPrimary} hover:shadow-lg active:scale-95 transform`
              : `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
            }
          `}
        >
          <ShoppingCart size={20} />
          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sample product
  const product = {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 199.99,
    salePrice: 149.99,
    image: "https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 128,
    inStock: true
  };

  const handleAddToCart = (product) => {
    alert(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (productId, isWishlisted) => {
    alert(`Product ${isWishlisted ? 'added to' : 'removed from'} wishlist!`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header with Dark Mode Toggle */}
      <div className={`sticky top-0 z-10 backdrop-blur-md transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800/90 text-white border-gray-700' : 'bg-white/90 text-gray-900 border-gray-200'
      } border-b`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">ShopMart</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Premium Products
            </p>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            } hover:scale-110`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Product Card Container */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-center">
          <ProductCard
            product={product}
            isDark={isDarkMode}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />
        </div>
        
        {/* Demo Info */}
        <div className={`mt-12 text-center ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <p className="text-sm">
            Toggle the theme and try the wishlist & cart buttons!
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;