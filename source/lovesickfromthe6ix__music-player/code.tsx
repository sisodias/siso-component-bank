"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useId,
} from "react";

/**
 * MusicPlayer
 *
 * Theming:
 * - Uses shadcn/ui token variables via CSS custom props:
 *   --mp-bg:        hsl(var(--card))
 *   --mp-text:      hsl(var(--card-foreground))
 *   --mp-muted:     hsl(var(--muted-foreground))
 *   --mp-accent:    hsl(var(--primary))
 *   --mp-border:    hsl(var(--border))
 *   --mp-track:     hsl(var(--muted))
 *   --mp-thumb:     hsl(var(--foreground))
 *   --mp-radius:    var(--radius)
 *
 * Accessibility:
 * - Sliders (seek, volume) with aria-valuetext
 * - Keyboard shortcuts on focused container (Space, arrows, M/S/L/N/P)
 * - Playlist uses listbox role with roving focus, supports Arrow/Home/End/Enter/Space
 * - Error messages announced via aria-live
 *
 * SSR Safety:
 * - All browser APIs (AudioContext, ResizeObserver) guarded within effects
 *
 * Ref API:
 * - play(), pause(), toggle(), next(), prev(), seek(seconds), setVolume(v), mute(flag),
 *   setShuffle(flag), setRepeat(mode: 'off'|'all'|'one'), getState()
 */

export type RepeatMode = "off" | "all" | "one";

export interface MusicPlayerTrack {
  src: string;
  title?: string;
  artist?: string;
  artwork?: string;
}

export interface MusicPlayerControls {
  shuffle?: boolean;
  repeat?: boolean;
  volume?: boolean;
  prevNext?: boolean;
  time?: boolean;
}

export interface MusicPlayerWaveform {
  enabled?: boolean;
  replaceSeekBar?: boolean;
  height?: number;
  barWidth?: number;
  gap?: number;
  mirror?: boolean;
  color?: string | null; // fallback if CSS var not present
  progressColor?: string | null; // fallback if CSS var not present
  radius?: number;
}

export interface MusicPlayerIcons {
  play?: React.ReactNode;
  pause?: React.ReactNode;
  next?: React.ReactNode;
  prev?: React.ReactNode;
  shuffleOn?: React.ReactNode;
  shuffleOff?: React.ReactNode;
  repeatOff?: React.ReactNode;
  repeatAll?: React.ReactNode;
  repeatOne?: React.ReactNode;
  volume?: React.ReactNode;
  mute?: React.ReactNode;
}

export interface MusicPlayerTheme {
  // If provided, these override the mapped shadcn tokens
  bg?: string;
  text?: string;
  muted?: string;
  accent?: string;
  border?: string;
  radius?: string;
  trackBg?: string;
  thumbBg?: string;
  backdropFilter?: string;
}

export interface MusicPlayerProps {
  className?: string;
  tracks: MusicPlayerTrack[];
  initialIndex?: number;
  initialVolume?: number; // 0..1
  autoPlay?: boolean;
  showPlaylist?: boolean;
  keyboardShortcuts?: boolean;
  theme?: MusicPlayerTheme;
  controls?: MusicPlayerControls;
  waveform?: MusicPlayerWaveform;
  icons?: Partial<MusicPlayerIcons>;
  onTrackChange?(index: number, track: MusicPlayerTrack): void;
  onPlay?(index: number, track: MusicPlayerTrack): void;
  onPause?(index: number, track: MusicPlayerTrack): void;
  onEnd?(index: number, track: MusicPlayerTrack): void;
  onError?(error: unknown, index: number, track: MusicPlayerTrack): void;
  onTimeUpdate?(currentTime: number, duration: number, index: number): void;
  onVolumeChange?(volume: number, muted: boolean): void;
}

export interface MusicPlayerRef {
  play(): void;
  pause(): void;
  toggle(): void;
  next(fromError?: boolean, fromEnded?: boolean): boolean | void;
  prev(): void;
  seek(seconds: number): void;
  setVolume(v: number): void;
  mute(flag: boolean): void;
  setShuffle(flag: boolean): void;
  setRepeat(mode: RepeatMode): void;
  getState(): {
    currentIndex: number;
    currentTrack?: MusicPlayerTrack;
    isPlaying: boolean;
    progress: number;
    duration: number;
    volume: number;
    muted: boolean;
    shuffle: boolean;
    repeatMode: RepeatMode;
    queue: number[];
    history: number[];
  };
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const formatTime = (t?: number | null) => {
  if (t == null || Number.isNaN(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const defaultControls: Required<MusicPlayerControls> = {
  shuffle: true,
  repeat: true,
  volume: true,
  prevNext: true,
  time: true,
};

const defaultWaveform: Required<MusicPlayerWaveform> = {
  enabled: false,
  replaceSeekBar: true,
  height: 74,
  barWidth: 2,
  gap: 1,
  mirror: true,
  color: null,
  progressColor: null,
  radius: 2,
};

function shuffleArray<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Simple inline icons (override via props.icons if preferred)
const Icon = ({
  path,
  size = 18,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.6,
}: {
  path: string;
  size?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

const defaultIcons: Required<MusicPlayerIcons> = {
  play: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  pause: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ),
  next: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 6l9 6-9 6z" />
      <rect x="19" y="5" width="2" height="14" rx="1" />
    </svg>
  ),
  prev: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 6l-9 6 9 6z" />
      <rect x="3" y="5" width="2" height="14" rx="1" />
    </svg>
  ),
  shuffleOn: <Icon path="M16 3h5v5M4 20l5-5M4 4l9 9m2 8h5v-5" />,
  shuffleOff: <Icon path="M20 20L4 4m14 0h3v3M4 20l3-3m2-2l3-3m3 11h3v-3" />,
  repeatOff: <Icon path="M17 2l4 4-4 4M3 11a6 6 0 016-6h8" />,
  repeatAll: <Icon path="M17 2l4 4-4 4M7 22l-4-4 4-4M3 13a6 6 0 006 6h8M3 11a6 6 0 016-6h8" />,
  repeatOne: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 2l4 4-4 4M3 11a6 6 0 016-6h8" />
      <path d="M7 22l-4-4 4-4M3 13a6 6 0 006 6h8" />
      <text x="12" y="14" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none">
        1
      </text>
    </svg>
  ),
  volume: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5l-5 4H3v6h3l5 4V5z" />
      <path d="M15 9a3 3 0 010 6" />
      <path d="M17.5 5.5a7 7 0 010 13" />
    </svg>
  ),
  mute: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5l-5 4H3v6h3l5 4V5z" />
      <path d="M23 9l-6 6M17 9l6 6" />
    </svg>
  ),
};

/* ---------- Waveform internal component ---------- */

// Decode cache so switching tracks is fast
const bufferCache = new Map<string, AudioBuffer>();

function computePeaks(buffer: AudioBuffer, targetBars: number) {
  const { numberOfChannels, length } = buffer;
  const samplesPerBar = Math.max(1, Math.floor(length / targetBars));
  const channels: Float32Array[] = [];
  for (let c = 0; c < numberOfChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }
  const peaks = new Float32Array(targetBars);
  let globalMax = 0;

  for (let i = 0; i < targetBars; i++) {
    const start = i * samplesPerBar;
    const end = Math.min(start + samplesPerBar, length);
    let peak = 0;
    for (let c = 0; c < numberOfChannels; c++) {
      const ch = channels[c];
      let min = 1,
        max = -1;
      for (let j = start; j < end; j++) {
        const v = ch[j];
        if (v > max) max = v;
        if (v < min) min = v;
      }
      const amp = Math.max(Math.abs(min), Math.abs(max));
      peak += amp;
    }
    peak /= numberOfChannels;
    peaks[i] = peak;
    if (peak > globalMax) globalMax = peak;
  }

  if (!globalMax) return peaks;

  for (let i = 0; i < peaks.length; i++) {
    let p = peaks[i] / globalMax;
    p = Math.pow(p, 0.75);
    peaks[i] = p;
  }
  // light smoothing
  for (let i = 1; i < peaks.length - 1; i++) {
    peaks[i] = (peaks[i - 1] + peaks[i] * 2 + peaks[i + 1]) / 4;
  }
  return peaks;
}

async function decodeArrayBuffer(ctx: AudioContext, buf: ArrayBuffer) {
  // Safari compatibility
  if ((ctx.decodeAudioData as any).length === 1) {
    return await ctx.decodeAudioData(buf);
  }
  return await new Promise<AudioBuffer>((res, rej) => ctx.decodeAudioData(buf, res, rej));
}

interface WaveformCanvasProps {
  src?: string;
  progress: number;
  duration: number;
  onSeek?: (seconds: number) => void;
  opts?: MusicPlayerWaveform;
}

function WaveformCanvas({ src, progress, duration, onSeek, opts }: WaveformCanvasProps) {
  const options = { ...defaultWaveform, ...(opts || {}) };
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const peaksRef = useRef<Float32Array | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const isDraggingRef = useRef(false);

  const getCtx = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AC: typeof AudioContext | undefined =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      audioCtxRef.current = new AC();
    }
    return audioCtxRef.current;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const { clientWidth: w, clientHeight: h } = container;

    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    (ctx as any).setTransform?.(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);

    const getVar = (name: string) => {
      if (!container) return "";
      return getComputedStyle(container).getPropertyValue(name).trim();
    };

    const baseColor = options.color || getVar("--mp-track") || "#e5e7eb";
    const progColor = options.progressColor || getVar("--mp-accent") || "#6366f1";

    const peaks = peaksRef.current;
    const barW = Math.max(1, options.barWidth);
    const gap = Math.max(0, options.gap);
    const centerY = options.mirror ? h / 2 : h;
    const maxH = options.mirror ? h / 2 : h;

    // No data yet: draw a faint baseline
    if (!peaks || !peaks.length) {
      ctx.fillStyle = baseColor;
      const mid = options.mirror ? h / 2 : h;
      ctx.fillRect(0, options.mirror ? mid - 1 : mid - 2, w, 2);
      return;
    }

    const bars = peaks.length;
    const usableWidth = bars * (barW + gap) - gap;
    const offsetX = Math.floor((w - usableWidth) / 2);

    const progressRatio = duration > 0 ? clamp(progress / duration, 0, 1) : 0;
    const progressBars = Math.floor(bars * progressRatio);

    const drawBar = (x: number, amp: number, color: string) => {
      const barH = Math.max(1, amp * (maxH - 2));
      const y = options.mirror ? centerY - barH : centerY - barH;
      ctx.fillStyle = color;
      // rounded rect if available
      if ((ctx as any).roundRect && options.radius) {
        const r = Math.min(options.radius, barW / 2, barH / 2);
        ctx.beginPath();
        const rectY = options.mirror ? y : centerY - barH;
        const rectH = options.mirror ? barH * 2 : barH;
        (ctx as any).roundRect(x, rectY, barW, rectH, r);
        ctx.fill();
      } else {
        if (options.mirror) {
          ctx.fillRect(x, y, barW, barH * 2);
        } else {
          ctx.fillRect(x, centerY - barH, barW, barH);
        }
      }
    };

    // Base layer
    for (let i = 0; i < bars; i++) {
      const x = offsetX + i * (barW + gap);
      drawBar(x, peaks[i], baseColor);
    }
    // Progress overlay
    for (let i = 0; i < progressBars; i++) {
      const x = offsetX + i * (barW + gap);
      drawBar(x, peaks[i], progColor);
    }
  };

  // Decode audio and compute peaks when src changes
  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!src) return;
      if (typeof window === "undefined") return;

      setErr("");
      setLoading(true);
      try {
        if (bufferCache.has(src)) {
          bufferRef.current = bufferCache.get(src) || null;
        } else {
          const res = await fetch(src, { mode: "cors" });
          if (!res.ok) throw new Error(`Failed to fetch audio (${res.status})`);
          const arr = await res.arrayBuffer();
          const ctx = getCtx();
          if (!ctx) throw new Error("Web Audio API not available");
          const buf = await decodeArrayBuffer(ctx, arr);
          bufferCache.set(src, buf);
          bufferRef.current = buf;
        }
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Waveform couldn't be generated (CORS or decode error)");
        setLoading(false);
        peaksRef.current = null;
        draw();
        return;
      }
      if (!alive) return;
      setLoading(false);

      // compute peaks based on current width
      const container = containerRef.current;
      if (container && bufferRef.current) {
        const w = container.clientWidth || 300;
        const bars = Math.max(
          30,
          Math.floor(w / (Math.max(1, options.barWidth) + Math.max(0, options.gap)))
        );
        peaksRef.current = computePeaks(bufferRef.current, bars);
      }
      draw();
    };
    run();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Recompute on resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;

    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => {
        if (!bufferRef.current || !containerRef.current) {
          draw();
          return;
        }
        const w = containerRef.current.clientWidth || 300;
        const bars = Math.max(
          30,
          Math.floor(w / (Math.max(1, options.barWidth) + Math.max(0, options.gap)))
        );
        peaksRef.current = computePeaks(bufferRef.current, bars);
        draw();
      });
      ro.observe(el);
    } catch {
      // ResizeObserver may not exist; ignore
    }
    return () => ro?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.barWidth, options.gap]);

  // Redraw when progress or visual options change
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, duration, options.color, options.progressColor, options.mirror, options.radius]);

  // Pointer seek + keyboard left/right
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateFromEvent = (e: PointerEvent) => {
      if (!duration) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = clamp(x / rect.width, 0, 1);
      onSeek?.(ratio * duration);
    };

    const onDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      el.setPointerCapture?.(e.pointerId);
      updateFromEvent(e);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      updateFromEvent(e);
    };
    const onUp = (e: PointerEvent) => {
      isDraggingRef.current = false;
      el.releasePointerCapture?.(e.pointerId);
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onSeek]);

  return (
    <div
      className="mp__wave relative w-full select-none"
      ref={containerRef}
      style={{ height: options.height }}
      role="slider"
      aria-label="Waveform seek"
      aria-valuemin={0}
      aria-valuemax={Math.floor(duration || 0)}
      aria-valuenow={Math.floor(progress || 0)}
      aria-valuetext={`${formatTime(progress)} of ${formatTime(duration)}`}
      aria-orientation="horizontal"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!duration) return;
        const key = e.key.toLowerCase();
        if (key === "arrowleft" || key === "arrowright") {
          e.preventDefault();
          e.stopPropagation();
          const dt = key === "arrowleft" ? -5 : 5;
          onSeek?.(clamp((progress || 0) + dt, 0, duration));
        }
      }}
      title="Click or drag to seek"
    >
      <canvas ref={canvasRef} />
      {loading && (
        <div className="mp__wave-status absolute inset-0 grid place-items-center text-[hsl(var(--muted-foreground))]">
          Loading waveform…
        </div>
      )}
      {err && !loading && (
        <div className="mp__wave-status absolute inset-0 grid place-items-center text-[hsl(var(--muted-foreground))]">
          {err}
        </div>
      )}
    </div>
  );
}

/* ---------- Main Player ---------- */

export const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(
  function MusicPlayer(
    {
      className,
      tracks,
      initialIndex = 0,
      initialVolume = 0.8,
      autoPlay = false,
      showPlaylist = true,
      keyboardShortcuts = true,
      theme = {},
      controls = {},
      waveform = {},
      icons = {},
      onTrackChange,
      onPlay,
      onPause,
      onEnd,
      onError,
      onTimeUpdate,
      onVolumeChange,
    },
    ref
  ) {
    const mergedControls = { ...defaultControls, ...controls };
    const wf = { ...defaultWaveform, ...waveform };
    const ICONS = useMemo(() => ({ ...defaultIcons, ...icons }), [icons]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [currentIndex, setCurrentIndex] = useState(
      clamp(initialIndex, 0, Math.max(0, (tracks?.length || 1) - 1))
    );
    const [isPlaying, setIsPlaying] = useState<boolean>(!!autoPlay);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(clamp(initialVolume, 0, 1));
    const [muted, setMuted] = useState<boolean>(false);
    const [shuffle, setShuffle] = useState<boolean>(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
    const [history, setHistory] = useState<number[]>([]);
    const [queue, setQueue] = useState<number[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");

    // Playlist roving focus
    const [activeOption, setActiveOption] = useState<number>(currentIndex);
    useEffect(() => {
      setActiveOption(currentIndex);
    }, [currentIndex]);
    const listRef = useRef<HTMLDivElement | null>(null);
    const idBase = useId();

    const currentTrack = tracks?.[currentIndex];

    // CSS variables mapped to shadcn tokens (overrideable by theme prop)
    const themeVars: React.CSSProperties = {
      // Prefer shadcn tokens by default
      ["--mp-bg" as any]: theme.bg ?? "hsl(var(--card))",
      ["--mp-text" as any]: theme.text ?? "hsl(var(--card-foreground))",
      ["--mp-muted" as any]: theme.muted ?? "hsl(var(--muted-foreground))",
      ["--mp-accent" as any]: theme.accent ?? "hsl(var(--primary))",
      ["--mp-border" as any]: theme.border ?? "hsl(var(--border))",
      ["--mp-track" as any]: theme.trackBg ?? "hsl(var(--muted))",
      ["--mp-thumb" as any]: theme.thumbBg ?? "hsl(var(--foreground))",
      ["--mp-radius" as any]: theme.radius ?? "var(--radius, 12px)",
      backdropFilter: theme.backdropFilter || undefined,
      WebkitBackdropFilter: theme.backdropFilter || undefined,
      background: "var(--mp-bg)",
      color: "var(--mp-text)",
      borderColor: "var(--mp-border)",
    };

    const refillQueue = (current: number) => {
      const indices = tracks.map((_, i) => i).filter((i) => i !== current);
      setQueue(shuffleArray(indices));
    };

    // Initialize audio element and listeners
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const onLoadedMetadata = () => {
        setDuration(audio.duration || 0);
      };
      const onTime = () => {
        const t = audio.currentTime || 0;
        setProgress(t);
        onTimeUpdate?.(t, audio.duration || 0, currentIndex);
      };
      const onPlayEv = () => {
        setIsPlaying(true);
        onPlay?.(currentIndex, currentTrack!);
      };
      const onPauseEv = () => {
        setIsPlaying(false);
        onPause?.(currentIndex, currentTrack!);
      };
      const onEndEv = () => {
        onEnd?.(currentIndex, currentTrack!);
        handleEnded();
      };
      const onErrorEv = () => {
        const err = (audio as any).error as MediaError | undefined;
        const msg =
          (err as any)?.message ||
          (err && `Audio error code ${err.code}`) ||
          "Unknown audio error";
        setErrorMsg(msg);
        onError?.(msg, currentIndex, currentTrack!);
        next(true, false);
      };

      audio.addEventListener("loadedmetadata", onLoadedMetadata);
      audio.addEventListener("timeupdate", onTime);
      audio.addEventListener("play", onPlayEv);
      audio.addEventListener("pause", onPauseEv);
      audio.addEventListener("ended", onEndEv);
      audio.addEventListener("error", onErrorEv);

      return () => {
        audio.removeEventListener("loadedmetadata", onLoadedMetadata);
        audio.removeEventListener("timeupdate", onTime);
        audio.removeEventListener("play", onPlayEv);
        audio.removeEventListener("pause", onPauseEv);
        audio.removeEventListener("ended", onEndEv);
        audio.removeEventListener("error", onErrorEv);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, currentTrack, onPlay, onPause, onEnd, onError, onTimeUpdate, tracks.length]);

    // Keep audio src in sync with current track
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio || !currentTrack) return;

      setErrorMsg("");
      audio.crossOrigin = "anonymous";
      audio.src = currentTrack.src;
      audio.load();
      setProgress(0);
      setDuration(0);
      audio.volume = volume;
      audio.muted = muted;

      const doPlay = isPlaying || autoPlay;
      if (doPlay) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // likely blocked by browser until user gesture
            setIsPlaying(false);
          });
      }
      onTrackChange?.(currentIndex, currentTrack);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, currentTrack]);

    // Keep volume/muted synced to audio element
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = volume;
      audio.muted = muted;
      onVolumeChange?.(volume, muted);
    }, [volume, muted, onVolumeChange]);

    // Keyboard shortcuts (container must be focused)
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!keyboardShortcuts) return;
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "arrowleft":
          e.preventDefault();
          seek((audioRef.current?.currentTime || 0) - 5);
          break;
        case "arrowright":
          e.preventDefault();
          seek((audioRef.current?.currentTime || 0) + 5);
          break;
        case "arrowup":
          e.preventDefault();
          setVolume((v) => clamp(v + 0.05, 0, 1));
          break;
        case "arrowdown":
          e.preventDefault();
          setVolume((v) => clamp(v - 0.05, 0, 1));
          break;
        case "m":
          setMuted((m) => !m);
          break;
        case "l":
          cycleRepeat();
          break;
        case "s":
          toggleShuffle();
          break;
        case "n":
          next();
          break;
        case "p":
          prev();
          break;
      }
    };

    // Imperative API
    useImperativeHandle(ref, (): MusicPlayerRef => ({
      play,
      pause,
      toggle,
      next,
      prev,
      seek,
      setVolume: (v: number) => setVolume(clamp(v, 0, 1)),
      mute: (flag: boolean) => setMuted(!!flag),
      setShuffle: (flag: boolean) => {
        setShuffle(!!flag);
        if (flag) refillQueue(currentIndex);
      },
      setRepeat: (mode: RepeatMode) => {
        if (["off", "all", "one"].includes(mode)) setRepeatMode(mode);
      },
      getState: () => ({
        currentIndex,
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        muted,
        shuffle,
        repeatMode,
        queue,
        history,
      }),
    }));

    function play() {
      const audio = audioRef.current;
      if (!audio) return;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    function pause() {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
    }

    function toggle() {
      isPlaying ? pause() : play();
    }

    function seek(sec: number) {
      const audio = audioRef.current;
      if (!audio || duration === 0) return;
      const t = clamp(sec, 0, duration);
      audio.currentTime = t;
      setProgress(t);
    }

    function toggleShuffle() {
      setShuffle((s) => {
        if (!s) {
          refillQueue(currentIndex);
        }
        return !s;
      });
    }

    function cycleRepeat() {
      setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"));
    }

    function handleEnded() {
      if (repeatMode === "one") {
        seek(0);
        play();
        return;
      }
      const didNext = next(false, true);
      if (!didNext) {
        setIsPlaying(false);
        pause();
      }
    }

    function next(fromError = false, fromEnded = false) {
      if (!tracks || tracks.length === 0) return false;
      const len = tracks.length;
      const idx = currentIndex;

      let nextIndex: number | null = null;

      if (shuffle) {
        if (queue.length === 0) {
          refillQueue(idx);
          if (queue.length === 0) return false; // single track edge
        }
        const [n, ...rest] = queue;
        nextIndex = n;
        setQueue(rest);
      } else {
        nextIndex = idx + 1;
        if (nextIndex >= len) {
          if (repeatMode === "all") {
            nextIndex = 0;
          } else {
            return false;
          }
        }
      }

      setHistory((h) => {
        const nextHistory = [...h, idx];
        // prevent unbounded growth
        if (nextHistory.length > 200) nextHistory.splice(0, nextHistory.length - 200);
        return nextHistory;
      });
      setCurrentIndex(nextIndex);
      if (isPlaying || fromEnded || fromError) {
        setTimeout(() => play(), 0);
      }
      return true;
    }

    function prev() {
      const audio = audioRef.current;
      if (audio && audio.currentTime > 3) {
        seek(0);
        return;
      }
      if (history.length > 0) {
        setHistory((h) => {
          const copy = [...h];
          const prevIndex = copy.pop();
          if (prevIndex == null) return h;
          setCurrentIndex(prevIndex);
          if (isPlaying) setTimeout(() => play(), 0);
          return copy;
        });
        return;
      }
      const len = tracks.length;
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        if (repeatMode === "all") {
          prevIndex = len - 1;
        } else {
          prevIndex = 0;
        }
      }
      if (prevIndex !== currentIndex) {
        setHistory((h) => [...h, currentIndex]);
        setCurrentIndex(prevIndex);
        if (isPlaying) setTimeout(() => play(), 0);
      }
    }

    const progressPct = duration ? Math.min(100, (progress / duration) * 100) : 0;

    if (!tracks || tracks.length === 0) {
      return (
        <div
          className={["mp", "w-full rounded-xl border shadow-sm p-4", className || ""].join(" ")}
          style={themeVars}
          ref={containerRef}
          role="region"
          aria-label="Music player"
        >
          <div className="text-sm text-[hsl(var(--muted-foreground))]">No tracks provided</div>
        </div>
      );
    }

    return (
      <div
        className={[
          "mp",
          "w-full rounded-xl border shadow-sm",
          "p-4 sm:p-5",
          "flex flex-col gap-3 sm:gap-4",
          className || "",
        ].join(" ")}
        style={themeVars}
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Music player"
        onKeyDown={onKeyDown}
      >
        <audio ref={audioRef} preload="metadata" />

        {/* Header: Artwork + Meta */}
        <div className="mp__header flex items-center gap-3">
          <div
            className="mp__art size-14 sm:size-16 shrink-0 overflow-hidden rounded-lg border"
            style={{ borderColor: "var(--mp-border)" }}
          >
            {currentTrack?.artwork ? (
              <img
                src={currentTrack.artwork}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className="mp__art--placeholder grid h-full w-full place-items-center text-xl"
                aria-hidden="true"
              >
                ♪
              </div>
            )}
          </div>
          <div className="mp__meta min-w-0">
            <div
              className="mp__title truncate font-medium"
              title={currentTrack?.title || "Untitled"}
            >
              {currentTrack?.title || "Untitled"}
            </div>
            <div
              className="mp__artist truncate text-sm text-[hsl(var(--muted-foreground))]"
              title={currentTrack?.artist || "Unknown"}
            >
              {currentTrack?.artist || "Unknown"}
            </div>
            {errorMsg ? (
              <div
                className="mp__error mt-1 text-xs text-red-500"
                role="status"
                aria-live="polite"
              >
                ⚠ {errorMsg}
              </div>
            ) : null}
          </div>
        </div>

        {/* Controls */}
        <div className="mp__controls flex items-center gap-2">
          {mergedControls.prevNext && (
            <button
              className="mp__btn inline-flex size-9 items-center justify-center rounded-md border text-sm transition-colors hover:bg-[hsl(var(--accent)/0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]"
              onClick={prev}
              aria-label="Previous"
              title="Previous (P)"
              type="button"
              style={{ borderColor: "var(--mp-border)" }}
            >
              {ICONS.prev}
            </button>
          )}

          <button
            className="mp__btn mp__btn--primary inline-flex h-9 min-w-9 items-center justify-center rounded-md bg-[hsl(var(--primary))] px-3 text-[hsl(var(--primary-foreground))] shadow transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]"
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            title="Play/Pause (Space)"
            type="button"
          >
            {isPlaying ? ICONS.pause : ICONS.play}
          </button>

          {mergedControls.prevNext && (
            <button
              className="mp__btn inline-flex size-9 items-center justify-center rounded-md border text-sm transition-colors hover:bg-[hsl(var(--accent)/0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]"
              onClick={() => next()}
              aria-label="Next"
              title="Next (N)"
              type="button"
              style={{ borderColor: "var(--mp-border)" }}
            >
              {ICONS.next}
            </button>
          )}

          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            {mergedControls.shuffle && (
              <button
                className={[
                  "mp__btn inline-flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-[hsl(var(--accent)/0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]",
                  shuffle ? "bg-[hsl(var(--accent)/0.12)]" : "",
                ].join(" ")}
                onClick={toggleShuffle}
                aria-pressed={shuffle}
                aria-label="Shuffle"
                title="Shuffle (S)"
                type="button"
                style={{ borderColor: "var(--mp-border)" }}
              >
                {shuffle ? ICONS.shuffleOn : ICONS.shuffleOff}
              </button>
            )}

            {mergedControls.repeat && (
              <button
                className={[
                  "mp__btn inline-flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-[hsl(var(--accent)/0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]",
                  repeatMode !== "off" ? "bg-[hsl(var(--accent)/0.12)]" : "",
                ].join(" ")}
                onClick={cycleRepeat}
                aria-label={`Repeat: ${repeatMode}`}
                title="Repeat (L)"
                type="button"
                style={{ borderColor: "var(--mp-border)" }}
              >
                {repeatMode === "one"
                  ? ICONS.repeatOne
                  : repeatMode === "all"
                  ? ICONS.repeatAll
                  : ICONS.repeatOff}
              </button>
            )}

            {mergedControls.volume && (
              <div className="mp__volume ml-1 flex items-center gap-2">
                <button
                  className="mp__btn inline-flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-[hsl(var(--accent)/0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute" : "Mute"}
                  title="Mute (M)"
                  type="button"
                  style={{ borderColor: "var(--mp-border)" }}
                >
                  {muted || volume === 0 ? ICONS.mute : ICONS.volume}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setMuted(false);
                    setVolume(clamp(v, 0, 1));
                  }}
                  aria-label="Volume"
                  aria-valuemin={0}
                  aria-valuemax={1}
                  aria-valuenow={muted ? 0 : volume}
                  aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)}%`}
                  className="h-2 w-28 cursor-pointer appearance-none rounded-full"
                  style={{
                    background: `linear-gradient(to right, var(--mp-accent) ${
                      (muted ? 0 : volume) * 100
                    }%, var(--mp-track) ${(muted ? 0 : volume) * 100}%)`,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Waveform or Seek */}
        {wf.enabled ? (
          <WaveformCanvas
            src={currentTrack?.src}
            progress={progress}
            duration={duration}
            onSeek={(t) => seek(t)}
            opts={wf}
          />
        ) : null}

        {!wf.enabled || !wf.replaceSeekBar ? (
          <div className="mp__progress flex items-center gap-3">
            {mergedControls.time && (
              <div className="mp__time min-w-[3.25rem] text-xs tabular-nums">
                {formatTime(progress)}
              </div>
            )}
            <input
              className="mp__seek h-2 w-full cursor-pointer appearance-none rounded-full"
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration || 0)}
              aria-valuenow={Math.floor(progress || 0)}
              aria-valuetext={`${formatTime(progress)} of ${formatTime(duration)}`}
              style={{
                background: `linear-gradient(to right, var(--mp-accent) ${progressPct}%, var(--mp-track) ${progressPct}%)`,
              }}
            />
            {mergedControls.time && (
              <div className="mp__time min-w-[3.25rem] text-xs tabular-nums">
                {formatTime(duration)}
              </div>
            )}
          </div>
        ) : null}

        {/* Playlist */}
        {showPlaylist && (
          <div
            ref={listRef}
            className="mp__playlist mt-1 grid gap-1"
            role="listbox"
            aria-label="Playlist"
            tabIndex={0}
            aria-activedescendant={`${idBase}-opt-${activeOption}`}
            onKeyDown={(e) => {
              const key = e.key;
              const max = tracks.length - 1;
              const focusOption = (i: number) => {
                setActiveOption(i);
                listRef.current
                  ?.querySelector<HTMLElement>(`[data-index="${i}"]`)
                  ?.focus();
              };
              switch (key) {
                case "ArrowDown":
                  e.preventDefault();
                  focusOption(Math.min(max, activeOption + 1));
                  break;
                case "ArrowUp":
                  e.preventDefault();
                  focusOption(Math.max(0, activeOption - 1));
                  break;
                case "Home":
                  e.preventDefault();
                  focusOption(0);
                  break;
                case "End":
                  e.preventDefault();
                  focusOption(max);
                  break;
                case "Enter":
                case " ":
                  e.preventDefault();
                  if (activeOption !== currentIndex) {
                    setHistory((h) => [...h, currentIndex]);
                    setCurrentIndex(activeOption);
                    if (shuffle) {
                      setQueue((q) => q.filter((x) => x !== activeOption));
                    }
                    if (isPlaying) setTimeout(() => play(), 0);
                  }
                  break;
              }
            }}
          >
            {tracks.map((t, i) => {
              const active = i === currentIndex;
              return (
                <button
                  id={`${idBase}-opt-${i}`}
                  data-index={i}
                  key={`${t.src}-${i}`}
                  className={[
                    "mp__track group flex w-full items-center gap-3 rounded-lg border px-2.5 py-2 text-left transition-colors",
                    "hover:bg-[hsl(var(--accent)/0.07)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]",
                    active ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent)/0.08)]" : "border-[hsl(var(--border))]",
                  ].join(" ")}
                  onClick={() => {
                    if (i === currentIndex) return;
                    setHistory((h) => [...h, currentIndex]);
                    setCurrentIndex(i);
                    if (shuffle) {
                      setQueue((q) => q.filter((x) => x !== i));
                    }
                    if (isPlaying) setTimeout(() => play(), 0);
                  }}
                  role="option"
                  aria-selected={active}
                  title={`${t.title || "Untitled"} — ${t.artist || "Unknown"}`}
                  tabIndex={i === activeOption ? 0 : -1}
                >
                  <div
                    className="mp__track-art size-10 shrink-0 overflow-hidden rounded-md border"
                    style={{ borderColor: "var(--mp-border)" }}
                    aria-hidden="true"
                  >
                    {t.artwork ? (
                      <img
                        src={t.artwork}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="mp__track-art--placeholder grid h-full w-full place-items-center text-base">
                        ♪
                      </div>
                    )}
                  </div>
                  <div className="mp__track-meta min-w-0 flex-1">
                    <div className="mp__track-title truncate text-sm font-medium">
                      {t.title || "Untitled"}
                    </div>
                    <div className="mp__track-artist truncate text-xs text-[hsl(var(--muted-foreground))]">
                      {t.artist || "Unknown"}
                    </div>
                  </div>
                  {active ? (
                    <div
                      className="mp__playing-dot ml-auto text-[hsl(var(--primary))]"
                      aria-hidden="true"
                    >
                      •
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
MusicPlayer.displayName = "MusicPlayer";