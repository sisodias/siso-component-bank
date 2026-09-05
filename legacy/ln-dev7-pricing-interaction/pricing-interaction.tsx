import NumberFlow from '@number-flow/react'
import React from "react";

export function PricingInteraction ({
  starterMonth,
  starterAnnual,
  proMonth,
  proAnnual,
}:{
  starterMonth: number;
  starterAnnual: number;
  proMonth: number;
  proAnnual: number;
}) {
  const [active, setActive] = React.useState(0);
  const [period, setPeriod] = React.useState(0);
  const handleChangePlan = (index: number) => {
    setActive(index);
  };
  const handleChangePeriod = (index: number) => {
    setPeriod(index);
    if (index === 0) {
      setStarter(starterMonth);
      setPro(proMonth);
    } else {
      setStarter(starterAnnual);
      setPro(proAnnual);
    }
  };
  const [starter, setStarter] = React.useState(starterMonth);
  const [pro, setPro] = React.useState(proMonth);

  return (
    <div className="border-2 rounded-[32px] p-3 shadow-md max-w-sm w-full flex flex-col items-center gap-3 bg-white">
        <div className="rounded-full relative w-full bg-slate-100 p-1.5 flex items-center">
          <button
            className="font-semibold rounded-full w-full p-1.5 text-slate-800 z-20"
            onClick={() => handleChangePeriod(0)}
          >
            Monthly
          </button>
          <button
            className="font-semibold rounded-full w-full p-1.5 text-slate-800 z-20"
            onClick={() => handleChangePeriod(1)}
          >
            Yearly
          </button>
          <div
            className="p-1.5 flex items-cnter justify-center absolute inset-0 w-1/2 z-10"
            style={{
              transform: `translateX(${period * 100}%)`,
              transition: "transform 0.3s",
            }}
          >
            <div className="bg-white shadow-sm rounded-full w-full h-full"></div>
          </div>
        </div>
        <div className="w-full relative flex flex-col items-center justify-center gap-3">
          <div
            className="w-full flex justify-between cursor-pointer border-2 border-gray-400 p-4 rounded-2xl"
            onClick={() => handleChangePlan(0)}
          >
            <div className="flex flex-col items-start">
              <p className="font-semibold text-xl text-gray-950">Free</p>
              <p className="text-slate-500 text-md">
                <span className="text-black font-medium">$0.00</span>/month
              </p>
            </div>
            <div
              className="border-2 border-slate-500 size-6 rounded-full mt-0.5 p-1 flex items-center justify-center"
              style={{
                borderColor: `${active === 0 ? "#000" : "#64748b"}`,
                transition: "border-color 0.3s",
              }}
            >
              <div
                className="size-3 bg-black rounded-full"
                style={{
                  opacity: `${active === 0 ? 1 : 0}`,
                  transition: "opacity 0.3s",
                }}
              ></div>
            </div>
          </div>
          <div
            className="w-full flex justify-between cursor-pointer border-2 border-gray-400 p-4 rounded-2xl"
            onClick={() => handleChangePlan(1)}
          >
            <div className="flex flex-col items-start">
              <p className="font-semibold text-xl flex items-center gap-2 text-gray-950">
                Starter{" "}
                <span className="py-1 px-2 block rounded-lg bg-yellow-100 text-yellow-950 text-sm">
                  Popular
                </span>
              </p>
              <p className="text-slate-500 text-md flex">
                <span className="text-black font-medium flex items-center">
                  ${" "}
                  <NumberFlow
                    className="text-black font-medium"
                    value={starter}
                  />
                </span>
                /month
              </p>
            </div>
            <div
              className="border-2 border-slate-500 size-6 rounded-full mt-0.5 p-1 flex items-center justify-center"
              style={{
                borderColor: `${active === 1 ? "#000" : "#64748b"}`,
                transition: "border-color 0.3s",
              }}
            >
              <div
                className="size-3 bg-black rounded-full"
                style={{
                  opacity: `${active === 1 ? 1 : 0}`,
                  transition: "opacity 0.3s",
                }}
              ></div>
            </div>
          </div>
          <div
            className="w-full flex justify-between cursor-pointer border-2 border-gray-400 p-4 rounded-2xl"
            onClick={() => handleChangePlan(2)}
          >
            <div className="flex flex-col items-start">
              <p className="font-semibold text-xl text-gray-950">Pro</p>
              <p className="text-slate-500 text-md flex">
                <span className="text-black font-medium flex items-center">
                  ${" "}
                  <NumberFlow
                    className="text-black font-medium"
                    value={pro}
                  />
                </span>
                /month
              </p>
            </div>
            <div
              className="border-2 border-slate-500 size-6 rounded-full mt-0.5 p-1 flex items-center justify-center"
              style={{
                borderColor: `${active === 2 ? "#000" : "#64748b"}`,
                transition: "border-color 0.3s",
              }}
            >
              <div
                className="size-3 bg-black rounded-full"
                style={{
                  opacity: `${active === 2 ? 1 : 0}`,
                  transition: "opacity 0.3s",
                }}
              ></div>
            </div>
          </div>
          <div
            className={`w-full h-[88px] absolute top-0 border-[3px] border-black rounded-2xl`}
            style={{
              transform: `translateY(${active * 88 + 12 * active}px)`,
              transition: "transform 0.3s",
            }}
          ></div>
        </div>
        <button className="rounded-full bg-black text-lg text-white w-full p-3 active:scale-95 transition-transform duration-300">
          Get Started
        </button>
      </div>
  );
};

