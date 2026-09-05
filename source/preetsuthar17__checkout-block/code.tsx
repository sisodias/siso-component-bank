"use client";

import { Button } from "@/components/ui/button";
import {
Card,
CardContent,
CardHeader,
CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import {
CreditCard,
Truck,
Shield,
MapPin,
User,
Mail,
Phone,
Lock,
Calendar,
ShoppingBag,
Check,
ChevronLeft,
Percent,
X,
Tag,
Wallet,
Smartphone,
Building2,
Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";

interface OrderItem {
id: string;
name: string;
price: number;
originalPrice?: number;
image: string;
quantity: number;
discount?: number;
}

interface CheckoutSummary {
subtotal: number;
discount: number;
shipping: number;
tax: number;
total: number;
}

interface ShippingAddress {
firstName: string;
lastName: string;
email: string;
phone: string;
address: string;
city: string;
state: string;
zipCode: string;
country: string;
}

interface PaymentMethod {
cardNumber: string;
expiryMonth: string;
expiryYear: string;
cvv: string;
nameOnCard: string;
}

export default function Checkout() {
const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [currentStep, setCurrentStep] = useState<number>(1);
const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
});
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  nameOnCard: "",
});
const [selectedPaymentType, setSelectedPaymentType] =
  useState<string>("card");
const [sameAsShipping, setSameAsShipping] = useState<boolean>(true);
const [savePaymentMethod, setSavePaymentMethod] = useState<boolean>(false);
const [appliedPromo, setAppliedPromo] = useState<string>("SAVE10");
const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

const sampleOrderItems: OrderItem[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 2,
    discount: 31,
  },
  {
    id: "2",
    name: "Minimalist Desk Lamp",
    price: 45.99,
    image:
      "https://images.unsplash.com/photo-1617363020293-62faac14783d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
  },
  {
    id: "3",
    name: "Organic Coffee Beans",
    price: 24.99,
    originalPrice: 29.99,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    quantity: 3,
    discount: 17,
  },
];

const shippingMethods = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 9.99,
    time: "5-7 business days",
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 19.99,
    time: "2-3 business days",
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    price: 39.99,
    time: "Next business day",
  },
];

const [selectedShipping, setSelectedShipping] = useState("standard");

useEffect(() => {
  const loadCheckout = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setOrderItems(sampleOrderItems);
    setIsLoading(false);
  };

  loadCheckout();
}, []);

const calculateSummary = (): CheckoutSummary => {
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
  const shipping =
    selectedShipping === "standard"
      ? 9.99
      : selectedShipping === "express"
      ? 19.99
      : 39.99;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + shipping + tax;

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
};

const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
  setShippingAddress((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handlePaymentChange = (field: keyof PaymentMethod, value: string) => {
  setPaymentMethod((prev) => ({
    ...prev,
    [field]: value,
  }));
};
const validateStep = (step: number): boolean => {
  switch (step) {
    case 1:
      return !!(
        shippingAddress.firstName &&
        shippingAddress.lastName &&
        shippingAddress.email &&
        shippingAddress.address &&
        shippingAddress.city &&
        shippingAddress.state &&
        shippingAddress.zipCode
      );
    case 2:
      if (selectedPaymentType === "card") {
        return !!(
          paymentMethod.cardNumber &&
          paymentMethod.expiryMonth &&
          paymentMethod.expiryYear &&
          paymentMethod.cvv &&
          paymentMethod.nameOnCard
        );
      }
      // For other payment methods, we just need them to be selected
      return !!selectedPaymentType;
    case 3:
      return agreeToTerms;
    default:
      return false;
  }
};

const nextStep = () => {
  if (validateStep(currentStep)) {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }
};

const prevStep = () => {
  setCurrentStep((prev) => Math.max(prev - 1, 1));
};

const removePromo = () => {
  setAppliedPromo("");
};

const summary = calculateSummary();

const CheckoutSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 flex flex-col gap-6">
      <Card>
        <CardContent className="p-6 flex flex-col gap-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col gap-4">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const OrderSummaryCard = () => (
  <Card className="flex flex-col gap-5">
    <CardHeader>
      <h3 className="font-semibold flex items-center gap-2">
        <ShoppingBag className="h-4 w-4" />
        Order Summary
      </h3>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      {/* Order Items */}
      <div className="flex flex-col gap-4">
        {orderItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-md"
              />
              <Badge
                size="sm"
                className="absolute -top-1 -right-1 text-xs min-w-5 h-5 flex items-center justify-center"
              >
                {item.quantity}
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">${item.price}</span>
                {item.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${item.originalPrice}
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      {/* Applied Promo */}
      {appliedPromo && (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-ele border border-green-200">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {appliedPromo}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removePromo}
            className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}{" "}
      {/* Pricing Breakdown */}
      <div className="flex flex-col gap-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${summary.subtotal.toFixed(2)}</span>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-${summary.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${summary.shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${summary.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-2">
          <span>Total</span>
          <span>${summary.total.toFixed(2)}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

if (isLoading) {
  return (
    <div className="w-full mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </div>
      <CheckoutSkeleton />
    </div>
  );
}

return (
  <div className="w-full mx-auto p-6 flex flex-col gap-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-4 flex-col">
        {" "}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Cart
        </Button>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Checkout
          </h1>
          <p className="text-muted-foreground text-sm">
            Complete your purchase securely
          </p>
        </div>
      </div>
      <Badge variant="secondary" className="flex items-center gap-1">
        <Shield className="h-3 w-3" />
        SSL Secured
      </Badge>
    </div>{" "}
    {/* Progress Steps */}
    <div className="flex items-center justify-start gap-4 sm:gap-6 py-4">
      {[
        { step: 1, label: "Shipping", icon: Truck },
        { step: 2, label: "Payment", icon: CreditCard },
        { step: 3, label: "Review", icon: Check },
      ].map(({ step, label, icon: Icon }, index) => (
        <div key={step} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                currentStep >= step
                  ? "bg-primary border-primary text-white"
                  : "border-border text-muted-foreground"
              )}
            >
              {currentStep > step ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>
            <span
              className={cn(
                "text-sm font-medium hidden sm:block",
                currentStep >= step
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
          {index < 2 && (
            <div
              className={cn(
                "w-8 h-0.5",
                currentStep > step
                  ? "bg-primary"
                  : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Step 1: Shipping Information */}
        {currentStep === 1 && (
          <Card className="flex flex-col gap-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Information
              </h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First Name *</Label>{" "}
                  <Input
                    id="firstName"
                    size="lg"
                    placeholder="John"
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      handleAddressChange("firstName", e.target.value)
                    }
                    leftIcon={<User className="h-4 w-4" />}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last Name *</Label>{" "}
                  <Input
                    id="lastName"
                    size="lg"
                    placeholder="Doe"
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      handleAddressChange("lastName", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email *</Label>{" "}
                  <Input
                    id="email"
                    size="lg"
                    type="email"
                    placeholder="john@example.com"
                    value={shippingAddress.email}
                    onChange={(e) =>
                      handleAddressChange("email", e.target.value)
                    }
                    leftIcon={<Mail className="h-4 w-4" />}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone</Label>{" "}
                  <Input
                    id="phone"
                    size="lg"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      handleAddressChange("phone", e.target.value)
                    }
                    leftIcon={<Phone className="h-4 w-4" />}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Address *</Label>{" "}
                <Input
                  id="address"
                  size="lg"
                  placeholder="123 Main Street"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    handleAddressChange("address", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City *</Label>{" "}
                  <Input
                    id="city"
                    size="lg"
                    placeholder="New York"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={shippingAddress.state}
                    onValueChange={(value) =>
                      handleAddressChange("state", value)
                    }
                  >
                    <SelectTrigger className="text-sm" size={"lg"}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>{" "}
                  <Input
                    id="zipCode"
                    size="lg"
                    placeholder="10001"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      handleAddressChange("zipCode", e.target.value)
                    }
                  />
                </div>
              </div>{" "}
              {/* Shipping Methods */}
              <div className="flex flex-col gap-3 border-t pt-4">
                <Label>Shipping Method</Label>
                <div className="flex flex-col gap-4">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={cn(
                        "p-3 border rounded-ele cursor-pointer transition-colors",
                        selectedShipping === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent"
                      )}
                      onClick={() => setSelectedShipping(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border-2 transition-colors",
                              selectedShipping === method.id
                                ? "border-primary bg-primary"
                                : "border-border"
                            )}
                          />
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {method.time}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold">${method.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={nextStep}
                disabled={!validateStep(1)}
                className="ml-auto"
                size="lg"
              >
                Continue to Payment
              </Button>
            </CardFooter>
          </Card>
        )}{" "}
        {/* Step 2: Payment Information */}
        {currentStep === 2 && (
          <Card className="flex flex-col gap-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Payment Method Selection */}
              <div className="flex flex-col gap-4">
                <Label className="text-base font-medium">
                  Choose Payment Method
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Credit/Debit Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentType("card")}
                    className={cn(
                      "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                      selectedPaymentType === "card"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-xs text-muted-foreground">
                        Visa, Mastercard, Amex
                      </div>
                    </div>
                  </button>

                  {/* PayPal */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentType("paypal")}
                    className={cn(
                      "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                      selectedPaymentType === "paypal"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Wallet className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-xs text-muted-foreground">
                        Fast & secure
                      </div>
                    </div>
                  </button>

                  {/* Apple Pay */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentType("apple-pay")}
                    className={cn(
                      "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                      selectedPaymentType === "apple-pay"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Smartphone className="h-5 w-5 text-gray-800" />
                    <div>
                      <div className="font-medium">Apple Pay</div>
                      <div className="text-xs text-muted-foreground">
                        Touch ID or Face ID
                      </div>
                    </div>
                  </button>

                  {/* Google Pay */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentType("google-pay")}
                    className={cn(
                      "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                      selectedPaymentType === "google-pay"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Google Pay</div>
                      <div className="text-xs text-muted-foreground">
                        One-tap checkout
                      </div>
                    </div>
                  </button>

                  {/* Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentType("bank-transfer")}
                    className={cn(
                      "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                      selectedPaymentType === "bank-transfer"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Building2 className="h-5 w-5 text-blue-800" />
                    <div>
                      <div className="font-medium">Bank Transfer</div>
                      <div className="text-xs text-muted-foreground">
                        Direct bank payment
                      </div>
                    </div>
                  </button>

                  {/* Buy Now Pay Later */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentType("bnpl")}
                    className={cn(
                      "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                      selectedPaymentType === "bnpl"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Buy Now Pay Later</div>
                      <div className="text-xs text-muted-foreground">
                        Split into 4 payments
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Credit Card Form - Only show when card is selected */}
              {selectedPaymentType === "card" && (
                <div className="flex flex-col gap-4 border-t pt-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nameOnCard">Name on Card *</Label>{" "}
                    <Input
                      id="nameOnCard"
                      size="lg"
                      placeholder="John Doe"
                      value={paymentMethod.nameOnCard}
                      onChange={(e) =>
                        handlePaymentChange("nameOnCard", e.target.value)
                      }
                      leftIcon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>{" "}
                    <Input
                      id="cardNumber"
                      size="lg"
                      placeholder="1234 5678 9012 3456"
                      value={paymentMethod.cardNumber}
                      onChange={(e) =>
                        handlePaymentChange("cardNumber", e.target.value)
                      }
                      leftIcon={<CreditCard className="h-4 w-4" />}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="expiryMonth">Month *</Label>
                      <Select
                        value={paymentMethod.expiryMonth}
                        onValueChange={(value) =>
                          handlePaymentChange("expiryMonth", value)
                        }
                      >
                        <SelectTrigger className="text-sm" size={"lg"}>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem
                              key={i + 1}
                              value={String(i + 1).padStart(2, "0")}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="expiryYear">Year *</Label>
                      <Select
                        value={paymentMethod.expiryYear}
                        onValueChange={(value) =>
                          handlePaymentChange("expiryYear", value)
                        }
                      >
                        <SelectTrigger className="text-sm" size={"lg"}>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem
                              key={2024 + i}
                              value={String(2024 + i)}
                            >
                              {2024 + i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cvv">CVV *</Label>{" "}
                      <Input
                        id="cvv"
                        size="lg"
                        placeholder="123"
                        maxLength={4}
                        value={paymentMethod.cvv}
                        onChange={(e) =>
                          handlePaymentChange("cvv", e.target.value)
                        }
                        leftIcon={<Lock className="h-4 w-4" />}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Info */}
              {selectedPaymentType === "paypal" && (
                <div className="border-t pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-ele p-4">
                    <div className="flex items-start gap-3">
                      <Wallet className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">
                          PayPal Payment
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          You'll be redirected to PayPal to complete your
                          payment securely.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Apple Pay Info */}
              {selectedPaymentType === "apple-pay" && (
                <div className="border-t pt-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-ele p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-gray-800 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Apple Pay
                        </h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Use Touch ID or Face ID to pay with your default
                          card.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Google Pay Info */}
              {selectedPaymentType === "google-pay" && (
                <div className="border-t pt-6">
                  <div className="bg-green-50 border border-green-200 rounded-ele p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">
                          Google Pay
                        </h4>
                        <p className="text-sm text-green-700 mt-1">
                          Complete your purchase with one tap using Google
                          Pay.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Info */}
              {selectedPaymentType === "bank-transfer" && (
                <div className="border-t pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-ele p-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-blue-800 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">
                          Bank Transfer
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          We'll provide bank details after you place your
                          order. Payment processing may take 1-3 business
                          days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy Now Pay Later Info */}
              {selectedPaymentType === "bnpl" && (
                <div className="border-t pt-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-ele p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900">
                          Buy Now Pay Later
                        </h4>{" "}
                        <p className="text-sm text-purple-700 mt-1">
                          Split your ${summary.total.toFixed(2)} purchase into
                          4 interest-free payments of $
                          {(summary.total / 4).toFixed(2)}.
                        </p>
                        <div className="mt-2 text-xs text-purple-600">
                          • Pay ${(summary.total / 4).toFixed(2)} today • Then
                          ${(summary.total / 4).toFixed(2)} every 2 weeks • No
                          interest, no fees when you pay on time
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Payment Method - Only for card payments */}
              {selectedPaymentType === "card" && (
                <div className="flex items-center gap-2 border-t pt-4">
                  <Checkbox
                    id="savePayment"
                    checked={savePaymentMethod}
                    onCheckedChange={(checked) =>
                      setSavePaymentMethod(checked === true)
                    }
                  />
                  <Label htmlFor="savePayment" className="text-sm">
                    Save payment method for future purchases
                  </Label>
                </div>
              )}
            </CardContent>{" "}
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={prevStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!validateStep(2)}
                size="lg"
              >
                Review Order
              </Button>
            </CardFooter>
          </Card>
        )}
        {/* Step 3: Review Order */}
        {currentStep === 3 && (
          <Card className="flex flex-col gap-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Check className="h-5 w-5" />
                Review Your Order
              </h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Shipping Address Review */}
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Shipping Address</h3>
                <div className="text-sm text-muted-foreground p-3 bg-accent rounded-ele">
                  <p>
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.zipCode}
                  </p>
                  <p>{shippingAddress.email}</p>
                </div>
              </div>{" "}
              {/* Payment Method Review */}
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Payment Method</h3>
                <div className="text-sm text-muted-foreground p-3 bg-accent rounded-ele">
                  {selectedPaymentType === "card" && (
                    <>
                      <p>
                        **** **** **** {paymentMethod.cardNumber.slice(-4)}
                      </p>
                      <p>{paymentMethod.nameOnCard}</p>
                    </>
                  )}
                  {selectedPaymentType === "paypal" && (
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-blue-600" />
                      <span>PayPal</span>
                    </div>
                  )}
                  {selectedPaymentType === "apple-pay" && (
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-gray-800" />
                      <span>Apple Pay</span>
                    </div>
                  )}
                  {selectedPaymentType === "google-pay" && (
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <span>Google Pay</span>
                    </div>
                  )}
                  {selectedPaymentType === "bank-transfer" && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-800" />
                      <span>Bank Transfer</span>
                    </div>
                  )}
                  {selectedPaymentType === "bnpl" && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span>
                        Buy Now Pay Later (4 payments of $
                        {(summary.total / 4).toFixed(2)})
                      </span>
                    </div>
                  )}
                </div>
              </div>{" "}
              {/* Terms and Conditions */}
              <div className="flex items-start gap-2 border-t pt-4">
                <Checkbox
                  id="agreeTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked === true)
                  }
                />
                <Label
                  htmlFor="agreeTerms"
                  className="text-sm leading-relaxed"
                >
                  I agree to the{" "}
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Privacy Policy
                  </Button>
                </Label>
              </div>
            </CardContent>{" "}
            <CardFooter className="flex justify-between">
              {" "}
              <Button
                variant="outline"
                size="lg"
                onClick={prevStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>{" "}
              <Button
                disabled={!validateStep(3)}
                size="lg"
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Complete Order ${summary.total.toFixed(2)}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="flex flex-col gap-4">
        <OrderSummaryCard />

        {/* Security Badge */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Secure & Encrypted</div>
                <div className="text-muted-foreground">
                  Your data is protected with SSL encryption
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
}

export { Checkout };