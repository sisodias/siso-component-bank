"use client"
import { OrderStatus } from "./order-status-tracker"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <OrderStatus />
    </div>
  )
}
