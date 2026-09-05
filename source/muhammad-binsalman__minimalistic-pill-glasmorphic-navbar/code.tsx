

const GlasmoPillNavbar = () => {
  return (
   <div className="min-h-screen bg-gradient-to-br w-full from-stone-900 to-gray-900 flex items-center justify-center p-6">
      <div className="flex bg-neutral-200/70 backdrop-blur-2xl shadow-xl rounded-full p-1.5 shadow-lg border border-white/50">
        {['Home', 'Products', 'Services', 'About', 'Contact'].map((item) => (
          <a
            key={item}
            href="#"
            className={`px-6 ${item == "Home" && "border-b-2 rounded-2xl bg-stone-500/20 text-gray-100 border-stone-500"} py-3 rounded-full text-gray-700 font-medium transition-all duration-300 hover:text-gray-100 hover:bg-stone-500/10 hover:border-stone-500 hover:border-b-2`}
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  )
};

export default GlasmoPillNavbar;