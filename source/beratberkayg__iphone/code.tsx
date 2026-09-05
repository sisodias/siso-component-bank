export const Component = () => {
  return (
    <div
      className="relative flex justify-center h-[460px] w-[240px] border-4 border-black rounded-[2rem] bg-gradient-to-b from-gray-100 to-gray-200"
      style={{
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)"
      }}
    >
   
      <span
        className="absolute top-0 border border-black bg-black w-20 h-2 rounded-b-xl"
      ></span>

    <span
        className="absolute -left-2 top-24 border-4 border-black h-7 w-2 rounded-md bg-gray-100"
      ></span>
      <span
        className="absolute -left-2 top-32 border-4 border-black h-7 w-2 rounded-md bg-gray-100"
      ></span>
      
      <span
        className="absolute -right-2 top-24 border-4 border-black h-13 w-2 rounded-md bg-gray-100"
      ></span>
    </div>
  );
};

