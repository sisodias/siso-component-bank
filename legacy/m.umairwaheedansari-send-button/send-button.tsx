import React from "react"
import styled from "styled-components"

const Button = () => {
  return (
    <StyledWrapper>
      <button className="flex items-center rounded-2xl bg-blue-600 text-white text-lg font-medium px-5 py-2 pl-[0.9em] overflow-hidden transition-all duration-200 cursor-pointer active:scale-95">
        <div className="svg-wrapper-1 flex items-center">
          <div className="svg-wrapper flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              className="transition-transform duration-300 origin-center"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                fill="currentColor"
                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
              />
            </svg>
          </div>
        </div>
        <span className="ml-1 transition-transform duration-300">Send</span>
      </button>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  button:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
  }

  button:hover span {
    transform: translateX(5em);
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }
    to {
      transform: translateY(-0.1em);
    }
  }
`

export default Button
