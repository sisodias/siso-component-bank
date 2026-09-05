import React from "react";

const App = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selected, setSelected] = React.useState("Select");

    const countries = ["Germany", "Canada", "United States", "Russia", "India"];

    const handleSelect = (country) => {
        setSelected(country);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col w-44 text-sm relative">
            <button type="button" onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-4 pr-2 py-2 border rounded bg-white text-gray-800 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
            >
                <span>{selected}</span>
                <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <ul className="w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                    {countries.map((country) => (
                        <li key={country} className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer" onClick={() => handleSelect(country)} >
                            {country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;