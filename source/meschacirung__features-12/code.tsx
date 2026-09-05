import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChartBarIncreasingIcon, Database, Fingerprint, IdCard } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BorderBeam } from '@/components/ui/border-beam'

export function Features() {
    type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4'
    const [activeItem, setActiveItem] = useState<ImageKey>('item-1')

    const images = {
        'item-1': {
            image: 'https://tailark.com/_next/image?url=%2Fcharts.png&w=3840&q=75',
            alt: 'Database visualization',
        },
        'item-2': {
            image: 'https://tailark.com/_next/image?url=%2Fmusic.png&w=3840&q=75',
            alt: 'Security authentication',
        },
        'item-3': {
            image: 'https://tailark.com/_next/image?url=%2Fmail2.png&w=3840&q=75',
            alt: 'Identity management',
        },
        'item-4': {
            image: 'https://tailark.com/_next/image?url=%2Fpayments.png&w=3840&q=75',
            alt: 'Analytics dashboard',
        },
    }

    return (
        <section className="py-12 md:py-20 lg:py-32">
            <div className="bg-gradient-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block dark:to-muted/50"></div>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-6xl">The foundation for AI</h2>
                    <p>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</p>
                </div>

                <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
                    <Accordion
                        type="single"
                        value={activeItem}
                        onValueChange={(value) => setActiveItem(value as ImageKey)}
                        className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Database className="size-4" />
                                    Database Visualization
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Fingerprint className="size-4" />
                                    Advanced Authentication
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <IdCard className="size-4" />
                                    Identity Management
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <ChartBarIncreasingIcon className="size-4" />
                                    Analytics Dashboard
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="aspect-[76/59] relative flex overflow-hidden rounded-3xl border">
                        <div className="size-full p-2 bg-background relative rounded-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeItem}-id`}
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md">
                                    <img
                                        src={images[activeItem].image}
                                        className="size-full object-cover object-left-top dark:mix-blend-lighten"
                                        alt={images[activeItem].alt}
                                        width={1207}
                                        height={929}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <BorderBeam
                            delay={1}
                            duration={12}
                            size={200}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}