import React from "react";

import QRCodeStyling from "qr-code-styling";

import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "./card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export const Component = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [qrCode, setQrCode] = React.useState<QRCodeStyling | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    const qrCode = new QRCodeStyling({
      width: 150,
      height: 150,
      data: "https://yourdomain.com/yourprofile",
      type: "svg",
      backgroundOptions: {
        color: "transparent",
      },
    });
    setQrCode(qrCode);
    qrCode.append(ref.current);
  }, []);

  return (
    <Card className="flex w-full max-w-[500px] flex-col rounded-[14px] bg-muted/40 p-[4px] shadow-none">
      <CardContent className="relative flex flex-col items-center justify-center space-y-6 overflow-hidden rounded-[10px] bg-background p-6 ring-1 ring-border">
        <div className="flex max-w-96 flex-col items-center justify-center gap-1.5 text-center">
          <CardTitle className="text-base">Share via QR code</CardTitle>
          <CardDescription className="tracking-[-0.006em]">
            Here is your unique QR code that will redirect people to your
            profile when they scan it.
          </CardDescription>
        </div>
        <div className="flex w-full items-center justify-center rounded-lg border-2 border-dashed py-6">
          <div className="relative p-0.5">
            <div ref={ref} className="dark:invert" />
            <div className="absolute top-0 left-0 size-3 rounded-tl border-t-2 border-l-2"></div>
            <div className="absolute top-0 right-0 size-3 rotate-90 rounded-tl border-t-2 border-l-2"></div>
            <div className="absolute bottom-0 left-0 size-3 -rotate-90 rounded-tl border-t-2 border-l-2"></div>
            <div className="absolute right-0 bottom-0 size-3 rotate-180 rounded-tl border-t-2 border-l-2"></div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between rounded-xl bg-muted p-3.5">
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="size-5 text-muted-foreground"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                color="currentColor"
              >
                <path d="M10 13.229q.213.349.504.654a3.56 3.56 0 0 0 4.454.59q.391-.24.73-.59l3.239-3.372c1.43-1.49 1.43-3.904 0-5.394a3.564 3.564 0 0 0-5.183 0l-.714.743" />
                <path d="m10.97 18.14l-.713.743a3.564 3.564 0 0 1-5.184 0c-1.43-1.49-1.43-3.905 0-5.394l3.24-3.372a3.564 3.564 0 0 1 5.183 0q.291.305.504.654" />
              </g>
            </svg>
            <span className="cursor-pointer text-sm font-medium tracking-[-0.006em] hover:underline">
              https://yourdomain.com/yourprofile
            </span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="size-7" size="icon" variant="ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    className="size-4.5 text-muted-foreground"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      color="currentColor"
                    >
                      <path d="M9 15c0-2.828 0-4.243.879-5.121C10.757 9 12.172 9 15 9h1c2.828 0 4.243 0 5.121.879C22 10.757 22 12.172 22 15v1c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22h-1c-2.828 0-4.243 0-5.121-.879C9 20.243 9 18.828 9 16z" />
                      <path d="M17 9c-.003-2.957-.047-4.489-.908-5.538a4 4 0 0 0-.554-.554C14.43 2 12.788 2 9.5 2c-3.287 0-4.931 0-6.038.908a4 4 0 0 0-.554.554C2 4.57 2 6.212 2 9.5c0 3.287 0 4.931.908 6.038a4 4 0 0 0 .554.554c1.05.86 2.58.906 5.538.908" />
                    </g>
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" showArrow>
                <p className="text-xs">Copy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <div className="relative flex w-full items-center justify-start rounded-xl p-3.5 ring ring-border">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"
                  className="fill-[#F5F5F5] dark:fill-popover"
                />
                <path
                  fill="currentColor"
                  d="m24 0 12 12h-8a4 4 0 0 1-4-4z"
                  opacity=".1"
                />
                <path
                  fill="currentColor"
                  d="M14.566 27.337a.8.8 0 0 0-.33-.6q-.29-.215-.789-.215-.338 0-.572.096a.8.8 0 0 0-.358.259.62.62 0 0 0-.121.377q-.006.176.073.307a.8.8 0 0 0 .227.227q.144.092.333.163.188.066.402.115l.588.14q.429.096.787.256.357.16.62.393.261.234.406.55.147.316.15.725a1.8 1.8 0 0 1-.307 1.042q-.3.439-.87.681-.565.24-1.364.24-.793 0-1.38-.243a2 2 0 0 1-.915-.72q-.326-.479-.342-1.185h1.34q.021.33.188.55.17.217.45.329.285.108.643.108.352 0 .61-.102a.94.94 0 0 0 .406-.284.66.66 0 0 0 .144-.419.54.54 0 0 0-.13-.37 1 1 0 0 0-.378-.256 4 4 0 0 0-.604-.192l-.713-.179q-.827-.201-1.307-.63-.48-.428-.476-1.153a1.7 1.7 0 0 1 .316-1.04q.322-.443.886-.693.561-.249 1.278-.249.729 0 1.272.25.547.249.85.693.303.445.313 1.029zm3.53-1.883 1.581 4.974h.06l1.586-4.974h1.534L20.601 32h-1.783l-2.26-6.546zm9.52 2.116a1.4 1.4 0 0 0-.188-.412 1.27 1.27 0 0 0-.694-.502 1.7 1.7 0 0 0-.489-.067q-.503 0-.882.25a1.64 1.64 0 0 0-.588.725q-.21.472-.211 1.157 0 .684.208 1.163.207.48.588.732.38.25.898.25.47 0 .802-.167.336-.169.511-.476.18-.306.18-.726l.28.042h-1.687v-1.042h2.74v.825q0 .863-.365 1.483a2.5 2.5 0 0 1-1.004.952q-.639.333-1.464.332-.92 0-1.617-.405a2.8 2.8 0 0 1-1.086-1.16q-.387-.755-.387-1.79q0-.796.23-1.42a3 3 0 0 1 .652-1.06q.42-.434.975-.662.555-.227 1.205-.227.556 0 1.035.163.48.16.85.454.375.295.61.7.238.402.304.888z"
                />
              </svg>

              <div className="flex flex-col">
                <p className="text-sm font-semibold tracking-[-0.006em]">
                  Download as SVG
                </p>
                <p className="text-xs tracking-[-0.006em] text-muted-foreground">
                  Scalable Vector Graphic
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="absolute top-2.5 right-2.5 size-7"
                      size="icon"
                      variant="ghost"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 14 14"
                        className="size-4.5 text-muted-foreground"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10.872 9.563c.586-.226 1.1-.516 1.506-.873a2.54 2.54 0 0 0 .393-3.403a2.63 2.63 0 0 0-1.548-1.026a.24.24 0 0 1-.167-.19a3.62 3.62 0 0 0-1.037-2.212a3.79 3.79 0 0 0-4.65-.553a3.67 3.67 0 0 0-1.547 1.906a.22.22 0 0 1-.202.12a3.1 3.1 0 0 0-1.159.307a3.1 3.1 0 0 0-.95.718a2.98 2.98 0 0 0-.754 2.186c.055.798.43 1.542 1.045 2.069c.325.279.722.521 1.171.726" />
                          <path d="M3.477 3.335c1.189 0 2.252.784 2.588 1.5m-1.045 6.54c.714.871 1.15 1.307 1.986 1.986c.837-.68 1.272-1.115 1.986-1.986M7 8.063v5.288" />
                        </g>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" showArrow>
                    <p className="text-xs">Download SVG</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="relative flex w-full items-center justify-start rounded-xl p-3.5 ring ring-border">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"
                  className="fill-[#F5F5F5] dark:fill-popover"
                />
                <path
                  fill="currentColor"
                  d="m24 0 12 12h-8a4 4 0 0 1-4-4z"
                  opacity=".1"
                />
                <path
                  fill="currentColor"
                  d="M10.923 32v-6.546h2.582q.745 0 1.27.285.523.281.798.783.278.498.278 1.15 0 .653-.281 1.151a1.94 1.94 0 0 1-.815.777q-.53.278-1.285.278h-1.646v-1.11h1.422q.4 0 .659-.137a.9.9 0 0 0 .39-.386 1.2 1.2 0 0 0 .13-.572 1.2 1.2 0 0 0-.13-.57.88.88 0 0 0-.39-.38q-.262-.137-.665-.137h-.933V32zm11.302-6.546V32h-1.196l-2.847-4.12h-.048V32H16.75v-6.546h1.215l2.825 4.117h.057v-4.117zm5.483 2.116a1.4 1.4 0 0 0-.188-.412 1.27 1.27 0 0 0-.694-.502 1.7 1.7 0 0 0-.489-.067q-.501 0-.882.25a1.64 1.64 0 0 0-.588.725q-.21.472-.21 1.157 0 .684.207 1.163.207.48.588.732.38.25.898.25.47 0 .802-.167.336-.169.512-.476.179-.306.179-.726l.28.042h-1.687v-1.042h2.74v.825q0 .863-.365 1.483a2.5 2.5 0 0 1-1.003.952q-.64.333-1.464.332-.921 0-1.617-.405a2.8 2.8 0 0 1-1.087-1.16q-.387-.755-.387-1.79q0-.796.23-1.42a3 3 0 0 1 .652-1.06q.42-.434.975-.662.555-.227 1.205-.227.556 0 1.035.163.48.16.85.454.374.295.611.7.237.402.304.888z"
                />
              </svg>
              <div className="flex flex-col">
                <p className="text-sm font-semibold tracking-[-0.006em]">
                  Download as PNG
                </p>
                <p className="text-xs tracking-[-0.006em] text-muted-foreground">
                  Portable Network Graphic
                </p>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="absolute top-2.5 right-2.5 size-7"
                      size="icon"
                      variant="ghost"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 14 14"
                        className="size-4.5 text-muted-foreground"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10.872 9.563c.586-.226 1.1-.516 1.506-.873a2.54 2.54 0 0 0 .393-3.403a2.63 2.63 0 0 0-1.548-1.026a.24.24 0 0 1-.167-.19a3.62 3.62 0 0 0-1.037-2.212a3.79 3.79 0 0 0-4.65-.553a3.67 3.67 0 0 0-1.547 1.906a.22.22 0 0 1-.202.12a3.1 3.1 0 0 0-1.159.307a3.1 3.1 0 0 0-.95.718a2.98 2.98 0 0 0-.754 2.186c.055.798.43 1.542 1.045 2.069c.325.279.722.521 1.171.726" />
                          <path d="M3.477 3.335c1.189 0 2.252.784 2.588 1.5m-1.045 6.54c.714.871 1.15 1.307 1.986 1.986c.837-.68 1.272-1.115 1.986-1.986M7 8.063v5.288" />
                        </g>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" showArrow>
                    <p className="text-xs">Download PNG</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
