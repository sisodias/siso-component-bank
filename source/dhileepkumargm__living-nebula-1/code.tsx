import React, { useRef, useEffect } from 'react';

const LivingNebula = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let hue = 280;
    let time = 0;
    let animationFrameId;
    let mouse = { x: null, y: null };

    const simplex = new (function () {
      const F2 = 0.5 * (Math.sqrt(3.0) - 1.0),
        G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
      const grad3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
      ];
      const p = Array.from({ length: 256 }, () => Math.floor(Math.random() * 256));
      const perm = p.concat(p);

      this.noise = (xin, yin) => {
        let n0, n1, n2;
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s), j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t, Y0 = j - t;
        const x0 = xin - X0, y0 = yin - Y0;
        const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
        const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2, y2 = y0 - 1.0 + 2.0 * G2;
        const ii = i & 255, jj = j & 255;
        const gi0 = perm[ii + perm[jj]] % 12,
          gi1 = perm[ii + i1 + perm[jj + j1]] % 12,
          gi2 = perm[ii + 1 + perm[jj + 1]] % 12;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0);
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1);
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2);
        return 70.0 * (n0 + n1 + n2);
      };
    })();

    class Particle {
      constructor(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.vx = 0;
        this.vy = 0;
        this.speed = Math.random() * 0.5 + 0.2;
        this.size = Math.random() * 40 + 60;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
        this.hue = hue + Math.random() * 60 - 30;
      }

      update(time) {
        const angle = simplex.noise(this.x * 0.001, this.y * 0.001 + time * 0.0001) * Math.PI * 2;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;

        if (mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            this.vx += (dx / dist) * force * 1.5;
            this.vy += (dy / dist) * force * 1.5;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        this.life++;
        if (this.life >= this.maxLife) this.reset();
      }

      draw() {
        const opacity = 1 - this.life / this.maxLife;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${opacity * 0.2})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 70%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
        this.hue = hue + Math.random() * 60 - 30;
      }
    }

    const setup = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      const particleCount = Math.floor((width * height) / 20000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 8, 28, 0.1)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      particles.forEach((p) => {
        p.update(time);
        p.draw();
      });
      ctx.globalCompositeOperation = 'source-over';
      hue += 0.3;
      time++;
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    setup();
    animate();
    window.addEventListener('resize', setup);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', setup);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div>
      <div className="content">
        <h1>Living Nebula</h1>
        <p>An interactive, ethereal cloud that responds to your touch.</p>
      </div>
      <canvas ref={canvasRef} id="aurora-canvas-nebula"></canvas>
    </div>
  );
};

export default LivingNebula;
