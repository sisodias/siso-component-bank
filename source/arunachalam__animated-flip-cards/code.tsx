'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const AnimatedCard=({
  backgroundColor,
  backFaceContent,
  date,
  company,
  role,
  logo,
  tags,
  rate,
  location,
}: {
  backgroundColor: string;
  backFaceContent: React.ReactNode;
  date: string;
  company: string;
  role: string;
  logo: string;
  tags: string[];
  rate: string;
  location: string;
}) => {
  const [showBackFace, setShowBackFace] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');

  const handleChangeCardFace = () => {
    setShowBackFace((prev) => !prev);
  };

  useEffect(() => {
    if (showBackFace && typeof backFaceContent === 'string') {
      setStreamedContent('');
      let index = 0;
      const interval = setInterval(() => {
        if (index < backFaceContent.length) {
          setStreamedContent((prev) => prev + (backFaceContent[index] ?? ''));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 1);

      return () => clearInterval(interval);
    }
    setStreamedContent('');
  }, [showBackFace, backFaceContent]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className="flex flex-col gap-4 items-center justify-center w-[300px] h-[350px] bg-[#ffffff] text-black rounded-2xl shadow-md p-4"
    >
      <AnimatePresence mode="wait">
        {showBackFace ? (
          <motion.div
            key="back"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.3 }}
            className={`flex ${backgroundColor} flex-col gap-4 items-center justify-center p-4 h-[350px] rounded-2xl shadow-md whitespace-wrap text-ellipsis overflow-hidden`}
            onClick={handleChangeCardFace}
          >
            {typeof backFaceContent === 'string' ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-center leading-relaxed"
              >
                {streamedContent}
              </motion.p>
            ) : (
              backFaceContent
            )}
          </motion.div>
        ) : (
          <motion.div
            key="front"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.1 }}
            className={`flex flex-3/2 flex-col w-full h-[350px] rounded-2xl ${backgroundColor} p-4 gap-4`}
          >
            {/* Card Header */}
            <div className="flex justify-between items-center">
              <span className="rounded-full bg-[#ffffff] p-2 px-3 font-bold text-xs">
                {date}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white hover:cursor-pointer border-none hover:bg-white outline-none focus:outline-none"
              >
                <Bookmark className="text-black hover:text-black" />
              </Button>
            </div>

            <div className="text-sm flex gap-2">
              <span className="flex flex-col flex-1/2">
                <span className="font-bold text-l">{company}</span>
                <span className="font-bold text-xl flex-wrap">{role}</span>
              </span>
              <Image
                src={logo}
                alt={company}
                width={16}
                height={16}
                className="flex w-[50px]"
              />
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full whitespace-nowrap border-[1px] border-neutral-300 text-xs ${backgroundColor} p-2 px-3`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 items-center w-full justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-bold">{rate}</span>
          <span className="text-gray-500">{location}</span>
        </div>
        <Button
          variant="outline"
          className="rounded-full bg-black text-white hover:bg-black hover:text-white hover:cursor-pointer"
          onClick={handleChangeCardFace}
        >
          Details
        </Button>
      </div>
    </motion.div>
  );
}
