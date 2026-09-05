import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="sharingon">
        <div className="ring">
          <div className="to" />
          <div className="to" />
          <div className="to" />
          <div className="circle" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .sharingon {
    width: 6em;
    height: 6em;
    background-color: red;
    border: 6px solid black;
    animation: rot 1s ease-in-out infinite;
  }

  .ring {
    position: absolute;
    content: "";
    left: 50%;
    top: 50%;
    width: 3.5em;
    height: 3.5em;
    border: 4px solid rgb(110, 13 ,13 ,0.5);
    transform: translate(-50%,-50%);
  }

  .sharingon, .ring, .to,.circle {
    border-radius: 50%;
  }

  .to,.circle {
    position: absolute;
    content: "";
    width: 0.9em;
    height: 0.9em;
    background-color: black;
  }

  .to:nth-child(1) {
    top: -0.5em;
    left: 50%;
    transform: translate(-40%);
  }

  .to::before {
    content: "";
    position: absolute;
    top: -0.5em;
    right: -0.2em;
    width: 1.1em;
    height: 0.9em;
    box-sizing: border-box;
    border-left: 16px solid black;
    border-radius: 100% 0 0;
  }

  .to:nth-child(2) {
    bottom: 0.5em;
    left: -0.35em;
    transform: rotate(-120deg);
  }

  .to:nth-child(3) {
    bottom: 0.5em;
    right: -0.35em;
    transform: rotate(120deg);
  }

  .circle {
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 20px 1px;
    width: 1em;
    height: 1em;
  }

  @keyframes rot {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }`;

export default Loader;
