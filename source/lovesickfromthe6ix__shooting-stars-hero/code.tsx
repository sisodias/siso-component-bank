import React, { useEffect, useRef, useState } from 'react';


import { gsap } from 'gsap';


import { Play } from 'lucide-react';



// WebGL Shader Background Component


const WebGLBackground: React.FC = () => {

  
const canvasRef = useRef<HTMLCanvasElement>(null);

  
const animationFrameRef = useRef<number | null>(null);


  
useEffect(() => {

    
if (!canvasRef.current) return;


    
const canvas = canvasRef.current;

    
const gl = canvas.getContext('webgl2');

    
if (!gl) return;


    
const vertexShaderSource = 
`#version 300 es

      precision highp float;

      in vec4 position;

      void main() {

        gl_Position = position;

      }

    `
;


    
const fragmentShaderSource = 
`#version 300 es

      precision highp float;

      out vec4 fragColor;

      uniform vec2 resolution;

      uniform float time;

      

      float noise(vec2 p) {

        p = fract(p * vec2(12.9898, 78.233));

        p += dot(p, p + 34.56);

        return fract(p.x * p.y);

      }

      

      float fbm(vec2 p) {

        float t = 0.0, a = 1.0;

        mat2 m = mat2(1.0, -0.5, 0.2, 1.2);

        for (int i = 0; i < 5; i++) {

          t += a * noise(p);

          p *= 2.0 * m;

          a *= 0.5;

        }

        return t;

      }

      

      void main() {

        vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);

        vec3 col = vec3(0.0);

        

        float bg = fbm(vec2(uv.x + time * 0.3, -uv.y));

        uv *= 1.0 - 0.3 * (sin(time * 0.2) * 0.5 + 0.5);

        

        for (float i = 1.0; i < 12.0; i++) {

          uv += 0.1 * cos(i * vec2(0.1 + 0.01 * i, 0.8) + i * i + time * 0.5 + 0.1 * uv.x);

          vec2 p = uv;

          float d = length(p);

          col += 0.00125 / d * (cos(sin(i) * vec3(1.0, 2.0, 3.0)) + 1.0);

          float b = noise(i + p + bg * 1.731);

          col += 0.002 * b / length(max(p, vec2(b * p.x * 0.02, p.y)));

          col = mix(col, vec3(bg * 0.25, bg * 0.137, bg * 0.05), d);

        }

        

        fragColor = vec4(col, 1.0);

      }

    `
;


    
const createShader = (type: number, source: string) => {

      
const shader = gl.createShader(type);

      
if (!shader) return null;

      
gl.shaderSource(shader, source);

      
gl.compileShader(shader);

      
return shader;

    
};


    
const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);

    
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);


    
if (!vertexShader || !fragmentShader) return;


    
const program = gl.createProgram();

    
if (!program) return;


    
gl.attachShader(program, vertexShader);

    
gl.attachShader(program, fragmentShader);

    
gl.linkProgram(program);


    
const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);

    
const buffer = gl.createBuffer();

    
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


    
const position = gl.getAttribLocation(program, 'position');

    
gl.enableVertexAttribArray(position);

    
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);


    
const resolutionLocation = gl.getUniformLocation(program, 'resolution');

    
const timeLocation = gl.getUniformLocation(program, 'time');


    
const resize = () => {

      
const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

      
canvas.width = window.innerWidth * dpr;

      
canvas.height = window.innerHeight * dpr;

      
gl.viewport(0, 0, canvas.width, canvas.height);

    
};


    
const render = (time: number) => {

      
gl.clearColor(0, 0, 0, 1);

      
gl.clear(gl.COLOR_BUFFER_BIT);

      
gl.useProgram(program);

      

      
gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      
gl.uniform1f(timeLocation, time * 0.001);

      

      
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      
animationFrameRef.current = requestAnimationFrame(render);

    
};


    
resize();

    
window.addEventListener('resize', resize);

    
render(0);


    
return () => {

      
window.removeEventListener('resize', resize);

      
if (animationFrameRef.current) {

        
cancelAnimationFrame(animationFrameRef.current);

      
}

    
};

  
}, []);


  
return (

    
<canvas

      
ref={canvasRef}

      
className="absolute inset-0 w-full h-full object-cover"

      
style={{ background: 'black' }}

    
/>

  
);


};



// Main Hero Component


interface HeroSectionProps {

  
headline?: string;

  
description?: string;

  
primaryButtonText?: string;

  
secondaryButtonText?: string;

  
onPrimaryClick?: () => void;

  
onSecondaryClick?: () => void;


}



const HeroSection: React.FC<HeroSectionProps> = ({

  
headline = "Transform Your Digital Experience",

  
description = "Experience your dreams",

  
primaryButtonText = "Get Started",

  
secondaryButtonText = "Watch Demo",

  
onPrimaryClick = () => console.log('Primary button clicked'),

  
onSecondaryClick = () => console.log('Secondary button clicked')


}) => {

  
const heroRef = useRef<HTMLDivElement>(null);

  
const headlineRef = useRef<HTMLHeadingElement>(null);

  
const descriptionRef = useRef<HTMLParagraphElement>(null);

  
const buttonsRef = useRef<HTMLDivElement>(null);

  
const [isLoaded, setIsLoaded] = useState(false);


  
useEffect(() => {

    
setIsLoaded(true);

    

    
if (!heroRef.current || !headlineRef.current || !descriptionRef.current || !buttonsRef.current) return;


    
// GSAP animations

    
const tl = gsap.timeline({ delay: 0.5 });


    
// Animate headline

    
tl.fromTo(

      
headlineRef.current,

      
{

        
opacity: 0,

        
y: -10,

        
scale: 0.8

      
},

      
{

        
opacity: 1,

        
y: 0,

        
scale: 1,

        
duration: 1.2,

        
ease: "power3.out"

      
}

    
);


    
// Animate description

    
tl.fromTo(

      
descriptionRef.current,

      
{

        
opacity: 0,

        
y: 50

      
},

      
{

        
opacity: 1,

        
y: 0,

        
duration: 0.8,

        
ease: "power2.out"

      
},

      
"-=0.6"

    
);


    
// Animate buttons

    
tl.fromTo(

      
buttonsRef.current.children,

      
{

        
opacity: 0,

        
y: 30,

        
scale: 0.9

      
},

      
{

        
opacity: 1,

        
y: 0,

        
scale: 1,

        
duration: 0.6,

        
ease: "back.out(1.7)",

        
stagger: 0.1

      
},

      
"-=0.4"

    
);


    
// Continuous floating animation for headline

    
gsap.to(headlineRef.current, {

      
y: -10,

      
duration: 3,

      
ease: "sine.inOut",

      
yoyo: true,

      
repeat: -1

    
});


  
}, []);


  
return (

    
<div className="relative w-full min-h-screen overflow-hidden bg-background">

      
{/* WebGL Background */
}

      
<div className="absolute inset-0 z-0">

        
<WebGLBackground />

        
{/* Gradient overlay */
}

        
<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      
</div>


      
{/* Hero Content */
}

      
<div
 

        
ref={heroRef}

        
className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"

      
>

        
<div className="max-w-6xl mx-auto space-y-8">

          
{/* Headline */
}

          
<h1
 

            
ref={headlineRef}

            
className="text-4xl sm:text-6xl lg:text-8xl font-bold leading-tight"

            
style={{ opacity: 0 }}

          
>

            
<span className="bg-gradient-to-r from-orange-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">

              
{headline.split(' ').slice(0, 2).join(' ')}

            
</span>

            
<br />

            
<span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">

              
{headline.split(' ').slice(2).join(' ')}

            
</span>

          
</h1>


          
{/* Description */
}

          
<p
 

            
ref={descriptionRef}

            
className="text-lg sm:text-xl lg:text-2xl text-orange-100/90 font-light leading-relaxed max-w-4xl mx-auto"

            
style={{ opacity: 0 }}

          
>

            
{description}

          
</p>


          
{/* CTA Buttons */
}

          
<div
 

            
ref={buttonsRef}

            
className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"

          
>

            
<button

              
onClick={onPrimaryClick}

              
className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 overflow-hidden"

              
style={{ opacity: 0 }}

            
>

              
<span className="relative z-10">{primaryButtonText}</span>

              
<div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            
</button>


            
<button

              
onClick={onSecondaryClick}

              
className="group flex items-center gap-3 px-8 py-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-300/30 hover:border-orange-300/50 text-orange-100 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"

              
style={{ opacity: 0 }}

            
>

              
<Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />

              
<span>{secondaryButtonText}</span>

            
</button>

          
</div>

        
</div>


        
{/* Scroll indicator */
}

        
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">

          
<div className="w-6 h-10 border-2 border-orange-300/50 rounded-full flex justify-center">

            
<div className="w-1 h-3 bg-orange-300/70 rounded-full mt-2 animate-pulse" />

          
</div>

        
</div>

      
</div>


      
{/* Ambient light effects */
}

      
<div className="absolute inset-0 pointer-events-none overflow-hidden z-5">

        
<div className="absolute top-20 left-20 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl animate-pulse" />

        
<div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] bg-gradient-radial from-orange-900/5 to-transparent rounded-full" />

      
</div>

    
</div>

  
);


};



// Demo Component


const HeroDemo: React.FC = () => {

  
const handleGetStarted = () => {

    
console.log('Get Started clicked!');

    
// Add your navigation logic here

  
};


  
const handleWatchDemo = () => {

    
console.log('Watch Demo clicked!');

    
// Add your demo logic here

  
};


  
return (

    
<div className="w-full">

      
<HeroSection

        
headline="Launch Your Digital Future"

        
description="Experience the next generation of web technology with stunning visuals, smooth animations, and cutting-edge design that captivates your audience."

        
primaryButtonText="Get Started Free"

        
secondaryButtonText="Watch Demo"

        
onPrimaryClick={handleGetStarted}

        
onSecondaryClick={handleWatchDemo}

      
/>

    
</div>

  
);


};



export default HeroDemo;