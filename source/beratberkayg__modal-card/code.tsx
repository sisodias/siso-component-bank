import { MessageCircle, Smile } from "lucide-react";

export const Component = () => {
  

  return (
     <div className="w-full max-w-md rounded-[2.5rem] bg-neutral-900 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center border-b border-neutral-800 pb-4">
          <h1 className="text-3xl font-semibold leading-tight text-white">
            You're invited to try
            <br />
            advanced AI Voice Mode
          </h1>
        </div>

        {/* Features */}
        <div className="mb-8 space-y-6">
          {/* Natural Conversations */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <div className="pt-1">
              <h3 className="mb-1 text-lg font-semibold text-white">
                Natural Conversations
              </h3>
              <p className="text-sm text-neutral-400">
                Real-time responses you can interrupt.
              </p>
            </div>
          </div>

          {/* Emotion and Tone */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600">
              <Smile className="h-7 w-7 text-white" />
            </div>
            <div className="pt-1">
              <h3 className="mb-1 text-lg font-semibold text-white">
                Emotion and Tone
              </h3>
              <p className="text-sm text-neutral-400">
                Senses and responds to humor,
                <br />
                sarcasm, and more.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-neutral-800" />

        {/* Disclaimer */}
        <div className="mb-6 text-center">
          <p className="text-sm leading-relaxed text-neutral-400">
            Voice Mode may make mistakes. Access
            <br />
            and limits are subject to change.
          </p>
          <a
            href="#"
            className="mt-2 inline-block text-sm text-white underline underline-offset-4 hover:text-neutral-200"
          >
            Learn more
          </a>
          <span className="text-sm text-neutral-400">
            {" "}
            about advanced Voice Mode.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800">
            Start chatting
          </button>
          <button className="w-full py-3 text-base font-medium text-white transition-colors hover:text-neutral-300">
            Maybe later
          </button>
        </div>
      </div>
  );
};
