import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
   
<div class="container flex flex-col items-center justify-center">
  <div class="card cart">
    <label class="title">CHECKOUT</label>
    <div class="steps">
      <div class="step">
        <div>
          <span>SHIPPING</span>
          <p>221B Baker Street, W1U 8ED</p>
          <p>London, United Kingdom</p>
        </div>
        <hr/>
        <div>
          <span>PAYMENT METHOD</span>
          <p>Visa</p>
          <p>**** **** **** 4243</p>
        </div>
        <hr/>
        <div class="promo">
          <span>HAVE A PROMO CODE?</span>
          <form class="form">
            <input class="input_field" placeholder="Enter a Promo Code" type="text"/>
            <button>Apply</button>
          </form>
        </div>
        <hr/>
        <div class="payments">
          <span>PAYMENT</span>
          <div class="details">
            <span>Subtotal:</span>
            <span>$240.00</span>
            <span>Shipping:</span>
            <span>$10.00</span>
            <span>Tax:</span>
            <span>$30.40</span>
          </div>
        </div>
        
      </div>
    </div>
  </div>

  <div class="card checkout">
    <div class="footer">
      <label class="price">$280.40</label>
      <button class="checkout-btn">Checkout</button>
    </div>
  </div>
</div>
  );
};
