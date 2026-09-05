import React from 'react';

export const MastercardComponent = () => {
  return (
    <div className="font-['Trebuchet_MS',_sans-serif] relative h-[203px] aspect-[1.579] rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 ease-in hover:scale-110 hover:shadow-[0_5em_2em_#111]"
         style={{
           transform: 'rotateZ(0deg) rotateY(0deg) scale(1)',
         }}
         onMouseEnter={(e) => {
           e.currentTarget.style.transform = 'rotateZ(1deg) rotateY(10deg) scale(1.1)';
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = 'rotateZ(0deg) rotateY(0deg) scale(1)';
         }}>
      
      <div className="flex items-center justify-center rounded-2xl relative"
           style={{
             background: 'linear-gradient(115deg, rgba(0, 0, 0, 0.33) 12%, rgba(255, 255, 255, 0.33) 27%, rgba(255, 255, 255, 0.33) 31%, rgba(0, 0, 0, 0.33) 52%)'
           }}>
        
        {/* Animated border effect on hover */}
        <div className="absolute h-[50em] aspect-[1.58] rounded-2xl opacity-0 hover:opacity-5 z-10 animate-pulse"
             style={{
               background: 'linear-gradient(115deg, rgba(0, 0, 0, 1) 42%, rgba(255, 255, 255, 1) 47%, rgba(255, 255, 255, 1) 51%, rgba(0, 0, 0, 1) 52%)',
               animation: 'rotate 4s linear infinite'
             }}></div>

        <div className="h-[12.5em] aspect-[1.586] rounded-2xl bg-[#999] opacity-80"
             style={{
               backgroundImage: 'linear-gradient(to right, #777, #777 2px, #999 2px, #999)',
               backgroundSize: '4px 100%'
             }}>
          
          <div className="relative w-full h-full rounded-[0.85em] border border-[#bbb] box-border"
               style={{
                 background: `
                   radial-gradient(circle at 100% 100%, #ffffff 0, #ffffff 8px, transparent 8px) 0% 0%/13px 13px no-repeat,
                   radial-gradient(circle at 0 100%, #ffffff 0, #ffffff 8px, transparent 8px) 100% 0%/13px 13px no-repeat,
                   radial-gradient(circle at 100% 0, #ffffff 0, #ffffff 8px, transparent 8px) 0% 100%/13px 13px no-repeat,
                   radial-gradient(circle at 0 0, #ffffff 0, #ffffff 8px, transparent 8px) 100% 100%/13px 13px no-repeat,
                   linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 10px) calc(100% - 26px) no-repeat,
                   linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 26px) calc(100% - 10px) no-repeat,
                   linear-gradient(135deg, rgba(3, 3, 3, 0.5) 0%, transparent 22%, transparent 47%, transparent 73%, rgba(0, 0, 0, 0.5) 100%)
                 `
               }}>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[0.6em] border border-[#aaa] shadow-[-1px_-1px_0_#ddd] h-[12em] aspect-[1.604]"
                 style={{
                   backgroundImage: 'linear-gradient(90deg, #777, #555 2px, #aaa 2px, #aaa)',
                   backgroundSize: '4px 100%'
                 }}>
              
              {/* Mastercard text */}
              <p className="absolute top-2 left-3 text-white/60 text-xl opacity-75"
                 style={{ textShadow: '-1px -1px #333' }}>
                Mastercard
              </p>
              
              {/* Ultra Member text */}
              <p className="absolute top-[10px] right-7 text-[0.5em] text-white/70 opacity-75"
                 style={{ textShadow: '-1px -1px #333' }}>
                ULTRA MEMBER
              </p>
              
              {/* Bottom mastercard text */}
              <p className="absolute bottom-1 right-[0.8em] text-xs text-white opacity-75"
                 style={{ textShadow: '-1px -1px #333' }}>
                mastercard
              </p>
              
              {/* Card number */}
              <p className="absolute bottom-12 left-3 text-[1.2em] text-white"
                 style={{ textShadow: '-1px -1px #333' }}>
                1234 5678 9012 3456
              </p>
              
              {/* Cardholder name */}
              <p className="absolute bottom-4 left-[1.4em] text-xs text-white"
                 style={{ textShadow: '-1px -1px #333' }}>
                Mysh Innovation Labs
              </p>
              
              {/* Mastercard circles */}
              <div className="absolute bottom-5 right-2 h-10 w-10 border border-[#bbb] rounded-full text-white"
                   style={{
                     background: 'linear-gradient(90deg, rgba(75, 75, 75, 0.25) 0%, rgba(121, 121, 121, 1) 100%)'
                   }}></div>
              
              <div className="absolute bottom-5 right-8 h-10 w-10 border border-[#bbb] rounded-full text-white"
                   style={{
                     background: 'linear-gradient(90deg, rgba(75, 75, 75, 0.25) 0%, rgba(121, 121, 121, 1) 100%)'
                   }}></div>
              
              {/* Chip SVG */}
              <svg version="1.1" className="absolute top-[27.5%] left-[8.25%] cursor-grab" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" xmlSpace="preserve">
                <image width={50} height={50} x={0} y={0} href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOY
                fEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSW
                ekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GS
                e0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOW
                ekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bf
                u3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWua
                fUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1
                lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrb
                tnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOh
                g0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU
                /f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dE
                orDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2Ng
                GAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVg
                OkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3d
                I2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6a
                lKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkI
                JVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0F
                qBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM
                1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGm
                BSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCET
                amiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdC
                S24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpj
                cmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIw
                MjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAy
                LTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg==" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          0% {
            transform: translate(-25em, -15em);
          }
          20% {
            transform: translate(25em, 15em);
          }
          100% {
            transform: translate(25em, 15em);
          }
        }
      `}</style>
    </div>
  );
};
