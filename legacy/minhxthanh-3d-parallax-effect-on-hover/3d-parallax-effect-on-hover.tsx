import React from "react";

const images = [
  {
    src: "https://picsum.photos/id/65/300/300",
    alt: "the back of a random person",
    f: 0.1,
    r: "10px",
  },
  {
    src: "https://assets.codepen.io/1480814/pexels-pixabay-62655.jpg",
    alt: "an eagle",
    f: 0.12,
    r: "5px",
  },
  {
    src: "https://picsum.photos/id/755/300/300",
    alt: "a cup of tea",
    f: 0.08,
    r: "20px",
  },
];

export default function ParallaxImages() {
  return (
    <div className="min-h-screen grid grid-flow-col place-content-center gap-8 bg-dark p-8">
      {images.map((img, idx) => (
        <div key={idx} className="overflow-hidden">
          <img
            src={img.src}
            alt={img.alt}
            className="parallax-img"
            style={{ "--f": img.f, "--r": img.r }}
          />
        </div>
      ))}
    </div>
  );
}