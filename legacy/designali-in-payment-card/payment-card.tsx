"use client"

import { useState } from "react"
import { LiquidCard, CardContent } from "./liquid-glass-card"
import { Input } from "./input"
import { Label } from "./label"
import { Button } from "./liquid-glass-button"

export function CreditCardForm() {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })

  const [isFlipped, setIsFlipped] = useState(false)

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  // Format expiry date MM/YY
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  // Detect card type based on number
  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, "")
    if (num.startsWith("4")) return "visa"
    if (num.startsWith("5") || num.startsWith("2")) return "mastercard"
    if (num.startsWith("3")) return "amex"
    return "default"
  }

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "number") {
      formattedValue = formatCardNumber(value)
      if (formattedValue.length > 19) return // Max length with spaces
    } else if (field === "expiry") {
      formattedValue = formatExpiry(value)
      if (formattedValue.length > 5) return // MM/YY format
    } else if (field === "cvv") {
      formattedValue = value.replace(/[^0-9]/g, "")
      if (formattedValue.length > 4) return // Max 4 digits
    } else if (field === "name") {
      formattedValue = value.toUpperCase()
    }

    setCardData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }))
  }

  const cardType = getCardType(cardData.number)

  return (
    <div className="p-6 mx-auto max-w-md space-y-6">
      {/* Credit Card Mockup */}
      <div className="relative h-60 w-full perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of Card */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <LiquidCard className="w-full mx-auto max-w-md h-60 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white border-0 shadow-2xl">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                {/* Card Type Logo */}
                <div className="flex justify-between items-start">
                  <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
                    <div className="w-6 h-4 bg-yellow-300 rounded-full"></div>
                  </div>
                  <div className="text-right">
                    {cardType === "visa" && <div className="text-2xl font-bold">VISA</div>}
                    {cardType === "mastercard" && (
                      <div className="flex space-x-1">
                        <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
                        <div className="w-6 h-6 bg-yellow-500 rounded-full opacity-80 -ml-3"></div>
                      </div>
                    )}
                    {cardType === "amex" && <div className="text-xl font-bold">AMEX</div>}
                  </div>
                </div>

                {/* Card Number */}
                <div className="space-y-4">
                  <div className="text-2xl font-mono tracking-wider">{cardData.number || "•••• •••• •••• ••••"}</div>
                </div>

                {/* Card Details */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">Card Holder</div>
                    <div className="text-lg font-medium">{cardData.name || "YOUR NAME"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">Expires</div>
                    <div className="text-lg font-mono">{cardData.expiry || "MM/YY"}</div>
                  </div>
                </div>
              </CardContent>
            </LiquidCard>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <LiquidCard className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white border-0 shadow-2xl">
              <CardContent className="p-0 h-full">
                {/* Magnetic Strip */}
                <div className="w-full h-12 bg-black mt-6"></div>

                {/* CVV Section */}
                <div className="p-6 pt-8">
                  <div className="bg-white h-10 rounded flex items-center justify-end px-3">
                    <div className="text-black font-mono text-lg">{cardData.cvv || "•••"}</div>
                  </div>
                  <div className="text-xs text-gray-300 mt-2">CVV</div>
                </div>

                {/* Card Network Logo */}
                <div className="absolute bottom-6 right-6">
                  {cardType === "visa" && <div className="text-xl font-bold opacity-50">VISA</div>}
                  {cardType === "mastercard" && (
                    <div className="flex space-x-1 opacity-50">
                      <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                      <div className="w-5 h-5 bg-yellow-500 rounded-full -ml-2"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </LiquidCard>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <LiquidCard>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-center mb-6">Payment Details</h2>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) => handleInputChange("number", e.target.value)}
              className="font-mono text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => handleInputChange("expiry", e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cardData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                className="font-mono"
              />
            </div>
          </div>

          <Button className="w-full mt-6" size="lg">
            Pay Now
          </Button>
        </CardContent>
      </LiquidCard>
    </div>
  )
}
