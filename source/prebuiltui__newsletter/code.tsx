import { cn } from "@/lib/utils";
import { useState } from "react";
export default function Example() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            <div className="w-full bg-slate-900 px-2 text-center text-white py-20 flex flex-col items-center justify-center">
                <p className="text-indigo-500 font-medium">Get updated</p>
                <h1 className="max-w-lg font-semibold text-4xl/[44px] mt-2">Subscribe to our newsletter & get the latest news</h1>
                <div className="flex items-center justify-center mt-10 border border-slate-600 focus-within:outline focus-within:outline-indigo-600 text-sm rounded-full h-14 max-w-md w-full">
                    <input type="text" className="bg-transparent outline-none rounded-full px-4 h-full flex-1" placeholder="Enter your email address"/>
                    <button className="bg-indigo-600 text-white rounded-full h-11 mr-1 px-8 flex items-center justify-center">
                        Subscribe now
                    </button>
                </div>
            </div>
        </>
    );
};