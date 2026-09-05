import React, { useRef, useEffect } from "react";

const CrystalTrailBackground = ({
  children,
  crystalColor = "rgba(180, 120, 255, 0.8)",
  maxCrystals = 500,
  className = "",
}) => {
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const crystalsRef = useRef([]);

  useEffect(() => {
    let destroyed = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Crystal {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1;
        this.size = Math.random() * 8 + 4;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.1;
        this.vertices = [];
        const numVertices = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < numVertices; i++) {
          const angle = (i / numVertices) * Math.PI * 2;
          const radius = Math.random() * this.size + this.size / 2;
          this.vertices.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          });
        }
      }
      update() {
        this.life -= 0.01;
        this.angle += this.spin;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
          ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(180, 120, 255, ${this.life * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = `rgba(180, 120, 255, ${this.life * 0.1})`;
        ctx.fill();
        ctx.restore();
      }
    }

    let lastMousePos = { x: width / 2, y: height / 2 };
    const handleMouseMove = (event) => {
      const currentMousePos = { x: event.clientX, y: event.clientY };
      const speed = Math.hypot(
        currentMousePos.x - lastMousePos.x,
        currentMousePos.y - lastMousePos.y
      );
      const crystalsToSpawn = Math.min(Math.floor(speed / 5), 5);

      for (let i = 0; i < crystalsToSpawn; i++) {
        if (crystalsRef.current.length < maxCrystals) {
          crystalsRef.current.push(new Crystal(event.clientX, event.clientY));
        }
      }
      lastMousePos = currentMousePos;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      if (destroyed) return;
      ctx.fillStyle = "rgba(10, 5, 20, 0.15)";
      ctx.fillRect(0, 0, width, height);

      crystalsRef.current = crystalsRef.current.filter((c) => c.life > 0);
      for (const crystal of crystalsRef.current) {
        crystal.update();
        crystal.draw();
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      destroyed = true;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [crystalColor, maxCrystals]);

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden bg-black ${className}`}
      style={{ backgroundColor: "#0a0514" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full z-0" />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default CrystalTrailBackground;
