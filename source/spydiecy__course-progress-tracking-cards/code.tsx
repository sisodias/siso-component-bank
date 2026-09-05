import React from "react";

/*
inspiration from
https://dribbble.com/shots/14951981-Design-Courses-Darshboard-Design/attachments/6669266?mode=media
*/

export const ProjectCard = ({ color, date, title, subtitle, progress, team, countdown }) => {
  // Define color variants with enhanced gradients for different card styles
  const colorVariants = {
    green: {
      gradient: "linear-gradient(135deg, rgba(1, 195, 168, 0.85) 0%, rgba(16, 118, 103, 0.2) 70%)",
      accentGradient: "linear-gradient(90deg, #01c3a8 0%, #107667 100%)",
      border: "linear-gradient(45deg, #232228, #232228, #232228, #232228, #01c3a8)",
      accent: "#01c3a8",
      progressGradient: "linear-gradient(90deg, #01c3a8 0%, #01957f 100%)",
    },
    orange: {
      gradient: "linear-gradient(135deg, rgba(255, 183, 65, 0.85) 0%, rgba(255, 153, 0, 0.2) 70%)",
      accentGradient: "linear-gradient(90deg, #ffb741 0%, #ff9900 100%)",
      border: "linear-gradient(45deg, #232228, #232228, #232228, #232228, #ffb741)",
      accent: "#ffb741",
      progressGradient: "linear-gradient(90deg, #ffb741 0%, #ff9900 100%)",
    },
    red: {
      gradient: "linear-gradient(135deg, rgba(166, 61, 42, 0.85) 0%, rgba(120, 40, 30, 0.2) 70%)",
      accentGradient: "linear-gradient(90deg, #a63d2a 0%, #78281e 100%)",
      border: "linear-gradient(45deg, #232228, #232228, #232228, #232228, #a63d2a)",
      accent: "#a63d2a",
      progressGradient: "linear-gradient(90deg, #a63d2a 0%, #78281e 100%)",
    },
    blue: {
      gradient: "linear-gradient(135deg, rgba(24, 144, 255, 0.85) 0%, rgba(0, 69, 143, 0.2) 70%)",
      accentGradient: "linear-gradient(90deg, #1890ff 0%, #00458f 100%)",
      border: "linear-gradient(45deg, #232228, #232228, #232228, #232228, #1890ff)",
      accent: "#1890ff",
      progressGradient: "linear-gradient(90deg, #1890ff 0%, #00458f 100%)",
    }
  };

  const variant = colorVariants[color] || colorVariants.blue;

  return (
    <div className="relative w-80 h-80 rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-b from-[#181818] to-[#101010]" 
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05)"
      }}>
      {/* Card background gradient effect */}
      <div 
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background: variant.gradient,
        }}
      />
      
      {/* Card border effect with subtle glow */}
      <div 
        className="absolute inset-0 -z-10 rounded-3xl border-2 border-transparent"
        style={{
          background: variant.border,
          boxShadow: `inset 0 0 15px rgba(${color === 'green' ? '1, 195, 168' : color === 'orange' ? '255, 183, 65' : color === 'red' ? '166, 61, 42' : '24, 144, 255'}, 0.15)`,
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out"
        }}
      />
      
      {/* Card Header */}
      <div className="absolute top-0 left-0 right-0 w-full flex items-center justify-between px-6 pt-3">
        <div className="text-gray-400 font-medium">{date}</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-colors">
          <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Card Body */}
      <div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6">
        <h3 className="text-white text-2xl mt-3 mb-1 capitalize font-semibold">{title}</h3>
        <p className="text-gray-400 text-base tracking-wide">{subtitle}</p>
        
        <div className="mt-6">
          <span className="text-white font-semibold text-left block mb-2">Progress</span>
          <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ 
                width: `${progress}%`, 
                background: variant.progressGradient,
                boxShadow: `0 0 6px ${variant.accent}`
              }}
            ></div>
          </div>
          <span className="mt-1 text-right block text-gray-300">{progress}%</span>
        </div>
      </div>
      
      {/* Card Footer with glass effect */}
      <div className="absolute bottom-0 left-0 right-0 w-full border-t border-gray-800 flex justify-between px-6 py-3 rounded-b-3xl"
        style={{
          background: "rgba(17, 17, 17, 0.9)",
          backdropFilter: "blur(5px)"
        }}>
        <ul className="flex items-center">
          {team.map((member, index) => (
            <li key={index} className="flex -mr-3 transition-transform hover:translate-y-[-3px]">
              <img 
                src={member.img} 
                alt={member.alt || "Team member"} 
                className="rounded-full w-9 h-9 object-cover border-2 border-[#0c0c0c]"
              />
            </li>
          ))}
          <a 
            href="#" 
            className="w-9 h-9 rounded-full flex justify-center items-center text-white ml-1 transition-transform hover:scale-110"
            style={{ background: variant.accentGradient }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </a>
        </ul>

        <a 
          href="#" 
          className="bg-[#1a1a1a] text-white rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:shadow-xl"
          style={{ 
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = variant.accentGradient;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#1a1a1a";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {countdown}
        </a>
      </div>
    </div>
  );
};

export const ProjectDashboard = () => {
  // Example project data
  const projects = [
    {
      color: "green",
      date: "Feb 2, 2021",
      title: "web designing",
      subtitle: "Prototyping",
      progress: 90,
      team: [
        { img: "/api/placeholder/60/60", alt: "Team member 1" },
        { img: "/api/placeholder/60/60", alt: "Team member 2" }
      ],
      countdown: "2 days left"
    },
    {
      color: "orange",
      date: "Feb 05, 2021",
      title: "mobile app",
      subtitle: "Shopping",
      progress: 30,
      team: [
        { img: "/api/placeholder/60/60", alt: "Team member 1" },
        { img: "/api/placeholder/60/60", alt: "Team member 2" }
      ],
      countdown: "3 weeks left"
    },
    {
      color: "red",
      date: "March 03, 2021",
      title: "dashboard",
      subtitle: "Medical",
      progress: 50,
      team: [
        { img: "/api/placeholder/60/60", alt: "Team member 1" },
        { img: "/api/placeholder/60/60", alt: "Team member 2" }
      ],
      countdown: "3 weeks left"
    },
    {
      color: "blue",
      date: "March 08, 2021",
      title: "web designing",
      subtitle: "Wireframing",
      progress: 20,
      team: [
        { img: "/api/placeholder/60/60", alt: "Team member 1" },
        { img: "/api/placeholder/60/60", alt: "Team member 2" }
      ],
      countdown: "3 weeks left"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] font-sans relative overflow-hidden grid place-items-center p-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
}