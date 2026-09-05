import { ArrowLeft, Phone } from "lucide-react"
import { Button } from '@/components/ui/button'
import {PlusIcon} from 'lucide-react'
export function LostGrid() {
      const positions = [
        "top-0 -left-3",
        "top-0 -right-3",
        "bottom-0 -left-3",
        "bottom-0 -right-3"
    ]
  return (
    <div className='flex flex-col font-mono w-full min-h-screen items-center justify-center bg-background text-foreground p-4'>
<div className="min-h-screen w-full bg-transparent absolute bottom-0 right-0">
  {/* Diagonal Fade Bottom Grid Right Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, var(--muted) 1px, transparent 1px),
        linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
      `,
      backgroundSize: "32px 32px",
      WebkitMaskImage:
         "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
      maskImage:
         "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
    }}
  />
     {/* Your Content/Components */}
</div>
    <div className="min-h-screen w-full absolute top-0 left-0">
  {/* Diagonal Fade Grid Background - Top Left */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, var(--muted) 1px, transparent 1px),
        linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
      `,
      backgroundSize: "32px 32px",
      WebkitMaskImage:
        "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
      maskImage:
        "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
    }}
  />
     {/* Your Content/Components */}
</div>
      <div className='relative group'>
        {/* Corner Accents */}
        
        {/* Main Content Card */}
        <div className='relative flex flex-col items-center border border-dashed border-border p-1 bg-transparent'>
                   {positions.map((position, index) => (
            <div key={index} className={`absolute ${position}`}>
                <PlusIcon />
            </div>
        ))}
          {/* Inner Grid Area */}
          <div className="flex flex-col items-center justify-center p-12 min-w-[320px] sm:min-w-[400px] border border-border bg-background bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)] bg-[size:24px_24px]">
            <h1 className='text-8xl font-bold tracking-tighter mb-2'>404</h1>
            <div className='h-px w-12 bg-border mb-4' />
            <p className='text-sm uppercase tracking-widest text-muted-foreground font-semibold'>Page Not Found</p>
          </div>

          {/* Action Buttons */}
          <div className='flex w-full gap-1 py-2 border-t border-dashed border-border'>
            <Button 
              className='flex-1 rounded-none border-dashed transition-colors' 
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Return Home</span>
            </Button>
            <Button 
              className='flex-1 rounded-none border-dashed transition-colors' 
              variant='outline'
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>Support</span>
            </Button>            
          </div>
        </div>
      </div>
    </div>
  )
}
