import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Reworked shader: LIC-style streak integration along a curl-noise flow,
// wide ribbons + fine ribs, DOF-aware sparkles, ACES-ish tonemapping.
const fragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;

  // Camera/controls
  uniform float uSpeed, uRadius, uFov, uMouseInfluence, uAutoRotateSpeed;

  // Flow field and bands
  uniform float uScale, uCurlStrength, uWarpStrength;
  uniform float uStripeFreq, uStripeSharp;
  uniform float uRibbonFreq, uRibbonWidth;

  // LIC streaks
  uniform float uStreakSteps;  // iteration count (float, but used as int)
  uniform float uStreakStep;   // step distance in flow space
  uniform float uStreakAtten;  // exp attenuation along offsets

  // Sparkles
  uniform float uSparkDensity, uSparkSize, uSparkSizeNear, uSparkTwinkle;

  // DOF
  uniform float uFocusDist, uAperture, uNearBoost;

  // Colors
  uniform vec3  uBaseColor, uRibbonA, uRibbonB, uSparkleTint;

  // Post
  uniform float uExposure, uGamma, uGrainAmount, uVignette;

  const float PI = 3.141592653589793;

  // Hashes / noise ------------------------------------------------------------
  float hash21(vec2 p){
    p = fract(p*vec2(123.34, 345.45));
    p += dot(p, p+34.45);
    return fract(p.x*p.y);
  }
  vec2 hash22(vec2 p){
    float n = sin(dot(p, vec2(41.0, 289.0)));
    return fract(vec2(262144.0, 32768.0)*n);
  }

  float noise2(vec2 x){
    vec2 i=floor(x), f=fract(x);
    f=f*f*(3.0-2.0*f);
    float a=hash21(i+vec2(0,0));
    float b=hash21(i+vec2(1,0));
    float c=hash21(i+vec2(0,1));
    float d=hash21(i+vec2(1,1));
    float u=mix(a,b,f.x);
    float v=mix(c,d,f.x);
    return mix(u,v,f.y);
  }

  float fbm2(vec2 p){
    float v=0.0, a=0.5;
    for(int i=0;i<5;i++){
      v += a*(noise2(p)*2.0-1.0);
      p = p*2.03 + 17.1;
      a *= 0.5;
    }
    return v;
  }

  // Curl direction from scalar field (normalized)
  vec2 curl2(vec2 p){
    float e=0.001;
    float n1=fbm2(p + vec2(0.0,e));
    float n2=fbm2(p - vec2(0.0,e));
    float n3=fbm2(p + vec2(e,0.0));
    float n4=fbm2(p - vec2(e,0.0));
    float dx=(n1-n2)/(2.0*e);
    float dy=(n3-n4)/(2.0*e);
    vec2 v = vec2(dy,-dx);
    float l = length(v);
    return (l>1e-6) ? v/l : vec2(1.0,0.0);
  }

  mat2 rot2(float a){ float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }

  // Fine ribs along flow (thin periodic lines)
  float ribResponse(float s, float freq, float sharp){
    float w = abs(sin(s*freq));        // 0..1 peaks at multiples of pi
    return pow(1.0 - w, sharp);        // sharp inverted peaks
  }

  // Broad luminous ribbons (saw/box-like)
  float ribbonResponse(float s, float freq, float width){
    float t = fract(s*freq);
    float d = abs(t - 0.5);
    return smoothstep(width, 0.0, d);
  }

  // Sample the base field at flow-space position x (scalar s along dir)
  vec3 sampleBands(vec2 x, vec2 dir, float s, float t){
    float ribs   = ribResponse(s + 0.3*sin(0.2*t + s*0.15), uStripeFreq, uStripeSharp);
    float ribbon = ribbonResponse(s + 0.07*fbm2(x*1.2 + 3.7), uRibbonFreq, uRibbonWidth);

    // Color variation across ribbons
    vec3 ribCol    = mix(uRibbonB, uRibbonA, 0.5 + 0.5*sin(s*0.4));
    vec3 ribbonCol = mix(uRibbonA, uRibbonB, 0.5 + 0.5*sin(s*0.15 + 1.3));

    // Subtle cross-bleed factor based on flow curvature
    float curve = fbm2(x*0.7 + vec2(0.0, t*0.2));
    vec3 base = uBaseColor + 0.2*ribbon*ribbonCol + 0.2*ribCol + 0.15*curve*(uRibbonA+uRibbonB);

    return base;
  }

  // DOF-aware sparkles using three interleaved rotated grids (blue-noise-ish)
  float sparkleMulti(vec2 p, vec2 basisX, float t, float cocPx, float density, float twinkle){
    vec2 basisY = vec2(-basisX.y, basisX.x);
    mat2 B = mat2(basisX.x, basisY.x, basisX.y, basisY.y);
    vec2 uv = B * p;

    float cells = 0.7 + density*0.6;
    float acc = 0.0;

    for(int k=0;k<3;k++){
      float angle = float(k)*2.0943951; // 120-degree rotations
      mat2 R = rot2(angle);
      vec2 uvr = R * uv;

      vec2 g = floor(uvr * cells);
      vec2 f = fract(uvr * cells);
      vec2 rnd = hash22(g + float(k)*13.37);
      vec2 star = (rnd + 0.5*(hash22(g+vec2(7.7,2.2)) - 0.5));
      vec2 d = f - star;

      float size = mix(0.4, 1.0, rnd.y) * cocPx;
      float dist2 = dot(d,d) / max(1e-4, size*size);
      float core = exp(-dist2);

      float phase = rnd.x*6.28318 + t*(0.6 + rnd.y*1.7);
      float flick = mix(0.55, 1.0, smoothstep(0.6, 1.0, sin(phase)*0.5+0.5));
      acc += core * flick;
    }

    return acc * (twinkle/2.0);
  }

  // ACES-ish tonemap
  vec3 tonemapACES(vec3 x){
    // Narkowicz ACES approximation
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
  }

  void main(){
    float t = uTime * uSpeed;

    // Screen coords
    vec2 uv = (gl_FragCoord.xy - 0.5*uResolution.xy) / uResolution.y;

    // Orbit camera
    float az = t*uAutoRotateSpeed + (uMouse.x*2.0-1.0)*PI*0.25*uMouseInfluence;
    float el = (uMouse.y*2.0-1.0)*0.18*uMouseInfluence;

    vec3 ro = vec3(cos(az)*cos(el), 0.55 + 0.12*sin(t*0.2), sin(az)*cos(el)) * uRadius;
    vec3 ta = vec3(0.0);
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(vec3(0.0,1.0,0.0), ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(uv.x*uu + uv.y*vv + uFov*ww);

    // Intersect plane y=0
    vec3 col = uBaseColor;
    float denom = rd.y;
    if(denom < -1e-4){
      float tHit = -ro.y / denom;
      vec3 hit = ro + rd * tHit;
      vec2 p = hit.xz;

      // Flow coordinates
      vec2 q = p * uScale;
      q += uWarpStrength * vec2(fbm2(q + vec2(0.0, t*0.2)),
                                fbm2(q + vec2(5.2, -t*0.2)));
      vec2 flow = curl2(q + t*0.12) * uCurlStrength;
      vec2 dir  = normalize(flow + vec2(1.0, 0.0)); // default bias

      // Flow scalar coordinate along dir (for ribs/ribbons)
      float s0 = dot(q, dir);

      // DOF circle-of-confusion
      float focus = uFocusDist;
      float coc = clamp(abs(tHit - focus) * uAperture / max(1.0, focus), 0.0, 1.5);
      float cocPx = mix(uSparkSize, uSparkSizeNear, smoothstep(0.0, 1.0, coc));

      // LIC-style integration: sample along +/- dir with exponential weights
      vec3 acc = vec3(0.0);
      float wsum = 0.0;
      float stepMul = mix(1.0, 2.0, clamp(coc, 0.0, 1.0)); // out-of-focus => wider integration
      const int MAXI = 64;
      for(int i=0; i<MAXI; i++){
        if(float(i) >= uStreakSteps) break;
        float ofs = (float(i) - 0.5*(uStreakSteps-1.0)) * (uStreakStep * stepMul);
        vec2 xp = q + dir * ofs;
        float s  = s0 + ofs; // slide the pattern along dir
        float w  = exp(-abs(ofs) * uStreakAtten);
        acc     += sampleBands(xp, dir, s, t) * w;
        wsum    += w;
      }
      acc /= max(1e-4, wsum);

      // Sparkles aligned to flow, modulated by ribbons/ribs intensity
      float ribbonMask = ribbonResponse(s0, uRibbonFreq, uRibbonWidth);
      float ribMask    = ribResponse(s0, uStripeFreq, uStripeSharp);
      float band = clamp(0.7*ribbonMask + 0.6*ribMask, 0.0, 1.0);

      float sparks = sparkleMulti(q + t*0.1*dir, dir, t, cocPx, uSparkDensity, uSparkTwinkle);
      col = acc + band * sparks * uSparkleTint * (1.0 + uNearBoost * coc);
    }

    // Vignette
    float vig = 1.0 - uVignette * length(uv);
    col *= clamp(vig, 0.0, 1.0);

    // Film grain
    float g = (hash21(gl_FragCoord.xy + fract(t*123.45)) - 0.5) * uGrainAmount;
    col += g;

    // Tone map + gamma
    col *= uExposure;
    col = tonemapACES(col);
    col = pow(col, vec3(1.0/uGamma));

    gl_FragColor = vec4(col, 1.0);
  }
`

function AuroraFlowShader({
  // Motion
  speed = 0.2,
  autoRotateSpeed = 0.012,
  mouseInfluence = 0.45,

  // Camera
  cameraRadius = 3.8,
  fov = 1.6,

  // Flow field
  scale = 0.42,
  curlStrength = 1.1,
  warpStrength = 0.75,

  // Bands
  stripeFreq = 28.0,
  stripeSharp = 4.0,
  ribbonFreq = 3.0,
  ribbonWidth = 0.55,

  // Streak integration
  streakSteps = 28,
  streakStep = 0.042,
  streakAtten = 0.85,

  // Sparkles
  sparkDensity = 1.4,
  sparkSize = 0.022,
  sparkSizeNear = 0.16,
  sparkTwinkle = 0.55,

  // DOF
  focusDist = 6.0,
  aperture = 0.8,
  nearBoost = 1.25,

  // Colors
  baseColor = [0.035, 0.04, 0.07],
  ribbonA = [0.38, 1.0, 0.86],
  ribbonB = [0.60, 0.72, 1.0],
  sparkleTint = [0.95, 1.0, 1.0],

  // Post
  exposure = 1.05,
  gamma = 2.0,
  grainAmount = 0.03,
  vignette = 0.32,

  // Interaction
  pointerSmoothing = 0.18,

  ...meshProps
}) {
  const mat = useRef()
  const { size, gl, pointer } = useThree()
  const tmpV2 = useMemo(() => new THREE.Vector2(), [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },

    uSpeed: { value: speed },
    uRadius: { value: cameraRadius },
    uFov: { value: fov },
    uMouseInfluence: { value: mouseInfluence },
    uAutoRotateSpeed: { value: autoRotateSpeed },

    uScale: { value: scale },
    uCurlStrength: { value: curlStrength },
    uWarpStrength: { value: warpStrength },
    uStripeFreq: { value: stripeFreq },
    uStripeSharp: { value: stripeSharp },
    uRibbonFreq: { value: ribbonFreq },
    uRibbonWidth: { value: ribbonWidth },

    uStreakSteps: { value: streakSteps },
    uStreakStep: { value: streakStep },
    uStreakAtten: { value: streakAtten },

    uSparkDensity: { value: sparkDensity },
    uSparkSize: { value: sparkSize },
    uSparkSizeNear: { value: sparkSizeNear },
    uSparkTwinkle: { value: sparkTwinkle },

    uFocusDist: { value: focusDist },
    uAperture: { value: aperture },
    uNearBoost: { value: nearBoost },

    uBaseColor: { value: new THREE.Vector3().fromArray(baseColor) },
    uRibbonA: { value: new THREE.Vector3().fromArray(ribbonA) },
    uRibbonB: { value: new THREE.Vector3().fromArray(ribbonB) },
    uSparkleTint: { value: new THREE.Vector3().fromArray(sparkleTint) },

    uExposure: { value: exposure },
    uGamma: { value: gamma },
    uGrainAmount: { value: grainAmount },
    uVignette: { value: vignette }
  }), [])

  // Sync props -> uniforms
  useEffect(()=>{ uniforms.uSpeed.value = speed }, [speed])
  useEffect(()=>{ uniforms.uRadius.value = cameraRadius }, [cameraRadius])
  useEffect(()=>{ uniforms.uFov.value = fov }, [fov])
  useEffect(()=>{ uniforms.uMouseInfluence.value = mouseInfluence }, [mouseInfluence])
  useEffect(()=>{ uniforms.uAutoRotateSpeed.value = autoRotateSpeed }, [autoRotateSpeed])

  useEffect(()=>{ uniforms.uScale.value = scale }, [scale])
  useEffect(()=>{ uniforms.uCurlStrength.value = curlStrength }, [curlStrength])
  useEffect(()=>{ uniforms.uWarpStrength.value = warpStrength }, [warpStrength])
  useEffect(()=>{ uniforms.uStripeFreq.value = stripeFreq }, [stripeFreq])
  useEffect(()=>{ uniforms.uStripeSharp.value = stripeSharp }, [stripeSharp])
  useEffect(()=>{ uniforms.uRibbonFreq.value = ribbonFreq }, [ribbonFreq])
  useEffect(()=>{ uniforms.uRibbonWidth.value = ribbonWidth }, [ribbonWidth])

  useEffect(()=>{ uniforms.uStreakSteps.value = streakSteps }, [streakSteps])
  useEffect(()=>{ uniforms.uStreakStep.value = streakStep }, [streakStep])
  useEffect(()=>{ uniforms.uStreakAtten.value = streakAtten }, [streakAtten])

  useEffect(()=>{ uniforms.uSparkDensity.value = sparkDensity }, [sparkDensity])
  useEffect(()=>{ uniforms.uSparkSize.value = sparkSize }, [sparkSize])
  useEffect(()=>{ uniforms.uSparkSizeNear.value = sparkSizeNear }, [sparkSizeNear])
  useEffect(()=>{ uniforms.uSparkTwinkle.value = sparkTwinkle }, [sparkTwinkle])

  useEffect(()=>{ uniforms.uFocusDist.value = focusDist }, [focusDist])
  useEffect(()=>{ uniforms.uAperture.value = aperture }, [aperture])
  useEffect(()=>{ uniforms.uNearBoost.value = nearBoost }, [nearBoost])

  useEffect(()=>{ uniforms.uBaseColor.value.fromArray(baseColor) }, [baseColor])
  useEffect(()=>{ uniforms.uRibbonA.value.fromArray(ribbonA) }, [ribbonA])
  useEffect(()=>{ uniforms.uRibbonB.value.fromArray(ribbonB) }, [ribbonB])
  useEffect(()=>{ uniforms.uSparkleTint.value.fromArray(sparkleTint) }, [sparkleTint])

  useEffect(()=>{ uniforms.uExposure.value = exposure }, [exposure])
  useEffect(()=>{ uniforms.uGamma.value = gamma }, [gamma])
  useEffect(()=>{ uniforms.uGrainAmount.value = grainAmount }, [grainAmount])
  useEffect(()=>{ uniforms.uVignette.value = vignette }, [vignette])

  useFrame((state) => {
    const dpr = gl.getPixelRatio()
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uResolution.value.set(size.width * dpr, size.height * dpr)
    const mx = 0.5 + state.pointer.x * 0.5
    const my = 0.5 + state.pointer.y * 0.5
    uniforms.uMouse.value.lerp(tmpV2.set(mx, my), pointerSmoothing)
  })

  return (
    <mesh frustumCulled={false} {...meshProps}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function AuroraHeroSection({
  // Canvas
  dpr = [1, 2],
  gl = { antialias: true },
  className = 'fixed bg-black',

  // Heading + CTAs
  title = 'NEBULA RIBBONS',
  subtitle,
  primaryLabel = 'Get Started',
  primaryHref = '#',
  onPrimaryClick,
  secondaryLabel = 'GitHub',
  secondaryHref = '#',
  onSecondaryClick,
  headingClassName = '',
  subtitleClassName = '',
  ctaClassName = '',

  // Forwarded shader props
  ...shaderProps
}) {
  return (
    <section className={`${className} relative`}>
      <Canvas dpr={dpr} gl={gl} className="w-full h-full touch-none">
        <AuroraFlowShader {...shaderProps} />
      </Canvas>

      {/* Overlay content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center pt-8 sm:pt-12 pointer-events-none">
        <div className="text-center">
          <h1
            className={[
              'select-none font-extrabold uppercase tracking-[0.28em]',
              'text-2xl sm:text-4xl md:text-6xl',
              'bg-gradient-to-r from-teal-200 via-cyan-200 to-indigo-200',
              'bg-clip-text text-transparent',
              'drop-shadow-[0_8px_32px_rgba(64,128,255,0.35)]',
              headingClassName,
            ].join(' ')}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={[
                'mt-2 text-xs sm:text-sm md:text-base tracking-widest',
                'text-slate-200/75 drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]',
                subtitleClassName,
              ].join(' ')}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* CTA buttons */}
        <div className="mt-5 sm:mt-7 pointer-events-auto">
          <div className={['flex items-center gap-3 sm:gap-4', ctaClassName].join(' ')}>
            <a
              href={primaryHref}
              onClick={onPrimaryClick}
              className={[
                'inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-2 sm:py-2.5',
                'text-black font-semibold text-sm sm:text-base',
                'bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300',
                'shadow-[0_10px_40px_rgba(56,189,248,0.35)] hover:shadow-[0_12px_48px_rgba(56,189,248,0.45)]',
                'hover:brightness-105 transition',
              ].join(' ')}
            >
              {primaryLabel}
            </a>
            <a
              href={secondaryHref}
              onClick={onSecondaryClick}
              className={[
                'inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-2 sm:py-2.5',
                'text-slate-100 font-semibold text-sm sm:text-base',
                'bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur',
                'transition',
              ].join(' ')}
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export { AuroraFlowShader }