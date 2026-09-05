import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AiModel = {
  id: string;
  name: string;
  provider?: string;
  family?: string;
  version?: string;
  description?: string;
  contextWindowTokens?: number;
  inputPricePer1KTokensUSD?: number;
  outputPricePer1KTokensUSD?: number;
  supports?: {
    vision?: boolean;
    functionCalling?: boolean;
    toolUse?: boolean;
    streaming?: boolean;
    jsonMode?: boolean;
    audioIn?: boolean;
    audioOut?: boolean;
  };
  tags?: string[];
  meta?: Record<string, unknown>;
};

type Props = {
  models: AiModel[];
  className?: string;
};

export const AiModelsList: React.FC<Props> = ({ models, className = "" }) => {
  const [selected, setSelected] = useState<AiModel | null>(null);

  const sorted = useMemo(() => {
    return [...models].sort((a, b) => {
      return (a.provider || "").localeCompare(b.provider || "");
    });
  }, [models]);

  const formatPrice = (n?: number) =>
    typeof n === "number" ? `$${n.toFixed(4)} / 1K tok` : "—";

  const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
      {children}
    </span>
  );

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <h2 className="text-2xl font-semibold text-foreground mb-4">AI Models</h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((m) => (
          <motion.li
            key={m.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm p-4 hover:shadow-md transition"
            onClick={() => setSelected(m)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{m.name}</span>
              {m.version && <Badge>v{m.version}</Badge>}
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {m.description || "No description available"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {m.supports?.streaming && <Badge>Streaming</Badge>}
              {m.supports?.vision && <Badge>Vision</Badge>}
              {m.supports?.functionCalling && <Badge>Functions</Badge>}
              {(m.tags || []).map((t) => (
                <Badge key={t}>#{t}</Badge>
              ))}
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg text-card-foreground"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <button
                className="absolute right-4 top-4 rounded-md bg-muted px-2 py-1 text-sm hover:bg-muted-foreground/20"
                onClick={() => setSelected(null)}
              >
                Close ✕
              </button>

              <h3 className="text-xl font-semibold mb-2">{selected.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selected.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Provider</div>
                  <div>{selected.provider || "—"}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Family</div>
                  <div>{selected.family || "—"}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Input</div>
                  <div>{formatPrice(selected.inputPricePer1KTokensUSD)}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Output</div>
                  <div>{formatPrice(selected.outputPricePer1KTokensUSD)}</div>
                </div>
              </div>

              {selected.meta && (
                <div className="mt-4 text-sm">
                  <h4 className="font-medium mb-1">Additional Metadata</h4>
                  <div className="space-y-1">
                    {Object.entries(selected.meta).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="w-32 text-muted-foreground">{k}:</span>
                        <span>{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
