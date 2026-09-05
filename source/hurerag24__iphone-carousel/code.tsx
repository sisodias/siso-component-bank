"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, PlayCircle, ArrowRight } from "lucide-react";

export interface VideoSlide {
  id: number;
  textLists: string[];
  video: string;
  videoDuration: number;
}

export interface VideoCarouselProps {
  slides: VideoSlide[];
  videoOffsets?: Record<number, string>;
}

export interface HighlightsSectionProps {
  heading?: string;
  links?: Array<{ label: string; icon?: "play" | "arrow" }>;
  slides: VideoSlide[];
  videoOffsets?: Record<number, string>;
}


// Internal state type
interface VideoState {
  isEnd: boolean;
  startPlay: boolean;
  videoId: number;
  isLastVideo: boolean;
  isPlaying: boolean;
}

type ProcessType = "video-end" | "video-last" | "video-reset" | "pause" | "play";


// VideoCarousel
export const VideoCarousel = ({ slides, videoOffsets = {} }: VideoCarouselProps) => {
  const lastIndex = slides.length - 1;

  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [video, setVideo] = useState<VideoState>({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const [loadedData, setLoadedData] = useState<Event[]>([]);

  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  // Slider + scroll-triggered autoplay
  useGSAP(() => {
    gsap.to("#vc-slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#vc-video", {
      scrollTrigger: {
        trigger: "#vc-video",
        toggleActions: "restart none none none",
      },
      onComplete: () =>
        setVideo((prev) => ({ ...prev, startPlay: true, isPlaying: true })),
    });
  }, [isEnd, videoId]);

  // Progress bar animation 
  useEffect(() => {
    let currentProgress = 0;
    const span = videoSpanRef.current;

    if (!span[videoId]) return;

    const anim = gsap.to(span[videoId], {
      onUpdate: () => {
        const progress = Math.ceil(anim.progress() * 100);
        if (progress !== currentProgress) {
          currentProgress = progress;

          gsap.to(videoDivRef.current[videoId], {
            width:
              window.innerWidth < 760
                ? "10vw"
                : window.innerWidth < 1200
                ? "10vw"
                : "4vw",
          });

          gsap.to(span[videoId], {
            width: `${currentProgress}%`,
            backgroundColor: "white",
          });
        }
      },
      onComplete: () => {
        if (isPlaying) {
          gsap.to(videoDivRef.current[videoId], { width: "12px" });
          gsap.to(span[videoId], { backgroundColor: "#afafaf" });
        }
      },
    });

    if (videoId === 0) anim.restart();

    const animUpdate = () => {
      const currentVideo = videoRef.current[videoId];
      if (currentVideo) {
        anim.progress(currentVideo.currentTime / slides[videoId].videoDuration);
      }
    };

    if (isPlaying) {
      gsap.ticker.add(animUpdate);
    } else {
      gsap.ticker.remove(animUpdate);
    }

    return () => gsap.ticker.remove(animUpdate);
  }, [videoId, startPlay, slides]);

  // Play / pause sync 
  useEffect(() => {
    if (loadedData.length > lastIndex) {
      const currentVideo = videoRef.current[videoId];
      if (currentVideo) {
        if (!isPlaying) {
          currentVideo.pause();
        } else if (startPlay) {
          currentVideo.play();
        }
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData, lastIndex]);

  // Controls
  const handleProcess = (type: ProcessType, i?: number) => {
    switch (type) {
      case "video-end":
        setVideo((prev) => ({ ...prev, isEnd: true, videoId: i! + 1 }));
        break;
      case "video-last":
        setVideo((prev) => ({ ...prev, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((prev) => ({ ...prev, videoId: 0, isLastVideo: false }));
        break;
      case "pause":
      case "play":
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
    }
  };

  const handleLoadedMetaData = (
    _i: number,
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => setLoadedData((prev) => [...prev, e.nativeEvent]);

  return (
    <>
      {/* Slides track */}
      <div className="flex items-center">
        {slides.map((slide, i) => {
          const offsetClass = videoOffsets[slide.id] ?? "";
          return (
            <div key={slide.id} id="vc-slider" className="sm:pr-20 pr-10">
              <div className="relative sm:w-[70vw] w-[88vw] md:h-[70vh] sm:h-[50vh] h-[35vh]">
                {/* Video */}
                <div className="w-full h-full flex items-center justify-center rounded-3xl overflow-hidden bg-black">
                  <video
                    id="vc-video"
                    playsInline
                    className={`${offsetClass} pointer-events-none`}
                    preload="metadata"
                    muted
                    crossOrigin="anonymous"
                    ref={(el) => { videoRef.current[i] = el; }}
                    onEnded={() =>
                      i !== lastIndex
                        ? handleProcess("video-end", i)
                        : handleProcess("video-last")
                    }
                    onPlay={() =>
                      setVideo((prev) => ({ ...prev, isPlaying: true }))
                    }
                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                  >
                    <source src={slide.video} type="video/mp4" />
                  </video>
                </div>

                {/* Text overlay */}
                <div className="absolute top-12 left-[5%] z-10">
                  {slide.textLists.map((text, j) => (
                    <p
                      key={j}
                      className="text-xl max-sm:text-sm font-medium text-white"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls bar */}
      <div className="relative flex items-center justify-center mt-10">
        {/* Progress dots */}
        <div className="flex items-center justify-center py-5 px-7 bg-input backdrop-blur rounded-full">
          {slides.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-muted-foreground/30 rounded-full relative cursor-pointer"
              ref={(el) => { videoDivRef.current[i] = el; }}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => { videoSpanRef.current[i] = el; }}
              />
            </span>
          ))}
        </div>

        {/* Play / Pause / Reset button */}
        <button
          aria-label={isLastVideo ? "Replay" : isPlaying ? "Pause" : "Play"}
          className="ml-4 p-4 rounded-full bg-input backdrop-blur flex items-center justify-center"
          onClick={() =>
            isLastVideo
              ? handleProcess("video-reset")
              : isPlaying
              ? handleProcess("pause")
              : handleProcess("play")
          }
        >
          {isLastVideo ? (
            <RotateCcw className="w-6 h-6 text-foreground" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6 text-foreground" />
          ) : (
            <Play className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>
    </>
  );
};


// HighlightsSection
const LINK_ICONS = {
  play: <PlayCircle className="ml-2 w-5 h-5" />,
  arrow: <ArrowRight className="ml-2 w-5 h-5" />,
};

export const HighlightsSection = ({
  heading = "Get the highlights.",
  links = [
    { label: "Watch the film", icon: "play" },
    { label: "Watch the event", icon: "arrow" },
  ],
  slides,
  videoOffsets,
}: HighlightsSectionProps) => {
  useGSAP(() => {
    gsap.to("#hs-title", { opacity: 1, y: 0 });
    gsap.to(".hs-link", { opacity: 1, y: 0, duration: 1, stagger: 0.25 });
  }, []);

  return (
    <section
      id="highlights"
      className="w-screen overflow-x-hidden sm:py-32 py-20 sm:px-10 px-5 bg-background h-screen"
    >
      <div className="max-w-[1120px] mx-auto relative overflow-hidden">
        {/* Header */}
        <div className="mb-12 w-full md:flex items-end justify-between">
          <h1
            id="hs-title"
            className="text-foreground lg:text-6xl md:text-5xl text-3xl lg:mb-0 mb-5 font-medium opacity-0 translate-y-20"
          >
            {heading}
          </h1>

          <div className="flex flex-wrap items-end gap-5">
            {links.map(({ label, icon }) => (
              <p
                key={label}
                className="hs-link text-blue-500 hover:underline cursor-pointer flex items-center text-xl opacity-0 translate-y-20"
              >
                {label}
                {icon ? LINK_ICONS[icon] : null}
              </p>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <VideoCarousel slides={slides} videoOffsets={videoOffsets} />
      </div>
    </section>
  );
};