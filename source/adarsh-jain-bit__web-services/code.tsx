import { cn } from "@/lib/utils";
import  {useState, useRef , useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  {
    title: "Website Development",
    para: "Custom and responsive websites",
    description:
      "Our website development services offer tailored, mobile-friendly, and visually stunning solutions that meet your business goals. Whether it’s a sleek landing page, a corporate portfolio, or a full-fledged web application, we ensure fast performance, clean design, and seamless user experience across all devices.",
    icons: ["https://idoxddu.sufydely.com/Angular.png", "https://idoxddu.sufydely.com/JavaScript.png", "https://idoxddu.sufydely.com/React.png"],
  },
  {
    title: "Mobile App Development",
    para: "iOS and Android mobile apps",
    description:
      "We specialize in building cross-platform mobile applications that combine robust functionality with elegant UI/UX. From planning to deployment, we create scalable apps optimized for performance, helping you connect with users on the go through feature-rich, intuitive experiences.",
    icons: ["https://idoxddu.sufydely.com/Flutter.png", "https://idoxddu.sufydely.com/Android.png", "https://idoxddu.sufydely.com/Dart.png"],
  },
  {
    title: "SEO & Email Marketing",
    para: "Boost reach and engagement",
    description:
      "Enhance your visibility and grow your audience through advanced SEO practices and personalized email campaigns. We analyze keywords, optimize on-page content, and develop targeted strategies to improve rankings, while crafting impactful emails that nurture leads and drive conversions.",
    icons: ["https://idoxddu.sufydely.com/Adobe%20Illustrator.png", "https://idoxddu.sufydely.com/social-media.png", "https://idoxddu.sufydely.com/Canva.png"],
  },
  {
    title: "Digital Marketing",
    para: "Promote through digital channels",
    description:
      "Our digital marketing team helps you grow your brand online using social media, PPC, content marketing, and influencer outreach. We create compelling narratives and data-driven campaigns that attract, engage, and convert your target audience into loyal customers.",
    icons: ["https://idoxddu.sufydely.com/Adobe%20XD.png", "https://idoxddu.sufydely.com/Canva.png", "https://idoxddu.sufydely.com/social-media.png"],
  },
  {
    title: "Custom Software Development",
    para: "Software tailored for business",
    description:
      "We build secure, scalable, and efficient custom software solutions that align with your business logic. From CRMs to internal tools, we leverage modern technologies to improve productivity, automate tasks, and solve complex operational challenges with precision.",
    icons: ["https://idoxddu.sufydely.com/Behance.png", "https://idoxddu.sufydely.com/Figma.png", "https://idoxddu.sufydely.com/bullhorn.png"],
  },
  {
    title: "API Development & Integration",
    para: "Connect systems efficiently",
    description:
      "Our API services help businesses integrate and automate data flows across systems. Whether creating new APIs or integrating third-party services, we ensure secure, flexible, and scalable architecture to power seamless communication between your platforms.",
    icons: ["https://idoxddu.sufydely.com/FastAPI.png", "https://idoxddu.sufydely.com/Java.png", "https://idoxddu.sufydely.com/Gatsby.png"],
  },
  {
    title: "UI/UX Design",
    para: "Intuitive and modern interfaces",
    description:
      "We craft visually compelling and user-focused designs that elevate your digital product. From wireframes to prototypes, our design process ensures a smooth user journey, optimized accessibility, and consistent branding across all touchpoints.",
    icons: ["https://idoxddu.sufydely.com/Figma.png", "https://idoxddu.sufydely.com/sketch.png", "https://idoxddu.sufydely.com/Adobe%20XD.png"],
  },
  {
    title: "Branding & Identity",
    para: "Build a strong brand image",
    description:
      "We help businesses define their voice and visual identity through impactful branding. From logos to complete brand kits, our team creates cohesive designs that reflect your values and resonate with your target audience, setting you apart from competitors.",
    icons: ["/img/images/Adobe Illustrator.png", "https://idoxddu.sufydely.com/Flutter.png", "https://idoxddu.sufydely.com/social-media.png"],
  },
  {
    title: "E-Commerce Solutions",
    para: "Launch and scale your store",
    description:
      "Our e-commerce development services focus on creating secure, scalable, and conversion-driven online stores. From product catalogs and payment gateways to inventory management and user analytics, we empower your digital retail journey with end-to-end support.",
    icons: ["https://idoxddu.sufydely.com/WooCommerce.png", "https://idoxddu.sufydely.com/Salesforce.png", "https://idoxddu.sufydely.com/social-media.png"],
  },
];

export const Component = () => {
   const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);
 useEffect(() => {
    const handleScroll = () => {
      refs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveIndex(i);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeService = services[activeIndex];

  
  return (
 
    <div className="h-[260vh] relative flex flex-row-reverse max-w-7xl m-auto">
      <div className="sticky h-[600px] w-[80%] flex items-center top-10 justify-center z-10">
        <div className="box bg-[#262930] w-full border-[3px] border-gray-500 h-[450px] flex items-center text-center flex-col text-white px-8 py-6">
           <AnimatePresence mode="wait">
  <motion.div
    key={activeIndex}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="text-center"
  >
          <div className="text-3xl font-bold mt-4 mb-4">{activeService.para}</div>
          <div className="text-md lg:text-lg max-w-2xl mb-4">{activeService.description}</div>
          <div className="flex space-x-4 justify-center items-center  ">
            {activeService.icons.map((icon, i) => (
              <img key={i} src={icon} alt="icon" className="w-20 h-20 ml-5 mt-10" />
            ))}
          </div>
                </motion.div>
</AnimatePresence>
        </div>
      </div>

      <div className="flex w-[20%] flex-col relative top-52 space-y-10 z-20">
        {services.map((feature, index) => (
          <div
            key={index}
            ref={(el) => (refs.current[index] = el)}
            onClick={() => setActiveIndex(index)}
            className={`relative max-w-sm group cursor-pointer min-w-[350px] ${
              activeIndex === index ? "scale-105" : ""
            } transition-transform duration-300`}
          >
            <div className="bg-white border-[3px] border-black rounded-lg p-3 md:p-5 relative z-20 h-[130px] ease">
              <div className="absolute right-4 top-2 h-8 w-10 ">
                <img src="https://idoxddu.sufydely.com/right-arrow%20(1).png" alt="arrow" />
              </div>
              <div className="text-xl font-medium tracking-[-0.04em] text-black lg:text-2xl mr-10">
                {feature.title}
              </div>
              <div className="font-medium hidden md:block lg:text-sm text-black">
                {feature.para}
              </div>
            </div>
            <div className="bg-[#7A15DE] z-10 group-hover:bg-purple-800 border-[3px] border-black rounded-lg absolute w-full h-full -bottom-3 -left-3 md:-bottom-4 md:-left-4 transition-colors ease" />
          </div>
        ))}
      </div>
    </div>

  );
};
