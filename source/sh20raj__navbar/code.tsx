'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar({ logo, links }) {
  const [active, setActive] = useState(links[0].href);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/30 backdrop-blur-lg shadow-lg rounded-2xl px-8 py-4 flex items-center justify-between w-[90%] max-w-5xl z-50 border border-white/20"
    >
      <div className="text-2xl font-bold text-gray-900 cursor-pointer hover:scale-105 transition-transform">
        {logo}
      </div>

      <ul className="flex space-x-6">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href}>
              <motion.a
                onClick={() => setActive(link.href)}
                whileHover={{ scale: 1.1 }}
                className={`px-4 py-2 rounded-xl text-gray-800 font-medium transition-all ${
                  active === link.href
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'hover:bg-gray-200'
                }`}
              >
                {link.label}
              </motion.a>
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
