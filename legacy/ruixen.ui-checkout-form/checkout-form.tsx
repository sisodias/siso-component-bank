"use client"

import { CreditCard, MapPin, Tag } from "lucide-react"
import { Input } from "./input"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Separator } from "./separator"

export default function CheckoutForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-md shadow-xl border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipping Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Delivery Address</span>
            </div>
            <p className="text-sm text-muted-foreground">742 Evergreen Terrace</p>
            <p className="text-sm text-muted-foreground">Springfield, USA</p>
          </div>

          <Separator />

          {/* Payment Method Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Billing Method</span>
            </div>
            <p className="text-sm text-muted-foreground">Mastercard</p>
            <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
          </div>

          <Separator />

          {/* Promo Code Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Apply Discount Code</span>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Enter discount code" className="flex-1" />
              <Button variant="secondary">Redeem</Button>
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div>
            <span className="text-sm font-medium">Order Total</span>
            <div className="grid grid-cols-2 gap-y-2 text-sm mt-2">
              <span className="text-muted-foreground">Item Total:</span>
              <span className="text-right font-medium">$180.00</span>
              <span className="text-muted-foreground">Delivery Fee:</span>
              <span className="text-right font-medium">$15.00</span>
              <span className="text-muted-foreground">Taxes:</span>
              <span className="text-right font-medium">$25.00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Checkout */}
      <div className="w-full max-w-md mt-4 flex items-center justify-between rounded-xl border px-4 py-3 bg-card shadow-lg">
        <span className="text-lg font-bold">$220.00</span>
        <Button className="px-6">Place Order</Button>
      </div>
    </div>
  )
}
