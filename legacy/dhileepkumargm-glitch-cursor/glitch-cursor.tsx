import React, { useEffect, useRef } from "react";

const GlitchCursor = ({
  title = "Glitch Field",
  subtitle = "Corrupting the digital space",
  caption = "Click to fracture reality",
  glitchBlockColor = "rgba(0, 255, 255, 0.7)",
  scanlineColor = "rgba(255, 255, 255, 0.1)",
  titleSize = "text-5xl md:text-7xl lg:text-8xl",
  subtitleSize = "text-xl md:text-2xl",
  captionSize = "text-sm md:text-base",
  className = "",
}) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const glitchBlocks = useRef([]);
  const scanlines = useRef([]);

  class GlitchBlock {
    constructor(x, y, context) {
      this.x = x + (Math.random() - 0.5) * 50;
      this.y = y + (Math.random() - 0.5) * 50;
      this.width = Math.random() * 50 + 10;
      this.height = Math.random() * 30 + 5;
      this.life = 100;
      this.context = context;
      this.color = `hsla(${180 + Math.random() * 60}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`;
    }

    draw() {
      this.context.fillStyle = this.color;
      this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
      this.life -= 1;
      this.x += (Math.random() - 0.5) * 4;
      this.y += (Math.random() - 0.5) * 4;
    }
  }

  class Scanline {
    constructor(y, height, speed, context, canvasWidth) {
      this.y = y;
      this.height = height;
      this.speed = speed;
      this.life = 15;
      this.context = context;
      this.canvasWidth = canvasWidth;
      this.offsetX = (Math.random() - 0.5) * 100;
    }

    draw() {
      const imageData = this.context.getImageData(0, this.y, this.canvasWidth, this.height);
      this.context.putImageData(imageData, this.offsetX, this.y);
      this.context.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.05)`;
      this.context.fillRect(0, this.y, this.canvasWidth, this.height);
    }

    update() {
      this.life -= 1;
      this.y += this.speed;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      glitchBlocks.current.forEach((block, i) => {
        block.update();
        block.draw();
        if (block.life <= 0) glitchBlocks.current.splice(i, 1);
      });

      scanlines.current.forEach((line, i) => {
        line.update();
        line.draw();
        if (line.life <= 0) scanlines.current.splice(i, 1);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (Math.random() > 0.5) {
        glitchBlocks.current.push(new GlitchBlock(e.clientX, e.clientY, ctx));
      }
    };

    const handleClick = () => {
      for (let i = 0; i < 20; i++) {
        scanlines.current.push(
          new Scanline(
            Math.random() * canvas.height,
            Math.random() * 10 + 1,
            (Math.random() - 0.5) * 4,
            ctx,
            canvas.width
          )
        );
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className={`relative h-screen w-screen overflow-hidden bg-black font-mono ${className}`}>
      <canvas ref={canvasRef} className="fixed inset-0 block h-full w-full" />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 select-none text-center p-4">
        <h1
          className={`m-0 p-0 text-cyan-300 font-bold uppercase tracking-widest leading-none ${titleSize}`}
          style={{ textShadow: "2px 2px 0px #ff00ff, -2px -2px 0px #00ffff" }}
        >
          {title}
        </h1>
        <h2
          className={`m-0 p-0 text-gray-300 font-normal leading-none ${subtitleSize}`}
          style={{ textShadow: "1px 1px 0px #ff00ff, -1px -1px 0px #00ffff" }}
        >
          {subtitle}
        </h2>
        <p className={`mt-4 p-0 text-gray-400 font-light leading-none ${captionSize}`}>
          {caption}
        </p>
      </div>
    </div>
  );
};

export default GlitchCursor;
