'use client';

import React, { useEffect, useRef } from 'react';

export type SecondsMode = 'smooth' | 'tick1' | 'tick2' | 'highFreq';

const BERLIN_TIMEZONE = 'Europe/Berlin';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function GlassClock(): React.ReactElement {
  const hourMarksRef = useRef<HTMLDivElement>(null);
  const glossyOverlayRef = useRef<HTMLDivElement>(null);
  const reflectionOverlayRef = useRef<HTMLDivElement>(null);
  const hourHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const secondHandContainerRef = useRef<HTMLDivElement>(null);
  const secondHandShadowRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const timezoneRef = useRef<HTMLDivElement>(null);
  const tweakpaneContainerRef = useRef<HTMLDivElement>(null);
  const glassEdgeShadowRef = useRef<HTMLDivElement>(null);
  const glassDarkEdgeRef = useRef<HTMLDivElement>(null);
  const glassEffectShadowRef = useRef<HTMLDivElement>(null);

  const requestAnimationRef = useRef<number | null>(null);
  const hourMinuteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  useEffect(() => {
    const rootStyle = document.documentElement.style;

    const setInitialVariables = () => {
      rootStyle.setProperty('--primary-light-angle', '-45deg');
      rootStyle.setProperty('--dark-edge-angle', '135deg');
      rootStyle.setProperty('--minute-marker-opacity', '1');
      rootStyle.setProperty('--inner-shadow-opacity', '0.15');
      rootStyle.setProperty('--outer-shadow-opacity', '1');
      rootStyle.setProperty('--reflection-opacity', '0.5');
      rootStyle.setProperty('--glossy-opacity', '0.3');
      rootStyle.setProperty('--hour-number-opacity', '1');
      rootStyle.setProperty('--hour-number-color', 'rgba(50, 50, 50, 0.9)');
      rootStyle.setProperty('--minute-marker-color', 'rgba(80, 80, 80, 0.5)');
      rootStyle.setProperty('--hand-color', 'rgba(50, 50, 50, 0.9)');
      rootStyle.setProperty('--second-hand-color', 'rgba(255, 107, 0, 1)');
      rootStyle.setProperty('--shadow-layer1-opacity', '0.1');
      rootStyle.setProperty('--shadow-layer2-opacity', '0.1');
      rootStyle.setProperty('--shadow-layer3-opacity', '0.1');
    };

    const clearHourMarks = () => {
      const container = hourMarksRef.current;
      if (container) {
        container.replaceChildren();
      }
    };

    const createHourMarks = () => {
      const container = hourMarksRef.current;
      if (!container) {
        return;
      }

      clearHourMarks();

      for (let i = 0; i < 60; i += 1) {
        if (i % 5 === 0) {
          const hourIndex = i / 5;
          const hourNumber = document.createElement('div');
          hourNumber.className = 'clock-number';
          const angle = (i * 6 * Math.PI) / 180;
          const radius = 145;
          const left = 175 + Math.sin(angle) * radius - 15;
          const top = 175 - Math.cos(angle) * radius - 10;
          hourNumber.style.left = `${left}px`;
          hourNumber.style.top = `${top}px`;
          hourNumber.textContent = hourIndex === 0 ? '12' : hourIndex.toString();
          container.appendChild(hourNumber);
        } else {
          const minuteMarker = document.createElement('div');
          minuteMarker.className = 'minute-marker';
          minuteMarker.style.transform = `rotate(${i * 6}deg)`;
          container.appendChild(minuteMarker);
        }
      }
    };

    const updateHourAndMinuteHands = () => {
      const now = new Date();
      const berlinString = now.toLocaleString('en-US', {
        timeZone: BERLIN_TIMEZONE,
      });
      const berlinTime = new Date(berlinString);
      const hours = berlinTime.getHours() % 12;
      const minutes = berlinTime.getMinutes();
      const minutesDegrees = minutes * 6;
      const hoursDegrees = hours * 30 + (minutes / 60) * 30;

      if (hourHandRef.current) {
        hourHandRef.current.style.transform = `rotate(${hoursDegrees}deg)`;
      }

      if (minuteHandRef.current) {
        minuteHandRef.current.style.transform = `rotate(${minutesDegrees}deg)`;
      }

      if (dateRef.current) {
        const month = MONTH_NAMES[berlinTime.getMonth()];
        const day = berlinTime.getDate();
        dateRef.current.textContent = `${month} ${day}`;
      }

      if (timezoneRef.current) {
        timezoneRef.current.textContent = 'Berlin';
      }

      if (hourMinuteTimeoutRef.current) {
        clearTimeout(hourMinuteTimeoutRef.current);
      }

      const millisecondsUntilNextMinute =
        (60 - berlinTime.getSeconds()) * 1000 - berlinTime.getMilliseconds();

      hourMinuteTimeoutRef.current = window.setTimeout(
        updateHourAndMinuteHands,
        Math.max(millisecondsUntilNextMinute, 0),
      );
    };

    const applySecondHandRotation = (angle: number) => {
      if (secondHandContainerRef.current) {
        secondHandContainerRef.current.style.transition = 'none';
        secondHandContainerRef.current.style.transform = `rotate(${angle}deg)`;
      }

      if (secondHandShadowRef.current) {
        secondHandShadowRef.current.style.transition = 'none';
        secondHandShadowRef.current.style.transform = `rotate(${angle + 0.5}deg)`;
      }
    };

    const cancelSecondHandAnimation = () => {
      if (requestAnimationRef.current !== null) {
        cancelAnimationFrame(requestAnimationRef.current);
        requestAnimationRef.current = null;
      }
    };

    const startSmoothSecondHand = () => {
      cancelSecondHandAnimation();

      const animate = () => {
        const now = new Date();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();
        const angle = seconds * 6 + (milliseconds / 1000) * 6;
        applySecondHandRotation(angle);
        requestAnimationRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    const startTickSecondHand = (ticksPerSecond: number) => {
      cancelSecondHandAnimation();

      const animate = () => {
        const now = new Date();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();
        const timeInMilliseconds = seconds * 1000 + milliseconds;
        const tickLength = 1000 / ticksPerSecond;
        const totalTicks = ticksPerSecond * 60;
        const tickIndex = Math.floor(timeInMilliseconds / tickLength) % totalTicks;
        const angle = tickIndex * (360 / totalTicks);
        applySecondHandRotation(angle);
        requestAnimationRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    const startSecondsAnimation = (mode: SecondsMode) => {
      switch (mode) {
        case 'tick1':
          startTickSecondHand(1);
          break;
        case 'tick2':
          startTickSecondHand(2);
          break;
        case 'highFreq':
          startTickSecondHand(8);
          break;
        case 'smooth':
        default:
          startSmoothSecondHand();
          break;
      }
    };

    const initializeOverlays = () => {
      if (glossyOverlayRef.current) {
        glossyOverlayRef.current.style.background = `linear-gradient(135deg,
          rgba(255, 255, 255, 0.9) 0%,
          rgba(255, 255, 255, 0.7) 15%,
          rgba(255, 255, 255, 0.5) 25%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0.2) 75%,
          rgba(255, 255, 255, 0.1) 100%)`;
        glossyOverlayRef.current.style.filter = 'blur(10px)';
      }

      if (reflectionOverlayRef.current) {
        reflectionOverlayRef.current.style.transform = 'rotate(-15deg)';
        reflectionOverlayRef.current.style.filter = 'blur(10px)';
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'h' || event.key === 'H') {
        const container = tweakpaneContainerRef.current;
        if (!container) {
          return;
        }

        container.style.display =
          container.style.display === 'none' || container.style.display === ''
            ? 'block'
            : 'none';
      }
    };

    setInitialVariables();
    createHourMarks();
    initializeOverlays();
    updateHourAndMinuteHands();
    startSecondsAnimation('smooth');
    document.addEventListener('keydown', handleKeydown);

    type PaneApi = {
      dispose: () => void;
      refresh: () => void;
      addFolder: (...args: unknown[]) => any;
      addBinding: (...args: unknown[]) => any;
      addButton: (...args: unknown[]) => any;
    };

    let paneInstance: PaneApi | null = null;

    const initializeTweakpane = async () => {
      if (!tweakpaneContainerRef.current) {
        return;
      }

      try {
        const tweakpaneModule = await import('tweakpane');
        const { Pane } = tweakpaneModule as {
          Pane: new (...args: any[]) => PaneApi;
        };
        const container = tweakpaneContainerRef.current;

        paneInstance = new Pane({
          container,
          title: 'Clock Settings',
        });

        const params = {
          minuteMarkerOpacity: 1,
          innerShadowOpacity: 0.15,
          reflectionOpacity: 0.5,
          glossyOpacity: 0.3,
          showNumbers: true,
          hourNumberColor: 'rgba(50, 50, 50, 0.9)',
          minuteMarkerColor: 'rgba(80, 80, 80, 0.5)',
          handColor: 'rgba(50, 50, 50, 0.9)',
          secondHandColor: 'rgba(255, 107, 0, 1)',
          shadowLayer1: 0.1,
          shadowLayer2: 0.1,
          shadowLayer3: 0.1,
          secondsMode: 'smooth' as SecondsMode,
        };

        const effectsParams = {
          lightAngle: -45,
          darkEdgeAngle: 135,
        };

        const visibilityFolder = paneInstance.addFolder({
          title: 'Visibility',
        });

        const shadowsFolder = paneInstance.addFolder({
          title: 'Shadows',
        });

        const colorsFolder = paneInstance.addFolder({
          title: 'Colors',
        });

        const effectsFolder = paneInstance.addFolder({
          title: 'Effects',
        });

        visibilityFolder
          .addBinding(params, 'minuteMarkerOpacity', {
            min: 0,
            max: 1,
            step: 0.1,
            label: 'Minute Markers',
          })
          .on('change', (event) => {
            rootStyle.setProperty(
              '--minute-marker-opacity',
              String(event.value),
            );
          });

        visibilityFolder
          .addBinding(params, 'reflectionOpacity', {
            min: 0,
            max: 1,
            step: 0.1,
            label: 'Reflection',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--reflection-opacity', String(event.value));
          });

        visibilityFolder
          .addBinding(params, 'glossyOpacity', {
            min: 0,
            max: 1,
            step: 0.1,
            label: 'Glossy Effect',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--glossy-opacity', String(event.value));
          });

        visibilityFolder
          .addBinding(params, 'showNumbers', {
            label: 'Show Numbers',
          })
          .on('change', (event) => {
            rootStyle.setProperty(
              '--hour-number-opacity',
              event.value ? '1' : '0',
            );
          });

        shadowsFolder
          .addBinding(params, 'innerShadowOpacity', {
            min: 0,
            max: 1,
            step: 0.1,
            label: 'Inner Shadow',
          })
          .on('change', (event) => {
            const value = String(event.value);
            rootStyle.setProperty('--inner-shadow-opacity', value);

            if (glassEdgeShadowRef.current) {
              glassEdgeShadowRef.current.style.opacity = value;
            }

            if (glassDarkEdgeRef.current) {
              glassDarkEdgeRef.current.style.opacity = value;
            }
          });

        shadowsFolder
          .addBinding(params, 'shadowLayer1', {
            min: 0,
            max: 0.5,
            step: 0.01,
            label: 'Shadow Layer 1',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--shadow-layer1-opacity', String(event.value));
          });

        shadowsFolder
          .addBinding(params, 'shadowLayer2', {
            min: 0,
            max: 0.5,
            step: 0.01,
            label: 'Shadow Layer 2',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--shadow-layer2-opacity', String(event.value));
          });

        shadowsFolder
          .addBinding(params, 'shadowLayer3', {
            min: 0,
            max: 0.5,
            step: 0.01,
            label: 'Shadow Layer 3',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--shadow-layer3-opacity', String(event.value));
          });

        colorsFolder
          .addBinding(params, 'hourNumberColor', {
            label: 'Hour Numbers',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--hour-number-color', String(event.value));
          });

        colorsFolder
          .addBinding(params, 'minuteMarkerColor', {
            label: 'Minute Markers',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--minute-marker-color', String(event.value));
          });

        colorsFolder
          .addBinding(params, 'handColor', {
            label: 'Hour/Minute Hands',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--hand-color', String(event.value));
          });

        colorsFolder
          .addBinding(params, 'secondHandColor', {
            label: 'Second Hand',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--second-hand-color', String(event.value));
          });

        effectsFolder
          .addBinding(params, 'secondsMode', {
            options: {
              'Smooth Movement': 'smooth',
              'Tick Every Second': 'tick1',
              'Half-Second Ticks': 'tick2',
              'High-Frequency Sweep': 'highFreq',
            },
            label: 'Seconds Mode',
          })
          .on('change', (event) => {
            startSecondsAnimation(event.value as SecondsMode);
          });

        effectsFolder
          .addBinding(effectsParams, 'lightAngle', {
            min: -180,
            max: 180,
            step: 1,
            label: 'Light Angle',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--primary-light-angle', `${event.value}deg`);
          });

        effectsFolder
          .addBinding(effectsParams, 'darkEdgeAngle', {
            min: -180,
            max: 180,
            step: 1,
            label: 'Dark Edge Angle',
          })
          .on('change', (event) => {
            rootStyle.setProperty('--dark-edge-angle', `${event.value}deg`);
          });

        paneInstance
          .addButton({
            title: 'Reset All Settings',
          })
          .on('click', () => {
            setInitialVariables();
            params.minuteMarkerOpacity = 1;
            params.innerShadowOpacity = 0.15;
            params.reflectionOpacity = 0.5;
            params.glossyOpacity = 0.3;
            params.showNumbers = true;
            params.hourNumberColor = 'rgba(50, 50, 50, 0.9)';
            params.minuteMarkerColor = 'rgba(80, 80, 80, 0.5)';
            params.handColor = 'rgba(50, 50, 50, 0.9)';
            params.secondHandColor = 'rgba(255, 107, 0, 1)';
            params.shadowLayer1 = 0.1;
            params.shadowLayer2 = 0.1;
            params.shadowLayer3 = 0.1;
            params.secondsMode = 'smooth';
            effectsParams.lightAngle = -45;
            effectsParams.darkEdgeAngle = 135;

            if (glassEdgeShadowRef.current) {
              glassEdgeShadowRef.current.style.opacity = '0.15';
            }

            if (glassDarkEdgeRef.current) {
              glassDarkEdgeRef.current.style.opacity = '0.15';
            }

            if (glassEffectShadowRef.current) {
              glassEffectShadowRef.current.style.opacity = '1';
            }

            paneInstance?.refresh();
            startSecondsAnimation('smooth');
          });
      } catch (error) {
        console.error('Error initializing Tweakpane:', error);
      }
    };

    initializeTweakpane();

    return () => {
      cancelSecondHandAnimation();

      if (hourMinuteTimeoutRef.current) {
        clearTimeout(hourMinuteTimeoutRef.current);
      }

      document.removeEventListener('keydown', handleKeydown);

      if (paneInstance) {
        paneInstance.dispose();
      }

      if (tweakpaneContainerRef.current) {
        tweakpaneContainerRef.current.style.display = 'none';
      }

      clearHourMarks();
    };
  }, []);

  return (
    <div className="glass-clock-page">
      <div className="inspiration">Braun Inspired Glass Clock</div>

      <div className="keyboard-info">
        Press <kbd>H</kbd> to toggle settings panel | Using Berlin timezone
      </div>

      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dottedGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dottedGrid)" />
      </svg>

      <div className="glass-clock-container">
        <div className="glass-effect-wrapper">
          <div
            className="glass-effect-shadow"
            ref={glassEffectShadowRef}
            style={{ opacity: 'var(--outer-shadow-opacity)' }}
          />
          <div className="glass-clock-face">
            <div
              className="glass-glossy-overlay"
              ref={glossyOverlayRef}
              id="glass-glossy-overlay"
            />
            <div className="glass-edge-highlight" />
            <div className="glass-edge-highlight-outer" />
            <div className="glass-edge-shadow" ref={glassEdgeShadowRef} />
            <div className="glass-dark-edge" ref={glassDarkEdgeRef} />
            <div className="glass-reflection" />
            <div
              className="glass-reflection-overlay"
              ref={reflectionOverlayRef}
              id="glass-reflection-overlay"
            />

            <div className="clock-hour-marks" ref={hourMarksRef} />
            <div className="hour-hand clock-hand" ref={hourHandRef} />
            <div className="minute-hand clock-hand" ref={minuteHandRef} />

            <div className="second-hand-container" ref={secondHandContainerRef}>
              <div className="second-hand" />
              <div className="second-hand-counterweight" />
            </div>

            <div className="second-hand-shadow" ref={secondHandShadowRef} />

            <div className="clock-center-dot" />
            <div className="clock-center-blur" />
            <div className="clock-logo">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/16/Braun_Logo.svg"
                alt="Braun Logo"
                width={80}
                height={30}
                style={{ opacity: 0.8 }}
              />
            </div>
            <div className="clock-date" ref={dateRef} />
            <div className="clock-timezone" ref={timezoneRef}>
              Berlin
            </div>
          </div>
        </div>
      </div>

      <div className="attribution">
        Inspired by{' '}
        <a href="https://codepen.io/Petr-Knoll/pen/QwWLZdx" target="_blank" rel="noreferrer">
          Petr Knoll
        </a>
      </div>

      <div className="tweakpane-container" ref={tweakpaneContainerRef} />
    </div>
  );
}

export default GlassClock;
