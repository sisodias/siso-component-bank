import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const Example = () => {
  return (
    <div className="bg-neutral-800">
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          Scroll down
        </span>
      </div>
      <HorizontalScrollCarousel />
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          Scroll up
        </span>
      </div>
    </div>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
          {card.title}
        </p>
      </div>
    </div>
  );
};

export default Example;

const cards = [
  {
    "id": 1,
    "title": "Title 1",
    "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80&auto=format&fit=crop"
  },
  {
    "id": 2,
    "title": "Title 2",
    "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop"
  },
  {
    "id": 3,
    "title": "Title 3",
    "url": "https://images.unsplash.com/photo-1602526216279-61258f121a1c?w=800&q=80&auto=format&fit=crop"
  },
  {
    "id": 4,
    "title": "Title 4",
    "url": "https://images.unsplash.com/photo-1612831195783-c994e079a3bb?w=800&q=80&auto=format&fit=crop"
  },
  {
    "id": 5,
    "title": "Title 5",
    "url": "https://images.unsplash.com/photo-1605460375648-278bcbd579a6?w=800&q=80&auto=format&fit=crop"
  },
  {
    "id": 6,
    "title": "Title 6",
    "url": "https://images.unsplash.com/photo-1616587891160-9446f49b7f10?w=800&q=80&auto=format&fit=crop"
  },
  {
    "id": 7,
    "title": "Title 7",
    "url": "https://images.unsplash.com/photo-1612831455544-e3a53c056cd7?w=800&q=80&auto=format&fit=crop"
  }
];