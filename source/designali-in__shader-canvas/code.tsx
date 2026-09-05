import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

const ShaderCanvas = ({ width = '100vw', height = '100vh' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let glea = null;
    let animationFrameId = null;

    const init = async () => {
      const { default: GLea } = await import('https://esm.sh/glea');

      const frag = `
        precision mediump float;
        uniform float time;
        uniform float width;
        uniform float height;
        vec2 R(vec2 p,float a) {
          return vec2( p.x*cos(a) + p.y*sin(a),
              -p.x*sin(a) + p.y*cos(a));
        }
        void main() {
          vec2 resolution = vec2(width, height);
          float vc = time / 50.0;
          float vt = 1000.0 + sin(sin(time/16.0)*2.0*3.1415927) * 7000.0;
          float vr = time / 20.0;
          vec2 c0 = (gl_FragCoord.xy / resolution) - vec2(0.5 + cos(time*0.3) * sin(time * 0.1) * 0.3, 0.5 + sin(time*0.3) * sin(time * 0.2) * 0.3);
          vec2 c = -R(c0, vr)*8.0;
          float val = 0.5 + sin((((vt - c.x - c.y) / 2.0)*(0.5+c.x)*(c.y+0.5) + vt+ c.x + c.y)/500.0);
          gl_FragColor = vec4(vec3(val* (0.2+sin(sin(1.0+vc)* 10.0 *c.x*c.y)*0.8), val * (0.3+cos(2.0 + c.x*c.y*sin(vc)* 10.0 )*0.7), val * (0.3+cos(1.0 + c.x*c.y *sin(vc)* 10.0))*0.7), 1.0);
        }
      `;

      const vert = `
        attribute vec3 pos;
        void main() {
          gl_Position=vec4(pos, 1.0);
        }
      `;

      glea = new GLea({
        shaders: [
          GLea.fragmentShader(frag),
          GLea.vertexShader(vert)
        ],
        buffers: {
          'pos': GLea.buffer(2, [1, 1, -1, 1, 1, -1, -1, -1])
        }
      }).create();

      const canvas = canvasRef.current;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const loop = (time) => {
        const { gl } = glea;
        glea.clear();
        glea.uni('width', glea.width);
        glea.uni('height', glea.height);
        glea.uni('time', time * 0.001);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationFrameId = requestAnimationFrame(loop);
      };

      const setup = () => {
        const { gl } = glea;
        window.addEventListener('resize', () => {
          glea.resize();
        });
        loop(0);
      };

      setup();

      return () => {
        window.removeEventListener('resize', glea.resize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
    };

    init();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="a"
      style={{ width, height }}
    />
  );
};

export { ShaderCanvas }