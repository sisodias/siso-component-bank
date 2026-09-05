import React, { useState, useEffect, useCallback } from "react";


// Data for the slides
const slidesData = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    brand: "BMW M3",
    name: "BMW M3 Competition",
    subtitle: "Twin-Turbo Inline-6 Performance",
    specs: [
      { label: "Engine", value: "3.0L Twin-Turbo Inline-6" },
      { label: "Power", value: "503 HP @ 6,250 RPM" },
      { label: "Torque", value: "650 Nm @ 2,750 RPM" },
      { label: "Transmission", value: "8-Speed Automatic" },
    ],
    badges: [
      { label: "0-100", value: "3.9s" },
      { label: "Top Speed", value: "290 km/h" },
      { label: "Price", value: "$73,400" },
    ],
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    brand: "Lamborghini Huracán",
    name: "Lamborghini Huracán",
    subtitle: "Naturally Aspirated V10 Excellence",
    specs: [
      { label: "Engine", value: "5.2L V10 Naturally Aspirated" },
      { label: "Power", value: "610 HP @ 8,250 RPM" },
      { label: "Torque", value: "560 Nm @ 6,500 RPM" },
      { label: "Transmission", value: "7-Speed Dual-Clutch" },
    ],
    badges: [
      { label: "0-100", value: "3.2s" },
      { label: "Top Speed", value: "325 km/h" },
      { label: "Price", value: "$248,295" },
    ],
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    brand: "Ferrari SF90",
    name: "Ferrari SF90 Stradale",
    subtitle: "Plug-in Hybrid Revolution",
    specs: [
      { label: "Engine", value: "4.0L V8 Twin-Turbo + Electric" },
      { label: "Power", value: "1000 HP Combined" },
      { label: "Torque", value: "800 Nm @ 6,000 RPM" },
      { label: "Transmission", value: "8-Speed F1 DCT" },
    ],
    badges: [
      { label: "0-100", value: "2.5s" },
      { label: "Top Speed", value: "340 km/h" },
      { label: "Price", value: "$625,000" },
    ],
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    brand: "Porsche 911",
    name: "Porsche 911 Turbo S",
    subtitle: "Twin-Turbo Flat-Six Perfection",
    specs: [
      { label: "Engine", value: "3.8L Twin-Turbo Flat-6" },
      { label: "Power", value: "640 HP @ 6,750 RPM" },
      { label: "Torque", value: "800 Nm @ 2,500 RPM" },
      { label: "Transmission", value: "8-Speed PDK" },
    ],
    badges: [
      { label: "0-100", value: "2.7s" },
      { label: "Top Speed", value: "330 km/h" },
      { label: "Price", value: "$207,000" },
    ],
  },
];

const AccordionSlider = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleSlideClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const nextSlide = useCallback(() => {
    setActiveIndex((current) =>
      current === -1 ? 0 : (current + 1) % slidesData.length
    );
  }, []);

  const previousSlide = useCallback(() => {
    setActiveIndex((current) =>
      current === -1
        ? slidesData.length - 1
        : (current - 1 + slidesData.length) % slidesData.length
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        previousSlide();
      }
      if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextSlide, previousSlide]);

  return (
    <div className="slider-container">
      <div className="now-showing">Now in Showroom</div>

      <div className="accordion-slider">
        {slidesData.map((slide, index) => (
          <div
            key={index}
            className={`slide ${activeIndex === index ? "active" : ""}`}
            style={{ backgroundImage: `url('${slide.imageUrl}')` }}
            onClick={() => handleSlideClick(index)}
          >
            <div className="slide-content">
              <div className="slide-number">{`0${index + 1}`}</div>
              <div className="car-brand">{slide.brand}</div>
              <div className="car-name">{slide.name}</div>
              <div className="car-subtitle">{slide.subtitle}</div>
              <div className="car-specs">
                {slide.specs.map((spec, specIndex) => (
                  <div key={specIndex} className="spec-row">
                    <span className="spec-label">{spec.label}:</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
              <div className="performance-badges">
                {slide.badges.map((badge, badgeIndex) => (
                  <div key={badgeIndex} className="badge">
                    <div className="badge-icon"></div>
                    <span>
                      {badge.label}: {badge.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="add-button"></div>
          </div>
        ))}
      </div>

      <button className="navigation-arrows nav-prev" onClick={previousSlide}>
        ‹
      </button>
      <button className="navigation-arrows nav-next" onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export default AccordionSlider;
