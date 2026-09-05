"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Heart, Trash2, Plus, Minus } from "lucide-react"

interface CartItem {
  id: string
  name: string
  category: string
  color: string
  size: string
  quantity: number
  price: number
  image: string
}

interface FavoriteItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface ShoppingCartCheckoutProps {
  cartItems: CartItem[]
  favoriteItems: FavoriteItem[]
  onAddToCart?: (itemId: string) => void
  onRemoveFromCart?: (itemId: string) => void
  onUpdateQuantity?: (itemId: string, quantity: number) => void
  shippingCost?: number
  showShippingOption?: boolean
}

export const ShoppingCartCheckout: React.FC<ShoppingCartCheckoutProps> = ({
  cartItems,
  favoriteItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  shippingCost = 0,
  showShippingOption = true,
}) => {
  const [hoveredFavorite, setHoveredFavorite] = useState<string | null>(null)
  const [hoveredCart, setHoveredCart] = useState<string | null>(null)
  const [showPromoCode, setShowPromoCode] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + shippingCost

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 dark:from-background dark:to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <span className="text-primary-foreground font-bold">🛍</span>
            </div>
            <h1 className="text-2xl font-bold">Shopping Bag</h1>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="hidden sm:block px-4 py-2 rounded-full bg-muted text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Heart className="w-6 h-6 cursor-pointer hover:fill-destructive hover:text-destructive transition-all duration-300" />
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              {cartItems.length}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Shipping Banner */}
            {showShippingOption && (
              <div className="mb-6 p-4 bg-muted rounded-lg border border-border animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Not in a hurry?</p>
                    <p className="text-sm text-muted-foreground">
                      Select <span className="font-medium">No Rush Shipping</span> at checkout
                    </p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">✕</button>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-6 animate-in fade-in slide-in-from-left-2 duration-700">Bag</h2>

            {/* Cart Items List */}
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                  onMouseEnter={() => setHoveredCart(item.id)}
                  onMouseLeave={() => setHoveredCart(null)}
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className={`object-cover transition-transform duration-500 ${
                        hoveredCart === item.id ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-sm text-muted-foreground">{item.color}</p>

                    {/* Size & Quantity */}
                    <div className="flex gap-4 mt-3">
                      <select className="px-3 py-1 text-sm border border-border rounded-md bg-background hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>{item.size}</option>
                      </select>
                      <div className="flex items-center gap-2 border border-border rounded-md bg-background px-2">
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-2 font-semibold">{item.quantity}</span>
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="mt-4 text-sm">
                      <p className="font-semibold text-foreground">Free Shipping</p>
                      <p className="text-muted-foreground">Arrives Wed, Aug 24 - Fri, Aug 26</p>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-xl font-bold">${item.price}</span>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted rounded-full transition-colors group">
                        <Heart className="w-5 h-5 group-hover:fill-destructive group-hover:text-destructive transition-all" />
                      </button>
                      <button
                        className="p-2 hover:bg-destructive/10 rounded-full transition-colors group"
                        onClick={() => onRemoveFromCart?.(item.id)}
                      >
                        <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Favorites Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold mb-6 animate-in fade-in slide-in-from-left-2 duration-700">
                Favorites
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {favoriteItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="group p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: "both",
                    }}
                    onMouseEnter={() => setHoveredFavorite(item.id)}
                    onMouseLeave={() => setHoveredFavorite(null)}
                  >
                    {/* Favorite Image */}
                    <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden flex item-center justify-center bg-muted mb-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className={`object-cover transition-transform duration-500 ${
                          hoveredFavorite === item.id ? "scale-80" : "scale-70"
                        }`}
                      />
                    </div>

                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <p className="text-lg font-bold mt-2">${item.price}</p>

                    <button
                      onClick={() => onAddToCart?.(item.id)}
                      className="mt-4 w-full py-2 px-4 rounded-full border border-foreground text-foreground hover:bg-foreground hover:text-background font-semibold transition-all duration-300 transform group-hover:scale-105"
                    >
                      Add to Bag
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-card rounded-lg border border-border shadow-lg animate-in fade-in slide-in-from-right-4 duration-700">
              <h2 className="text-2xl font-bold mb-6">Summary</h2>

              {/* Promo Code */}
              <div className="mb-6 pb-6 border-b border-border">
                <button
                  onClick={() => setShowPromoCode(!showPromoCode)}
                  className="flex items-center gap-2 text-foreground hover:text-primary font-semibold transition-colors"
                >
                  <span>Do you have a Promo Code?</span>
                  <span className={`transition-transform duration-300 ${showPromoCode ? "rotate-180" : ""}`}>▼</span>
                </button>
                {showPromoCode && (
                  <input
                    type="text"
                    placeholder="Enter code..."
                    className="mt-3 w-full px-3 py-2 rounded-md bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary animate-in fade-in slide-in-from-top-2 duration-300"
                  />
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border animate-in fade-in duration-700">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Shipping & Handling</span>
                  <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="font-semibold">—</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6 pb-6 border-b border-border">
                <span className="text-lg font-bold">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button className="w-full py-3 rounded-full bg-foreground text-background font-bold text-lg hover:bg-primary transition-all duration-300 transform hover:scale-105 active:scale-95 mb-3 shadow-lg hover:shadow-xl">
                Checkout
              </button>

              {/* PayPal Button */}
              <button className="w-full py-3 rounded-full bg-muted text-foreground font-semibold hover:bg-muted/80 transition-all duration-300 transform hover:scale-105 active:scale-95">
                PayPal
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
