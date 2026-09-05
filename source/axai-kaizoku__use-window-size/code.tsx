import { cn } from "@/lib/utils";
import { useState,useEffect } from "react";

export const useWindowSize = () => {
   const isClient = typeof window === "object"

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    }
  }

  const [windowSize, setWindowSize] = useState(getSize)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!isClient) return

    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return windowSize
};
