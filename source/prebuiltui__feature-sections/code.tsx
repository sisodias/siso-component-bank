import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Example() {
  return (
    <section className="w-full py-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>


      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-semibold">Powerful Features</h1>
        <p className="text-sm text-slate-500 mt-2">
          Everything you need to manage, track, and grow your finances, securely and efficiently.
        </p>
      </div>

      {/* Блок карточек */}
      <div className="flex flex-wrap items-start justify-center gap-10">
        <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
          <img
            className="rounded-xl"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-1.png"
            alt=""
          />
          <h3 className="text-base font-semibold text-slate-700 mt-4">Feedback analyser</h3>
          <p className="text-sm text-slate-600 mt-1">
            Get instant insights into your finances with live dashboards.
          </p>
        </div>

        <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
          <img
            className="rounded-xl"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-2.png"
            alt=""
          />
          <h3 className="text-base font-semibold text-slate-700 mt-4">User management</h3>
          <p className="text-sm text-slate-600 mt-1">
            Get instant insights into your finances with live dashboards.
          </p>
        </div>

        <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
          <img
            className="rounded-xl"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-3.png"
            alt=""
          />
          <h3 className="text-base font-semibold text-slate-700 mt-4">Better invoicing</h3>
          <p className="text-sm text-slate-600 mt-1">
            Get instant insights into your finances with live dashboards.
          </p>
        </div>
      </div>
    </section>
  );
}
