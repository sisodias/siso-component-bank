'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export const Component = () => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div className='min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black'>
            <motion.div 
                className='min-h-[55vh] w-[40vh] bg-black/80 backdrop-blur-sm rounded-4xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col p-2 gap-2 overflow-hidden border border-gray-800'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileHover={{ 
                    scale: 1.01,
                    boxShadow: "0 35px 60px -15px rgba(0,0,0,0.7)",
                    borderColor: "rgba(255,255,255,0.2)"
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <motion.div 
                    className='flex justify-between p-2 items-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <motion.svg 
                        width="34px" 
                        height="34px" 
                        fill="white" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <g>
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M4 10.4V4a1 1 0 0 1 1-1h5V1h4v2h5a1 1 0 0 1 1 1v6.4l1.086.326a1 1 0 0 1 .682 1.2l-1.516 6.068A4.992 4.992 0 0 1 16 16 4.992 4.992 0 0 1 12 18a4.992 4.992 0 0 1-4-2 4.992 4.992 0 0 1-4.252 1.994l-1.516-6.068a1 1 0 0 1 .682-1.2L4 10.4zm2-.6L12 8l2.754.826 1.809.543L18 9.8V5H6v4.8zM4 20a5.978 5.978 0 0 0 4-1.528A5.978 5.978 0 0 0 12 20a5.978 5.978 0 0 0 4-1.528A5.978 5.978 0 0 0 20 20h2v2h-2a7.963 7.963 0 0 1-4-1.07A7.963 7.963 0 0 1 12 22a7.963 7.963 0 0 1-4-1.07A7.963 7.963 0 0 1 4 22H2v-2h2z" />
                        </g>
                    </motion.svg>
                    <motion.div 
                        className='w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer'
                        whileHover={{ 
                            scale: 1.1, 
                            backgroundColor: "#60a5fa",
                            boxShadow: "0 0 15px rgba(96, 165, 250, 0.7)" 
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7" />
                            <path d="M7 7h10v10" />
                        </svg>
                    </motion.div>
                </motion.div>
                <div className='flex flex-col gap-4'>
                    <motion.div 
                        className="title text-4xl text-center font-bold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        BALI
                        <br />
                        ISLAND
                    </motion.div>
                    <motion.div 
                        className="image relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        <div className="absolute inset-0 rounded-2xl opacity-15 z-0">
                            <motion.div
                                animate={{ scale: isHovered ? 1.03 : 1 }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                            >
                                <Image 
                                    src="https://hblimg.mmtcdn.com/content/hubble/img/julydestimg/mmt/activities/m_Bali_1destimg_l_902_1352.jpg" 
                                    alt="Bali Island Background" 
                                    className="w-full h-full object-cover blur-sm scale-200 opacity-70"
                                    width={500}
                                    height={300}
                                />
                            </motion.div>
                        </div>
                        <motion.div 
                            className="relative z-10 p-2"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "easeInOut" }}
                        >
                            <Image 
                                src="https://hblimg.mmtcdn.com/content/hubble/img/julydestimg/mmt/activities/m_Bali_1destimg_l_902_1352.jpg" 
                                alt="Bali Island" 
                                className="rounded-2xl w-full h-full shadow-lg"
                                width={500}
                                height={300}
                            />
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        className="desc text-xs text-center max-w-72 mx-auto text-neutral-400 font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.7 }}
                    >
                        Experience the breathtaking beauty of Bali Island, where pristine beaches meet lush tropical forests and ancient temples await your discovery.
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
