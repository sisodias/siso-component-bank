import React, { useRef, useEffect, useState } from 'react'


import { Canvas, useFrame, useThree } from '@react-three/fiber'


import { Points, PointMaterial } from '@react-three/drei'


import { gsap } from 'gsap'


import { Button } from '@/components/ui/button-1'


import { ArrowRight, Play } from 'lucide-react'


import * as THREE from 'three'



interface ParticleFieldProps {

  
count?:
 number

}



function ParticleField({ count = 10000 }: ParticleFieldProps) {

  
const ref = useRef<THREE.Points>(null!)

  
const { size, viewport } = useThree()

  
const aspect = size.width / viewport.width


  
const [sphere] = useState(() => {

    
const positions = new Float32Array(count * 3)

    
const colors = new Float32Array(count * 3)

    

    
for (let i = 0; i < count; i++) {

      
const i3 = i * 3

      
const radius = Math.random() * 15 + 5

      
const theta = Math.random() * Math.PI * 2

      
const phi = Math.acos(Math.random() * 2 - 1)

      

      
positions[i3] = radius * Math.sin(phi) * Math.cos(theta)

      
positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)

      
positions[i3 + 2] = radius * Math.cos(phi)

      

      
const color = new THREE.Color()

      
color.setHSL(0.8 + Math.random() * 0.2, 0.7, 0.5 + Math.random() * 0.3)

      
colors[i3] = color.r

      
colors[i3 + 1] = color.g

      
colors[i3 + 2] = color.b

    
}

    

    
return { positions, colors }

  
})


  
useFrame((state, delta) => {

    
if (ref.current) {

      
ref.current.rotation.x -= delta / 10

      
ref.current.rotation.y -= delta / 10

      

      
const time = state.clock.getElapsedTime()

      
const positions = ref.current.geometry.attributes.position.array as
 Float32Array

      

      
for (let i = 0; i < count; i++) {

        
const i3 = i * 3

        
const x = positions[i3]

        
const y = positions[i3 + 1]

        
const z = positions[i3 + 2]

        

        
positions[i3 + 1] = y + Math.sin(time + x * 0.01) * 0.01

      
}

      

      
ref.current.geometry.attributes.position.needsUpdate = true

    
}

  
})


  
return (

    
<group rotation={[0, 0, Math.PI / 4]}>

      
<Points ref={ref} positions={sphere.positions} stride={3} frustumCulled={false}>

        
<PointMaterial

          
transparent

          
vertexColors

          
size={0.04}

          
sizeAttenuation={true}

          
depthWrite={false}

          
blending={THREE.AdditiveBlending}

        
/>

        
<bufferAttribute

          
attach="geometry-attributes-color"

          
args={[sphere.colors, 3]}

        
/>

      
</Points>

    
</group>

  
)


}



interface FloatingElementsProps {}



function FloatingElements({}: FloatingElementsProps) {

  
const groupRef = useRef<THREE.Group>(null!)

  

  
useFrame((state) => {

    
if (groupRef.current) {

      
groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1

    
}

  
})


  
return (

    
<group ref={groupRef}>

      
{Array.from({ length: 2 }).map((_, i) => (

        
<mesh

          
key={i}

          
position={[

            
(Math.random() - 0.5) * 40,

            
(Math.random() - 0.5) * 40,

            
(Math.random() - 0.5) * 40

          
]}

          
rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}

        
>

          
<boxGeometry args={[0.5, 0.5, 0.5]} />

          
<meshStandardMaterial

            
color={new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6)}

            
transparent

            
opacity={0.3}

          
/>

        
</mesh>

      
))}

    
</group>

  
)


}



interface WebGLBackgroundProps {}



function WebGLBackground({}: WebGLBackgroundProps) {

  
return (

    
<Canvas

      
camera={{ position: [0, 0, 30], fov: 75 }}

      
style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}

      
gl={{ alpha: true, antialias: true }}

    
>

      
<ambientLight intensity={0.3} />

      
<pointLight position={[0, 10, 10]} intensity={0.5} />

      
<ParticleField />

      
<FloatingElements />

    
</Canvas>

  
)


}



interface HeroSectionProps {

  
headline?:
 string

  
description?:
 string

  
primaryCTA?:
 string

  
secondaryCTA?:
 string

  
onPrimaryClick?: () => void

  
onSecondaryClick?: () => void


}



export default function HeroDemo({

  
headline = "Transform Your Digital Experience",

  
description = "Discover the power of cutting-edge technology with our innovative solutions. Build faster, scale better, and create extraordinary user experiences that drive real business results.",

  
primaryCTA = "Get Started",

  
secondaryCTA = "Watch Demo",

  
onPrimaryClick = () => console.log("Primary CTA clicked"),

  
onSecondaryClick = () => console.log("Secondary CTA clicked")


}: HeroSectionProps) {

  
const heroRef = useRef<HTMLDivElement>(null)

  
const headlineRef = useRef<HTMLHeadingElement>(null)

  
const descriptionRef = useRef<HTMLParagraphElement>(null)

  
const ctaRef = useRef<HTMLDivElement>(null)


  
useEffect(() => {

    
const tl = gsap.timeline({ delay: 0.5 })


    
if (headlineRef.current) {

      
gsap.set(headlineRef.current, { y: 100, opacity: 0 })

      
tl.to(headlineRef.current, {

        
y: 0,

        
opacity: 1,

        
duration: 1.2,

        
ease: "power3.out"

      
})

    
}


    
if (descriptionRef.current) {

      
gsap.set(descriptionRef.current, { y: 50, opacity: 0 })

      
tl.to(descriptionRef.current, {

        
y: 0,

        
opacity: 1,

        
duration: 1,

        
ease: "power3.out"

      
}, "-=0.8")

    
}


    
if (ctaRef.current) {

      
gsap.set(ctaRef.current, { y: 30, opacity: 0 })

      
tl.to(ctaRef.current, {

        
y: 0,

        
opacity: 1,

        
duration: 0.8,

        
ease: "power3.out"

      
}, "-=0.6")

    
}


    
// Floating animation for the entire hero content

    
if (heroRef.current) {

      
gsap.to(heroRef.current, {

        
y: -10,

        
duration: 3,

        
ease: "power2.inOut",

        
yoyo: true,

        
repeat: -1

      
})

    
}


    
return () => {

      
tl.kill()

    
}

  
}, [])


  
return (

    
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      
<WebGLBackground />

      

      
{/* Gradient overlay */
}

      
<div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 z-0" />

      

      
{/* Content */
}

      
<div ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        
<div className="space-y-8">

          
<h1
 

            
ref={headlineRef}

            
className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight"

          
>

            
<span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">

              
{headline.split(' ').slice(0, 2).join(' ')}

            
</span>

            
<br />

            
<span className="text-foreground">

              
{headline.split(' ').slice(2).join(' ')}

            
</span>

          
</h1>

          

          
<p
 

            
ref={descriptionRef}

            
className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"

          
>

            
{description}

          
</p>

          

          
<div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">

            
<Button

              
size="lg"

              
onClick={onPrimaryClick}

              
className="group px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"

            
>

              
{primaryCTA}

              
<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />

            
</Button>

            

            
<Button

              
variant="outline"

              
size="lg"

              
onClick={onSecondaryClick}

              
className="group px-8 py-6 text-lg font-semibold border-2 border-border hover:border-primary/50 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"

            
>

              
<Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />

              
{secondaryCTA}

            
</Button>

          
</div>

        
</div>

        

        
{/* Scroll indicator */
}

        
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">

          
<div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">

            
<div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-bounce" />

          
</div>

        
</div>

      
</div>

      

      
{/* Decorative elements */
}

      
<div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />

      
<div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      
<div className="absolute top-1/2 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500" />

    
</section>

  
)


}