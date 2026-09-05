import React, { useState, useEffect, useRef } from 'react';

// Panda Login Form Component
export default function PandaLoginForm() {
  // State to track which input is focused: 'none', 'username', or 'password'
  const [focus, setFocus] = useState('none');
  const containerRef = useRef(null);

  // This effect handles clicks outside the form to reset the panda's state
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setFocus('none');
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    // Unbind the event listener on clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);


  // Conditional styles for the panda parts based on the 'focus' state
  const eyeballLeftStyle = {
    top: focus === 'username' ? '1.12em' : '0.6em',
    left: focus === 'username' ? '0.75em' : '0.6em',
  };

  const eyeballRightStyle = {
    top: focus === 'username' ? '1.12em' : '0.6em',
    right: focus === 'username' ? '0.75em' : '0.6em',
  };

  const handLeftStyle = {
    height: focus === 'password' ? '6.56em' : '2.81em',
    top: focus === 'password' ? '3.87em' : '8.4em',
    left: focus === 'password' ? '11.75em' : '7.5em',
    transform: focus === 'password' ? 'rotate(-155deg)' : 'rotate(0deg)',
  };

  const handRightStyle = {
    height: focus === 'password' ? '6.56em' : '2.81em',
    top: focus === 'password' ? '3.87em' : '8.4em',
    right: focus === 'password' ? '11.75em' : '7.5em',
    transform: focus === 'password' ? 'rotate(155deg)' : 'rotate(0deg)',
  };

  return (
    // The main container for the panda and form. `font-size` is adjusted on smaller screens.
    <div ref={containerRef} className="relative w-[31.25em] h-[31.25em] text-[16px] sm:text-[14px]">
      {/* Panda Face and Features */}
      <div className="absolute top-[2em] left-0 right-0 mx-auto h-[7.5em] w-[8.4em] bg-white border-[0.18em] border-[#2e0d30] rounded-t-[7.5em] rounded-b-[5.62em] z-10">
        {/* Blushes */}
        <div className="absolute top-[4em] left-[1em] h-[1em] w-[1.37em] bg-[#ff8bb1] rounded-full transform rotate-25"></div>
        <div className="absolute top-[4em] right-[1em] h-[1em] w-[1.37em] bg-[#ff8bb1] rounded-full transform -rotate-25"></div>

        {/* Eyes */}
        <div className="absolute top-[2.18em] left-[1.37em] h-[2.18em] w-[2em] bg-[#3f3554] rounded-full transform -rotate-20">
          <div style={eyeballLeftStyle} className="absolute h-[0.6em] w-[0.6em] bg-white rounded-full transition-all duration-500 ease-in-out transform rotate-20"></div>
        </div>
        <div className="absolute top-[2.18em] right-[1.37em] h-[2.18em] w-[2em] bg-[#3f3554] rounded-full transform rotate-20">
          <div style={eyeballRightStyle} className="absolute h-[0.6em] w-[0.6em] bg-white rounded-full transition-all duration-500 ease-in-out transform -rotate-20"></div>
        </div>

        {/* Nose and Mouth */}
        <div className="absolute top-[4.37em] left-0 right-0 mx-auto h-[1em] w-[1em] bg-[#3f3554] rounded-tl-[1.2em] rounded-br-[0.25em] transform rotate-45
                        before:content-[''] before:absolute before:h-[0.6em] before:w-[0.1em] before:bg-[#3f3554] before:transform before:-rotate-45 before:top-[0.75em] before:left-[1em]">
        </div>
        <div className="absolute top-[5.31em] left-[3.12em] h-[0.75em] w-[0.93em] bg-transparent rounded-full shadow-[0_0.18em_#3f3554]
                        before:content-[''] before:absolute before:h-[0.75em] before:w-[0.93em] before:bg-transparent before:rounded-full before:shadow-[0_0.18em_#3f3554] before:left-[0.87em]">
        </div>
      </div>

      {/* Ears */}
      <div className="absolute top-[1.75em] left-[10.75em] h-[2.5em] w-[2.81em] bg-[#3f3554] border-[0.18em] border-[#2e0d30] rounded-t-full transform -rotate-38"></div>
      <div className="absolute top-[1.75em] right-[10.75em] h-[2.5em] w-[2.81em] bg-[#3f3554] border-[0.18em] border-[#2e0d30] rounded-t-full transform rotate-38"></div>

      {/* Login Form */}
      <form className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[3.1em] w-[23.75em] h-[18.75em] bg-white rounded-lg flex flex-col justify-center px-[3.1em] shadow-lg" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="username" className="block mb-[0.2em] font-semibold text-[#2e0d30]">Username:</label>
        <input
          type="text"
          id="username"
          onFocus={() => setFocus('username')}
          placeholder="Username here..."
          className="w-full text-[0.95em] font-normal text-[#3f3554] p-[0.3em] border-b-[0.12em] border-[#3f3554] focus:outline-none focus:border-[#f4c531] mb-[0.9em] bg-transparent"
        />
        <label htmlFor="password"className="block mb-[0.2em] font-semibold text-[#2e0d30]">Password:</label>
        <input
          type="password"
          id="password"
          onFocus={() => setFocus('password')}
          placeholder="Password here..."
          className="w-full text-[0.95em] font-normal text-[#3f3554] p-[0.3em] border-b-[0.12em] border-[#3f3554] focus:outline-none focus:border-[#f4c531] bg-transparent"
        />
        <button className="text-[0.95em] py-[0.8em] mt-[0.8em] bg-[#f4c531] text-[#2e0d30] font-semibold uppercase tracking-[0.15em] rounded-full border-none cursor-pointer hover:bg-yellow-500 transition-colors">
          Login
        </button>
      </form>
      
      {/* Hands */}
      <div style={handLeftStyle} className="absolute w-[2.5em] bg-[#3f3554] border-[0.18em] border-[#2e0d30] rounded-b-[2.18em] rounded-t-[0.6em] transition-all duration-500 ease-in-out z-20"></div>
      <div style={handRightStyle} className="absolute w-[2.5em] bg-[#3f3554] border-[0.18em] border-[#2e0d30] rounded-b-[2.18em] rounded-t-[0.6em] transition-all duration-500 ease-in-out z-20"></div>

      {/* Paws */}
      <div className="absolute top-[26.56em] left-[10em] h-[3.12em] w-[3.12em] bg-[#3f3554] border-[0.18em] border-[#2e0d30] rounded-t-[2.5em] rounded-b-[1.2em] 
                      before:content-[''] before:absolute before:h-[1.37em] before:w-[1.75em] before:top-[1.12em] before:left-[0.55em] before:bg-white before:rounded-t-[1.56em] before:rounded-b-[0.6em]
                      after:content-[''] after:absolute after:h-[0.5em] after:w-[0.5em] after:top-[0.31em] after:left-[1.12em] after:bg-white after:rounded-full after:shadow-[0.87em_0.37em_#ffffff,_-0.87em_0.37em_#ffffff]">
      </div>
      <div className="absolute top-[26.56em] right-[10em] h-[3.12em] w-[3.12em] bg-[#3f3554] border-[0.18em] border-[#2e0d30] rounded-t-[2.5em] rounded-b-[1.2em]
                       before:content-[''] before:absolute before:h-[1.37em] before:w-[1.75em] before:top-[1.12em] before:left-[0.55em] before:bg-white before:rounded-t-[1.56em] before:rounded-b-[0.6em]
                       after:content-[''] after:absolute after:h-[0.5em] after:w-[0.5em] after:top-[0.31em] after:left-[1.12em] after:bg-white after:rounded-full after:shadow-[0.87em_0.37em_#ffffff,_-0.87em_0.37em_#ffffff]">
      </div>
    </div>
  );
}
