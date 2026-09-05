'use client';
import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { Input } from "./input";
import { Plus, Minus, Trash2, ShoppingCart as ShoppingCartIcon } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface ShoppingCartProps {
  items: CartItem[];
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ items, onQuantityChange, onRemoveItem }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.00 : 0;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCartIcon className="h-6 w-6" /> Your Shopping Cart
        </CardTitle>
        <span className="text-sm text-muted-foreground">{items.length} items</span>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Your cart is empty. Start shopping!
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border p-3 rounded-lg">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 grid gap-1">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.price)} per item</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value);
                        if (!isNaN(newQty) && newQty >= 1) {
                          onQuantityChange(item.id, newQty);
                        }
                      }}
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold text-lg">{formatCurrency(item.price * item.quantity)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Separator className="my-6" />
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-medium">{formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({taxRate * 100}%)</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <Button className="w-full" disabled={items.length === 0}>
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};