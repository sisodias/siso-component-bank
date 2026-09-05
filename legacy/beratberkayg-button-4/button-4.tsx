import React, { useState } from "react";


export const Component = () => {
  const [selected, setSelected] = useState("");

  const handleChange = (value) => {
    setSelected(value);
  };

  return (
    <div className="radio-group">
      <div className={`radio-container ${selected === "yes" ? "active" : ""}`}>
        <label className="radio-button">
          <input
            type="radio"
            name="option"
            value="yes"
            className="radio-input-element"
            checked={selected === "yes"}
            onChange={() => handleChange("yes")}
          />
          <svg
            className="radio-icon-element"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="8"></circle>
          </svg>
          <div className="glow"></div>
        </label>
      </div>

      <div className={`radio-container danger ${selected === "no" ? "active" : ""}`}>
        <label className="radio-button">
          <input
            type="radio"
            name="option"
            value="no"
            className="radio-input-element"
            checked={selected === "no"}
            onChange={() => handleChange("no")}
          />
          <svg
            className="radio-icon-element"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M6 18 18 6M6 6l12 12"></path>
          </svg>
          <div className="glow"></div>
        </label>
      </div>
    </div>
  );
};
