"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  title: string;
  price: string;
  oldPrice?: string;
  prodImg: string;
  modelImg: string;
}

const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Celestria Cape Sleeve Midi Dress in Black",
    price: "$35.00",
    oldPrice: "$80.00",
    prodImg: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
  },
  {
    id: "2",
    title: "Lumina Silk Blouse in Ivory",
    price: "$45.00",
    prodImg: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80",
  },
  {
    id: "3",
    title: "Seraphina Leather Tote",
    price: "$120.00",
    prodImg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
  },
  {
    id: "4",
    title: "Celestria Cape Sleeve Midi Dress",
    price: "$35.00",
    prodImg: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
  },
  {
    id: "5",
    title: "Lumina Silk Blouse",
    price: "$45.00",
    prodImg: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80",
  },
  {
    id: "6",
    title: "Seraphina Leather Tote",
    price: "$120.00",
    prodImg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
  },
  {
    id: "7",
    title: "Celestria Cape Sleeve Midi Dress",
    price: "$35.00",
    prodImg: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
  },
  {
    id: "8",
    title: "Lumina Silk Blouse",
    price: "$45.00",
    prodImg: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80",
  },
  {
    id: "9",
    title: "Seraphina Leather Tote",
    price: "$120.00",
    prodImg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
  },
  {
    id: "10",
    title: "Celestria Cape Sleeve Midi Dress",
    price: "$35.00",
    prodImg: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
  },
  {
    id: "11",
    title: "Lumina Silk Blouse",
    price: "$45.00",
    prodImg: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80",
  },
  {
    id: "12",
    title: "Seraphina Leather Tote",
    price: "$120.00",
    prodImg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
  },
  {
    id: "13",
    title: "Celestria Cape Sleeve Midi Dress",
    price: "$35.00",
    prodImg: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
  },
  {
    id: "14",
    title: "Lumina Silk Blouse",
    price: "$45.00",
    prodImg: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80",
  },
  {
    id: "15",
    title: "Seraphina Leather Tote",
    price: "$120.00",
    prodImg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    modelImg: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
  }
];

// Split products into 3 chunks for the 3 columns
const COL_1_PRODUCTS = PRODUCTS.slice(0, 5);
const COL_2_PRODUCTS = PRODUCTS.slice(5, 10);
const COL_3_PRODUCTS = PRODUCTS.slice(10, 15);

// CSS Styles matching original exactly
const styles = `
  .products-carousel {
    background-color: #FFFFFF;
    color: #1f1f1f;
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    overflow-x: hidden;
  }
  
  .dark .products-carousel {
    background-color: #0a0a0a;
    color: #f4f1ea;
  }

  .col-scroll {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    min-height: 100vh;
    width: 90vw;
    box-sizing: border-box;
    padding: 0;
  }

  @media (max-width: 768px) {
    .col-scroll {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 0;
      gap: 5vh;
      align-items: center;
    }
  }

  .col-scroll__box {
    display: flex;
    flex-direction: column;
    padding: 10vh 0 15vh;
  }

  .col-scroll__box--odd {
    flex-direction: column-reverse;
    height: 100vh;
  }

  @media (max-width: 768px) {
    .col-scroll__box--odd {
      flex-direction: column;
      height: auto;
      padding: 0;
    }
    .col-scroll__box {
      width: 100%;
      align-items: center;
      padding: 2rem 0;
    }
  }

  .col-scroll__list {
    display: flex;
    flex-direction: column;
    will-change: transform;
    gap: 10vw;
  }

  .col-scroll__box--odd .col-scroll__list {
    flex-direction: column-reverse;
  }

  @media (max-width: 768px) {
    .col-scroll__box--odd .col-scroll__list {
      flex-direction: column;
    }
    .col-scroll__list {
      gap: 5vh;
    }
  }

  .product-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    width: 20vw;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  @media (max-width: 768px) {
    .product-card {
      width: 90vw;
      margin: 0 0 10vh 0;
    }
    .product-card:last-child {
      margin-bottom: 0;
    }
  }

  .col-scroll__img-wrapper {
    position: relative;
    aspect-ratio: 0.8;
    width: 100%;
    margin-bottom: 0;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1rem;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .dark .col-scroll__img-wrapper {
    border-color: rgba(255, 255, 255, 0.1);
    background: #171717;
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.03);
  }

  .col-scroll__img-wrapper img {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    width: calc(100% - 2rem);
    height: calc(100% - 2rem);
    object-fit: cover;
    transition: opacity 0.5s ease-in-out;
  }

  .product-img {
    z-index: 1;
    opacity: 1;
  }

  .model-img {
    z-index: 2;
    opacity: 0;
  }

  .product-card:hover .product-img,
  .product-card:active .product-img {
    opacity: 0;
  }

  .product-card:hover .model-img,
  .product-card:active .model-img {
    opacity: 1;
  }

  .product-card__info {
    position: absolute;
    bottom: 2rem;
    left: 0;
    width: 100%;
    text-align: center;
    z-index: 3;
    padding: 0 1.5rem;
    box-sizing: border-box;
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  
  .product-card:hover .product-card__info,
  .product-card:active .product-card__info {
    opacity: 0;
    transform: translateY(10px);
  }

  .product-card__title {
    margin: 0 0 0.5rem;
    font-family: 'Playfair Display', serif;
    font-weight: 400;
    font-size: 1.25rem;
    line-height: 1.3;
    color: #1f1f1f;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
  }
  
  .dark .product-card__title {
    color: #f4f1ea;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
  }

  .product-card__price-wrapper {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    letter-spacing: 0.5px;
    color: #1f1f1f;
  }
  
  .dark .product-card__price-wrapper {
    color: #f4f1ea;
  }

  .product-card__price--old {
    text-decoration: line-through;
    opacity: 0.5;
    margin-right: 0.5rem;
  }

  .product-card__btn {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    z-index: 4;
    opacity: 0;
    background: rgba(244, 241, 234, 0.95);
    border: 1px solid #1f1f1f;
    padding: 1rem 2rem;
    font-family: 'Playfair Display', serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s ease;
    white-space: nowrap;
    color: #1f1f1f;
  }
  
  .dark .product-card__btn {
    background: rgba(23, 23, 23, 0.95);
    border-color: #f4f1ea;
    color: #f4f1ea;
  }

  .product-card:hover .product-card__btn,
  .product-card:active .product-card__btn {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .product-card__btn:hover {
    background: #1f1f1f;
    color: #fff;
  }
  
  .dark .product-card__btn:hover {
    background: #f4f1ea;
    color: #1f1f1f;
  }

  @media (max-width: 768px) {
    .product-card__title {
      font-size: 1.1rem;
    }
    .product-card__price-wrapper {
      font-size: 1rem;
    }
    .product-card__btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.7rem;
    }
  }
`;

export default function ProductsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Only apply scroll animation on desktop
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        const reverseTrigger = gsap.utils.toArray<HTMLElement>(".col-scroll__box--odd .col-scroll__list");

        reverseTrigger.forEach((element) => {
          const elementHeight = element.offsetHeight;
          const viewportHeight = window.innerHeight;
          const extraSpace = viewportHeight * 0.2;
          const scrollDistance = elementHeight + viewportHeight + extraSpace;

          gsap.to(element, {
            yPercent: 100,
            scrollTrigger: {
              trigger: element,
              start: 0,
              end: `+=${scrollDistance}`,
              scrub: true,
              pin: true,
            }
          });
        });
      }, containerRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <main className="products-carousel">
        <div ref={containerRef} className="col-scroll">
          {/* Column 1 (Odd - reverse scroll) */}
          <div className="col-scroll__box col-scroll__box--odd">
            <div className="col-scroll__list">
              {COL_1_PRODUCTS.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>

          {/* Column 2 (Even - normal scroll) */}
          <div className="col-scroll__box">
            <div className="col-scroll__list">
              {COL_2_PRODUCTS.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>

          {/* Column 3 (Odd - reverse scroll) */}
          <div className="col-scroll__box col-scroll__box--odd">
            <div className="col-scroll__list">
              {COL_3_PRODUCTS.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <figure className="product-card">
      <div className="col-scroll__img-wrapper">
        <img className="product-img" src={product.prodImg} alt={product.title} />
        <img className="model-img" src={product.modelImg} alt={`Model wearing ${product.title}`} />
        
        <div className="product-card__info">
          <h3 className="product-card__title">{product.title}</h3>
          <div className="product-card__price-wrapper">
            {product.oldPrice && (
              <span className="product-card__price--old">{product.oldPrice}</span>
            )}
            <span className="product-card__price">{product.price}</span>
          </div>
        </div>

        <button className="product-card__btn">View Details +</button>
      </div>
    </figure>
  );
}
