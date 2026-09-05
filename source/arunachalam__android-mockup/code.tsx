import { SVGProps } from "react";

export interface AndroidMockupProps extends SVGProps<SVGSVGElement> {
  screenImage?: string;
  screenVideo?: string;
  deviceWidth?: number;
  deviceHeight?: number;
}

export const AndroidMockup: React.FC<AndroidMockupProps> = ({
  deviceWidth = 420,
  deviceHeight = 900,
  screenImage,
  screenVideo,
  ...svgProps
}) => {
  // Outline and screen geometry
  const outlineX = 5;
  const outlineY = 10;
  const outlineW = deviceWidth - 10;
  const outlineH = deviceHeight - 20;
  const outlineR = 35;

  const screenX = 15;
  const screenY = 25;
  const screenW = deviceWidth - 30;
  const screenH = deviceHeight - 50;
  const screenR = 30;

  // Top hardware
  const speakerW = 70;
  const speakerH = 4;
  const speakerY = outlineY;
  const cameraR = 8;
  const cameraCY = outlineY + speakerH + cameraR / 0.25;

  return (
    <svg
      viewBox={`0 0 ${deviceWidth} ${deviceHeight}`}
      fill="none"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Android device mockup"
      role="img"
      {...svgProps}
    >
      <rect
        x={outlineX}
        y={outlineY}
        width={outlineW}
        height={outlineH}
        rx={outlineR}
        className="fill-zinc-300 dark:fill-zinc-700 stroke-zinc-400 dark:stroke-zinc-600 stroke-[1]"
      />

      <clipPath id="android-mockup-screen">
        <rect
          x={screenX}
          y={screenY}
          width={screenW}
          height={screenH}
          rx={screenR}
        />
      </clipPath>

      {screenImage && (
        <image
          href={screenImage}
          x={screenX}
          y={screenY}
          width={screenW}
          height={screenH}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#android-mockup-screen)"
        />
      )}
      {screenVideo && (
        <foreignObject
          x={screenX}
          y={screenY}
          width={screenW}
          height={screenH}
          clipPath="url(#android-mockup-screen)"
          preserveAspectRatio="xMidYMid slice"
        >
          <video
            src={screenVideo}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </foreignObject>
      )}
      {!screenImage && !screenVideo && (
        <rect
          x={screenX}
          y={screenY}
          width={screenW}
          height={screenH}
          rx={screenR}
          className="fill-white dark:fill-zinc-900"
        />
      )}
      <rect
        x={(deviceWidth - speakerW) / 2}
        y={speakerY}
        width={speakerW}
        height={speakerH}
        rx={2}
        ry={2}
        className="fill-zinc-400 dark:fill-zinc-500"
      />
      <circle
        cx={deviceWidth / 2}
        cy={cameraCY}
        r={cameraR}
        className="fill-black"
      />
    </svg>
  );
};
