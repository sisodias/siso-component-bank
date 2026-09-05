import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
   <>
  {/* From Uiverse.io by whoisyourdeadie */}
  <div className="button-wrapper">
    <button className="button">
      <img
        alt="Shoot button"
        className="sprite"
        src="data:image/png;base64,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"
      />
    </button>
    <div className="laser laser-1" />
    <div className="laser laser-2" />
    <div className="laser laser-3" />
  </div>
  <div className="stars">
    <span
      style={{
        top: "3%",
        left: "7%",
        background: "#ff3cff",
        animationDelay: "0.1s",
        animationDuration: "2.4s"
      }}
    />
    <span
      style={{
        top: "12%",
        left: "15%",
        background: "#39ff14",
        animationDelay: "0.3s",
        animationDuration: "3s"
      }}
    />
    <span
      style={{
        top: "22%",
        left: "30%",
        background: "#00e5ff",
        animationDelay: "0.5s",
        animationDuration: "2.8s"
      }}
    />
    <span
      style={{
        top: "18%",
        left: "75%",
        background: "#ffffff",
        animationDelay: "0.4s",
        animationDuration: "2.5s"
      }}
    />
    <span
      style={{
        top: "9%",
        left: "88%",
        background: "#ccff00",
        animationDelay: "0.2s",
        animationDuration: "3.3s"
      }}
    />
    <span
      style={{
        top: "37%",
        left: "6%",
        background: "#fff600",
        animationDelay: "0.6s",
        animationDuration: "2.6s"
      }}
    />
    <span
      style={{
        top: "45%",
        left: "19%",
        background: "#00ffff",
        animationDelay: "0.1s",
        animationDuration: "2.7s"
      }}
    />
    <span
      style={{
        top: "52%",
        left: "41%",
        background: "#ff00ff",
        animationDelay: "0.3s",
        animationDuration: "2.9s"
      }}
    />
    <span
      style={{
        top: "61%",
        left: "67%",
        background: "#ffffff",
        animationDelay: "0.8s",
        animationDuration: "3s"
      }}
    />
    <span
      style={{
        top: "5%",
        left: "93%",
        background: "#ff3cff",
        animationDelay: "0.2s",
        animationDuration: "2.6s"
      }}
    />
    <span
      style={{
        top: "11%",
        left: "49%",
        background: "#00e5ff",
        animationDelay: "0.4s",
        animationDuration: "3.1s"
      }}
    />
    <span
      style={{
        top: "28%",
        left: "36%",
        background: "#39ff14",
        animationDelay: "0.7s",
        animationDuration: "2.5s"
      }}
    />
    <span
      style={{
        top: "65%",
        left: "12%",
        background: "#fff600",
        animationDelay: "0.6s",
        animationDuration: "3s"
      }}
    />
    <span
      style={{
        top: "83%",
        left: "2%",
        background: "#ccff00",
        animationDelay: "0.1s",
        animationDuration: "2.9s"
      }}
    />
    <span
      style={{
        top: "34%",
        left: "71%",
        background: "#00ffff",
        animationDelay: "0.5s",
        animationDuration: "3.2s"
      }}
    />
    <span
      style={{
        top: "74%",
        left: "17%",
        background: "#ffffff",
        animationDelay: "0.3s",
        animationDuration: "2.7s"
      }}
    />
    <span
      style={{
        top: "14%",
        left: "58%",
        background: "#ff00ff",
        animationDelay: "0.4s",
        animationDuration: "2.6s"
      }}
    />
    <span
      style={{
        top: "47%",
        left: "85%",
        background: "#00e5ff",
        animationDelay: "0.9s",
        animationDuration: "2.5s"
      }}
    />
    <span
      style={{
        top: "22%",
        left: "65%",
        background: "#ff3cff",
        animationDelay: "0.2s",
        animationDuration: "3s"
      }}
    />
    <span
      style={{
        top: "31%",
        left: "92%",
        background: "#39ff14",
        animationDelay: "0.6s",
        animationDuration: "2.8s"
      }}
    />
    <span
      style={{
        top: "7%",
        left: "25%",
        background: "#fff600",
        animationDelay: "0.4s",
        animationDuration: "3.2s"
      }}
    />
    <span
      style={{
        top: "16%",
        left: "40%",
        background: "#ccff00",
        animationDelay: "0.1s",
        animationDuration: "2.9s"
      }}
    />
    <span
      style={{
        top: "26%",
        left: "80%",
        background: "#ffffff",
        animationDelay: "0.3s",
        animationDuration: "2.7s"
      }}
    />
    <span
      style={{
        top: "53%",
        left: "3%",
        background: "#00ffff",
        animationDelay: "0.2s",
        animationDuration: "3.1s"
      }}
    />
    <span
      style={{
        top: "66%",
        left: "33%",
        background: "#ff00ff",
        animationDelay: "0.5s",
        animationDuration: "2.8s"
      }}
    />
    <span
      style={{
        top: "76%",
        left: "50%",
        background: "#00e5ff",
        animationDelay: "0.7s",
        animationDuration: "2.4s"
      }}
    />
    <span
      style={{
        top: "89%",
        left: "6%",
        background: "#ff3cff",
        animationDelay: "0.6s",
        animationDuration: "2.9s"
      }}
    />
    <span
      style={{
        top: "96%",
        left: "29%",
        background: "#39ff14",
        animationDelay: "0.8s",
        animationDuration: "3.2s"
      }}
    />
    <span
      style={{
        top: "70%",
        left: "72%",
        background: "#fff600",
        animationDelay: "0.4s",
        animationDuration: "2.6s"
      }}
    />
    <span
      style={{
        top: "81%",
        left: "95%",
        background: "#ccff00",
        animationDelay: "0.5s",
        animationDuration: "3s"
      }}
    />
    <span
      style={{
        top: "59%",
        left: "10%",
        background: "#ffffff",
        animationDelay: "0.3s",
        animationDuration: "2.7s"
      }}
    />
    <span
      style={{
        top: "48%",
        left: "60%",
        background: "#00ffff",
        animationDelay: "0.2s",
        animationDuration: "3.1s"
      }}
    />
    <span
      style={{
        top: "36%",
        left: "13%",
        background: "#ff00ff",
        animationDelay: "0.7s",
        animationDuration: "2.9s"
      }}
    />
    <span
      style={{
        top: "17%",
        left: "76%",
        background: "#00e5ff",
        animationDelay: "0.6s",
        animationDuration: "2.8s"
      }}
    />
    <span
      style={{
        top: "56%",
        left: "38%",
        background: "#ff3cff",
        animationDelay: "0.1s",
        animationDuration: "2.6s"
      }}
    />
    <span
      style={{
        top: "44%",
        left: "89%",
        background: "#39ff14",
        animationDelay: "0.5s",
        animationDuration: "3.3s"
      }}
    />
    <span
      style={{
        top: "32%",
        left: "19%",
        background: "#fff600",
        animationDelay: "0.3s",
        animationDuration: "2.5s"
      }}
    />
    <span
      style={{
        top: "71%",
        left: "54%",
        background: "#ccff00",
        animationDelay: "0.2s",
        animationDuration: "2.9s"
      }}
    />
    <span
      style={{
        top: "20%",
        left: "90%",
        background: "#ffffff",
        animationDelay: "0.6s",
        animationDuration: "2.8s"
      }}
    />
    <span
      style={{
        top: "63%",
        left: "23%",
        background: "#00ffff",
        animationDelay: "0.4s",
        animationDuration: "3.1s"
      }}
    />
    <span
      style={{
        top: "39%",
        left: "84%",
        background: "#ff00ff",
        animationDelay: "0.7s",
        animationDuration: "2.6s"
      }}
    />
    <span
      style={{
        top: "10%",
        left: "46%",
        background: "#00e5ff",
        animationDelay: "0.2s",
        animationDuration: "3s"
      }}
    />
    <span
      style={{
        top: "50%",
        left: "69%",
        background: "#ff3cff",
        animationDelay: "0.5s",
        animationDuration: "2.7s"
      }}
    />
    <span
      style={{
        top: "73%",
        left: "32%",
        background: "#39ff14",
        animationDelay: "0.3s",
        animationDuration: "2.6s"
      }}
    />
    <span
      style={{
        top: "68%",
        left: "18%",
        background: "#fff600",
        animationDelay: "0.4s",
        animationDuration: "2.8s"
      }}
    />
    <span
      style={{
        top: "24%",
        left: "48%",
        background: "#ccff00",
        animationDelay: "0.6s",
        animationDuration: "3.2s"
      }}
    />
    <span
      style={{
        top: "77%",
        left: "78%",
        background: "#ffffff",
        animationDelay: "0.1s",
        animationDuration: "2.5s"
      }}
    />
    <span
      style={{
        top: "85%",
        left: "35%",
        background: "#00ffff",
        animationDelay: "0.5s",
        animationDuration: "2.9s"
      }}
    />
    <span
      style={{
        top: "93%",
        left: "59%",
        background: "#ff00ff",
        animationDelay: "0.2s",
        animationDuration: "2.7s"
      }}
    />
    <span
      style={{
        top: "40%",
        left: "26%",
        background: "#00e5ff",
        animationDelay: "0.3s",
        animationDuration: "2.6s"
      }}
    />
  </div>
  <div className="monster monster-1" />
  <div className="monster monster-2" />
  <div className="monster monster-3" />
  <div className="monster monster-4" />
  <div className="monster monster-5" />
  <div className="monster monster-6" />
  <div className="monster monster-7" />
  <div className="monster monster-8" />
  <div className="monster monster-9" />
</>

  );
};
