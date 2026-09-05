"use client"

import { useId, useState } from "react"
import { Input } from "./input"
import { Label } from "./label"
import { CreditCardIcon } from "lucide-react"
import images, { CardImages } from "react-payment-inputs/images"
import { usePaymentInputs } from "react-payment-inputs"
import { cn } from "../_utils/cn"

interface CardInputProps {
  label?: string
  showPreview?: boolean
  onChange?: (data: { number: string; expiry: string; cvc: string }) => void
}

export default function ModernCardInput({
  label = "Card Information",
  showPreview = true,
  onChange,
}: CardInputProps) {
  const id = useId()
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
  } = usePaymentInputs()

  const handleChange = () => {
    if (onChange) {
      onChange({
        number: (getCardNumberProps() as any).value || "",
        expiry: (getExpiryDateProps() as any).value || "",
        cvc: (getCVCProps() as any).value || "",
      })
    }
  }

  return (
    <div className="w-full max-w-md space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      <div
        className={cn(
          "relative rounded-xl border bg-background p-4 shadow-md flex flex-col gap-3 transition-all",
          focusedField ? "ring-2 ring-primary/50" : "ring-0"
        )}
      >
        {/* Card Number */}
        <div className="relative">
          <Input
            id={`card-number-${id}`}
            placeholder="Card Number"
            {...getCardNumberProps()}
            onFocus={() => setFocusedField("number")}
            onBlur={() => setFocusedField(null)}
            onChange={handleChange}
            className="peer rounded-xl pr-12"
          />
          <div className="absolute inset-y-0 end-0 flex items-center justify-center pr-3 pointer-events-none text-muted-foreground">
            {meta.cardType ? (
              <svg
                {...getCardImageProps({ images: images as unknown as CardImages })}
                width={24}
                className="overflow-hidden rounded-sm transition-all"
              />
            ) : (
              <CreditCardIcon size={18} />
            )}
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="flex gap-2">
          <Input
            id={`expiry-${id}`}
            placeholder="MM/YY"
            {...getExpiryDateProps()}
            onFocus={() => setFocusedField("expiry")}
            onBlur={() => setFocusedField(null)}
            onChange={handleChange}
            className="flex-1 rounded-xl"
          />
          <Input
            id={`cvc-${id}`}
            placeholder="CVC"
            {...getCVCProps()}
            onFocus={() => setFocusedField("cvc")}
            onBlur={() => setFocusedField(null)}
            onChange={handleChange}
            className="flex-1 rounded-xl"
          />
        </div>

        {/* Optional Preview */}
        {showPreview && meta.cardType && (
          <div className="absolute top-3 right-3 text-xs text-muted-foreground font-medium">
            {meta.cardType.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  )
}
