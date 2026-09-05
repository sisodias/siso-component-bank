import React from 'react';

const Browser = () => {
  return (
    <div 
      className="w-[300px] h-[250px] bg-neutral-100 rounded-lg flex flex-col overflow-hidden relative"
      style={{ boxShadow: '5px 5px 10px rgba(31, 31, 31, 0.245)' }}
    >
      {/* Tabs Header */}
      <div className="bg-[#353535] h-[40px] flex justify-between items-end pl-5">
        <div className="flex">
          <div className="relative w-[100px] h-[34px] rounded-tl-[7px] rounded-tr-[7px] bg-[#515151] flex items-start justify-between gap-1 p-[4px_8px]">
            {/* Right Mask */}
            <div className="absolute top-0 right-0 h-[24px] w-[20px] translate-x-full overflow-hidden bg-[#515151]">
              <div style={{ borderRadius: '0 0 0 7px' }} className="w-full h-full bg-[#353535]"></div>
            </div>
            
            {/* Left Mask */}
            <div className="absolute top-0 left-0 h-[24px] w-[20px] -translate-x-full overflow-hidden bg-[#515151]">
              <div style={{ borderRadius: '0 0 7px 0' }} className="w-full h-full bg-[#353535]"></div>
            </div>
            
            <span className="text-white text-[10px]">21st.dev</span>
            <div className="text-white text-[9px] p-[1px_4px] rounded-full cursor-default hover:bg-[#5d5d5d]">✕</div>
          </div>
        </div>
        
        <div className="flex">
          <button className="h-[30px] w-[30px] border-none bg-transparent transition ease-out duration-100 text-white mb-[10px] hover:bg-[#515151c8]">-</button>
          <button className="h-[30px] w-[30px] border-none bg-transparent transition ease-out duration-100 text-white mb-[10px] hover:bg-[#515151c8]">□</button>
          <button className="h-[30px] w-[30px] border-none bg-transparent transition ease-out duration-100 text-white mb-[10px] hover:bg-[#ff3434]">✕</button>
        </div>
      </div>
      
      {/* Browser Header */}
      <div className="absolute top-[30px] w-full h-[40px] bg-[#515151] p-[7px] flex gap-[5px] rounded-tl-[7px] rounded-tr-[7px]">
        <button className="w-[27px] h-[25px] border-none bg-transparent text-white rounded-full transition ease-in-out duration-200 hover:bg-[#5d5d5d]">←</button>
        <button disabled className="w-[27px] h-[25px] border-none bg-transparent text-white rounded-full transition ease-in-out duration-200 opacity-40 hover:bg-transparent">→</button>
        <input 
          type="text" 
          placeholder="Search Google or type URL" 
          value="21st.dev"
          className="bg-[#3b3b3b] text-sm border-2 border-transparent h-full rounded-full outline-none text-white px-[15px] flex-1 transition ease-in-out duration-200 hover:bg-[#5d5d5d] focus:border-[#add6ff] focus:bg-[#3b3b3b] focus:transition-none placeholder-white"
        />
        <button className="w-[27px] h-[25px] border-none bg-transparent text-white rounded-full transition ease-in-out duration-200 hover:bg-[#5d5d5d]">⋮</button>
        <button className="text-white absolute right-[45px] top-1/2 -translate-y-1/2 text-[15px] opacity-70 h-[18px] w-[19px] flex items-center justify-center pb-[3px]">✰</button>
      </div>
    </div>
  );
};

export {Browser};