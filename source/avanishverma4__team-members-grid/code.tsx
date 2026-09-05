import React, { useState } from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const TeamMember = ({ name, role, image, bio, social, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative group"
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300"
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover grayscale"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
        
        <div className="p-4 md:p-5">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-xs md:text-sm font-medium text-gray-600 mb-2">{role}</p>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2">
            {bio}
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="flex gap-2 mt-3"
          >
            {social.linkedin && (
              <a
                href={social.linkedin}
                className="p-1.5 md:p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-black hover:text-white transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin size={14} className="md:w-4 md:h-4" />
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                className="p-1.5 md:p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-black hover:text-white transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Twitter size={14} className="md:w-4 md:h-4" />
              </a>
            )}
            {social.email && (
              <a
                href={`mailto:${social.email}`}
                className="p-1.5 md:p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-black hover:text-white transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail size={14} className="md:w-4 md:h-4" />
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
          x: mousePosition.x + 15,
          y: mousePosition.y + 15
        }}
        transition={{ duration: 0.2 }}
        className="absolute pointer-events-none z-50 whitespace-nowrap"
        style={{
          left: 0,
          top: 0
        }}
      >
        <div className="bg-black text-white px-3 py-2 rounded-md shadow-lg text-sm font-medium">
          More about {name}
        </div>
      </motion.div>
    </motion.div>
  );
};

const OrthogonalGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(229, 231, 235)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

export default function TeamMembersGrid() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop",
      bio: "Visionary leader with 15+ years in tech. Passionate about building innovative products that make a difference.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@company.com"
      }
    },
    {
      name: "Marcus Rodriguez",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop",
      bio: "Full-stack architect and AI enthusiast. Loves solving complex technical challenges at scale.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "marcus@company.com"
      }
    },
    {
      name: "Emma Thompson",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop",
      bio: "Award-winning designer focused on creating delightful user experiences that blend form and function.",
      social: {
        linkedin: "#",
        email: "emma@company.com"
      }
    },
    {
      name: "David Park",
      role: "VP of Engineering",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&h=600&fit=crop",
      bio: "Engineering leader who thrives on mentorship and building high-performing teams.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "david@company.com"
      }
    },
    {
      name: "Aisha Patel",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=600&fit=crop",
      bio: "Product strategist with a keen eye for market trends and user needs. Data-driven decision maker.",
      social: {
        linkedin: "#",
        email: "aisha@company.com"
      }
    },
    {
      name: "James Wilson",
      role: "Chief Marketing Officer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop",
      bio: "Growth hacker and brand builder. Expert in creating compelling narratives that resonate.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "james@company.com"
      }
    },
    {
      name: "Lisa Martinez",
      role: "Chief Financial Officer",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=600&fit=crop",
      bio: "Financial strategist with expertise in scaling businesses and optimizing operational efficiency.",
      social: {
        linkedin: "#",
        email: "lisa@company.com"
      }
    },
    {
      name: "Ryan Kumar",
      role: "Head of Sales",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
      bio: "Results-driven sales leader committed to building lasting client relationships and driving growth.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "ryan@company.com"
      }
    },
    {
      name: "Nina Foster",
      role: "VP of Operations",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop",
      bio: "Operations expert focused on streamlining processes and building scalable systems.",
      social: {
        linkedin: "#",
        email: "nina@company.com"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <OrthogonalGrid />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">Meet Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Talented individuals united by a passion for innovation and excellence
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {teamMembers.slice(0, 9).map((member, index) => (
            <TeamMember key={index} {...member} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
