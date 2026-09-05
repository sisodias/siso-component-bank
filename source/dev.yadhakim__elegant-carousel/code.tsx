'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../index.css';

interface SlideData {
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  imageUrl: string;
}

const slides: SlideData[] = [
  {
    title: 'Venetian Dusk',
    subtitle: 'Autumn / Winter Collection',
    description:
      'Where ancient architecture meets the dying light — a palette drawn from terracotta, aged stone, and the shimmering canals of Venice at twilight.',
    accent: '#C4956A',
    imageUrl:
      'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=900&h=1200&fit=crop&q=80',
  },
  {
    title: 'Nordic Silence',
    subtitle: 'Spring / Summer Collection',
    description:
      'Inspired by the vast stillness of Scandinavian fjords — clean lines, muted tones, and the quiet power of unadorned beauty.',
    accent: '#8BA7B8',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=1200&fit=crop&q=80',
  },
  {
    title: 'Kyoto Garden',
    subtitle: 'Resort Collection',
    description:
      'Moss-covered pathways and paper lanterns — an ode to the meditative elegance of Japanese garden design and its timeless restraint.',
    accent: '#7A9E7E',
    imageUrl:
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&h=1200&fit=crop&q=80',
  },
  {
    title: 'Saharan Gold',
    subtitle: 'Capsule Collection',
    description:
      'The desert reveals its secrets at dawn — liquid gold spilling across endless dunes, textures carved by centuries of wind and time.',
    accent: '#D4A955',
    imageUrl:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&h=1200&fit=crop&q=80',
  },
];

export default function ElegantCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const SLIDE_DURATION = 6000;
  const TRANSITION_DURATION = 800;

  const goToSlide = useCallback(
    (index: number, dir?: 'next' | 'prev') => {
      if (isTransitioning || index === currentIndex) return;
      setDirection(dir || (index > currentIndex ? 'next' : 'prev'));
      setIsTransitioning(true);
      setProgress(0);

      setTimeout(() => {
        setCurrentIndex(index);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, TRANSITION_DURATION / 2);
    },
    [isTransitioning, currentIndex]
  );

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex, 'next');
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex, 'prev');
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (isPaused) return;

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);

    intervalRef.current = setInterval(() => {
      goNext();
    }, SLIDE_DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentIndex, isPaused, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background accent wash */}
      <div
        className="carousel-bg-wash"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${currentSlide.accent}18 0%, transparent 70%)`,
        }}
      />

      <div className="carousel-inner">
        {/* Left: Text Content */}
        <div className="carousel-content">
          <div className="carousel-content-inner">
            {/* Collection number */}
            <div
              className={`carousel-collection-num ${isTransitioning ? 'transitioning' : 'visible'}`}
            >
              <span className="carousel-num-line" />
              <span className="carousel-num-text">
                {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Title */}
            <h2
              className={`carousel-title ${isTransitioning ? 'transitioning' : 'visible'}`}
            >
              {currentSlide.title}
            </h2>

            {/* Subtitle */}
            <p
              className={`carousel-subtitle ${isTransitioning ? 'transitioning' : 'visible'}`}
              style={{ color: currentSlide.accent }}
            >
              {currentSlide.subtitle}
            </p>

            {/* Description */}
            <p
              className={`carousel-description ${isTransitioning ? 'transitioning' : 'visible'}`}
            >
              {currentSlide.description}
            </p>

            {/* Navigation Arrows */}
            <div className="carousel-nav-arrows">
              <button
                onClick={goPrev}
                className="carousel-arrow-btn"
                aria-label="Previous slide"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="carousel-arrow-btn"
                aria-label="Next slide"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="carousel-image-container">
          <div
            className={`carousel-image-frame ${isTransitioning ? 'transitioning' : 'visible'}`}
          >
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className="carousel-image"
            />
            <div
              className="carousel-image-overlay"
              style={{
                background: `linear-gradient(135deg, ${currentSlide.accent}22 0%, transparent 50%)`,
              }}
            />
          </div>

          {/* Decorative frame corner */}
          <div className="carousel-frame-corner carousel-frame-corner--tl" style={{ borderColor: currentSlide.accent }} />
          <div className="carousel-frame-corner carousel-frame-corner--br" style={{ borderColor: currentSlide.accent }} />
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="carousel-progress-bar">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`carousel-progress-item ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className="carousel-progress-track">
              <div
                className="carousel-progress-fill"
                style={{
                  width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%',
                  backgroundColor: index === currentIndex ? currentSlide.accent : undefined,
                }}
              />
            </div>
            <span className="carousel-progress-label">{slide.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}