"use client"

import { useId, useState } from "react"
import { CreditCardIcon, GiftIcon } from "lucide-react"

import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./dialog"
import { Input } from "./input"
import { Label } from "./label"

export default function MinimalPaymentModal() {
  const id = useId()
  const [couponCode, setCouponCode] = useState("")
  const [showCouponInput, setShowCouponInput] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Checkout</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md !rounded-2xl p-6 space-y-6">
        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle>Secure Payment</DialogTitle>
          <DialogDescription>Enter your card details to complete the payment.</DialogDescription>
        </DialogHeader>

        {/* Payment Form */}
        <form className="space-y-4">
          <div>
            <Label htmlFor={`card-name-${id}`}>Cardholder Name</Label>
            <Input id={`card-name-${id}`} placeholder="Jane Doe" required className="rounded-lg" />
          </div>

          <div>
            <Label htmlFor={`card-number-${id}`}>Card Number</Label>
            <div className="relative">
              <Input
                id={`card-number-${id}`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                className="rounded-lg pr-10"
              />
              <CreditCardIcon
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor={`expiry-${id}`}>Expiry</Label>
              <Input id={`expiry-${id}`} placeholder="MM/YY" maxLength={5} required className="rounded-lg" />
            </div>
            <div className="flex-1">
              <Label htmlFor={`cvc-${id}`}>CVC</Label>
              <Input id={`cvc-${id}`} placeholder="123" maxLength={4} required className="rounded-lg" />
            </div>
          </div>

          {/* Coupon */}
          {!showCouponInput ? (
            <button
              type="button"
              onClick={() => setShowCouponInput(true)}
              className="text-sm underline hover:no-underline"
            >
              + Apply Coupon
            </button>
          ) : (
            <div>
              <Label htmlFor={`coupon-${id}`}>Coupon Code</Label>
              <Input
                id={`coupon-${id}`}
                placeholder="Enter your code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="rounded-lg"
              />
            </div>
          )}

          <Button type="button" className="w-full mt-2">
            Pay Now
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-xs">
          Payments are secure and non-refundable. Cancel anytime.
        </p>
      </DialogContent>
    </Dialog>
  )
}
