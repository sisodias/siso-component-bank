import React from 'react';
import styled from 'styled-components';

const Switch = () => {
  return (
    <StyledWrapper>
      <div>
        <input id="check" type="checkbox" />
        <label className="switch" htmlFor="check">
          <svg viewBox="0 0 212.4992 84.4688" overflow="visible">
            <path pathLength={360} fill="none" stroke="currentColor" d="M 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 A 42.24 42.24 90 0 0 84.4992 42.2496 A 42.24 42.24 90 0 0 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 L 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 A 42.24 42.24 90 0 0 128 42.2496 A 42.24 42.24 90 0 0 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 L 42.2496 0" />
          </svg>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* The switch - the box around the slider */
  .switch {
    --a: 0.5s ease-out;
    cursor: pointer;
    position: relative;
    display: inline-flex;
    height: 2em;
    border-radius: 2em;
    box-shadow: 0 0 0 0.66em #aaa;
    aspect-ratio: 212.4992/84.4688;
    background-color: #aaa;
  }

  /* Hide default HTML checkbox */
  #check {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .switch svg {
    height: 100%;
  }

  .switch svg path {
    color: #fff;
    stroke-width: 16;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 136 224;
    transition:
      all var(--a),
      0s transform;
    transform-origin: center;
  }

  #check:checked ~ .switch svg path {
    stroke-dashoffset: 180;
    transform: scaleY(-1);
  }`;

export default Switch;
