import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

/**
 * ===================================
 * Types & Interfaces
 * ===================================
 */
export type SidebarLink = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
};

export type Stat = {
  id: string;
  label: string;
  value: number | string;
};

export type ProjectStatus = "inProgress" | "upcoming" | "completed" | "paused";

export type Project = {
  id: string;
  name: string;
  subtitle?: string;
  date?: string;
  progress?: number;
  status?: ProjectStatus;
  accentColor?: string;
  participants?: string[];
  daysLeft?: number | string;
  bgColorClass?: string;
};

export type Message = {
  id: string;
  name: string;
  avatarUrl: string;
  text: string;
  date: string;
  starred?: boolean;
};

export type SortBy = "manual" | "date" | "name" | "progress";
export type SortDir = "asc" | "desc";
export type ThemeMode = "light" | "dark" | "system";

export type ProjectDashboardProps = {
  title?: string;
  user?: { name?: string; avatarUrl?: string };
  sidebarLinks?: SidebarLink[];
  stats?: Stat[];
  projects: Project[];
  messages?: Message[];
  view?: "grid" | "list";
  defaultView?: "grid" | "list";
  onViewChange?: (view: "grid" | "list") => void;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  messagesOpen?: boolean;
  defaultMessagesOpen?: boolean;
  onMessagesOpenChange?: (open: boolean) => void;
  sortBy?: SortBy;
  defaultSortBy?: SortBy;
  sortDir?: SortDir;
  defaultSortDir?: SortDir;
  onSortChange?: (by: SortBy, dir: SortDir) => void;
  statusFilter?: ProjectStatus | "all";
  defaultStatusFilter?: ProjectStatus | "all";
  onStatusFilterChange?: (status: ProjectStatus | "all") => void;
  pageSize?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  virtualizeList?: boolean;
  estimatedRowHeight?: number;
  onProjectClick?: (projectId: string) => void;
  onProjectAction?: (projectId: string, action: "open" | "edit" | "delete") => void;
  onProjectUpdate?: (project: Project) => void;
  onProjectsReorder?: (orderedIds: string[]) => void;
  allowCreate?: boolean;
  onProjectCreate?: (project: Project) => void;
  generateId?: () => string;
  onMessageStarChange?: (messageId: string, starred: boolean) => void;
  showThemeToggle?: boolean;
  onToggleTheme?: () => void;
  theme?: ThemeMode;
  defaultTheme?: ThemeMode;
  onThemeChange?: (mode: ThemeMode) => void;
  persistKey?: string;
  className?: string;
  loading?: boolean;
  emptyProjectsLabel?: string;
  emptyMessagesLabel?: string;
};

/**
 * ===================================
 * Spacing System - Consistent padding/margins
 * ===================================
 */
const spacing = {
  page: {
    header: "px-4 sm:px-6 lg:px-8 py-4",
    sidebar: "px-2 sm:px-3 py-4",
    main: "px-4 sm:px-6 lg:px-8 py-4",
    messages: "px-4 sm:px-6 py-4"
  },
  card: {
    base: "p-4 sm:p-5 lg:p-6",
    compact: "p-3 sm:p-4"
  },
  button: {
    sm: "px-2.5 py-1.5",
    md: "px-3 py-2",
    lg: "px-4 py-2.5"
  },
  gap: {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6"
  }
};

/**
 * ===================================
 * Utilities
 * ===================================
 */
const cx = (...classes: Array<string | false | null | undefined>) => {
  return classes.filter(Boolean).join(" ");
};

const parseDateLike = (v?: string): number => {
  if (!v) return 0;
  const ts = Date.parse(v);
  return Number.isNaN(ts) ? 0 : ts;
};

const clamp = (n: number, min: number, max: number) => {
  return Math.min(Math.max(n, min), max);
};

const readLS = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLS = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/**
 * ===================================
 * Icon Components
 * ===================================
 */
const Icons = {
  Dots: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
  Grid: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  List: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Bell: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Theme: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" />
    </svg>
  ),
  Trash: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 6h18M8 6V4h8v2m-1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  Home: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Chart: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M4 19V5M10 19V9M16 19V3M22 19H2" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Calendar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M7 2v4M17 2v4M3 8h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .33 1.8 1.8 0 0 0-.82 1.51V21.5a2 2 0 1 1-4 0v-.26A1.8 1.8 0 0 0 7 19.4a1.8 1.8 0 0 0-1.98-.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.33-1 1.8 1.8 0 0 0-1.51-.82H2.5a2 2 0 1 1 0-4h.26A1.8 1.8 0 0 0 4.6 7a1.8 1.8 0 0 0-.36-1.98l-.06-.06A2 2 0 1 1 7.01 2.13l.06.06A1.8 1.8 0 0 0 9 4.6c.34 0 .67-.11 1-.33.46-.31.77-.82.82-1.38V2.5a2 2 0 1 1 4 0v.26c.05.56.36 1.07.82 1.38.33.22.66.33 1 .33a1.8 1.8 0 0 0 1.98-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.8 1.8 0 0 0 19.4 9c0 .34.11.67.33 1 .31.46.82.77 1.38.82h.39a2 2 0 1 1 0 4h-.39c-.56.05-1.07.36-1.38.82-.22.33-.33.66-.33 1z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  Close: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Chat: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Star: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 2l3.1 6.3L22 9.3l-5 4.9 1.2 7-6.2-3.4L5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="currentColor" />
    </svg>
  ),
  Arrow: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 5v14m7-7-7 7-7-7" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  )
};

/**
 * ===================================
 * Main Component
 * ===================================
 */
export function ProjectDashboard({
  // Content
  title = "Portfolio",
  user = {
    name: "You",
    avatarUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=96&q=80&auto=format&fit=crop",
  },
  sidebarLinks = [
    { id: "home", label: "Home", active: true },
    { id: "charts", label: "Charts" },
    { id: "calendar", label: "Calendar" },
    { id: "settings", label: "Settings" },
  ],
  stats,
  // Data
  projects,
  messages = [],
  // View
  view,
  defaultView = "grid",
  onViewChange,
  // Search
  searchQuery,
  defaultSearchQuery = "",
  onSearchQueryChange,
  showSearch = true,
  searchPlaceholder = "Search",
  // Messages panel
  messagesOpen,
  defaultMessagesOpen = false,
  onMessagesOpenChange,
  // Sort
  sortBy,
  defaultSortBy = "date",
  sortDir,
  defaultSortDir = "desc",
  onSortChange,
  // Filter
  statusFilter,
  defaultStatusFilter = "all",
  onStatusFilterChange,
  // Pagination
  pageSize = 9,
  initialPage = 1,
  onPageChange,
  // Virtualization
  virtualizeList = false,
  estimatedRowHeight = 140,
  // Actions
  onProjectClick,
  onProjectAction,
  onProjectUpdate,
  onProjectsReorder,
  // Create
  allowCreate = true,
  onProjectCreate,
  generateId,
  onMessageStarChange,
  // Theme
  showThemeToggle = true,
  onToggleTheme,
  theme,
  defaultTheme = "system",
  onThemeChange,
  // Persistence
  persistKey,
  // Misc
  className = "",
  loading = false,
  emptyProjectsLabel = "No projects match your search.",
  emptyMessagesLabel = "No messages yet.",
}: ProjectDashboardProps) {
  const lsKey = persistKey ? (k: string) => `pd:${persistKey}:${k}` : null;

  // State management
  const [internalView, setInternalView] = useState<"grid" | "list">(
    lsKey ? readLS(lsKey("view"), defaultView) : defaultView
  );
  const viewMode = view ?? internalView;

  const [internalQuery, setInternalQuery] = useState<string>(
    lsKey ? readLS(lsKey("query"), defaultSearchQuery) : defaultSearchQuery
  );
  const query = searchQuery ?? internalQuery;

  const [internalMessagesOpen, setInternalMessagesOpen] = useState<boolean>(
    lsKey ? readLS(lsKey("messagesOpen"), defaultMessagesOpen) : defaultMessagesOpen
  );
  const isMessagesOpen = messagesOpen ?? internalMessagesOpen;

  const [internalSortBy, setInternalSortBy] = useState<SortBy>(
    lsKey ? readLS(lsKey("sortBy"), defaultSortBy) : defaultSortBy
  );
  const [internalSortDir, setInternalSortDir] = useState<SortDir>(
    lsKey ? readLS(lsKey("sortDir"), defaultSortDir) : defaultSortDir
  );
  const activeSortBy = sortBy ?? internalSortBy;
  const activeSortDir = sortDir ?? internalSortDir;

  const [internalStatusFilter, setInternalStatusFilter] = useState<ProjectStatus | "all">(
    lsKey ? readLS(lsKey("statusFilter"), defaultStatusFilter) : defaultStatusFilter
  );
  const activeStatusFilter = statusFilter ?? internalStatusFilter;

  const [page, setPage] = useState<number>(
    lsKey ? readLS(lsKey("page"), initialPage) : initialPage
  );

  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  
  useEffect(() => {
    if (onProjectUpdate || onProjectsReorder) return;
    setLocalProjects(projects);
  }, [projects, onProjectUpdate, onProjectsReorder]);

  const dataProjects = onProjectUpdate || onProjectsReorder ? projects : localProjects;

  const searchInputId = useId();
  const statusSelectId = useId();

  // Compute stats
  const computedStats: Stat[] = useMemo(() => {
    if (stats) return stats;
    const total = dataProjects.length;
    const byStatus = dataProjects.reduce(
      (acc, p) => {
        acc[p.status ?? "inProgress"]++;
        return acc;
      },
      { inProgress: 0, upcoming: 0, completed: 0, paused: 0 } as Record<ProjectStatus, number>
    );
    return [
      { id: "inProgress", label: "In Progress", value: byStatus.inProgress },
      { id: "upcoming", label: "Upcoming", value: byStatus.upcoming },
      { id: "completed", label: "Completed", value: byStatus.completed },
      { id: "total", label: "Total Projects", value: total },
    ];
  }, [stats, dataProjects]);

  // Filter and sort projects
  const orderMap = useMemo(() => {
    const map = new Map<string, number>();
    dataProjects.forEach((p, i) => map.set(p.id, i));
    return map;
  }, [dataProjects]);

  const preparedProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = dataProjects.slice();

    if (activeStatusFilter !== "all") {
      list = list.filter((p) => (p.status ?? "inProgress") === activeStatusFilter);
    }
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subtitle?.toLowerCase().includes(q) ?? false)
      );
    }

    list.sort((a, b) => {
      let cmp = 0;
      switch (activeSortBy) {
        case "manual":
          cmp = (orderMap.get(a.id)! - orderMap.get(b.id)!);
          break;
        case "date":
          cmp = parseDateLike(a.date) - parseDateLike(b.date);
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "progress":
          cmp = (a.progress ?? 0) - (b.progress ?? 0);
          break;
      }
      return activeSortBy === "manual" ? cmp : activeSortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [dataProjects, query, activeSortBy, activeSortDir, activeStatusFilter, orderMap]);

  // Pagination
  const totalPages = virtualizeList ? 1 : Math.max(1, Math.ceil(preparedProjects.length / pageSize));
  const currentPage = virtualizeList ? 1 : clamp(page, 1, totalPages);
  const pagedProjects = useMemo(() => {
    if (virtualizeList) return preparedProjects;
    const start = (currentPage - 1) * pageSize;
    return preparedProjects.slice(start, start + pageSize);
  }, [preparedProjects, currentPage, pageSize, virtualizeList]);

  useEffect(() => {
    if (!virtualizeList) setPage(1);
  }, [query, activeStatusFilter, activeSortBy, activeSortDir, pageSize, virtualizeList]);

  // Theme handling
  const [internalTheme, setInternalTheme] = useState<ThemeMode>(() => {
    if (theme) return theme;
    if (lsKey) return readLS(lsKey("theme"), "system");
    return defaultTheme;
  });
  const activeTheme = theme ?? internalTheme;

  const applyTheme = useCallback((mode: ThemeMode) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    const isDark = mode === "dark" || (mode === "system" && prefersDark);
    root.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    applyTheme(activeTheme);
    if (lsKey) writeLS(lsKey("theme"), activeTheme);
  }, [activeTheme, applyTheme, lsKey]);

  const toggleTheme = () => {
    if (onToggleTheme) return onToggleTheme();
    const next: ThemeMode =
      activeTheme === "dark" ? "light" : activeTheme === "light" ? "system" : "dark";
    if (theme === undefined) setInternalTheme(next);
    onThemeChange?.(next);
  };

  // Local state for editing and creation
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Project | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState<Project>({
    id: "",
    name: "",
    subtitle: "",
    date: "",
    progress: 0,
    status: "inProgress",
    accentColor: "#6366f1",
    participants: [],
  });
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [liveMsg, setLiveMsg] = useState("");

  // Virtualization refs
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const messagesPanelRef = useRef<HTMLDivElement | null>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Virtualization logic
  const onScroll = useCallback(() => {
    const t = scrollRef.current?.scrollTop ?? 0;
    setScrollTop(t);
  }, []);

  useEffect(() => {
    if (!virtualizeList) return;
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [virtualizeList, onScroll]);

  const viewportH = scrollRef.current?.clientHeight ?? 0;
  const itemH = estimatedRowHeight;
  const overscan = 3;
  const totalCount = pagedProjects.length;
  const startIndex = virtualizeList && viewMode === "list" 
    ? Math.max(0, Math.floor(scrollTop / itemH) - overscan) : 0;
  const endIndex = virtualizeList && viewMode === "list"
    ? Math.min(totalCount, Math.ceil((scrollTop + viewportH) / itemH) + overscan)
    : totalCount;
  const before = startIndex * itemH;
  const after = Math.max(0, (totalCount - endIndex) * itemH);
  const visibleProjects = virtualizeList && viewMode === "list"
    ? pagedProjects.slice(startIndex, endIndex)
    : pagedProjects;

  // Message starring
  const [localStarred, setLocalStarred] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const seed: Record<string, boolean> = {};
    messages.forEach((m) => (seed[m.id] = !!m.starred));
    setLocalStarred(seed);
  }, [messages]);

  const isStarred = (m: Message) => m.starred ?? localStarred[m.id] ?? false;
  const toggleStar = (m: Message) => {
    const next = !isStarred(m);
    if (onMessageStarChange) {
      onMessageStarChange(m.id, next);
    } else {
      setLocalStarred((s) => ({ ...s, [m.id]: next }));
    }
  };

  // Persistence effects
  useEffect(() => { if (lsKey) writeLS(lsKey("view"), viewMode); }, [lsKey, viewMode]);
  useEffect(() => { if (lsKey) writeLS(lsKey("query"), query); }, [lsKey, query]);
  useEffect(() => { if (lsKey) writeLS(lsKey("messagesOpen"), isMessagesOpen); }, [lsKey, isMessagesOpen]);
  useEffect(() => { if (lsKey) { writeLS(lsKey("sortBy"), activeSortBy); writeLS(lsKey("sortDir"), activeSortDir); } }, [lsKey, activeSortBy, activeSortDir]);
  useEffect(() => { if (lsKey) writeLS(lsKey("statusFilter"), activeStatusFilter); }, [lsKey, activeStatusFilter]);
  useEffect(() => { if (lsKey && !virtualizeList) writeLS(lsKey("page"), currentPage); }, [lsKey, currentPage, virtualizeList]);

  // Keyboard handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMessagesOpen) setMessagesOpen(false);
        if (reorderMode) setReorderMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMessagesOpen, reorderMode]);

  // Focus trap for messages panel
  useEffect(() => {
    if (!isMessagesOpen) return;
    const root = messagesPanelRef.current;
    if (!root) return;

    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusables.length === 0) return;
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          (last as HTMLElement).focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          (first as HTMLElement).focus();
          e.preventDefault();
        }
      }
    };
    root.addEventListener("keydown", handleKeyDown);
    return () => root.removeEventListener("keydown", handleKeyDown);
  }, [isMessagesOpen]);

  // Controlled/uncontrolled setters
  const setView = (next: "grid" | "list") => {
    if (view === undefined) setInternalView(next);
    onViewChange?.(next);
  };

  const setSearch = (q: string) => {
    if (searchQuery === undefined) setInternalQuery(q);
    onSearchQueryChange?.(q);
  };

  const setMessagesOpen = (open: boolean) => {
    if (messagesOpen === undefined) setInternalMessagesOpen(open);
    onMessagesOpenChange?.(open);
  };

  const setSort = (by: SortBy, dir: SortDir) => {
    if (sortBy === undefined) setInternalSortBy(by);
    if (sortDir === undefined) setInternalSortDir(dir);
    onSortChange?.(by, dir);
  };

  const setStatusFilter = (status: ProjectStatus | "all") => {
    if (statusFilter === undefined) setInternalStatusFilter(status);
    onStatusFilterChange?.(status);
  };

  const goToPage = (p: number) => {
    setPage(p);
    onPageChange?.(p);
  };

  // Project actions
  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setEditDraft({ ...p });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = () => {
    if (!editDraft) return;
    if (onProjectUpdate) {
      onProjectUpdate(editDraft);
    } else {
      setLocalProjects((arr) => arr.map((x) => (x.id === editDraft.id ? editDraft : x)));
    }
    setEditingId(null);
    setEditDraft(null);
  };

  const mkId = () =>
    generateId?.() ??
    Math.random().toString(36).slice(2, 8) + "-" + Date.now().toString(36).slice(-4);

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = mkId();
    const proj: Project = { ...createDraft, id };
    if (onProjectCreate) {
      onProjectCreate(proj);
    } else {
      setLocalProjects((arr) => [proj, ...arr]);
    }
    setCreateOpen(false);
    setCreateDraft({
      id: "",
      name: "",
      subtitle: "",
      date: "",
      progress: 0,
      status: "inProgress",
      accentColor: "#6366f1",
      participants: [],
    });
  };

  const openDetail = (p: Project) => {
    if (onProjectClick) return onProjectClick(p.id);
    setDetailProject(p);
  };

  // Drag and drop
  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const doReorder = (ids: string[]) => {
    if (onProjectsReorder) {
      onProjectsReorder(ids);
    } else {
      setLocalProjects((arr) => {
        const map = new Map(arr.map((p) => [p.id, p]));
        return ids.map((id) => map.get(id)!).filter(Boolean);
      });
    }
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const ids = preparedProjects.map((p) => p.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);

    const full = dataProjects.map((p) => p.id);
    const reordered = reorderWithinFull(full, ids);
    doReorder(reordered);
    setDragId(null);
    announce(`Moved item to position ${to + 1}.`);
  };

  function reorderWithinFull(fullIds: string[], visibleIds: string[]) {
    const setVisible = new Set(visibleIds);
    const remaining = fullIds.filter((id) => !setVisible.has(id));
    return [...visibleIds, ...remaining];
  }

  const announce = (msg: string) => {
    setLiveMsg("");
    setTimeout(() => setLiveMsg(msg), 10);
  };

  const canReorder = activeSortBy === "manual" && !query && activeStatusFilter === "all" && viewMode === "list";

  const moveBy = (id: string, delta: number) => {
    const vis = preparedProjects.map((p) => p.id);
    const i = vis.indexOf(id);
    if (i < 0) return;
    const j = clamp(i + delta, 0, vis.length - 1);
    if (i === j) return;
    vis.splice(j, 0, vis.splice(i, 1)[0]);
    const reordered = reorderWithinFull(dataProjects.map((p) => p.id), vis);
    doReorder(reordered);
    announce(`Moved to position ${j + 1}.`);
  };

  const moveToIndex = (id: string, index: number) => {
    const vis = preparedProjects.map((p) => p.id);
    const i = vis.indexOf(id);
    const j = clamp(index, 0, vis.length - 1);
    if (i < 0 || i === j) return;
    vis.splice(j, 0, vis.splice(i, 1)[0]);
    const reordered = reorderWithinFull(dataProjects.map((p) => p.id), vis);
    doReorder(reordered);
    announce(`Moved to position ${j + 1}.`);
  };

  const getNavIcon = (id?: string) => {
    switch ((id || "").toLowerCase()) {
      case "home": return <Icons.Home className="size-5" />;
      case "charts":
      case "analytics": return <Icons.Chart className="size-5" />;
      case "calendar": return <Icons.Calendar className="size-5" />;
      case "settings":
      case "preferences": return <Icons.Settings className="size-5" />;
      default: return <Icons.Logo className="size-5" />;
    }
  };

  return (
    <div className={cx(
      "pd-container flex flex-col h-screen bg-slate-50 dark:bg-slate-900",
      className
    )}>
      {/* Live region for accessibility */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" ref={liveRef}>
        {liveMsg}
      </div>

      {/* Header */}
      <header className={cx(
        "flex items-center justify-between border-b border-slate-200 dark:border-slate-700",
        spacing.page.header,
        spacing.gap.sm
      )}>
        <div className={cx("flex items-center min-w-0", spacing.gap.sm)}>
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-indigo-600 text-white dark:bg-indigo-500 shrink-0">
            <Icons.Logo className="size-5" />
          </span>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
            {title}
          </h1>

          {showSearch && (
            <label
              htmlFor={searchInputId}
              className={cx(
                "hidden md:flex items-center rounded-lg bg-white dark:bg-slate-800",
                "ring-1 ring-slate-200 dark:ring-slate-700 px-3 py-2 ml-4",
                spacing.gap.xs
              )}
            >
              <Icons.Search className="size-4 text-slate-500 dark:text-slate-400" />
              <input
                id={searchInputId}
                aria-label="Search projects"
                className="bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none text-sm w-56"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          )}
        </div>

        <div className={cx("flex items-center", spacing.gap.xs)}>
          {allowCreate && (
            <button
              className={cx(
                "rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors",
                spacing.button.md
              )}
              onClick={() => setCreateOpen(true)}
            >
              <span className="hidden sm:inline">New Project</span>
              <Icons.Plus className="size-5 sm:hidden" />
            </button>
          )}

          {showThemeToggle && (
            <button
              title={`Theme: ${activeTheme}`}
              onClick={toggleTheme}
              className={cx(
                "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
                "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                "p-2"
              )}
            >
              <Icons.Theme className="size-5" />
              <span className="sr-only">Toggle theme</span>
            </button>
          )}

          <button
            className={cx(
              "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
              "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
              "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
              "p-2"
            )}
            aria-label="Notifications"
          >
            <Icons.Bell className="size-5" />
          </button>

          <button
            className={cx(
              "flex items-center rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
              "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
              "pl-2 pr-3 py-1.5",
              spacing.gap.xs
            )}
            aria-label="Account menu"
          >
            <img src={user?.avatarUrl} alt="" className="size-8 rounded-md object-cover" />
            <span className="hidden sm:inline text-sm font-medium text-slate-800 dark:text-slate-100">
              {user?.name}
            </span>
          </button>

          {/* Mobile messages toggle */}
          <button
            className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            onClick={() => setMessagesOpen(true)}
            aria-label="Open messages"
          >
            <Icons.Chat className="size-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={cx(
          "hidden sm:flex flex-col items-center border-r border-slate-200 dark:border-slate-700",
          spacing.page.sidebar,
          spacing.gap.sm
        )}>
          {sidebarLinks.map((l) => (
            <a
              key={l.id}
              href={l.href || "#"}
              className={cx(
                "size-11 inline-flex items-center justify-center rounded-lg transition-all",
                "ring-1 ring-slate-200 dark:ring-slate-700",
                l.active
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
              aria-current={l.active ? "page" : undefined}
              title={l.label}
            >
              {l.icon ?? getNavIcon(l.id)}
              <span className="sr-only">{l.label}</span>
            </a>
          ))}
        </aside>

        {/* Main content */}
        <main className={cx(
          "flex-1 min-w-0 overflow-hidden flex flex-col",
          spacing.page.main
        )}>
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {/* Stats */}
            <div className={cx("flex flex-wrap items-center", spacing.gap.md)}>
              {computedStats.map((s, i) => (
                <div key={s.id} className={cx("flex items-center", spacing.gap.xs)}>
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {s.value}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {s.label}
                  </span>
                  {i < computedStats.length - 1 && (
                    <span className="ml-4 w-px h-8 bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>
              ))}
            </div>

            {/* Filters and view toggles */}
            <div className={cx("flex items-center", spacing.gap.xs)}>
              <label className="sr-only" htmlFor={statusSelectId}>
                Filter by status
              </label>
              <select
                id={statusSelectId}
                value={activeStatusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
                className={cx(
                  "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
                  spacing.button.sm
                )}
              >
                <option value="all">All</option>
                <option value="inProgress">In progress</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>

              <div className={cx("inline-flex items-center", spacing.gap.xs)}>
                <label className="sr-only" htmlFor="sortBy">Sort by</label>
                <select
                  id="sortBy"
                  value={activeSortBy}
                  onChange={(e) => setSort(e.target.value as SortBy, activeSortDir)}
                  className={cx(
                    "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                    "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
                    spacing.button.sm
                  )}
                >
                  <option value="manual">Manual</option>
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="progress">Progress</option>
                </select>
                {activeSortBy !== "manual" && (
                  <button
                    className={cx(
                      "p-2 rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                      "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    )}
                    aria-label={`Sort direction: ${activeSortDir}`}
                    onClick={() => setSort(activeSortBy, activeSortDir === "asc" ? "desc" : "asc")}
                  >
                    <Icons.Arrow className={cx("size-4", activeSortDir === "asc" && "rotate-180")} />
                  </button>
                )}
              </div>

              <button
                className={cx(
                  "p-2 rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 transition-colors",
                  reorderMode 
                    ? "bg-indigo-100 dark:bg-indigo-900/50 ring-indigo-300 dark:ring-indigo-700"
                    : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}
                title="Reorder items"
                aria-pressed={reorderMode}
                onClick={() => {
                  setReorderMode(!reorderMode);
                  if (!reorderMode && !canReorder) {
                    announce("Switch to Manual sort, clear search, and show All to enable reordering.");
                  } else {
                    announce(reorderMode ? "Reorder mode off." : "Reorder mode on. Use arrow keys to move items.");
                  }
                }}
                disabled={!canReorder}
              >
                ⇅
              </button>

              <div className="inline-flex rounded-lg ring-1 ring-slate-200 dark:ring-slate-700">
                <button
                  onClick={() => setView("list")}
                  className={cx(
                    "p-2 rounded-l-lg transition-colors",
                    viewMode === "list"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                  )}
                  title="List view"
                  aria-pressed={viewMode === "list"}
                >
                  <Icons.List className="size-5" />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={cx(
                    "p-2 rounded-r-lg transition-colors",
                    viewMode === "grid"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                  )}
                  title="Grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  <Icons.Grid className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {reorderMode && (
            <div className="mb-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-sm text-indigo-700 dark:text-indigo-300">
              Reorder mode active. Use ↑/↓ arrows to move items, Home/End for first/last position, Escape to exit.
            </div>
          )}

          {/* Projects */}
          <section
            aria-label="Projects"
            ref={scrollRef}
            className={cx(
              "flex-1 overflow-y-auto",
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                : cx("flex flex-col", spacing.gap.sm)
            )}
            style={virtualizeList && viewMode === "list" ? { position: "relative" } : undefined}
          >
            {loading && (
              <div className="col-span-full">
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                    <div key={i} className="h-44 rounded-xl bg-slate-200 dark:bg-slate-700" />
                  ))}
                </div>
              </div>
            )}

            {virtualizeList && viewMode === "list" && !loading && (
              <div style={{ height: before }} aria-hidden="true" />
            )}

            {!loading && visibleProjects.map((p) => {
              const accent = p.accentColor || "#6366f1";
              const isEditing = editingId === p.id;

              return (
                <article
                  key={p.id}
                  draggable={canReorder}
                  onDragStart={() => canReorder && handleDragStart(p.id)}
                  onDragOver={canReorder ? handleDragOver : undefined}
                  onDrop={() => canReorder && handleDrop(p.id)}
                  className={cx(
                    "group rounded-xl transition-all",
                    "ring-1 ring-slate-200 dark:ring-slate-700",
                    p.bgColorClass || "bg-white dark:bg-slate-800",
                    viewMode === "list" 
                      ? cx("flex items-center", spacing.card.compact, spacing.gap.md)
                      : cx("flex flex-col", spacing.card.base),
                    "hover:shadow-md hover:ring-slate-300 dark:hover:ring-slate-600",
                    canReorder && "cursor-grab active:cursor-grabbing",
                    reorderMode && "ring-2 ring-indigo-300 dark:ring-indigo-700"
                  )}
                  style={virtualizeList && viewMode === "list" ? { height: estimatedRowHeight } : undefined}
                  tabIndex={reorderMode && viewMode === "list" ? 0 : -1}
                  onKeyDown={(e) => {
                    if (!reorderMode || !canReorder) return;
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      moveBy(p.id, -1);
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      moveBy(p.id, +1);
                    } else if (e.key === "Home") {
                      e.preventDefault();
                      moveToIndex(p.id, 0);
                    } else if (e.key === "End") {
                      e.preventDefault();
                      moveToIndex(p.id, preparedProjects.length - 1);
                    }
                  }}
                  aria-label={`${p.name} card`}
                >
                  {/* Card header */}
                  <div className={cx(
                    "flex items-start justify-between",
                    viewMode === "list" ? "w-full" : ""
                  )}>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {p.date}
                    </span>

                    <div className={cx("flex items-center", spacing.gap.xs, "opacity-0 group-hover:opacity-100 transition-opacity")}>
                      <button
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(p);
                          onProjectAction?.(p.id, "edit");
                        }}
                        title="Edit"
                        disabled={reorderMode}
                      >
                        ✏️
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProjectAction?.(p.id, "delete");
                          if (!onProjectAction && !onProjectUpdate) {
                            setLocalProjects((arr) => arr.filter((x) => x.id !== p.id));
                          }
                        }}
                        title="Delete"
                        disabled={reorderMode}
                      >
                        <Icons.Trash className="size-4 text-slate-500 dark:text-slate-400" />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProjectAction?.(p.id, "open");
                        }}
                        title="More options"
                        disabled={reorderMode}
                      >
                        <Icons.Dots className="size-4 text-slate-500 dark:text-slate-400 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  {!isEditing ? (
                    <div className={viewMode === "list" ? "flex-1 min-w-0" : "mt-3"}>
                      <button
                        className="text-left w-full"
                        onClick={() => openDetail(p)}
                        disabled={reorderMode}
                      >
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {p.name}
                        </p>
                        {p.subtitle && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                            {p.subtitle}
                          </p>
                        )}
                      </button>
                    </div>
                  ) : (
                    <form
                      className={cx(
                        "mt-3 grid gap-2",
                        viewMode === "list" ? "w-full grid-cols-2" : "grid-cols-1"
                      )}
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveEdit();
                      }}
                    >
                      <input
                        className={cx(
                          "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                          "bg-white dark:bg-slate-900/40",
                          spacing.button.sm
                        )}
                        value={editDraft?.name ?? ""}
                        onChange={(e) => setEditDraft((d) => ({ ...(d as Project), name: e.target.value }))}
                        placeholder="Project name"
                        required
                      />
                      <input
                        className={cx(
                          "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                          "bg-white dark:bg-slate-900/40",
                          spacing.button.sm
                        )}
                        value={editDraft?.subtitle ?? ""}
                        onChange={(e) => setEditDraft((d) => ({ ...(d as Project), subtitle: e.target.value }))}
                        placeholder="Subtitle"
                      />
                      <div className={cx("col-span-full flex items-center", spacing.gap.xs, "mt-2")}>
                        <button type="submit" className={cx(
                          "rounded-lg bg-indigo-600 text-white hover:bg-indigo-500",
                          spacing.button.sm
                        )}>
                          Save
                        </button>
                        <button type="button" onClick={cancelEdit} className={cx(
                          "rounded-lg ring-1 ring-slate-300 dark:ring-slate-700",
                          spacing.button.sm
                        )}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Progress */}
                  {!isEditing && (
                    <div className={cx("mt-4", viewMode === "list" ? "w-48" : "w-full")}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Progress
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {p.progress ?? 0}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(Math.max(p.progress ?? 0, 0), 100)}%`,
                            backgroundColor: accent,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  {!isEditing && (
                    <div className={cx(
                      "mt-4 flex items-center justify-between",
                      viewMode === "list" ? "w-full" : ""
                    )}>
                      <div className="flex -space-x-2">
                        {(p.participants ?? []).slice(0, 3).map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt=""
                            className="size-8 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                          />
                        ))}
                        <button
                          className="size-8 inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 ring-2 ring-white dark:ring-slate-800 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          style={{ color: accent }}
                          title="Add participant"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(p);
                          }}
                          disabled={reorderMode}
                        >
                          <Icons.Plus className="size-3" />
                        </button>
                      </div>

                      <div className={cx("flex items-center", spacing.gap.xs)}>
                        {p.status && (
                          <span className={cx(
                            "text-xs px-2 py-0.5 rounded-full ring-1",
                            "ring-slate-200 dark:ring-slate-700",
                            "text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/40"
                          )}>
                            {p.status}
                          </span>
                        )}
                        {p.daysLeft !== undefined && (
                          <span className="text-xs font-medium" style={{ color: accent }}>
                            {typeof p.daysLeft === "number"
                              ? `${p.daysLeft} Days Left`
                              : p.daysLeft}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}

            {virtualizeList && viewMode === "list" && !loading && (
              <div style={{ height: after }} aria-hidden="true" />
            )}

            {!loading && visibleProjects.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                {emptyProjectsLabel}
              </div>
            )}
          </section>

          {/* Pagination */}
          {!loading && !virtualizeList && preparedProjects.length > pageSize && (
            <div className={cx(
              "flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700",
              "text-sm text-slate-600 dark:text-slate-300"
            )}>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className={cx("inline-flex items-center", spacing.gap.xs)}>
                <button
                  className={cx(
                    "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                    "bg-white dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed",
                    "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                    spacing.button.sm
                  )}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                <button
                  className={cx(
                    "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                    "bg-white dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed",
                    "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                    spacing.button.sm
                  )}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Messages Panel */}
        <aside
          ref={messagesPanelRef}
          className={cx(
            "fixed md:relative inset-y-0 right-0 z-40 w-80 md:w-96",
            "bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700",
            "transform transition-transform duration-300 md:transform-none",
            isMessagesOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
            "md:block",
            messages.length === 0 ? "hidden md:hidden" : ""
          )}
          aria-label="Client messages"
        >
          <div className={cx(
            "flex items-center justify-between border-b border-slate-200 dark:border-slate-700",
            spacing.page.messages
          )}>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Client Messages
            </p>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMessagesOpen(false)}
              aria-label="Close messages"
            >
              <Icons.Close className="size-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <div className={cx(
            "overflow-y-auto h-[calc(100%-64px)]",
            spacing.page.messages,
            "space-y-3"
          )}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={cx(
                  "flex items-start rounded-lg",
                  "ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800",
                  spacing.card.compact,
                  spacing.gap.sm
                )}
              >
                <img 
                  src={m.avatarUrl} 
                  alt="" 
                  className="size-10 rounded-full object-cover shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {m.name}
                    </div>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isStarred(m)}
                        onChange={() => toggleStar(m)}
                        className="sr-only"
                        aria-label={`Star message from ${m.name}`}
                      />
                      <Icons.Star 
                        className={cx(
                          "size-4 transition-colors",
                          isStarred(m) 
                            ? "text-yellow-400" 
                            : "text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500"
                        )} 
                      />
                    </label>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {m.text}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    {m.date}
                  </p>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                {emptyMessagesLabel}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Create Project Modal */}
      {allowCreate && createOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog" 
          aria-modal="true" 
          aria-label="Create project"
        >
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setCreateOpen(false)} 
          />
          <div className={cx(
            "relative w-full max-w-md rounded-xl",
            "bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700",
            "shadow-xl",
            spacing.card.base
          )}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              New Project
            </h2>
            <form className="space-y-3" onSubmit={submitCreate}>
              <input
                className={cx(
                  "w-full rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800",
                  spacing.button.sm
                )}
                placeholder="Project name"
                value={createDraft.name}
                onChange={(e) => setCreateDraft((d) => ({ ...d, name: e.target.value }))}
                required
              />
              <input
                className={cx(
                  "w-full rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800",
                  spacing.button.sm
                )}
                placeholder="Subtitle"
                value={createDraft.subtitle}
                onChange={(e) => setCreateDraft((d) => ({ ...d, subtitle: e.target.value }))}
              />
              <input
                type="date"
                className={cx(
                  "w-full rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800",
                  spacing.button.sm
                )}
                value={(createDraft.date && /^\d{4}-\d{2}-\d{2}$/.test(createDraft.date)) ? createDraft.date : ""}
                onChange={(e) => setCreateDraft((d) => ({ ...d, date: e.target.value }))}
              />
              <select
                className={cx(
                  "w-full rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800",
                  spacing.button.sm
                )}
                value={createDraft.status}
                onChange={(e) => setCreateDraft((d) => ({ ...d, status: e.target.value as ProjectStatus }))}
              >
                <option value="inProgress">In progress</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300 mb-1 block">
                  Progress: {createDraft.progress ?? 0}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  className="w-full"
                  value={createDraft.progress ?? 0}
                  onChange={(e) => setCreateDraft((d) => ({ ...d, progress: Number(e.target.value) }))}
                />
              </label>

              <div className={cx("flex items-center pt-4", spacing.gap.xs)}>
                <button 
                  className={cx(
                    "rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors",
                    spacing.button.md
                  )} 
                  type="submit"
                >
                  Create Project
                </button>
                <button 
                  type="button" 
                  className={cx(
                    "rounded-lg ring-1 ring-slate-300 dark:ring-slate-700",
                    "hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                    spacing.button.md
                  )} 
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {detailProject && !onProjectClick && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog" 
          aria-modal="true" 
          aria-label="Project details"
        >
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setDetailProject(null)} 
          />
          <div className={cx(
            "relative w-full max-w-lg rounded-xl",
            "bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700",
            "shadow-xl",
            spacing.card.base
          )}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {detailProject.name}
            </h2>
            {detailProject.subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {detailProject.subtitle}
              </p>
            )}
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-300">Date</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {detailProject.date || "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-300">Status</span>
                <span className={cx(
                  "text-xs px-2 py-0.5 rounded-full ring-1",
                  "ring-slate-200 dark:ring-slate-700",
                  "text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/40"
                )}>
                  {detailProject.status || "In progress"}
                </span>
              </div>
              <div className="py-2 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Progress</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {detailProject.progress ?? 0}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${detailProject.progress ?? 0}%`,
                      backgroundColor: detailProject.accentColor || "#6366f1",
                    }}
                  />
                </div>
              </div>
              {detailProject.participants && detailProject.participants.length > 0 && (
                <div className="py-2">
                  <span className="text-sm text-slate-600 dark:text-slate-300 block mb-2">
                    Participants
                  </span>
                  <div className="flex -space-x-2">
                    {detailProject.participants.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt=""
                        className="size-10 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={cx("flex items-center pt-6", spacing.gap.xs)}>
              <button
                className={cx(
                  "rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors",
                  spacing.button.md
                )}
                onClick={() => {
                  startEdit(detailProject);
                  setDetailProject(null);
                }}
              >
                Edit Project
              </button>
              <button
                className={cx(
                  "rounded-lg ring-1 ring-slate-300 dark:ring-slate-700",
                  "hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                  spacing.button.md
                )}
                onClick={() => setDetailProject(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global styles */}
      <style jsx global>{`
        .pd-container {
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        /* Smooth scrollbar */
        .pd-container ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .pd-container ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .pd-container ::-webkit-scrollbar-thumb {
          background-color: rgb(203 213 225);
          border-radius: 4px;
        }
        
        .dark .pd-container ::-webkit-scrollbar-thumb {
          background-color: rgb(71 85 105);
        }
        
        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        
        /* Focus styles */
        .pd-container button:focus-visible,
        .pd-container input:focus-visible,
        .pd-container select:focus-visible,
        .pd-container a:focus-visible {
          outline: 2px solid rgb(99 102 241);
          outline-offset: 2px;
        }
        
        /* Dark mode focus */
        .dark .pd-container button:focus-visible,
        .dark .pd-container input:focus-visible,
        .dark .pd-container select:focus-visible,
        .dark .pd-container a:focus-visible {
          outline-color: rgb(129 140 248);
        }
        
        /* Transitions */
        .pd-container * {
          transition-property: none;
        }
        
        .pd-container button,
        .pd-container a,
        .pd-container input,
        .pd-container select {
          transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </div>
  );
}

export default ProjectDashboard;