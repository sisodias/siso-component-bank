import React, { useState } from 'react';
import { motion, AnimatePresence, MotionConfig, Transition } from "framer-motion";

// --- Types ---
export interface MenuItem {
  label: string;
  value: string;
}

export interface TabItem {
  name: string;
  value: any;
}

export interface Feature {
  name: string;
  description: string;
}

export interface PricingPlan {
  price: string;
  period: string;
  features: Feature[];
  cta: string;
  subtext?: string;
  badge?: string;
}

export interface PlanTier {
  monthly: PricingPlan;
  annual: PricingPlan;
}

// --- Components ---

interface TabsProps {
  tabs: TabItem[];
  tab: TabItem;
  setTab: (tab: TabItem) => void;
  small?: boolean;
}

const Tabs: React.FC<TabsProps> = ({ tabs, tab, setTab, small }) => {
  return (
    <div className={`flex rounded-lg bg-gray-100 p-1 ${small ? 'gap-1' : 'gap-2'}`}>
      {tabs.map((t) => (
        <button
          key={t.name}
          onClick={() => setTab(t)}
          className={`relative px-3 py-1 text-sm font-medium transition-colors ${
            tab.value === t.value ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
          } ${small ? 'px-2 py-0.5 text-xs' : ''}`}
        >
          <span className="relative z-10">{t.name}</span>
          {tab.value === t.value && (
            <motion.div
              layoutId="tabs-active"
              className="absolute inset-0 rounded-md bg-white shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

interface SubSelectToggleProps {
  tabs: [MenuItem, MenuItem];
  subTabs: [MenuItem, MenuItem];
  tab: MenuItem;
  setTab: (tab: MenuItem) => void;
  subTab: MenuItem;
  setSubTab: (tab: MenuItem) => void;
  transition?: Transition;
}

const SubMenu = ({ tab, setTab, tabs }: { tab: MenuItem; setTab: (tab: MenuItem) => void; tabs: [MenuItem, MenuItem] }) => {
  return (
    <div className="flex h-full w-full rounded-full p-1 text-xs sm:text-sm">
      {tabs.map((t) => (
        <motion.div
          onClick={(e) => {
            e.stopPropagation();
            setTab(t);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              setTab(t);
            }
          }}
          key={t.value}
          initial={{ color: t.value === tab?.value ? "#000000" : "#FFFFFF" }}
          animate={{ color: t.value === tab?.value ? "#000000" : "#FFFFFF" }}
          className="relative flex-1 cursor-pointer font-bold rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
          tabIndex={0}
          role="button"
          aria-pressed={t.value === tab?.value}
        >
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            {t.label}
          </div>
          {t.value === tab?.value && (
            <motion.div
              layoutId="active-duration"
              className={"absolute inset-0 rounded-full bg-white shadow-sm"}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

const SubSelectToggle = ({
  tabs,
  subTabs,
  tab,
  subTab,
  setTab,
  setSubTab,
  transition = { type: "spring", duration: 0.5, bounce: 0.1 },
}: SubSelectToggleProps) => {
  const isValid = 
    Array.isArray(tabs) && 
    tabs.length === 2 && 
    Array.isArray(subTabs) && 
    subTabs.length === 2 &&
    tabs.every(t => t?.label && t?.value) &&
    subTabs.every(t => t?.label && t?.value);

  if (!isValid) {
    return (
      <div className="flex h-16 w-full max-w-[320px] sm:max-w-[520px] items-center justify-center rounded-full bg-red-50 border border-red-100 px-6 text-red-600 shadow-sm animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium tracking-tight">Configuration invalid</span>
      </div>
    );
  }

  const activeIdx = tabs.findIndex((t) => t.value === tab?.value);
  const second = activeIdx === 1;

  function renderItem(idx: number) {
    if (idx === 0) return tabs[0].label;
    return (
      <div className="relative flex h-full w-full items-center justify-center text-center select-none">
        <motion.div
          initial={{ opacity: second ? 0 : 1 }}
          animate={{
            opacity: second ? 0 : 1,
            filter: second ? "blur(2px)" : "blur(0px)",
            y: second ? -10 : 0,
          }}
        >
          <div>Premium</div>
          <motion.div className="mt-0.5 text-xs font-semibold opacity-60">
            {subTabs[0].label} • {subTabs[1].label}
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: second ? 1 : 0.5, opacity: second ? 1 : 0 }}
          className={"absolute inset-0 origin-[50%_50px] rounded-full"}
        >
          <SubMenu tabs={subTabs} tab={subTab} setTab={setSubTab} />
        </motion.div>
      </div>
    );
  }

  return (
    <div role="group" aria-label="Selection Toggle">
      <MotionConfig transition={transition}>
        <div className="flex h-16 rounded-full bg-white p-0.5 text-sm shadow-2xl shadow-black/20 border border-black/5">
          {tabs.map((t, idx) => (
            <motion.button
              onClick={() => setTab(t)}
              key={t.value}
              initial={{ color: t.value === tab?.value ? "#FFFFFF" : "#000000" }}
              animate={{ color: t.value === tab?.value ? "#FFFFFF" : "#000000" }}
              className="relative w-[160px] cursor-pointer font-bold sm:w-[260px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-full"
              aria-pressed={t.value === tab?.value}
            >
              <div className="relative z-10 flex h-full w-full items-center justify-center text-sm sm:text-base">
                {renderItem(idx)}
              </div>
              {t.value === tab?.value && (
                <motion.div
                  layoutId="active-black"
                  className={"absolute inset-0 rounded-full bg-black"}
                />
              )}
            </motion.button>
          ))}
        </div>
      </MotionConfig>
    </div>
  );
};

const FeatureItem: React.FC<{ feature: Feature }> = ({ feature }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li 
      className="relative flex items-center gap-3 text-gray-600 group cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm font-medium border-b border-transparent group-hover:border-gray-300 transition-colors">
        {feature.name}
      </span>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-3 z-50 w-48 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl pointer-events-none"
          >
            {feature.description}
            <div className="absolute top-full left-4 border-8 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

// --- App Component ---

const TABS: [MenuItem, MenuItem] = [
  { label: "Free", value: "free" },
  { label: "Premium", value: "premium" },
];

const SUB_TABS: [MenuItem, MenuItem] = [
  { label: "Monthly", value: "monthly" },
  { label: "Annual", value: "annual" },
];

const TDATA: TabItem[] = [
  { name: "0.5s", value: 0.5 },
  { name: "2s", value: 2 },
];

const PRICING_DATA: Record<string, PlanTier> = {
  free: {
    monthly: {
      price: "$0",
      period: "/month",
      features: [
        { name: "Basic Access", description: "Access to all essential tools and standard features." },
        { name: "1 Project", description: "Manage one active personal or professional project." },
        { name: "Community Support", description: "Get help from our community forums and knowledge base." },
        { name: "5GB Storage", description: "Cloud storage for your project files and assets." }
      ],
      cta: "Start for Free"
    },
    annual: {
      price: "$0",
      period: "/year",
      features: [
        { name: "Basic Access", description: "Access to all essential tools and standard features." },
        { name: "1 Project", description: "Manage one active personal or professional project." },
        { name: "Community Support", description: "Get help from our community forums and knowledge base." },
        { name: "5GB Storage", description: "Cloud storage for your project files and assets." }
      ],
      cta: "Start for Free"
    }
  },
  premium: {
    monthly: {
      price: "$19",
      period: "/month",
      features: [
        { name: "Unlimited Projects", description: "Create and manage as many projects as you need without limits." },
        { name: "Priority Support", description: "Jump to the front of the line with 24/7 priority email support." },
        { name: "100GB Storage", description: "Generous high-speed cloud storage for high-resolution assets." },
        { name: "Advanced Analytics", description: "Deep insights and visualization tools for your data." },
        { name: "Team Collaboration", description: "Invite up to 5 team members to collaborate in real-time." }
      ],
      cta: "Subscribe Monthly"
    },
    annual: {
      price: "$180",
      period: "/year",
      badge: "2 Months Free",
      subtext: "$15/month billed annually",
      features: [
        { name: "Everything in Monthly", description: "All features from the monthly premium plan included." },
        { name: "1TB Storage", description: "Massive storage for enterprise-level data needs." },
        { name: "Dedicated Manager", description: "A personal point of contact for all your support needs." },
        { name: "Custom Integrations", description: "API access and webhooks for tailored workflows." },
        { name: "2 Months Free", description: "Save $48 per year compared to monthly billing." }
      ],
      cta: "Subscribe Annually"
    }
  }
};

const App: React.FC = () => {
  const [dur, setDur] = useState(TDATA[0]);
  const [tab, setTab] = useState(TABS[0]);
  const [subTab, setSubTab] = useState(SUB_TABS[0]);

  const isPremium = tab.value === 'premium';
  
  const currentTier = PRICING_DATA[tab.value];
  const currentPricing: PricingPlan = isPremium 
    ? (subTab.value === 'monthly' ? currentTier.monthly : currentTier.annual)
    : currentTier.monthly;

  return (
    <div className="w-full min-h-screen bg-d-bg p-8 sm:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-d-border pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Flexible Pricing</h2>
              <p className="text-gray-500 text-sm">Choose the plan that fits your growth</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Transition:</span>
              <Tabs tabs={TDATA} tab={dur} setTab={setDur} small />
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-12">
            <div className="bg-d-sheet border border-d-border rounded-3xl relative flex w-full min-h-[160px] items-center justify-center overflow-hidden shadow-inner py-8">
              <SubSelectToggle
                tabs={TABS}
                subTabs={SUB_TABS}
                tab={tab}
                setTab={setTab}
                subTab={subTab}
                setSubTab={setSubTab}
                transition={{ type: "spring", bounce: 0.1, duration: dur.value }}
              />
            </div>

            <motion.div 
              layout
              initial={false}
              className="w-full max-w-2xl bg-white border border-d-border rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-8 sm:p-12 space-y-8">
                <div className="flex flex-col items-center text-center space-y-2">
                  <motion.span 
                    key={tab.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isPremium ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {tab.label} Plan
                  </motion.span>
                  
                  <div className="flex flex-col items-center pt-2">
                    <div className="flex items-baseline gap-1 relative">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentPricing.price}
                          initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, scale: 1.1, filter: 'blur(4px)' }}
                          transition={{ duration: 0.2 }}
                          className="text-6xl font-black tracking-tighter"
                        >
                          {currentPricing.price}
                        </motion.span>
                      </AnimatePresence>
                      <AnimatePresence mode="wait">
                        <motion.span 
                          key={currentPricing.period}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="text-gray-400 text-xl font-medium"
                        >
                          {currentPricing.period}
                        </motion.span>
                      </AnimatePresence>
                      
                      <AnimatePresence>
                        {currentPricing.badge && (
                          <motion.div
                            initial={{ opacity: 0, x: 10, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 10, scale: 0.8 }}
                            className="absolute -right-4 top-0 translate-x-full"
                          >
                            <span className="inline-flex items-center rounded-full bg-green-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm ring-1 ring-inset ring-green-600/20 whitespace-nowrap">
                              {currentPricing.badge}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {currentPricing.subtext && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-indigo-500 font-semibold"
                      >
                        {currentPricing.subtext}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="wait">
                    <motion.ul 
                      key={`${tab.value}-${subTab.value}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 col-span-2 sm:grid sm:grid-cols-2 sm:gap-x-8"
                    >
                      {currentPricing.features.map((feature, idx) => (
                        <FeatureItem key={`${feature.name}-${idx}`} feature={feature} />
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </div>

                <motion.button
                  key={currentPricing.cta}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    type: "spring", 
                    bounce: 0.6, 
                    duration: 0.8,
                    delay: 0.1
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-5 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl ${
                    isPremium 
                      ? 'bg-black text-white font-extrabold text-xl hover:bg-gradient-to-r hover:from-green-400 hover:to-green-700' 
                      : 'bg-gray-100 text-black font-bold text-lg hover:bg-gray-200'
                  }`}
                >
                  {currentPricing.cta}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="text-center text-gray-400 text-sm pb-12">
          &copy; {new Date().getFullYear()} UI Systems • Advanced Selection Patterns
        </footer>
      </div>
    </div>
  );
};

export default App;