

const Loader = () => {
  return (
    <div className="relative max-w-fit text-[50px] italic font-semibold text-gray-800 dark:text-gray-100 hover:text-[#FCFFDF] transition-colors duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] font-[Mine]">
      <span className="animate-cut transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
        Barcode
      </span>
      <div className="absolute w-full h-[6px] rounded bg-[#FF828291] top-0 left-0 z-0 blur-[10px] animate-scan transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"></div>
      <div className="absolute w-full h-[5px] rounded bg-[#FF8282] top-0 left-0 z-[1] opacity-90 animate-scan transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"></div>
    </div>
  );
};


export default Loader;