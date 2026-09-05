// components.js

import React from 'react';

export function Gallery({ data, onImageClick }) {
  return (
    <section id="portfolio" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          My Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((img) => (
            <div
              key={img.id}
              className={`group cursor-pointer relative overflow-hidden rounded-lg ${img.span}`}
              onClick={() => onImageClick(img.src)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="gallery-img w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImageModal({ src, onClose }) {
  if (!src) return null;

  return (
    <div
      id="imageModal"
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 opacity-100"
      onClick={onClose}
    >
      <img
        src={src}
        alt="Enlarged view"
        className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute top-5 right-5 text-white text-4xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
}
