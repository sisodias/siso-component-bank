import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white px-8 py-16 relative overflow-hidden w-full">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-950"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top section with content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Left Column - Company Info */}
          <div className="space-y-6">
            <div className="text-sm font-medium tracking-wide">
              00X
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-wide">
                SWIPE TEMPLATE
              </h3>
              <p className="text-blue-100 leading-relaxed max-w-sm">
                We generate highly qualified bespoke leads for businesses around the world.
              </p>
            </div>
            
            <div className="text-sm text-blue-200 pt-8">
              2025 © Wize Templates
            </div>
          </div>

          {/* Middle Column - Navigation */}
          <div className="space-y-6">
            <div className="text-sm font-medium tracking-wide">
              FOOTER
            </div>
            
            <nav className="space-y-3">
              <a href="#" className="block text-white hover:text-blue-200 transition-colors font-medium tracking-wide">
                HOME
              </a>
              <a href="#" className="block text-white hover:text-blue-200 transition-colors font-medium tracking-wide">
                CASE STUDIES
              </a>
              <a href="#" className="block text-white hover:text-blue-200 transition-colors font-medium tracking-wide">
                ABOUT
              </a>
              <a href="#" className="block text-white hover:text-blue-200 transition-colors font-medium tracking-wide">
                CONTACT
              </a>
            </nav>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-4">
              <a href="#" className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center hover:bg-opacity-30 transition-all">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center hover:bg-opacity-30 transition-all">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center hover:bg-opacity-30 transition-all">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column - Contact */}
          <div className="space-y-6">
            <div className="text-sm font-medium tracking-wide">
              SWIPE
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-wide">
                CONTACT
              </h3>
              <div className="space-y-3">
                <a href="mailto:hello@swipe.agency" className="block text-blue-100 hover:text-white transition-colors">
                  hello@swipe.agency
                </a>
                <a href="tel:+15551239876" className="block text-blue-100 hover:text-white transition-colors">
                  +1 (555) 123-9876
                </a>
              </div>
            </div>
            
            {/* Back to Top */}
            <div className="pt-8">
              <button className="flex items-center space-x-2 text-sm font-medium tracking-wide hover:text-blue-200 transition-colors">
                <span>BACK TO TOP</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Large SWIPE text with decorative elements */}
        <div className="relative">
          {/* Green asterisk */}
          <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
            <div className="text-lime-400 text-[10rem] font-black select-none leading-none">
              ✱
            </div>
          </div>

          {/* Main SWIPE text */}
          <div className="text-center">
            <h1 className="text-[16rem] md:text-[18rem] lg:text-[22rem] xl:text-[26rem] font-black tracking-tighter text-white select-none leading-none">
              SWIPE
            </h1>
          </div>

          {/* Green dot */}
          <div className="absolute -right-8 bottom-8">
            <div className="w-20 h-20 bg-lime-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;