"use client";

import React from "react";


export default function Example() {
    return (
        <div className="flex flex-wrap justify-center gap-12">
            <div className="relative">
                <img className="h-20 w-20 rounded"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                    alt="userImage1" />
                <div className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                    <p className="text-xs text-white">09</p>
                </div>
            </div>
            <div className="relative">
                <img className="h-20 w-20 rounded"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                    alt="userImage2" />
                <div className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                    <p className="text-xs text-white">09</p>
                </div>
            </div>
            <div className="relative">
                <img className="h-20 w-20 rounded"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="userImage3" />
                <div className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                    <p className="text-xs text-white">09</p>
                </div>
            </div>
        </div>
    );
};