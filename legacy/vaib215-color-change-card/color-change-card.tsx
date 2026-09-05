import React from "react";
import { motion, Variants } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const ColorChangeCards = () => {
  return (
    <div className="p-4 py-12 md:p-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <Card
          heading="Plan"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, exercitationem."
          imgSrc="https://images.pexels.com/photos/176342/pexels-photo-176342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        />
        <Card
          heading="Play"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, exercitationem."
          imgSrc="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        />
        <Card
          heading="Connect"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, exercitationem."
          imgSrc="https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        />
        <Card
          heading="Support"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, exercitationem."
          imgSrc="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        />
      </div>
    </div>
  );
};

// --- Card Component ---
interface CardProps {
  heading: string;
  description: string;
  imgSrc: string;
}

const Card = ({ heading, description, imgSrc }: CardProps) => {
  return (
    <motion.div
      transition={{ staggerChildren: 0.035 }}
      whileHover="hover"
      className="group relative h-64 w-full cursor-pointer overflow-hidden bg-slate-300"
    >
      <div
        className="absolute inset-0 saturate-100 transition-all duration-500 group-hover:scale-110 md:saturate-0 md:group-hover:saturate-100"
        style={{
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-20 flex h-full flex-col justify-between p-4 text-slate-300 transition-colors duration-500 group-hover:text-white">
        <FiArrowRight className="ml-auto text-3xl transition-transform duration-500 group-hover:-rotate-45" />
        <div>
          <h4>
            {heading.split("").map((letter, index) => (
              <AnimatedLetter letter={letter} key={index} />
            ))}
          </h4>
          <p>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- AnimatedLetter Helper Component ---
interface AnimatedLetterProps {
  letter: string;
}

const letterVariants: Variants = {
  hover: {
    y: "-50%",
  },
};

const AnimatedLetter = ({ letter }: AnimatedLetterProps) => {
  return (
    <div className="inline-block h-[36px] overflow-hidden font-semibold text-3xl">
      <motion.span
        className="flex min-w-[4px] flex-col"
        style={{ y: "0%" }}
        variants={letterVariants}
        transition={{ duration: 0.5 }}
      >
        <span>{letter}</span>
        <span>{letter}</span>
      </motion.span>
    </div>
  );
};

export default ColorChangeCards;
