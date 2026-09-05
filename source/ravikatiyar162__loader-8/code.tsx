import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="solar-system-container">
        <div className="solar-system">
          <div className="sun" />
          <div className="earth-orbit">
            <div className="earth">
              <div className="moon-orbit">
                <div className="moon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .solar-system-container {
    perspective: 1500px;
    width: 200px;
    height: 200px;
    margin: 50px auto;
  }

  .solar-system {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: all 0.5s ease-out;
    animation: rotate-center 6s linear infinite;
  }

  .sun {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    background: radial-gradient(circle at 30% 30%, #fff, #ffd700, #ffa500);
    border-radius: 50%;
    transform: translate(-50%, -50%) translateZ(0);
    box-shadow: 0 0 20px #ffd700;
    transition: all 0.5s ease-out;
  }

  .earth-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150px;
    height: 150px;
    border: 2px dashed rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%) translateZ(-50px);
    transform-style: preserve-3d;
    transition: all 0.5s ease-out;
  }

  .earth {
    position: absolute;
    top: -10px;
    left: 50%;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle at 30% 30%, #4b9cd3, #1b4f72);
    border-radius: 50%;
    transform: translateX(-50%) translateZ(0);
    transform-style: preserve-3d;
    transition: all 0.5s ease-out;
  }

  .moon-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%) translateZ(-10px);
    animation: rotate-orbit 2s linear infinite;
    transform-style: preserve-3d;
    transition: all 0.5s ease-out;
  }

  .moon {
    position: absolute;
    top: -3px;
    left: 50%;
    width: 6px;
    height: 6px;
    background: radial-gradient(circle at 30% 30%, #fff, #ccc);
    border-radius: 50%;
    transform: translateX(-50%) translateZ(0);
    transition: all 0.5s ease-out;
  }

  /* Hover Effects */
  .solar-system-container:hover .solar-system {
    animation-play-state: paused;
    transform: rotateX(45deg) rotateY(-45deg);
  }

  .solar-system-container:hover .sun {
    transform: translate(-50%, -50%) translateZ(100px);
    box-shadow: 0 0 40px #ffd700;
  }

  .solar-system-container:hover .earth-orbit {
    transform: translate(-50%, -50%) translateZ(-100px) rotateX(75deg);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .solar-system-container:hover .earth {
    transform: translateX(-50%) translateZ(20px);
    box-shadow: 0 0 15px rgba(75, 156, 211, 0.8);
  }

  .solar-system-container:hover .moon-orbit {
    transform: translate(-50%, -50%) translateZ(-120px) rotateX(75deg);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .solar-system-container:hover .moon {
    transform: translateX(-50%) translateZ(10px);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  }

  /* Active state for even more depth */
  .solar-system-container:active .solar-system {
    transform: rotateX(55deg) rotateY(-55deg);
  }

  .solar-system-container:active .sun {
    transform: translate(-50%, -50%) translateZ(150px);
    box-shadow: 0 0 50px #ffd700;
  }

  .solar-system-container:active .earth-orbit {
    transform: translate(-50%, -50%) translateZ(-150px) rotateX(85deg);
  }

  .solar-system-container:active .moon-orbit {
    transform: translate(-50%, -50%) translateZ(-180px) rotateX(85deg);
  }

  @keyframes rotate-orbit {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes rotate-center {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }`;

export default Loader;
