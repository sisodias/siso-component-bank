import React from "react";

export default function FlippingContactCard() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 transition-colors">
      {/* Flipping Card */}
      <div className="group w-80 h-52 [perspective:1000px]">
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-active:[transform:rotateY(180deg)]">
          
          {/* Front Side */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 [backface-visibility:hidden]">
            <img
              src="https://cdn.pixabay.com/photo/2017/06/23/03/36/photo-2433385_1280.jpg"
              alt="Profile"
              className="w-20 h-20 rounded-full shadow-md border-2 border-gray-200"
            />
            <h2 className="mt-4 text-lg font-semibold text-gray-800">Awanish Verma</h2>
            <p className="text-sm text-gray-500">UI/UX Designer</p>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <p className="text-sm mt-2">📧 avanishverma4@gmail.com</p>
            <p className="text-sm">📱 +91 78922 34174</p>
            <p className="text-sm">🌐 www.portfolio.com</p>

            <div className="flex gap-4 mt-3">
              <a href="#" className="hover:scale-110 transition">🔗</a>
              <a href="#" className="hover:scale-110 transition">🐦</a>
              <a href="#" className="hover:scale-110 transition">💼</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
