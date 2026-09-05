import { useEffect, useRef } from 'react';

export function SparkEffect({
  selector = '#sparks',
  amount = 5000,
  speed = 0.05,
  lifetime = 200,
  direction = { x: -0.5, y: 1 },
  size = [2, 2],
  maxopacity = 1,
  color = '150, 150, 150',
  randColor = true,
  acceleration = [5, 40]
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const OPT = {
      selector,
      amount,
      speed: window.innerWidth < 520 ? 0.05 : speed,
      lifetime,
      direction,
      size,
      maxopacity,
      color: window.innerWidth < 520 ? '150, 150, 150' : color,
      randColor,
      acceleration
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let sparks = [];

    function setCanvasWidth() {
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
    }

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function Spark(x, y) {
      this.x = x;
      this.y = y;
      this.age = 0;
      this.acceleration = rand(OPT.acceleration[0], OPT.acceleration[1]);
      this.color = OPT.randColor
        ? `${rand(0, 255)},${rand(0, 255)},${rand(0, 255)}`
        : OPT.color;
      this.opacity = OPT.maxopacity - this.age / (OPT.lifetime * rand(1, 10));

      this.go = function () {
        this.x += OPT.speed * OPT.direction.x * this.acceleration / 2;
        this.y += OPT.speed * OPT.direction.y * this.acceleration / 2;
        this.opacity = OPT.maxopacity - ++this.age / OPT.lifetime;
      };
    }

    function addSpark() {
      let x = rand(-200, window.innerWidth + 200);
      let y = rand(-200, window.innerHeight + 200);
      sparks.push(new Spark(x, y));
    }

    function drawSpark(spark) {
      let x = spark.x,
        y = spark.y;
      spark.go();
      ctx.beginPath();
      ctx.fillStyle = `rgba(${spark.color}, ${spark.opacity})`;
      ctx.rect(x, y, OPT.size[0], OPT.size[1], 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
  ctx.fillStyle = 'rgba(255,255,255,0)'; // fully transparent "wipe"
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  sparks.forEach((spark, i, array) => {
    if (spark.opacity <= 0) {
      array.splice(i, 1);
    } else {
      drawSpark(spark);
    }
  });
  window.requestAnimationFrame(draw);
}


    function init() {
      setCanvasWidth();
      window.setInterval(() => {
        if (sparks.length < OPT.amount) {
          addSpark();
        }
      }, 1000 / OPT.amount);
      window.requestAnimationFrame(draw);
    }

    window.addEventListener('resize', setCanvasWidth);
    init();

    return () => {
      window.removeEventListener('resize', setCanvasWidth);
    };
  }, [selector, amount, speed, lifetime, direction, size, maxopacity, color, randColor, acceleration]);

  return (
    <>
      <canvas
  ref={canvasRef}
  id="sparks"
  style={{
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'transparent',
    pointerEvents: 'none', // optional: so it doesn’t block clicks
  }}
/>

    </>
  );
}