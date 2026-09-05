"use client";

import { useEffect, useRef, useState } from "react";

//
// 🔹 Shader Background Component
//
export const ShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Resize canvas to fill window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create vertex shader
    const vertexShaderSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    // Create fragment shader
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      vec3 spectral_colour(float l) {
        float r=0.0,g=0.0,b=0.0;
        if ((l>=400.0)&&(l<410.0)) { float t=(l-400.0)/(410.0-400.0); r=+(0.33*t)-(0.20*t*t); }
        else if ((l>=410.0)&&(l<475.0)) { float t=(l-410.0)/(475.0-410.0); r=0.14-(0.13*t*t); }
        else if ((l>=545.0)&&(l<595.0)) { float t=(l-545.0)/(595.0-545.0); r=+(1.98*t)-(t*t); }
        else if ((l>=595.0)&&(l<650.0)) { float t=(l-595.0)/(650.0-595.0); r=0.98+(0.06*t)-(0.40*t*t); }
        else if ((l>=650.0)&&(l<700.0)) { float t=(l-650.0)/(700.0-650.0); r=0.65-(0.84*t)+(0.20*t*t); }
        if ((l>=415.0)&&(l<475.0)) { float t=(l-415.0)/(475.0-415.0); g=+(0.80*t*t); }
        else if ((l>=475.0)&&(l<590.0)) { float t=(l-475.0)/(590.0-475.0); g=0.8+(0.76*t)-(0.80*t*t); }
        else if ((l>=585.0)&&(l<639.0)) { float t=(l-585.0)/(639.0-585.0); g=0.82-(0.80*t); }
        if ((l>=400.0)&&(l<475.0)) { float t=(l-400.0)/(475.0-400.0); b=+(2.20*t)-(1.50*t*t); }
        else if ((l>=475.0)&&(l<560.0)) { float t=(l-475.0)/(560.0-475.0); b=0.7-(t)+(0.30*t*t); }
        return vec3(r,g,b);
      }

      void main() {
        vec2 p = (2.0*gl_FragCoord.xy - iResolution.xy) / min(iResolution.x, iResolution.y);
        p *= 2.0;
        for(int i=0;i<8;i++) {
          vec2 newp = vec2(
            p.y + cos(p.x + iTime) - sin(p.y * cos(iTime * 0.2)),
            p.x - sin(p.y - iTime) - cos(p.x * sin(iTime * 0.3))
          );
          p = newp;
        }
        gl_FragColor = vec4(spectral_colour(p.y * 50.0 + 500.0 + sin(iTime * 0.6)), 1.0);
      }
    `;

    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Link program
    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const timeUniformLocation = gl.getUniformLocation(shaderProgram, "iTime");
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "iResolution");

    // Animation loop
    let startTime = Date.now();
    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeUniformLocation, currentTime);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      gl.deleteProgram(shaderProgram);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer!);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" />;
};

//
// 🔹 Time Display Component
//
type TemperatureUnit = "C" | "F";

export const TimeDisplay = () => {
  const [time, setTime] = useState("");
  const [city, setCity] = useState("Your City");
  const [temperature, setTemperature] = useState("--°");
  const [temperatureValue, setTemperatureValue] = useState<number | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [tempCity, setTempCity] = useState("");

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  useEffect(() => {
    setTime(formatTime(new Date()));
    const interval = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let cityFromTimezone =
        timezone.split("/").pop()?.replace(/_/g, " ") || "Your City";
      if (cityFromTimezone.includes("/")) {
        cityFromTimezone = cityFromTimezone.split("/").pop() || "Your City";
      }
      setCity(cityFromTimezone);
      setTempCity(cityFromTimezone);
    } catch {
      setCity("Your City");
      setTempCity("Your City");
    }

    const month = new Date().getMonth();
    const isSummer = month >= 3 && month <= 8;
    const baseTemp = isSummer ? 25 : 10;
    const mockTemp = Math.round(baseTemp + (Math.random() * 10 - 5));
    setTemperatureValue(mockTemp);
    setTemperature(`${mockTemp}°${unit}`);
  }, []);

  useEffect(() => {
    if (temperatureValue !== null) {
      if (unit === "F") {
        const fahrenheit = Math.round(temperatureValue * 9 / 5 + 32);
        setTemperature(`${fahrenheit}°F`);
      } else {
        setTemperature(`${temperatureValue}°C`);
      }
    }
  }, [temperatureValue, unit]);

  const toggleTemperatureUnit = () => setUnit(u => (u === "C" ? "F" : "C"));
  const handleSubmitCity = () => {
    if (tempCity.trim()) setCity(tempCity);
    else setTempCity(city);
    setIsEditingCity(false);
  };
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => setTempCity(e.target.value);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmitCity();
    if (e.key === "Escape") {
      setIsEditingCity(false);
      setTempCity(city);
    }
  };

  return (
    <div className="flex flex-col items-center text-white relative z-10">
      <h1 className="mb-2">{time}</h1>
      {isEditingCity ? (
        <input
          type="text"
          value={tempCity}
          onChange={handleCityChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSubmitCity}
          autoFocus
          className="mb-4 bg-black/30 text-white text-center px-4 py-2 rounded-lg backdrop-blur-sm border-0 shadow-inner"
          placeholder="Enter your city"
        />
      ) : (
        <h2
          className="mb-4 cursor-pointer hover:underline underline-offset-4"
          onClick={() => setIsEditingCity(true)}
          title="Click to edit location"
        >
          {city}
        </h2>
      )}
      <h3
        className="cursor-pointer hover:underline underline-offset-4"
        onClick={toggleTemperatureUnit}
        title="Click to toggle between °C and °F"
      >
        {temperature}
      </h3>
    </div>
  );
};

//
// 🔹 Example: Combined Wrapper
//
export default function Dashboard() {
  return (
    <div className="relative w-full h-screen">
      <ShaderBackground />
      <div className="absolute inset-0 flex items-center justify-center">
        <TimeDisplay />
      </div>
    </div>
  );
}
