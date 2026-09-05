"use client"

export default function ConvertedComponent() {
  return (
    <>
      <style jsx>{`
        @layer components {
          @keyframes shake {
            50% {
              top: 6px;
            }
          }
          @keyframes shadow {
            50% {
              width: 110px;
              margin-left: -40px;
            }
          }
          @keyframes tail {
            50% {
              transform: rotate(38deg);
            }
          }
          @keyframes track {
            to {
              margin-left: 20px;
            }
          }
          @keyframes eye {
            50% {
              top: 2px;
            }
          }
          @keyframes mustache_l {
            50% {
              transform: rotate(-10deg);
            }
          }
          @keyframes mustache_r {
            0%, 100% {
              transform: rotateY(180deg) rotateZ(0);
            }
            50% {
              transform: rotateY(180deg) rotateZ(-10deg);
            }
          }
          @keyframes ear_l {
            50% {
              transform: rotate(-30deg);
            }
          }
          @keyframes ear_r {
            50% {
              transform: rotate(30deg);
            }
          }
          @keyframes paw_l {
            50% {
              left: 130px;
              top: 176px;
            }
            70% {
              top: 160px;
            }
          }
          @keyframes paw_r {
            25% {
              top: 160px;
            }
            50% {
              left: 88px;
              top: 176px;
            }
          }
        }
      `}</style>

      <div className="m-0 overflow-hidden min-h-screen">
        <div className="cat absolute top-1/2 left-1/2 w-[188px] h-[260px] -ml-[99px] -mt-[130px] text-black">
          {/* Paws */}
          <div className="absolute top-[176px] left-[88px] w-5 h-20 bg-current rounded-[20px_20px_80px_40px] rotate-[10deg] [animation:paw_l_0.45s_infinite_linear] after:absolute after:content-[''] after:bottom-[-5px] after:left-[-4px] after:w-5 after:h-[26px] after:bg-current after:rounded-[50%] after:rotate-[24deg]"></div>
          <div className="absolute top-[176px] left-[130px] w-5 h-20 bg-current rounded-[20px_20px_80px_40px] rotate-[10deg] [animation:paw_r_0.45s_infinite_linear] after:absolute after:content-[''] after:bottom-[-5px] after:left-[-4px] after:w-5 after:h-[26px] after:bg-current after:rounded-[50%] after:rotate-[24deg]"></div>

          {/* Shake container */}
          <div className="absolute w-full top-0 [animation:shake_0.45s_infinite_linear]">
            {/* Tail */}
            <div className="absolute content-[''] top-0 right-[-4px] w-[160px] h-[150px] border-[20px] border-solid border-t-current border-l-current border-r-transparent border-b-transparent rotate-45 rounded-[120px_120px_0_120px] box-border [animation:tail_0.45s_infinite_linear] after:absolute after:content-[''] after:w-5 after:h-5 after:bg-current after:rounded-[50%] after:bottom-0 after:[box-shadow:2px_4px_currentcolor,2px_7px_currentcolor,2px_10px_currentcolor,1px_14px_currentcolor,-1px_18px_currentcolor,-5px_22px_currentcolor,-10px_25px_currentcolor,-15px_28px_currentcolor,-20px_30px_currentcolor]"></div>

            {/* Main body */}
            <div className="absolute top-[14px] right-0 w-[144px] h-[216px] text-current">
              {/* Head */}
              <div className="absolute bottom-[-10px] left-5 w-[104px] h-[180px] bg-current rounded-[55px_55px_65px_65px] rotate-[40deg]"></div>

              {/* Body */}
              <div className="absolute right-0 w-[130px] h-[180px] bg-current rounded-[65px_65px_100px_100px]">
                {/* Leg */}
                <div className="absolute right-[-10px] top-5 w-[50px] h-[116px] bg-current rounded-[25px_60px_50px_0] before:absolute before:content-[''] before:bottom-[-4px] before:right-0 before:w-5 before:h-10 before:border-[3px] before:border-solid before:border-transparent before:rounded-[50%] before:border-l-[#616161] before:rotate-[6deg] after:absolute after:content-[''] after:left-[3px] after:bottom-[35px] after:w-[76px] after:h-[70px] after:rounded-[50%] after:border-[3px] after:border-solid after:border-transparent after:border-b-[#616161] after:rotate-[65deg]"></div>
              </div>

              {/* Face */}
              <div className="absolute bottom-0 w-[76px] h-20">
                {/* Nose */}
                <div className="absolute bottom-2 left-1/2 w-[18px] h-[9px] -ml-[10px] bg-[#9c1b4d] rounded-[20px_20px_20px_20px]"></div>

                {/* Mustache containers */}
                <div className="absolute bottom-[5px] w-5 h-[10px] [animation:mustache_l_0.45s_infinite_linear]">
                  <div className="absolute top-0 w-full border border-solid border-[#616161] origin-[100%_0] -rotate-[10deg]"></div>
                  <div className="absolute top-[6px] w-full border border-solid border-[#616161] origin-[100%_0] -rotate-[20deg]"></div>
                </div>
                <div className="absolute bottom-[5px] right-0 w-5 h-[10px] [animation:mustache_r_0.45s_infinite_linear]">
                  <div className="absolute top-0 w-full border border-solid border-[#616161] origin-[100%_0] -rotate-[10deg]"></div>
                  <div className="absolute top-[6px] w-full border border-solid border-[#616161] origin-[100%_0] -rotate-[20deg]"></div>
                </div>

                {/* Eyes */}
                <div className="absolute top-[28px] left-[-8px] w-[30px] h-[30px] bg-white border-[3px] border-solid border-black rounded-[50%] box-border after:absolute after:content-[''] after:w-[10px] after:h-[10px] after:right-[1px] after:top-[4px] after:bg-black after:rounded-[50%] after:[animation:eye_0.45s_infinite_linear]"></div>
                <div className="absolute top-[26px] left-[36px] w-[30px] h-[30px] bg-white border-[3px] border-solid border-black rounded-[50%] box-border after:absolute after:content-[''] after:w-[10px] after:h-[10px] after:right-[1px] after:top-[4px] after:bg-black after:rounded-[50%] after:[animation:eye_0.45s_infinite_linear]"></div>

                {/* Brow containers */}
                <div className="absolute top-[14px] left-[10px] w-[10px] h-[10px]">
                  <div className="absolute top-[20%] h-[60%] border border-solid border-[#616161] origin-[100%_0] rotate-[10deg]"></div>
                  <div className="absolute top-0 h-full left-[6px] border border-solid border-[#616161] origin-[100%_0] rotate-[3deg]"></div>
                </div>
                <div className="absolute top-[14px] left-[38px] w-[10px] h-[10px] [transform:rotateY(180deg)_rotateZ(0)]">
                  <div className="absolute top-[20%] h-[60%] border border-solid border-[#616161] origin-[100%_0] rotate-[10deg]"></div>
                  <div className="absolute top-0 h-full left-[6px] border border-solid border-[#616161] origin-[100%_0] rotate-[3deg]"></div>
                </div>

                {/* Ears */}
                <div className="absolute top-[-17px] w-5 h-[30px] bg-current rounded-[20px_20px_0_0] origin-[50%_100%] overflow-hidden -rotate-[20deg] [animation:ear_l_0.45s_infinite_linear]">
                  <div className="absolute top-[5px] left-1/2 w-[6px] h-[14px] -ml-[4px] bg-[#616161] rounded-[7px_7px_0_0]"></div>
                </div>
                <div className="absolute right-0 -mt-[22px] w-[36px] h-[30px] origin-[50%_100%] overflow-hidden rotate-[20deg] [animation:ear_r_0.45s_infinite_linear]">
                  <div className="absolute w-[30px] h-[200%] border-[3px] border-solid border-[#616161] rounded-[20px_20px_0_0]"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-[26px] -ml-[6px] bg-[#616161] rounded-[50%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Shadow */}
          <div className="absolute content-[''] top-full left-1/2 w-[130px] h-[30px] -ml-[50px] -mt-5 bg-[#616161] opacity-40 rounded-[50%] [animation:shadow_0.45s_infinite_linear] [animation-delay:0.225s]"></div>

          {/* Paw tracks */}
          <div className="absolute content-[''] top-full left-full w-[15px] h-[10px] -ml-[30px] -mt-[10px] bg-[#616161] opacity-30 rounded-[50%] [box-shadow:50px_0_#616161,100px_0_#616161,150px_0_#616161,200px_0_#616161,250px_0_#616161,300px_0_#616161] [animation:track_0.225s_infinite_linear]"></div>
        </div>
      </div>
    </>
  )
}
