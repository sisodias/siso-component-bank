import { cn } from "@/lib/utils";
import { Terminal, Database, Network, ShieldCheck } from "lucide-react";

export const Component = () => {
  return (
    <section className="relative w-full bg-black py-24 font-sans text-white sm:py-32 selection:bg-white selection:text-black">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
            Platform Capabilities
          </div>
          <h2 className="mb-4 max-w-3xl text-balance text-4xl font-medium tracking-tighter text-white sm:text-5xl md:text-6xl">
            Everything you need. <br className="hidden sm:block" />
            <span className="text-neutral-600">Nothing you don't.</span>
          </h2>
          <p className="max-w-2xl text-balance text-base text-neutral-400 sm:text-lg">
            Purpose-built primitives designed for maximum leverage. No bloat, no gimmicks—just raw, unadulterated performance.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          
          {/* Feature 1: Large Card (Performance) */}
          <div className="group flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#050505] transition-colors hover:border-white/[0.15] md:col-span-2">
            <div className="relative flex flex-1 items-center justify-center p-8">
              {/* Minimalist Terminal UI Mock */}
              <div className="w-full max-w-md overflow-hidden rounded-lg border border-white/[0.08] bg-black font-mono text-[11px] leading-relaxed text-neutral-500 sm:text-xs">
                <div className="flex border-b border-white/[0.08] px-4 py-2">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-white/[0.15]" />
                    <div className="h-2 w-2 rounded-full bg-white/[0.15]" />
                    <div className="h-2 w-2 rounded-full bg-white/[0.15]" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <span className="text-white">latency_check --region global</span>
                    <span>[OK]</span>
                  </div>
                  <div className="mt-2 flex justify-between text-neutral-400">
                    <span>resolving edge nodes...</span>
                    <span>12ms</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>authenticating request...</span>
                    <span>8ms</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>establishing connection...</span>
                    <span>14ms</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-white">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    Global deployment active (34ms total)
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-white/[0.04] bg-white/[0.01] p-6">
              <div className="mb-2 flex items-center gap-2 text-white">
                <Terminal className="h-4 w-4" />
                <h3 className="text-sm font-medium">Sub-50ms Execution</h3>
              </div>
              <p className="text-sm text-neutral-400">
                Deployed across 150+ edge nodes globally. Your logic executes precisely where your users are, instantly.
              </p>
            </div>
          </div>

          {/* Feature 2: Small Card (Database) */}
          <div className="group flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#050505] transition-colors hover:border-white/[0.15]">
            <div className="flex flex-1 items-center justify-center p-8">
              {/* Minimalist Data Structure Mock */}
              <div className="flex flex-col gap-2 w-full">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex h-8 w-full items-center justify-between rounded border border-white/[0.04] bg-white/[0.02] px-3">
                    <div className="h-1 w-12 rounded bg-white/[0.2]" />
                    <div className="h-1 w-4 rounded bg-white/[0.1]" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/[0.04] bg-white/[0.01] p-6">
              <div className="mb-2 flex items-center gap-2 text-white">
                <Database className="h-4 w-4" />
                <h3 className="text-sm font-medium">Atomic State</h3>
              </div>
              <p className="text-sm text-neutral-400">
                Strictly consistent, strongly typed data primitives available at the edge.
              </p>
            </div>
          </div>

          {/* Feature 3: Small Card (Security) */}
          <div className="group flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#050505] transition-colors hover:border-white/[0.15]">
            <div className="flex flex-1 items-center justify-center p-8">
              {/* Minimalist Auth Key Mock */}
              <div className="w-full max-w-[200px] break-all font-mono text-[10px] leading-tight text-neutral-600">
                <span className="text-white">sk_live_</span>
                51MkxXXXXXXXXXXXXXXXXXXXXX
                <br />
                <br />
                <div className="h-px w-full bg-white/[0.08] my-2" />
                AES-256-GCM / SHA-384
              </div>
            </div>
            <div className="border-t border-white/[0.04] bg-white/[0.01] p-6">
              <div className="mb-2 flex items-center gap-2 text-white">
                <ShieldCheck className="h-4 w-4" />
                <h3 className="text-sm font-medium">Zero-Trust Auth</h3>
              </div>
              <p className="text-sm text-neutral-400">
                Enterprise-grade encryption by default. No keys ever touch our database unhashed.
              </p>
            </div>
          </div>

          {/* Feature 4: Large Card (API / Webhooks) */}
          <div className="group flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#050505] transition-colors hover:border-white/[0.15] md:col-span-2">
            <div className="relative flex flex-1 items-center justify-center p-8">
              {/* Minimalist Webhook/API Mock */}
              <div className="flex w-full max-w-sm flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 items-center rounded border border-white/[0.08] bg-black px-3 font-mono text-xs text-white">
                    POST
                  </div>
                  <div className="flex-1 rounded border border-white/[0.08] bg-black px-3 py-2 font-mono text-xs text-neutral-500">
                    api.leadmeta.dev/v1/sync
                  </div>
                </div>
                <div className="pl-[60px]">
                  <div className="h-6 border-l border-white/[0.12]" />
                </div>
                <div className="flex items-center justify-between rounded border border-white/[0.08] bg-white/[0.02] p-3 font-mono text-xs text-neutral-400">
                  <span>{`{ "status": "success", "records": 240 }`}</span>
                  <span className="text-white">200 OK</span>
                </div>
              </div>
            </div>
            <div className="border-t border-white/[0.04] bg-white/[0.01] p-6">
              <div className="mb-2 flex items-center gap-2 text-white">
                <Network className="h-4 w-4" />
                <h3 className="text-sm font-medium">Programmatic Control</h3>
              </div>
              <p className="text-sm text-neutral-400">
                Manage every aspect of your infrastructure through our strictly typed REST API.
                Built for developers who demand complete automation.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};