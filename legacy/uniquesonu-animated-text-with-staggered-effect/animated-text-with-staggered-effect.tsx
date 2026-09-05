import React from 'react';

const AnimatedText = ({ text, className, baseDelay = 0, spaceClassName }) => {
  const characters = text.split('');

 
  const getAnimationDelay = (index) => {
    let delay = baseDelay;
    if ((index + 1) % 7 === 0) {
      delay -= 1000;
    } else if ((index + 1) % 5 === 0) {
      delay -= 500;
    } else if ((index + 1) % 3 === 0) {
      delay -= 250;
    }
    return `${delay}ms`;
  };

  return (
    <div className={`absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 ${className}`}>
      {characters.map((char, index) => {
        if (char === ' ') {
          // Render a responsive spacer for space characters
          return <span key={index} className={spaceClassName}></span>;
        }
        return (
          <span
            key={index}
            className="m-0 [animation:fontSkew_2000ms_steps(1,end)_infinite,fontScale_1000ms_steps(1,end)_infinite]"
            style={{ animationDelay: getAnimationDelay(index) }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};


const AnimatedFollowerCount = () => {
  const mainText = "1300 Followers";
  const threadsText = "On Threads";
  // Define responsive classes for the space between words.
  const spaceClassName = "mx-2 sm:mx-3 lg:mx-[1.5vmin]";

  return (
    <div className="relative w-fit-content text-6xl sm:text-8xl lg:text-[15vmin]">
      <AnimatedText
        text={mainText}
        className="font-['Londrina_Solid'] text-orange-600 dark:text-orange-400"
        baseDelay={200}
        spaceClassName={spaceClassName}
      />
      
      <AnimatedText
        text={mainText}
        className="font-['Londrina_Sketch'] text-gray-900 dark:text-gray-100"
        baseDelay={0}
        spaceClassName={spaceClassName}
      />
      <div className="font-['Londrina_Solid'] absolute text-3xl sm:text-4xl lg:text-[8vmin] text-gray-800 dark:text-gray-200 whitespace-nowrap 
        transform 
        translate-x-[7rem] translate-y-[2.75rem] 
        sm:translate-x-[11rem] sm:translate-y-[4.5rem] 
        lg:translate-x-0 lg:translate-y-0 lg:[transform:translate(27vmin,11vmin)]">
        {threadsText}
      </div>
    </div>
  );
};

export default AnimatedFollowerCount;