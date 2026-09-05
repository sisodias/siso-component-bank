import { Menu } from 'lucide-react'
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PlayCircle } from 'lucide-react'
import { GripVertical } from "lucide-react";
import { Box, Code, LayoutTemplate, Lightbulb, PenTool } from "lucide-react";

const COLORS = {
  bgTeal: "#01303C",
  darkbgTeal: "#02242E",
  lightGreen: "#a7ff12",
  yellow: "#ffea00",
  lightBlue: "#34ebf8",
  pink: "#ff287c",
};
const Scribble = (className)=>{
  return(
    <svg className={className} width="113" height="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" overflow="hidden"><g transform="translate(-445 -2195)"><path d="M448.711 2195.5C448.623 2197.75 446.719 2199.66 447.602 2201.14 448.614 2207.75 452.08 2203.13 455.363 2202.27 456.459 2201.72 457.612 2201.39 458.69 2201.14 459.047 2202.13 458.965 2204.27 459.798 2204.53 463.127 2204.39 467.043 2201.74 469.777 2200.01 470.316 2201.86 472.146 2203.49 473.103 2205.66 473.956 2207.35 472.544 2210.15 474.212 2211.3 475.739 2212.36 478.301 2209.95 479.755 2209.04 481.184 2208.55 482.217 2208.31 483.082 2207.92 484.879 2208.23 487.292 2209.35 488.625 2209.04 490.464 2208.68 491.498 2207.13 493.06 2205.66 493.88 2204.6 495.061 2203.88 496.386 2203.4 497.588 2209.73 497.531 2210.95 497.495 2206.79" stroke="#FFFF00" stroke-width="3.4375" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M506.5 2209.42C508.559 2206.32 515.057 2202.21 518.695 2203.93 520.066 2204.54 518.813 2207.01 519.804 2208.32 522.005 2213.12 523.168 2212.84 527.565 2214.91 531.09 2212.17 535.265 2209.93 540.87 2213.81 542.726 2215.97 542.9 2218.96 543.087 2221.5 544.002 2220.1 545.649 2219.32 546.413 2218.21 547.101 2217.06 546.359 2215.12 547.522 2214.91 548.772 2214.45 549.838 2216.53 550.848 2217.11 555.878 2220.81 552.511 2220.78 557.5 2221.5" stroke="#FFFF00" stroke-width="3.4375" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/></g></svg>
  )
}

const whyUsData = [
  {
    id: 1,
    value: "$812+",
    label: "Money Raised",
    desc: "Helping our clients grow and prosper.",
    classes:
      "absolute top-0 right-0 w-64 h-40 bg-white p-4 rounded-lg shadow-xl transform rotate-3 z-30",
  },
  {
    id: 2,
    value: "$12+",
    label: "Design Award",
    desc: "Recognized for excellence in design.",
    classes:
      "absolute top-1/4 left-0 w-64 h-40 bg-white p-4 rounded-lg shadow-xl transform -rotate-6 z-20 opacity-80",
  },
  {
    id: 3,
    value: "$400+",
    label: "Our Client",
    desc: "Trusted by numerous satisfied clients.",
    classes:
      "absolute bottom-0 right-1/4 w-64 h-40 bg-white p-4 rounded-lg shadow-xl transform rotate-2 z-10 opacity-70",
  },
  {
    id: 4,
    value: "$425+",
    label: "Projects Complete",
    desc: "Successfully delivered projects.",
    classes:
      "absolute top-1/2 left-1/4 w-64 h-40 bg-white p-4 rounded-lg shadow-xl transform -rotate-3 z-0 opacity-60",
  },
];

const servicesData = [
  {
    id: 1,
    title: "AI Image Generation",
    icon: <PenTool className="size-5 lg:size-6" />,
    desc: "Converting simple boring images to studio level images using AI",
    rotation: "-rotate-6",
    decorColor: "bg-pink-500",
    iconColor: "bg-blue-300",
  },
  {
    id: 2,
    title: "AI Content Ideas",
    icon: <Lightbulb className="size-5 lg:size-6" />,
    desc: "Bringing concepts to life with unique up to date AI art",
    rotation: "rotate-6",
    decorColor: "bg-purple-500",
    iconColor: "bg-lime-400",
  },

  {
    id: 3,
    title: "Web Development",
    icon: <LayoutTemplate className="size-5 lg:size-6" />,
    desc: "Building responsive and user-friendly websites. using modern tools and frameworks",
    rotation: "-rotate-6",
    decorColor: "bg-yellow-500",
    iconColor: "bg-rose-300",
  },
  {
    id: 4,
    title: "AI Automation",
    icon: <Box className="size-5 lg:size-6" />,
    desc: "Automating repetitive tasks with AI to save time and increase efficiency.",
    rotation: "rotate-10",
    decorColor: "bg-blue-500",
    iconColor: "bg-yellow-400",
  },
  {
    id: 5,
    title: "AI Video Generation",
    icon: <Code className="size-5 lg:size-6" />,
    desc: "Creating engaging and professional videos using AI",
    rotation: "-rotate-12",
    decorColor: "bg-lime-500",
    iconColor: "bg-indigo-300",
  },
];

const worksData = [
  {
    id: 1,
    title: "Creating professional banners for Thumb Thrift",
    desc: "Our Client Thumb Thrift needed banners for their website, so we used AI to generate professional banners for them",
    imgUrl: "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg",
    rotation: "-rotate-1",
    bagePosition: "-bottom-6 -left-8 rotate-80",
  },
  {
    id: 2,
    title: "Generative AI Solutions on Fiverr",
    desc: "We also provide these services on platforms like Fiverr, Upwork, and Freelancer.",
    imgUrl:
      "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg",
    rotation: "rotate-3 lg:mt-20",
    bagePosition: "-top-6 -left-7 rotate-10",
  },
  {
    id: 3,
    title: "N8N Automation Services",
    desc: "We provide N8N automation services to help our clients automate their workflows and save time.",
    imgUrl: "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg",
    rotation: "-rotate-6 ",
    bagePosition: "-bottom-6 -right-7 rotate-10",
  },
];


export const Component = () => {

  return (
  <div className='min-h-screen w-full bg-[#01303C] text-white overflow-hidden relative'>
      {/* Background Pattern using pseudo elements */}
      <div className="bg-grid-pattern absolute inset-0"></div>
      <div></div>
      {/* HEADER */}
      <Header />
      {/* MAIN */}
      <main className='relative z-10 max-w-7xl mx-auto py-8 sm:py-16'>
        {/* Hero Section */}
        <HeroSection />
        {/* Why Choose Us Section */}
        <WhyChooseUsSection />
        {/* Services Section */}
        <ServicesSection />
        {/* Our Work Section  */}
        <PortfolioSection/>
        {/* CTA Section */}
        <CTASection/>
      </main>
      {/* FOOTER */}
      <Footer />
    </div>
  );
};

const Header = () => {
  return (
    <header className='relative p-4 sm:p-6 flex w-full justify-between items-center max-w-7xl mx-auto z-10 text-xs sm:text-sm font-medium pr-2'>
      <div className="flex items-center space-x-2">
        <div className="size-8 bg-white rounded-full flex items-center justify-center text-gray-800 font-bold text-base">
          M
        </div>
        <span className="opacity-90 text-base">Mysh </span>
      </div>
      {/* Navbar  */}
      <nav className="hidden md:flex space-x-6 opacity-75 ">
        {["Services", "Portfolio", "Team", "Blog", "Contact"].map((item, index) => (
          <a key={index} href={"#"} className='hover:opacity-100 hover:text-lime-300 hover:-translate-y-1 antialiased hover:underline underline-offset-2 transition-all duration-200 ease-in'>
            {item}
          </a>
        ))}
      </nav>

      <div className="md:hidden">
        {/* Hamburger menu for smaller screen */}
        <Menu className="text-white" />
      </div>
    </header>
  )
}
const HeroSection = () => {
  return (
    <section className='relative text-center pt-10 pb-20 sm:pt-20 sm:pb-32'>
        {/* HEAD */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight sm:px-12">
            (: real agency with its - <RotationLabel text="super" className='inline-block mx-1 sm:mx-2' textColor='text-gray-900' bgColor={COLORS.lightGreen}/> digital 
        </h1>
        {/* Decor */}
        <Scribble className='absolute hidden lg:block bottom-10 -rotate-12 left-10'/>
        <Scribble className='absolute hidden lg:block top-8 -rotate-12 right-10'/>
        <p className="text-base sm:text-xl mt-6 sm:mt-8 opacity-70 max-w-2xl mx-auto">Let's make something amazing together</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-10">

        {/* btn  */}
        <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-base sm:text-lg max-w-fit self-center shadow-xl hover:bg-transparent cursor-pointer transition-all duration-200 ease-in hover:border-zinc-100 border-transparent hover:text-zinc-50 hover:border-dashed hover:animate-wiggle border-2">Start Project</button>
        <button className="flex items-center justify-center sm:justify-start space-x-2 text-white opacity-90 hover:opacity-100 transition cursor-pointer border-2 border-transparent hover:border-zinc-100 rounded-full p-2 px-4">
            <PlayCircle size={28}/>
            <span className='font-semibold text-base'>Watch Video</span>
        </button>
        </div>
    </section>
  )
}
const WhyChooseUsSection = () => {
  return (
    <section className={`relative py-10 mt-6 bg-[${COLORS.darkbgTeal}] sm:py-20 rounded-md flex flex-col items-center justify-center`}>
        <RotationLabel text="Why Choose Us" bgColor={COLORS.lightGreen} className='mb-10 -rotate-6 z-10' clipColor='bg-[#02242E]' pinPosition='left-25 -top-7 rotate-20'/>  
        <div className="grid md:grid-cols-2 gap-12 w-full max-w-4xl mt-8 md:mt-12">
            <div className="space-y-6 text-center md:text-left">
                <p className="text-2xl sm:text-3xl font-bold leading-snug">
                    Recognition Success, <br/> strive for 
                </p>
                {/* BTN   */}
                <div className="border-2 p-2 border-dashed w-fit rounded-full mt-6">
                    <button className="bg-white text-gray-900 p-3 rounded-full font-bold text-lg shadow-xl rotate-3 transition-all saturate-200 ease-in
                     hover:bg-transparent hover:text-zinc-50 border border-transparent hover:border-zinc-300 cursor-pointer">Start Project</button>
                </div>
            </div>
            {/* Mobile Layour For Stats  */}
            <div className='flex flex-col space-y-4 md:hidden px-4 '>
                <MobileStatsCard value={"$100+"} label="Money Raised" rotation="rotate-2" className="self-end"/>
                <MobileStatsCard value={"$12+"} label="Design Award" rotation="-rotate-3" className="self-start"/>
                <MobileStatsCard value={"400+"} label="Our Clients" rotation="rotate-1" className="self-end"/>
                <MobileStatsCard value={"425+"} label="Projects Completed" rotation="-rotate-2" className="self-start"/>
            </div>
            {/* Desktop Layout for stats  */}
            <div className="hidden md:block relative h-72">
                {
                    whyUsData.map(({id,value,label,desc,classes})=>(
                        <LayeredCard key={id} value={value} label={label} descp={desc} className={classes}/>
                    ))
                }
            </div>
        </div>
        {/* DECOR IMAGE  */}
        <img src="/path-3.svg" alt="Decorative Image" className="absolute -bottom-92 pointer-events-none" />
    </section>
  )
}
const ServicesSection = () => {
  return (
    <section className={`py-10 bg-[${COLORS.darkbgTeal}] rounded-md sm:py-20 flex flex-col items-center justify-center`}>
      <p className='text-lg sm:text-xl opacity-75 mb-4'>
        Not what we make
      </p>
      <RotationLabel text="services" bgColor={COLORS.lightGreen} className='-rotate-6 mb-12 z-10' clipColor="bg-[#02242E]" />
      <p className="text-lg sm:text-xl opacity-70 -mt-8">But your satisfaction matters</p>
      {/* SERVICES CARD SECT  */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 sm:mt-16 w-full max-w-5xl px-8">
        {/* ServicesData  */}
        {
            servicesData.map((item)=>(
                <div key={item.id} className={`relative p-4 rounded ${item.rotation?item.rotation:"-rotate-6"} shadow-xl cursor-pointer flex flex-col hover:rotate-0 transition-all duration-300 ease-in-out items-center bg-zinc-100 max-w-fit text-cyan-950`}>
                    {/* Icon  */}
                    <div className={`absolute left-2 size-10 lg:size-16 ${item.iconColor} rounded-full flex items-center justify-center -mt-12 mb-4 border-2 border-white border-dotted`}>
                        {item.icon}
                    </div>
                    {/* Text  */}
                    <p className="text-cl font-bold mb-2">
                        {item.title}
                    </p>
                    <p className="text-center text-sm lg:text-lg leading-tight opacity-70">
                        {item.desc}
                    </p>
                    {/* Decorative  */}
                    <div className={`absolute -bottom-4 -right-4 size-12 md:size-16 ${item.decorColor} rounded-full opacity-30 blur-md`}/>
                </div>
            ))
        }
      </div>
      {/* BTN  */}
      <div className="self-end mt-16 p-2 mr-30 rounded-full border-2 border-zinc-100 border-dashed">
        <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-lg shadow-xl -rotate-3 hover:rotate-0 transition-all saturate-200 duration-200 ease-in hover:bg-transparent hover:text-zinc-50 border border-transparent hover:border-zinc-300 cursor-pointer">
            Start Project
        </button>
      </div>
   </section>
  )
}
const PortfolioSection = () => {
  return (
    <section className={`py-10 sm:py-20 flex flex-col items-center justify-center`}>
        <RotationLabel text="Our Work" bgColor={COLORS.yellow} className="mb-10 -rotate-3" textColor="text-gray-900"/>
        {/* WORKS  */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 sm:mt-12 w-full max-w-5xl px-8 lg:px-4">
            {worksData.map((item)=>(
                <div key={item.id} className={`relative bg-white p-4 rounded shadow-xl transform ${item.rotation} hover:rotate-0 transition-all duration-300 max-h-fit`}>
                   <div style={{backgroundImage: `url(${item.imgUrl})`,backgroundSize:"cover",backgroundPosition:"center"}} className="h-65 lg:h-70 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400">
                        {item.imgUrl === null && "Mock Image"}
                    </span>
                    {/* Bandge Image  */}
                    <img src="/bandage.svg" alt="decoration" className={`absolute ${item.bagePosition?item.bagePosition:"-bottom-6 -right-7 rotate-10"} size-20`} />
                   </div>
                   <p className="text-gray-900 text-lg font-bold mt-4">
                    {item.title}
                   </p>
                   <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
            ))}
        </div>
        {/* BTN */}
        <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-lg shadow-xl hover:text-zinc-50 mt-16 cursor-pointer hover:bg-transparent border-2 border-transparent border-dashed hover:border-zinc-100 transition-all duration-300 ease-in hover:rotate-3">See More</button>
    </section>
  )

}
const CTASection = () => {
  return (
    <section className={`relative py-10 bg-[${COLORS.darkbgTeal}] rounded-md sm:py-20 flex flex-col items-center justify-center text-center`}>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter">
            Let's Work <br/> Together 
            <RotationLabel text="Stay" bgColor={COLORS.lightGreen} textColor='text-gray-900' className='inline-block mx-1 sm:mx-2 z-10 -rotate-3' clipColor='bg-[#02242E]'/>
            <br/>
            <RotationLabel text="Connected" bgColor={COLORS.lightBlue} textColor='text-gray-900' className='inline-block mt-4 sm:mt-10 z-0 -rotate-3' clipColor='bg-[#02242E]'/>
        </h2>
        {/* BTN  */}
        <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-200 mt-10 cursor-pointer hover:bg-transparent border-2 border-transparent hover:border-zinc-100 hover:text-zinc-50 hover:rotate-3 hover:animate-wiggle">Get In Touch</button>
    </section>
  )
}
const Footer = () => {
  return (
    <footer className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between font-medium opacity-70 border-t border-gray-700 mt-8">
      <div className="flex items-center space-x-2 mb-4 sm:mb-0">
        {/* Icon */}
        <div className="size-8 bg-white rounded-full center-item text-gray-800 font-bold text-sm">B</div>
        {/* Text */}
        <span className='text-sm'>Mysh Agency © {new Date().getFullYear()}. All rights reserved.</span>
      </div>
      <div className="flex space-x-4 md:space-x-6">
        <a href="" className="hover:opacity-100 transition-all duration-200 ease-in hover:text-lime-300 hover:underline underline-offset-2 hover:-translate-y-1">Services</a>
        <a href="" className="hover:opacity-100 transition-all duration-200 ease-in hover:text-lime-300 hover:underline underline-offset-2 hover:-translate-y-1">Portfolio</a>
        <a href="" className="hover:opacity-100 transition-all duration-200 ease-in hover:text-lime-300 hover:underline underline-offset-2 hover:-translate-y-1">Team</a>
      </div>
    </footer>
  )
}
const RotationLabel = ({
    text,
    bgColor,
    clipColor,
    textColor="text-gray-900",
    className="",
    pinPosition
}:{
    text:string,
    bgColor:string,
    clipColor?:string,
    textColor?:string,
    className?:string,
    pinPosition?:string
}) => {
  return (
    <span style={{backgroundColor:`${bgColor}`}} className={`relative inline-block px-3 py-1 sm:px-4 sm:py-2 text-4xl sm:text-5xl md:text-7xl font-extrabold ${textColor} transform-rotate-3 shadow-lg ${className} rounded -z-10`}>
        {text}
        {/* pin hole */}
        <div className="absolute size-3 top-1 left-1 bg-cyan-950 rounded-full"></div>
        {/* Clip Mask */}
        <div className={`absolute w-16 h-12 -top-6 -right-9 rotate-50 ${clipColor?clipColor:"bg-cyan-950"}`}></div>
        {/* pin */}
        <img src="https://image2url.com/r2/default/images/1770233988341-97ed9b3e-8c1d-4434-85d2-a38ead89cace.png" alt="clipper" className={`absolute w-6 ${pinPosition?pinPosition:"-top-8 right-10 rotate-16"}`}/>
    </span>
  )
}

const MobileStatsCard = ({value, label, rotation, className}: {value: string, label: string, rotation: string, className: string}) => {
  return (
    <div className={`${className} p-4 rounded-xl shadow-2xl transform ${rotation} bg-white w-full max-w-xs mx-auto border-4 border-gray-100`}>
        <p className="text-2xl font-extrabold text-gray-900">
            {value}
        </p>
        <p className="text-sm text-gray-600">
            {label}
        </p>
    </div>
  )
}

const LayeredCard = ({value, label, descp, className}: {value: string, label: string, descp: string, className: string}) => {
  return (
    <div className={`cursor-pointer hover:animate-border border-2 border-transparent hover:opacity-100 hover:-rotate-6 transition-all duration-400 ease-in-out hover:bg-white hover:z-50 ${className?className:"absolute top-0 right-0 w-64 h-40 bg-white p-4 rounded-lg shadow-xl transform"}`}>
        <p className="text-2xl font-bold text-gray-900">
            {value}

        </p>
        <p className="text-sm text-gray-600">
            {label}
        </p>
        <p className="text-xs text-gray-400 mt-2">
            {descp}
        </p>
        </div>
  )
}