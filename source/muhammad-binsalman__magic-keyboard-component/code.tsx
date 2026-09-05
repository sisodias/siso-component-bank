import { ArrowLeft, ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
function Keyboard(){
  return (
    <div className="flex flex-col gap-1 p-5 rounded-xl bg-gray-300 shadow-md w-[600px] select-none">
      {/* Row 1 - Function keys */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">esc</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F1</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F2</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F3</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F4</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F5</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F6</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F7</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F8</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F9</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F10</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F11</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F12</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-5 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 ml-4">⏏</div>
      </div>

      {/* Row 2 */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">`</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">1</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">2</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">3</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">4</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">5</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">6</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">7</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">8</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">9</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">0</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">-</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">=</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-5 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">delete</div>
      </div>

      {/* Row 3 */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[2]">tab</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">Q</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">W</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">E</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">R</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">T</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">Y</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">U</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">I</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">O</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">P</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">[</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">]</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[2]">\</div>
      </div>

      {/* Row 4 */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[2]">caps lock</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">A</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">S</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">D</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">F</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">G</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">H</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">J</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">K</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">L</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">;</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">'</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[2]">return</div>
      </div>

      {/* Row 5 */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[3]">shift</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">Z</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">X</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">C</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">V</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">B</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">N</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">M</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">,</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">.</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">/</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[3]">shift</div>
      </div>

      {/* Row 6 */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">fn</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">ctrl</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center p-0.5 text-base text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">⌥</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center p-0.5 text-base text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">⌘</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[175px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[5]"></div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center p-0.5 text-base text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">⌘</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center p-0.5 text-base text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">⌥</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[30px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5"><ArrowLeft size={16} /></div>
        <div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[30px] text-center py-0.5 px-2 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5"><ArrowDown size={13} /></div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[30px] text-center py-0.5 px-2 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5"><ArrowUp size={13} /></div>
        </div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[30px] text-center py-2 px-1 text-xs text-gray-800 cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5"><ArrowRight size={16} /></div>
      </div>
    </div>
  );
};

export default Keyboard;