import React from 'react';

export const Component = () => {
  return (
    <>
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            font-family: system-ui, sans-serif;
          }
          
          .hover-scale {
            transition: transform 700ms ease-out;
          }
          
          .hover-scale:hover {
            transform: scale(1.02);
          }
          
          .image-scale {
            transition: transform 700ms ease-out;
          }
          
          .image-container:hover .image-scale {
            transform: scale(1.03);
          }
          
          .hover-translate {
            transition: transform 500ms ease-out;
          }
          
          .hover-translate:hover {
            transform: translateX(4px);
          }
          
          .hover-scale-sm {
            transition: transform 500ms ease-out;
          }
          
          .hover-scale-sm:hover {
            transform: scale(1.1);
          }
        `}
      </style>
      
      <div className="w-full h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-zinc-950 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg dark:shadow-2xl dark:shadow-black/80 overflow-hidden hover-scale mx-4">
            <div className="relative overflow-hidden image-container">
              <img 
                src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"
                alt="Profile" 
                className="w-full aspect-square object-cover image-scale"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 dark:from-black/60 to-transparent pointer-events-none"></div>
              <div className="absolute top-6 left-6">
                <h2 className="text-2xl font-medium text-white drop-shadow-lg">John Doe</h2>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden hover-scale-sm ring-2 ring-gray-200 dark:ring-zinc-700">
                  <img 
                    src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hover-translate">
                  <div className="text-sm text-gray-700 dark:text-zinc-200">@johndoe</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-500">12m ago</div>
                </div>
              </div>
              <button 
                onClick={() => console.log('Add member clicked')}
                className="bg-gray-900 dark:bg-zinc-800 text-white dark:text-zinc-100 rounded-lg px-4 py-2 text-sm font-medium
                         transition-all duration-500 ease-out transform hover:scale-105 
                         hover:bg-gray-800 dark:hover:bg-zinc-700
                         active:scale-95 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/50"
              >
                + Add member
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Component