import React, { useRef, useEffect } from "react";

const LivingVineBackground = ({
  children,
  vineColor = "rgba(45, 255, 190, 0.8)",
  branchColor = "rgba(45, 255, 190, 0.6)",
  maxBranchLength = 50,
  className = "",
}) => {
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pathHistoryRef = useRef([]);
  const branchesRef = useRef([]);

  useEffect(() => {
    let destroyed = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Branch {
      constructor(x, y) {
        this.points = [{ x, y }];
        this.life = 1;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 1.5 + 0.5;
        this.length = 0;
      }
      update() {
        if (this.length >= maxBranchLength) {
          this.life -= 0.02;
          return;
        }
        this.angle += (Math.random() - 0.5) * 0.2;
        const last = this.points[this.points.length - 1];
        const newX = last.x + Math.cos(this.angle) * this.speed;
        const newY = last.y + Math.sin(this.angle) * this.speed;
        this.points.push({ x: newX, y: newY });
        this.length++;
      }
      draw() {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.strokeStyle = `rgba(45, 255, 190, ${this.life * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      pathHistoryRef.current.push({ ...mousePosRef.current });
      if (pathHistoryRef.current.length > 100) pathHistoryRef.current.shift();
      if (Math.random() > 0.95) {
        branchesRef.current.push(new Branch(e.clientX, e.clientY));
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      if (destroyed) return;
      ctx.fillStyle = "rgba(0, 5, 10, 0.1)";
      ctx.fillRect(0, 0, width, height);

      if (pathHistoryRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pathHistoryRef.current[0].x, pathHistoryRef.current[0].y);
        for (let i = 1; i < pathHistoryRef.current.length; i++) {
          ctx.lineTo(pathHistoryRef.current[i].x, pathHistoryRef.current[i].y);
        }
        ctx.strokeStyle = vineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      branchesRef.current = branchesRef.current.filter((b) => b.life > 0);
      for (const branch of branchesRef.current) {
        branch.update();
        branch.draw();
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
  }, [vineColor, branchColor, maxBranchLength]);

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden bg-black ${className}`}
      style={{ backgroundColor: "#00050a" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full z-0" />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default LivingVineBackground;
