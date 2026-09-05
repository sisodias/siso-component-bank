import {
  ChartNetworkIcon,
  ImageIcon,
  MapIcon,
  PenToolIcon,
  ScanTextIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Textarea } from "./textarea";

export const Component = () => {
  return (
    <Card className="flex h-full min-h-[800px] w-full max-w-[480px] flex-col gap-6 p-4 shadow-none">
      <div className="flex flex-row items-center justify-end p-0">
        <Button variant="ghost" size="icon" className="size-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="size-4 text-muted-foreground"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 5a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
            />
          </svg>
        </Button>
        <Button variant="ghost" size="icon" className="size-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="size-4 text-muted-foreground"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </Button>
      </div>
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="flex flex-col items-center justify-center space-y-8 p-6">
          <svg
            fill="none"
            height="48"
            viewBox="0 0 48 48"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <filter
              id="a"
              color-interpolation-filters="sRGB"
              filterUnits="userSpaceOnUse"
              height="54"
              width="48"
              x="0"
              y="-3"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                mode="normal"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="-3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                k2="-1"
                k3="1"
                operator="arithmetic"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
              />
              <feBlend
                in2="shape"
                mode="normal"
                result="effect1_innerShadow_3051_46851"
              />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                k2="-1"
                k3="1"
                operator="arithmetic"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"
              />
              <feBlend
                in2="effect1_innerShadow_3051_46851"
                mode="normal"
                result="effect2_innerShadow_3051_46851"
              />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feMorphology
                in="SourceAlpha"
                operator="erode"
                radius="1"
                result="effect3_innerShadow_3051_46851"
              />
              <feOffset />
              <feComposite
                in2="hardAlpha"
                k2="-1"
                k3="1"
                operator="arithmetic"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.24 0"
              />
              <feBlend
                in2="effect2_innerShadow_3051_46851"
                mode="normal"
                result="effect3_innerShadow_3051_46851"
              />
            </filter>
            <filter
              id="b"
              color-interpolation-filters="sRGB"
              filterUnits="userSpaceOnUse"
              height="42"
              width="42"
              x="3"
              y="5.25"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feMorphology
                in="SourceAlpha"
                operator="erode"
                radius="1.5"
                result="effect1_dropShadow_3051_46851"
              />
              <feOffset dy="2.25" />
              <feGaussianBlur stdDeviation="2.25" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0.1 0"
              />
              <feBlend
                in2="BackgroundImageFix"
                mode="normal"
                result="effect1_dropShadow_3051_46851"
              />
              <feBlend
                in="SourceGraphic"
                in2="effect1_dropShadow_3051_46851"
                mode="normal"
                result="shape"
              />
            </filter>
            <linearGradient
              id="c"
              gradientUnits="userSpaceOnUse"
              x1="24"
              x2="26"
              y1=".000001"
              y2="48"
            >
              <stop offset="0" stop-color="#fff" stop-opacity="0" />
              <stop offset="1" stop-color="#fff" stop-opacity=".12" />
            </linearGradient>
            <linearGradient
              id="d"
              gradientUnits="userSpaceOnUse"
              x1="24"
              x2="24"
              y1="6"
              y2="42"
            >
              <stop offset="0" stop-color="#fff" stop-opacity=".8" />
              <stop offset="1" stop-color="#fff" stop-opacity=".5" />
            </linearGradient>
            <linearGradient
              id="e"
              gradientUnits="userSpaceOnUse"
              x1="24"
              x2="24"
              y1="0"
              y2="48"
            >
              <stop offset="0" stop-color="#fff" stop-opacity=".12" />
              <stop offset="1" stop-color="#fff" stop-opacity="0" />
            </linearGradient>
            <clipPath id="f">
              <rect height="48" rx="12" width="48" />
            </clipPath>
            <g filter="url(#a)">
              <g clip-path="url(#f)">
                <rect fill="#0A0D12" height="48" rx="12" width="48" />
                <path d="m0 0h48v48h-48z" fill="url(#c)" />
                <g filter="url(#b)">
                  <path
                    clip-rule="evenodd"
                    d="m6 24c11.4411 0 18-6.5589 18-18 0 11.4411 6.5589 18 18 18-11.4411 0-18 6.5589-18 18 0-11.4411-6.5589-18-18-18z"
                    fill="url(#d)"
                    fill-rule="evenodd"
                  />
                </g>
              </g>
              <rect
                height="46"
                rx="11"
                stroke="url(#e)"
                stroke-width="2"
                width="46"
                x="1"
                y="1"
              />
            </g>
          </svg>

          <div className="flex flex-col space-y-2.5 text-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-medium tracking-tight text-muted-foreground">
                Hi Robert,
              </h2>
              <h3 className="text-lg font-medium tracking-[-0.006em]">
                Welcome back! How can I help?
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              I'm here to help you tackle your tasks. Choose from the prompts
              below or just tell me what you need!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="secondary"
              className="h-7 min-w-7 cursor-pointer gap-1.5 [&_svg]:-ms-px [&_svg]:shrink-0 text-xs [&_svg]:size-3.5 rounded-md"
            >
              <ImageIcon aria-hidden="true" className="text-blue-500" />
              Create image
            </Badge>
            <Badge
              variant="secondary"
              className="h-7 min-w-7 cursor-pointer gap-1.5 [&_svg]:-ms-px [&_svg]:shrink-0 text-xs [&_svg]:size-3.5 rounded-md"
            >
              <ChartNetworkIcon
                aria-hidden="true"
                className="text-orange-500"
              />
              Analyze data
            </Badge>
            <Badge
              variant="secondary"
              className="h-7 min-w-7 cursor-pointer gap-1.5 [&_svg]:-ms-px [&_svg]:shrink-0 text-xs [&_svg]:size-3.5 rounded-md"
            >
              <MapIcon aria-hidden="true" className="text-green-500" />
              Make a plan
            </Badge>
            <Badge
              variant="secondary"
              className="h-7 min-w-7 cursor-pointer gap-1.5 [&_svg]:-ms-px [&_svg]:shrink-0 text-xs [&_svg]:size-3.5 rounded-md"
            >
              <ScanTextIcon aria-hidden="true" className="text-pink-500" />
              Summarize text
            </Badge>
            <Badge
              variant="secondary"
              className="h-7 min-w-7 cursor-pointer gap-1.5 [&_svg]:-ms-px [&_svg]:shrink-0 text-xs [&_svg]:size-3.5 rounded-md"
            >
              <PenToolIcon aria-hidden="true" className="text-yellow-500" />
              Help me write
            </Badge>
            <Badge
              variant="secondary"
              className="h-7 min-w-7 cursor-pointer gap-1.5 [&_svg]:-ms-px [&_svg]:shrink-0 text-xs [&_svg]:size-3.5 rounded-md"
            >
              <SparklesIcon aria-hidden="true" className="text-purple-500" />
              More
            </Badge>
          </div>
        </div>

        <div className="relative mt-auto flex-col rounded-md ring-1 ring-border">
          <div className="relative">
            <Textarea
              placeholder="Ask me anything..."
              className="peer bg-transparent min-h-[100px] resize-none rounded-b-none border-none py-3 ps-9 pe-9 shadow-none"
            />

            <div className="pointer-events-none absolute start-0 top-[14px] flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="size-4"
              >
                <g fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="11.5" cy="11.5" r="9.5" />
                  <path stroke-linecap="round" d="M18.5 18.5L22 22" />
                </g>
              </svg>
            </div>

            <button
              className="absolute end-0 bottom-7 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-colors outline-none hover:text-foreground focus:z-10 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Record audio"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="size-4"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M5.25 8a6.75 6.75 0 0 1 13.5 0v5a6.75 6.75 0 0 1-13.5 0zM12 2.75A5.25 5.25 0 0 0 6.75 8v5a5.25 5.25 0 1 0 10.5 0V8c0-2.9-2.35-5.25-5.25-5.25m-1.485 4.295a.75.75 0 0 1-1.06-1.06l.534.504a37 37 0 0 1-.533-.505v-.001l.002-.002l.004-.003l.008-.008l.064-.06q.054-.047.139-.106c.113-.078.268-.167.473-.25c.41-.165 1.008-.304 1.854-.304s1.444.139 1.854.305c.205.083.36.17.473.249a2 2 0 0 1 .203.166l.008.008l.004.003l.001.002h.001c0 .001.001.002-.533.506l.534-.504a.75.75 0 0 1-1.068 1.055a1 1 0 0 0-.186-.095c-.207-.084-.61-.195-1.291-.195s-1.084.111-1.291.195a1 1 0 0 0-.194.1m0 3.001a.75.75 0 0 1-1.06-1.061L10 9.5a46 46 0 0 1-.544-.516v-.001l.002-.002l.004-.003l.008-.008l.064-.06q.054-.047.139-.106c.113-.078.268-.167.473-.25c.41-.165 1.008-.304 1.854-.304s1.444.139 1.854.305c.205.082.36.17.473.249a2 2 0 0 1 .203.166l.008.008l.004.003l.001.002h.001c0 .001.001.002-.544.517l.545-.515a.75.75 0 0 1-1.06 1.06l-.008-.005a1 1 0 0 0-.186-.095c-.207-.084-.61-.195-1.291-.195s-1.084.111-1.291.195a1 1 0 0 0-.186.095zm2.942-.029h-.001M3 10.25a.75.75 0 0 1 .75.75v2a8.25 8.25 0 0 0 16.5 0v-2a.75.75 0 0 1 1.5 0v2c0 5.385-4.365 9.75-9.75 9.75S2.25 18.385 2.25 13v-2a.75.75 0 0 1 .75-.75"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between rounded-b-md border-t bg-muted/50 px-3 py-2 dark:bg-muted">
            <Select defaultValue="gpt-4">
              <SelectTrigger size="sm" className="h-7! bg-background text-xs w-[90px]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs" value="gpt-4">
                  GPT-4
                </SelectItem>
                <SelectItem className="text-xs" value="gpt-3.5">
                  GPT-3.5
                </SelectItem>
                <SelectItem className="text-xs" value="gpt-3.5-turbo">
                  GPT-3.5 Turbo
                </SelectItem>
                <SelectItem className="text-xs" value="gpt-3.5-turbo-16k">
                  GPT-3.5 Turbo 16k
                </SelectItem>
                <SelectItem className="text-xs" value="gpt-4-32k">
                  GPT-4 32k
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Button className="h-7! px-2! gap-2 text-xs" variant="ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className="size-3.5 text-muted-foreground"
                >
                  <path
                    fill="currentColor"
                    d="M6.17 6.309a5.317 5.317 0 0 1 7.522 0a5.326 5.326 0 0 1 0 7.529l-1.43 1.43a.75.75 0 0 0 1.06 1.061l1.43-1.431a6.826 6.826 0 0 0 0-9.65a6.817 6.817 0 0 0-9.644 0l-2.86 2.864A6.826 6.826 0 0 0 6.69 19.749a.75.75 0 1 0 .083-1.498a5.326 5.326 0 0 1-3.465-9.08z"
                  />
                  <path
                    fill="currentColor"
                    d="M17.31 4.251a.75.75 0 0 0-.083 1.498a5.326 5.326 0 0 1 3.465 9.08L17.83 17.69a5.317 5.317 0 0 1-7.523 0a5.326 5.326 0 0 1 0-7.528l1.43-1.432a.75.75 0 0 0-1.06-1.06l-1.43 1.431a6.826 6.826 0 0 0 0 9.65a6.817 6.817 0 0 0 9.644 0l2.86-2.864A6.826 6.826 0 0 0 17.31 4.251"
                  />
                </svg>
                Attach
              </Button>
              <Button className="h-7! px-2! gap-2 text-xs" variant="ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className="size-3.5 text-muted-foreground"
                >
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path
                      stroke-linecap="round"
                      d="M13.294 7.17L12 12l-1.294 4.83"
                    />
                    <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z" />
                  </g>
                </svg>
                Shortcuts
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
