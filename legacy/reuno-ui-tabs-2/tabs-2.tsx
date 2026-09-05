import { cn } from "../_utils/cn";
import { useState } from "react";
export default function Example() {
    return (
        <div className="flex space-x-2 bg-white p-1 border border-gray-500/50 rounded-md text-sm">
            <div className="flex items-center">
                <input type="radio" name="options" id="html" className="hidden peer" checked />
                <label htmlFor="html" className="cursor-pointer rounded py-2 px-8 text-gray-500 transition-colors duration-200 peer-checked:bg-indigo-600 peer-checked:text-white">HTML</label>
            </div>
            <div className="flex items-center">
                <input type="radio" name="options" id="css" className="hidden peer" />
                <label htmlFor="css" className="cursor-pointer rounded py-2 px-8 text-gray-500 transition-colors duration-200 peer-checked:bg-indigo-600 peer-checked:text-white">CSS</label>
            </div>
            <div className="flex items-center">
                <input type="radio" name="options" id="react" className="hidden peer" />
                <label htmlFor="react" className="cursor-pointer rounded py-2 px-8 text-gray-500 transition-colors duration-200 peer-checked:bg-indigo-600 peer-checked:text-white">React</label>
            </div>
        </div>
    );
};