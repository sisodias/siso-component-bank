import React from "react"

const Button = () => {
  return (
    <button className="group relative rounded-[0.75em] bg-black dark:bg-white font-bold text-[17px] cursor-pointer border-0">
      <span
        className="
          block box-border 
          border-2 border-black dark:border-white
          rounded-[0.75em] 
          px-6 py-3 
          bg-[#e8e8e8] dark:bg-[#1a1a1a] 
          text-black dark:text-white 
          transform -translate-y-[0.2em] 
          transition-transform duration-100 ease-in-out
          group-hover:-translate-y-[0.33em] 
          group-active:translate-y-0
        "
      >
        Button
      </span>
    </button>
  )
}

export default Button
