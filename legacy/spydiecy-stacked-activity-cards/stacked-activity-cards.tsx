import React, { useState } from "react";
import { cn } from "../_utils/cn";

export const Component = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Different mock data for activities
  const activities = [
    {
      id: 1,
      activity: "Mountain Hiking",
      location: "Mount Rainier",
      date: "12 August",
      color: "#ff7e5f"
    },
    {
      id: 2,
      activity: "Surfing Lesson",
      location: "Malibu Beach",
      date: "8 August",
      color: "#0396FF"
    },
    {
      id: 3,
      activity: "Wine Tasting",
      location: "Napa Valley",
      date: "30 July",
      color: "#7367F0"
    }
  ];

  return (
    <div className="stacked-cards-container">
      <div className="inner_container">
        {activities.map((item, index) => (
          <div 
            key={item.id} 
            className={cn(
              "park_sec", 
              `park_sec${index + 1}`,
              isExpanded && "active"
            )}
          >
            <div className="park_inside">
              <span className="img" style={{ backgroundColor: item.color }}></span>
              <div className="content_sec">
                <h2>{item.activity}</h2>
                <span>{item.location}</span>
              </div>
            </div>
            <span className="date">{item.date}</span>
          </div>
        ))}
        <div className="btn_grp">
          <button 
            className={cn("btn", isExpanded && "active")} 
            onClick={toggleExpand}
          >
            {isExpanded ? "Hide" : "Show All"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        
        body {
          margin: 0px;
          font-family: "Poppins", sans-serif;
          background: #531753;
        }
        
        .stacked-cards-container {
          position: relative;
          max-width: 700px;
          width: 100%;
          margin: 0px auto;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .inner_container {
          position: relative;
          max-width: 400px;
          width: 100%;
          padding: 15px;
          border-radius: 25px;
          box-sizing: border-box;
        }
        
        .park_sec {
          position: relative;
          max-width: 100%;
          width: 100%;
          padding: 15px;
          border: 2px solid #EAEAE9;
          border-radius: 25px;
          box-sizing: border-box;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 10px;
          transition: all .3s cubic-bezier(.68,-0.55,.27,1.55);
          background: #fff;
          box-shadow: 0px 5px 10px rgba(32, 28, 28, 0.3);
        }
        
        .park_sec.active {
          transform: unset;
        }
        
        .park_sec1 {
          z-index: 2;
          transform: translateY(200%) scale(0.95);
        }
        
        .park_sec2 {
          z-index: 1;
          transform: translateY(100%) scale(0.9);
        }
        
        .park_sec3 {
          z-index: 0;
          transform: translateY(0px) scale(0.85);
        }
        
        .park_inside {
          position: relative;
          display: flex;
        }
        
        .content_sec {
          position: relative;
          margin-left: 10px;
        }
        
        .img {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .content_sec h2 {
          position: relative;
          margin: 0px;
          font-size: 16px;
          font-weight: 500;
          color: #626263;
        }
        
        .content_sec span,
        .park_sec span {
          position: relative;
          color: #626263;
          font-size: 15px;
        }
        
        .btn_grp {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
        }
        
        .btn {
          position: relative;
          padding: 10px 40px 10px 30px;
          background: #fff;
          border-radius: 20px;
          border: 0px;
          box-sizing: border-box;
          box-shadow: 0px 3px 3.5px rgba(119, 113, 113, 0.5);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0px 5px 5px rgba(119, 113, 113, 0.5);
        }
        
        .btn::after {
          position: absolute;
          content: "";
          border-top: 2px solid #000;
          border-left: 2px solid #000;
          width: 7px;
          height: 7px;
          right: 23px;
          top: 12px;
          transform: rotate(225deg);
          transition: all .3s linear;
        }
        
        .btn.active::after {
          transform: rotate(45deg);
          top: 17px;
        }
      `}</style>
    </div>
  );
};