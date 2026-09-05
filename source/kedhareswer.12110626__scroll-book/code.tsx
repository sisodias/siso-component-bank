import React, { useEffect } from 'react';

const DEMOS = [
    { name: 'Kitkat', id: 'LYpNyvm' },
    { name: 'Newton', id: 'abzeaWJ' },
    { name: 'Launch', id: 'rNOqzbN' },
    { name: 'Birthday', id: 'BaobKOJ' },
    { name: 'Impossible', id: 'ZjLKGY' },
    { name: 'Care', id: 'RwPrOoz' },
    { name: 'Cubes', id: 'QWbRxXb' },
    { name: 'Elon', id: 'RwWMwvY' },
    { name: 'Gun', id: 'GRoKOyg' },
    { name: 'Moon', id: 'NWqemYK' },
    { name: 'Pokedex', id: 'eYpGQxr' },
    { name: 'Record', id: 'RwraKYZ' },
    { name: 'Tcannon', id: 'eYpmBxQ' },
    { name: 'Cloud', id: 'MWwRKvd' },
    { name: 'Fireflies', id: 'zYGQYWJ' },
    { name: 'Train', id: 'eYpdPWa' },
    { name: 'Pancake', id: 'jJVpWZ' },
    { name: 'Earth', id: 'aPzVme' },
    { name: 'Matryoshka', id: 'jOOYMLm' },
    { name: 'Truck', id: 'MWWowEb' },
];

const SHUFFLED_DEMOS = DEMOS.sort(() => 0.5 - Math.random());
const PAGES = 10;

const Sketch: React.FC<{ idx: number }> = ({ idx }) => {
    const src = SHUFFLED_DEMOS[idx - 1]?.name;
    const id = SHUFFLED_DEMOS[idx - 1]?.id;

    return (
        <a href={`https://codepen.io/jh3y/full/${id}`} target="_blank" rel="noreferrer noopener">
            <img src={`https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/${src || 'Book'}-sketch.svg`} alt={src} />
        </a>
    );
};

const BookComponent: React.FC = () => {
    useEffect(() => {
        // GSAP animation code
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        document.head.appendChild(script);

        const scrollTriggerScript = document.createElement('script');
        scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
        document.head.appendChild(scrollTriggerScript);

        scrollTriggerScript.onload = () => {
            const { gsap, ScrollTrigger } = (window as any);
            if (gsap && ScrollTrigger) {
                gsap.registerPlugin(ScrollTrigger);

                gsap.to('.book', {
                    scrollTrigger: {
                        scrub: 1,
                        start: () => 0,
                        end: () => window.innerHeight * 0.25,
                    },
                    scale: 1,
                });

                gsap.to('.logo', {
                    scrollTrigger: {
                        scrub: true,
                        start: () => 13.5 * (window.innerHeight * 0.25),
                        end: () => 14 * (window.innerHeight * 0.25),
                    },
                    opacity: 1,
                });

                const PAGES = Array.from(document.querySelectorAll('.book__page'));
                PAGES.forEach((page, index) => {
                    gsap.set(page, { z: index === 0 ? 13 : -index * 1 });
                    if (index === 11) return;

                    gsap.to(page, {
                        rotateY: `-=${180 - index / 2}`,
                        scrollTrigger: {
                            scrub: 1,
                            start: () => (index + 1) * (window.innerHeight * 0.25),
                            end: () => (index + 2) * (window.innerHeight * 0.25),
                        },
                    });

                    gsap.to(page, {
                        z: index === 0 ? -13 : index,
                        scrollTrigger: {
                            scrub: 1,
                            start: () => (index + 1) * (window.innerHeight * 0.25),
                            end: () => (index + 1.5) * (window.innerHeight * 0.25),
                        },
                    });
                });
            }
        };

        return () => {
            document.head.removeChild(script);
            document.head.removeChild(scrollTriggerScript);
        };
    }, []);

    const renderPages = () => {
        const pages = [];
        for (let p = 0; p < PAGES; p++) {
            pages.push(
                <div key={p} className="page book__page" style={{ '--page-index': p + 2 } as React.CSSProperties}>
                    <div className="page__half page__half--front">
                        <Sketch idx={p * 2 + 1} />
                        <div className="page__number">{p * 2 + 1}</div>
                    </div>
                    <div className="page__half page__half--back">
                        <Sketch idx={p * 2 + 2} />
                        <div className="page__number">{p * 2 + 2}</div>
                    </div>
                </div>
            );
        }
        return pages;
    };

    return (
        <>
            <h1>Scroll</h1>
            <div className="book">
                <div className="book__spine"></div>
                <div className="page book__page book__cover book__cover--front" style={{ '--page-index': 1 } as React.CSSProperties}>
                    <div className="page__half page__half--front">
                        <span className="code">
                            {`.set(FOLD,{transformOrigin:"50% 100%",scaleY:0}),set(CLIPS,{transformOrigin:"50% 0"}),set(".cannon__shirt",{opacity:0}),set(".cannon",{y:28}),set(".text--ordered .char",{y:"100%"});const SPEED=.15,FOLD_TL=()=>new timeline().to(LEFT_ARM,{duration:SPEED,rotateY:-180,transformOrigin:\`\${100*(22/65.3)}% 50%\`},0).to(RIGHT_ARM,{duration:SPEED,rotateY:-180,transformOrigin:\`\${100*((65.3-22)/65.3)}% 50%\`},SPEED).to(FOLD,{duration:SPEED/4,scaleY:1},2*SPEED).to(FOLD,{duration:SPEED,y:-47},2*SPEED+.01).to(CLIPS,{duration:SPEED,scaleY:.2},2*SPEED).to(".cannon",{duration:SPEED,y:0},2*SPEED),LOAD_TL=()=>new timeline().to(".button__shirt",{transformOrigin:"50% 13%",rotate:90,duration:.15}).to(".button__shirt",{duration:.15,y:60}).to(".t-shirt__cannon",{y:5,repeat:1,yoyo:!0,duration:.1}).to(".t-shirt__cannon",{y:50,duration:.5,delay:.1}),FIRE_TL=()=>new timeline().set(".t-shirt__cannon",{rotate:48,x:-85,scale:2.5}).set(".cannon__shirt",{opacity:1}).to(".t-shirt__cannon-content",{duration:1,y:-35}).to(".t-shirt__cannon-content",{duration:.25,y:-37.5}).to(".t-shirt__cannon-content",{duration:.015,y:-30.5}).to(".cannon__shirt",{onStart:()=>CLIP.play(),duration:.5,y:"-25vmax"},"<").to(".text--ordered .char",{duration:.15,stagger:.1,y:"0%"}).to("button",{duration:.15*7,"--hue":116,"--lightness":55},"<"),ORDER_TL=new timeline({paused:!0});ORDER_TL.set(".cannon__shirt",{opacity:0}),ORDER_TL.set("button",{"--hue":260,"--lightness":20}),ORDER_TL.to("button",{scale:300/BUTTON.offsetWidth,duration:SPEED}),ORDER_TL.to(".text--order .char",{stagger:.1,y:"100%",duration:.1}),ORDER_TL.to(SHIRT,{x:BUTTON.offsetWidth/2-33,duration:.2}),ORDER_TL.add(FOLD_TL()),ORDER_TL.add(LOAD_TL()),ORDER_TL.add(FIRE_TL()),BUTTON.addEventListener("click",()=>{1===ORDER_TL.progress()?(document.documentElement.style.setProperty("--hue",360*Math.random()),ORDER_TL.time(0),ORDER_TL.pause()):0===ORDER_TL.progress()&&ORDER_TL.play()});`}
                        </span>
                        <svg className="sticker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 316 306">
                            <path d="M155 0c-37 0-63 8-85 30-6-6-21-7-29-7C22 23 6 38 6 56c1 24 9 34 24 40l-9 2-21 4 3 22c3 0 8 1 9 4 6 7 2 14 3 26 2 21 7 33 14 40 14 67 62 112 127 112 70 0 118-45 132-112 6-7 11-20 13-40 1-12-3-19 3-26 2-3 6-4 9-4l3-22-21-4-10-2c17-7 24-26 24-40 0-18-15-33-34-33-9 0-23 1-30 7-23-22-51-30-90-30z" fill="hsl(0, 0%, 96%)" />
                            <g transform="matrix(1.34105 0 0 1.34105 -43 -1047)">
                                <path d="M243 894c0 61-36 106-94 106-55 0-92-45-92-106s38-86 91-86 95 25 95 86z" fill="#803300" />
                                <path d="M212 958c0 20-29 39-63 39-35 0-61-19-61-39s26-33 61-33 63 13 63 33z" fill="#e9c6af" />
                                <path d="M181 932c0 7-19 24-30 24s-32-17-32-24c0-8 20-13 31-13 12 0 31 5 31 13z" />
                                <ellipse cx="68.3" cy="827.7" rx="23.8" ry="23.1" fill="#803300" />
                                <path d="M85 826a17 16 0 00-17-14 17 16 0 00-16 16 17 16 0 0016 16 17 16 0 001 0l3-4a66 66 0 0111-12l2-2z" fill="#e9c6af" />
                                <ellipse ry="23.1" rx="23.8" cy="827.7" cx="-231.2" transform="scale(-1 1)" fill="#803300" />
                                <path d="M215 826a17 16 0 0116-14 17 16 0 0117 16 17 16 0 01-17 16 17 16 0 01-1 0l-2-4a66 66 0 00-11-12l-2-2z" fill="#e9c6af" />
                                <path d="M148 815c-14 0-26 1-38 4v11a199 199 0 0180 1v-11c-13-3-27-5-42-5z" fill="red" />
                                <path d="M165 816a16 8 0 015 5 16 8 0 01-6 6l26 4v-11l-25-4z" fill="#e50000" />
                                <path d="M148 789c-43 0-76 20-83 64 12-11 28-19 45-23 0 0-2-12 10-16 15-4 19-4 28-4 10 0 15 0 30 4s12 17 12 17c18 5 32 11 45 22-8-46-43-64-87-64z" fill="#1a1a1a" />
                                <circle cx="97.2" cy="894.1" r="11.2" fill="#faa" fillOpacity=".6" />
                                <circle cy="894.1" cx="201.9" r="11.2" fill="#faa" fillOpacity=".6" />
                                <path d="M97 864a21 21 0 01-7 16 21 21 0 01-16 5M204 864a21 21 0 006 16 21 21 0 0016 5" fill="none" stroke="#e9afaf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </svg>
                    </div>
                    <div className="page__half page__half--back">
                        <div className="book__insert">
                            <a href="https://jhey.dev" target="_blank" rel="noopener noreferrer">
                                <img className="logo" src="https://assets.codepen.io/605876/bear-with-cap.svg" alt="Logo" />
                            </a>
                        </div>
                    </div>
                </div>
                {renderPages()}
                <div className="page book__page book__cover book__cover--back" style={{ '--page-index': PAGES + 2 } as React.CSSProperties}>
                    <div className="page__half page__half--front"></div>
                    <div className="page__half page__half--back">
                        <span className="code">
                            {`.set(FOLD,{transformOrigin:"50% 100%",scaleY:0}),set(CLIPS,{transformOrigin:"50% 0"}),set(".cannon__shirt",{opacity:0}),set(".cannon",{y:28}),set(".text--ordered .char",{y:"100%"});const SPEED=.15,FOLD_TL=()=>new timeline().to(LEFT_ARM,{duration:SPEED,rotateY:-180,transformOrigin:\`\${100*(22/65.3)}% 50%\`},0).to(RIGHT_ARM,{duration:SPEED,rotateY:-180,transformOrigin:\`\${100*((65.3-22)/65.3)}% 50%\`},SPEED).to(FOLD,{duration:SPEED/4,scaleY:1},2*SPEED).to(FOLD,{duration:SPEED,y:-47},2*SPEED+.01).to(CLIPS,{duration:SPEED,scaleY:.2},2*SPEED).to(".cannon",{duration:SPEED,y:0},2*SPEED),LOAD_TL=()=>new timeline().to(".button__shirt",{transformOrigin:"50% 13%",rotate:90,duration:.15}).to(".button__shirt",{duration:.15,y:60}).to(".t-shirt__cannon",{y:5,repeat:1,yoyo:!0,duration:.1}).to(".t-shirt__cannon",{y:50,duration:.5,delay:.1}),FIRE_TL=()=>new timeline().set(".t-shirt__cannon",{rotate:48,x:-85,scale:2.5}).set(".cannon__shirt",{opacity:1}).to(".t-shirt__cannon-content",{duration:1,y:-35}).to(".t-shirt__cannon-content",{duration:.25,y:-37.5}).to(".t-shirt__cannon-content",{duration:.015,y:-30.5}).to(".cannon__shirt",{onStart:()=>CLIP.play(),duration:.5,y:"-25vmax"},"<").to(".text--ordered .char",{duration:.15,stagger:.1,y:"0%"}).to("button",{duration:.15*7,"--hue":116,"--lightness":55},"<"),ORDER_TL=new timeline({paused:!0});ORDER_TL.set(".cannon__shirt",{opacity:0}),ORDER_TL.set("button",{"--hue":260,"--lightness":20}),ORDER_TL.to("button",{scale:300/BUTTON.offsetWidth,duration:SPEED}),ORDER_TL.to(".text--order .char",{stagger:.1,y:"100%",duration:.1}),ORDER_TL.to(SHIRT,{x:BUTTON.offsetWidth/2-33,duration:.2}),ORDER_TL.add(FOLD_TL()),ORDER_TL.add(LOAD_TL()),ORDER_TL.add(FIRE_TL()),BUTTON.addEventListener("click",()=>{1===ORDER_TL.progress()?(document.documentElement.style.setProperty("--hue",360*Math.random()),ORDER_TL.time(0),ORDER_TL.pause()):0===ORDER_TL.progress()&&ORDER_TL.play()});`}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookComponent;