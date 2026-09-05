"use client";

import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { BookmarkIcon, X } from "lucide-react";
import { cn } from "../_utils/cn";

interface NewsCard {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  timeAgo: string;
  location: string;
  image: string;
  gradientColors?: string[];
  content?: string[];
}

interface StatusBar {
  id: string;
  category: string;
  subcategory: string;
  length: number; // 1-3 for different lengths
  opacity: number; // 0.3-1 for different opacities
}

interface NewsCardsProps {
  title?: string;
  subtitle?: string;
  statusBars?: StatusBar[];
  newsCards?: NewsCard[];
  enableAnimations?: boolean;
}

const defaultStatusBars: StatusBar[] = [
  {
    id: "1",
    category: "US Politics",
    subcategory: "Donald Trump",
    length: 3,
    opacity: 1,
  },
  {
    id: "2", 
    category: "US Politics",
    subcategory: "Donald Trump",
    length: 2,
    opacity: 0.7,
  },
  {
    id: "3",
    category: "World News",
    subcategory: "EU Policy",
    length: 1,
    opacity: 0.4,
  }
];

const defaultNewsCards: NewsCard[] = [
  {
    id: "1",
    title: "RFK Jr: Trump to Announce Other Democrats Joining His Campaign",
    category: "US Politics",
    subcategory: "Donald Trump",
    timeAgo: "15 min ago",
    location: "United States",
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=1600&h=900&fit=crop&q=80",
    gradientColors: ["from-red-500/20", "to-orange-500/20"],
    content: [
      "In a surprising political development, Robert F. Kennedy Jr. announced that former President Donald Trump is preparing to reveal a significant number of Democratic politicians who will be joining his 2024 campaign effort. This unprecedented crossover could reshape the traditional party lines that have defined American politics for decades.",
      "Sources close to the Kennedy campaign suggest that several high-profile Democrats, disillusioned with their party's current direction, have been quietly negotiating terms for their public endorsement of Trump. This move represents a dramatic shift in the political landscape and could signal broader realignment within American political parties.",
      "The announcement is expected to include former senators, governors, and mayors from key swing states, potentially providing Trump with crucial credibility among moderate voters who have been skeptical of his candidacy. Political analysts are calling this development unprecedented in modern American politics.",
      "Kennedy, who himself switched from the Democratic party, cited concerns about government overreach and censorship as primary motivations for these defections. The campaign promises that these revelations will demonstrate growing bipartisan support for Trump's vision of American governance.",
      "Critics argue that this represents opportunistic politics rather than genuine ideological alignment, suggesting that these politicians are positioning themselves for potential appointments in a future Trump administration. However, supporters maintain that this reflects authentic concern about the country's direction.",
      "The timing of this announcement, coming just months before the election, is seen as strategically calculated to maximize impact during the crucial campaign period when voter attention is at its peak."
    ]
  },
  {
    id: "2",
    title: "EU signs off on landmark migration and asylum policy reforms",
    category: "US Politics", 
    subcategory: "Donald Trump",
    timeAgo: "41 min ago",
    location: "United States",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600&h=900&fit=crop&q=80",
    gradientColors: ["from-blue-500/20", "to-purple-500/20"],
    content: [
      "The European Union has formally approved comprehensive migration and asylum policy reforms that represent the most significant overhaul of immigration law in the bloc's history. After years of contentious negotiations, member states have reached consensus on new frameworks that balance humanitarian obligations with security concerns.",
      "The new policies establish unified standards for processing asylum claims across all EU member states, ending the current system where the burden disproportionately falls on border countries like Italy, Greece, and Spain. This redistribution mechanism aims to ensure more equitable sharing of responsibilities among member nations.",
      "Key provisions include streamlined processing procedures that promise to reduce waiting times for asylum seekers from years to months, while also implementing stricter criteria for economic migrants. The reforms introduce enhanced background checking systems and improved coordination between national security agencies.",
      "Human rights organizations have expressed mixed reactions to the changes. While praising improved processing times and standardized procedures, they raise concerns about potential restrictions that could limit access to protection for legitimate refugees fleeing persecution and conflict.",
      "Implementation of these reforms will begin gradually over the next 18 months, with full enforcement expected by 2026. The EU has allocated significant funding to support member states in upgrading their immigration infrastructure and training personnel on new procedures.",
      "This landmark agreement represents a rare moment of unity within the EU on one of its most divisive issues, potentially serving as a model for international cooperation on migration challenges facing developed nations worldwide."
    ]
  },
  {
    id: "3",
    title: "Climate Summit Reaches Historic Agreement on Carbon Neutrality",
    category: "Environment",
    subcategory: "Climate Change",
    timeAgo: "1 hour ago",
    location: "Global",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600&h=900&fit=crop&q=80",
    gradientColors: ["from-green-500/20", "to-emerald-500/20"],
    content: [
      "World leaders at the Global Climate Summit have reached a groundbreaking agreement committing 195 nations to achieve carbon neutrality by 2040, a decade earlier than previous targets. This historic accord represents the most ambitious climate action plan ever negotiated, with binding commitments and financial penalties for non-compliance.",
      "The agreement establishes a revolutionary carbon credit system that will create economic incentives for rapid decarbonization while generating funding for climate adaptation projects in developing nations. Major industrial powers have committed to investing $2 trillion annually in renewable energy infrastructure and green technology development.",
      "Breakthrough provisions include mandatory phase-out schedules for fossil fuel subsidies, universal adoption of renewable energy standards, and establishment of international carbon pricing mechanisms. The accord also addresses deforestation, with legally binding commitments to halt forest destruction and restore degraded ecosystems.",
      "Scientific advisors to the summit praised the agreement as the first climate accord with enforcement mechanisms robust enough to achieve stated goals. Independent modeling suggests these measures could limit global warming to 1.5 degrees Celsius, preventing the most catastrophic climate impacts.",
      "Implementation will require unprecedented international cooperation and technological innovation. The agreement establishes joint research initiatives for carbon capture, renewable energy storage, and sustainable agriculture practices that could transform how human civilization interacts with the natural environment.",
      "Environmental activists, while celebrating this progress, emphasize that success depends entirely on rigorous implementation and continued political commitment from signatory nations, particularly as governments change through democratic processes."
    ]
  }
];

export function NewsCards({
  title = "News Today",
  subtitle = "Stories from all over the world",
  statusBars = defaultStatusBars,
  newsCards = defaultNewsCards,
  enableAnimations = true,
}: NewsCardsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCard, setSelectedCard] = useState<NewsCard | null>(null);
  const [bookmarkedCards, setBookmarkedCards] = useState<Set<string>>(new Set());
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const toggleBookmark = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const openCard = (card: NewsCard) => {
    setSelectedCard(card);
  };

  const closeCard = () => {
    setSelectedCard(null);
  };

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(true);
    }
  }, [shouldAnimate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 28,
        mass: 0.6,
      }
    }
  };

  const statusBarContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const statusBarVariants = {
    hidden: { 
      opacity: 0, 
      scaleX: 0,
      x: -20,
    },
    visible: { 
      opacity: 1, 
      scaleX: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        scaleX: { type: "spring", stiffness: 400, damping: 30 }
      }
    }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.8,
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9,
      filter: "blur(6px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 28,
        mass: 0.8,
      }
    }
  };

  const imageVariants = {
    hidden: { 
      scale: 1.1,
      opacity: 0.8,
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.2,
      }
    }
  };



  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-6 bg-background text-foreground"
      initial={shouldAnimate ? "hidden" : "visible"}
      animate={isLoaded ? "visible" : "hidden"}
      variants={shouldAnimate ? containerVariants : {}}
    >
             {/* Header */}
       <motion.div
         className="mb-8"
         variants={shouldAnimate ? headerVariants : {}}
       >
         <h1 className="text-4xl font-bold mb-2">{title}</h1>
         <p className="text-muted-foreground text-lg">{subtitle}</p>
         
         {/* Simple Border Lines */}
         <motion.div 
           className="mt-6 space-y-1"
           variants={shouldAnimate ? statusBarContainerVariants : {}}
         >
           {statusBars.map((bar, index) => (
             <motion.div
               key={bar.id}
               className={cn("h-0.5 bg-foreground rounded-full", bar.id === "1" ? "bg-foreground/80" : bar.id === "2" ? "bg-foreground/60" : "bg-foreground/40")}
               style={{ 
                 opacity: bar.opacity,
                 width: `${(bar.length / 3) * 100}%`
               }}
               variants={shouldAnimate ? statusBarVariants : {}}
               initial={{ scaleX: 0 }}
               animate={{ scaleX: 1 }}
               transition={{ 
                 delay: 0.3 + (index * 0.1),
                 type: "spring", 
                 stiffness: 400, 
                 damping: 30 
               }}
             />
           ))}
         </motion.div>
       </motion.div>

                    {/* News Cards with Shared Layout */}
       <LayoutGroup>
         <motion.div
           className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
           variants={shouldAnimate ? cardContainerVariants : {}}
         >
           {newsCards.map((card, index) => {
             if (selectedCard?.id === card.id) {
               return null; // Don't render the compact card when expanded
             }
             
             return (
               <motion.article
                 key={card.id}
                 layoutId={`card-${card.id}`}
                 className="bg-card border border-border/50 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer group"
                 variants={shouldAnimate ? cardVariants : {}}
                 whileHover={shouldAnimate ? { 
                   y: -4,
                   scale: 1.01,
                   transition: { type: "spring", stiffness: 400, damping: 25 }
                 } : {}}
                 onClick={() => openCard(card)}
               >
                 {/* Image with gradient overlay */}
                 <motion.div 
                   layoutId={`card-image-${card.id}`}
                   className="relative h-56 overflow-hidden bg-muted"
                 >
                   <img
                     src={card.image}
                     alt={card.title}
                     className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-700 ease-out"
                   />
                   <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-background/80 to-transparent"></div>
                   {card.gradientColors && (
                     <div className={`absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t ${card.gradientColors[0]} ${card.gradientColors[1]} to-transparent`}></div>
                   )}
                   
                   {/* Bookmark icon */}
                   <motion.div 
                     className="absolute top-3 right-3"
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 0.6, type: "spring", stiffness: 400, damping: 25 }}
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={(e) => toggleBookmark(card.id, e)}
                   >
                     <BookmarkIcon 
                       className={`w-5 h-5 transition-colors cursor-pointer ${
                         bookmarkedCards.has(card.id) 
                           ? 'text-yellow-400 fill-yellow-400' 
                           : 'text-white/80 hover:text-white'
                       }`} 
                     />
                   </motion.div>

                   {/* Category and time info */}
                   <motion.div 
                     className="absolute bottom-3 left-3 text-white"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 25 }}
                   >
                     <div className="text-xs mb-1 opacity-90">
                       {card.category}, {card.subcategory}
                     </div>
                     <div className="text-xs opacity-75">
                       {card.timeAgo}, {card.location}
                     </div>
                   </motion.div>
                 </motion.div>

                 {/* Content */}
                 <motion.div 
                   layoutId={`card-content-${card.id}`}
                   className="p-6"
                 >
                   <motion.h3 
                     layoutId={`card-title-${card.id}`}
                     className="font-semibold text-lg leading-tight line-clamp-3 group-hover:text-primary transition-colors"
                   >
                     {card.title}
                   </motion.h3>
                 </motion.div>
               </motion.article>
             );
           })}
         </motion.div>

         {/* Expanded Card Modal */}
         <AnimatePresence>
           {selectedCard && (
             <>
               {/* Backdrop */}
               <motion.div
                 className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={closeCard}
               />
               
               {/* Expanded Card */}
               <motion.div
                 layoutId={`card-${selectedCard.id}`}
                 className="fixed inset-4 md:inset-8 lg:inset-16 bg-card border border-border rounded-xl overflow-hidden z-50"
               >
                 {/* Close Button */}
                 <motion.button
                   className="absolute top-4 right-4 w-8 h-8 bg-background/80 hover:bg-background rounded-full flex items-center justify-center z-10"
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.2 }}
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={closeCard}
                 >
                   <X className="w-4 h-4" />
                 </motion.button>

                 <div className="h-full overflow-y-auto">
                   {/* Header Image */}
                   <motion.div 
                     layoutId={`card-image-${selectedCard.id}`}
                     className="relative h-64 md:h-80"
                   >
                     <img
                       src={selectedCard.image}
                       alt={selectedCard.title}
                       className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent"></div>
                     {selectedCard.gradientColors && (
                       <div className={`absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t ${selectedCard.gradientColors[0]} ${selectedCard.gradientColors[1]} to-transparent`}></div>
                     )}
                     
                     {/* Image overlay info */}
                     <div className="absolute bottom-4 left-4 text-white">
                       <div className="text-sm mb-1 opacity-90">{selectedCard.category}, {selectedCard.subcategory}</div>
                       <div className="text-sm opacity-75">{selectedCard.timeAgo}, {selectedCard.location}</div>
                     </div>
                   </motion.div>

                   {/* Content */}
                   <motion.div 
                     layoutId={`card-content-${selectedCard.id}`}
                     className="p-6 md:p-8"
                   >
                     <motion.h1 
                       layoutId={`card-title-${selectedCard.id}`}
                       className="text-2xl md:text-3xl font-bold mb-6"
                     >
                       {selectedCard.title}
                     </motion.h1>
                     
                     <motion.div 
                       className="prose prose-lg max-w-none text-muted-foreground"
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.3, duration: 0.4 }}
                     >
                       {selectedCard.content ? (
                         selectedCard.content.map((paragraph, index) => (
                           <p key={index} className="mb-4">
                             {paragraph}
                           </p>
                         ))
                       ) : (
                         <>
                           <p className="mb-4">
                             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                           </p>
                           <p className="mb-4">
                             Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                           </p>
                           <p className="mb-4">
                             Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                           </p>
                           <p className="mb-4">
                             Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                           </p>
                           <p>
                             At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
                           </p>
                         </>
                       )}
                     </motion.div>
                   </motion.div>
                 </div>
               </motion.div>
             </>
           )}
         </AnimatePresence>
       </LayoutGroup>
     </motion.div>
   );
} 