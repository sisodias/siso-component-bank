// component.tsx
import * as React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, ArrowRight } from "lucide-react";
import NumberFlow from "@number-flow/react";

export type SpendMigratorSite = {
  name: string;
  logo: string;
  price: number;
};

export interface SpendMigratorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sites: SpendMigratorSite[];
}

const CreditCard = ({ progress }: { progress: number }) => {
  return (
    <motion.div className="relative h-16 w-36 overflow-hidden rounded-lg bg-black/10">
      <div className="relative z-10 flex size-full flex-col items-center justify-center gap-1 py-1 px-3">
        <div className="flex w-full items-center justify-between">
          <span className="text-[10px] font-medium text-white">05/26</span>
          <span className="text-[10px] font-medium text-white">111</span>
        </div>
        <span className="w-full text-left text-[10px] font-medium text-white">
          4242 4242 4242 4242
        </span>
      </div>
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-0 bg-black"
        style={{
          width: `${progress}%`,
          transition: "width 0.3s ease-out",
        }}
      />
    </motion.div>
  );
};

const SpendMigrator = React.forwardRef<HTMLDivElement, SpendMigratorProps>(
  ({ sites, className, ...props }, ref) => {
    const [selectedSites, setSelectedSites] = useState<SpendMigratorSite[]>([]);
    const [openModal, setOpenModal] = useState(false);

    const totalSpend = sites.map((site) => site.price).reduce((a, b) => a + b, 0);

    const toggleSite = (site: SpendMigratorSite) => {
      setSelectedSites((prev) =>
        prev.includes(site)
          ? prev.filter((s) => s !== site)
          : [...prev, site]
      );
    };

    const progress = (selectedSites.length / sites.length) * 100;
    const currentSpend = selectedSites
      .map((site) => site.price)
      .reduce((a, b) => a + b, 0);

    return (
      <div
        ref={ref}
        className={`relative w-full max-w-2xl ${className}`}
        {...props}
      >
        <motion.div
          layoutId="modal"
          className="relative w-full space-y-5 overflow-hidden rounded-3xl border bg-white p-6 shadow-lg"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start">
              <h1 className="text-lg font-medium text-gray-900">
                Select sites to change your card
              </h1>
              <p className="text-gray-500">
                We found {sites.length} sites based on your browser history
              </p>
            </div>
            <button
              onClick={() =>
                setSelectedSites(selectedSites.length === 0 ? sites : [])
              }
              className="shrink-0 text-gray-500 hover:text-gray-700"
            >
              {selectedSites.length === 0 ? "Select All" : "Unselect All"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {sites.map((site) => (
              <motion.div key={site.name} layoutId={`site-${site.name}`}>
                <div
                  className={`relative cursor-pointer rounded-xl border-2 bg-white p-4 transition-all duration-300 ease-in-out ${
                    selectedSites.includes(site)
                      ? "border-gray-900"
                      : "border-gray-200"
                  }`}
                  onClick={() => toggleSite(site)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={site.logo}
                      alt={`${site.name} logo`}
                      className="h-12 w-12 object-contain"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {site.name}
                    </span>
                  </div>
                  <AnimatePresence>
                    {selectedSites.includes(site) && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black"
                      >
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            layout
            className="flex w-full flex-col items-center justify-between gap-2 md:flex-row"
          >
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-medium text-gray-900">
                  Estimated yearly spend
                </span>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-md font-bold text-gray-900 md:text-2xl">
                  <NumberFlow
                    value={currentSpend}
                    locales="en-US"
                    format={{ style: "currency", currency: "USD" }}
                  />
                </span>
                <motion.span
                  layout
                  className="text-md font-bold text-gray-400 md:text-2xl"
                >
                  / ${totalSpend}
                </motion.span>
              </div>
            </div>
            <CreditCard progress={progress} />
          </motion.div>

          <motion.button
            layout
            className={`flex w-full items-center justify-center space-x-2 rounded-full py-3 font-medium text-white ${
              selectedSites.length > 0
                ? "bg-black"
                : "cursor-not-allowed bg-gray-200"
            }`}
            disabled={selectedSites.length === 0}
            onClick={() => setOpenModal(true)}
          >
            <span>Migrate my spend</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
        <AnimatePresence>
          {openModal && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <motion.div
                layoutId="modal"
                className="relative w-full cursor-pointer space-y-5 overflow-hidden rounded-3xl border bg-white p-6 shadow-lg"
                onClick={() => setOpenModal(false)}
              >
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {sites.map((site) => (
                    <motion.div
                      key={site.name}
                      layoutId={`site-${site.name}`}
                    >
                      <div
                        className={`relative rounded-xl border-2 bg-white p-4 transition-all duration-300 ease-in-out ${
                          selectedSites.includes(site)
                            ? "border-gray-900"
                            : "border-gray-200 opacity-10"
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <img
                            src={site.logo}
                            alt={`${site.name} logo`}
                            className="h-12 w-12 object-contain"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {site.name}
                          </span>
                        </div>
                        {selectedSites.includes(site) && (
                          <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

SpendMigrator.displayName = "SpendMigrator";

export default SpendMigrator;