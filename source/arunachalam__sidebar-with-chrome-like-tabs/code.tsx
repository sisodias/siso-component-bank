'use client';

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext,
  createContext,
  useEffect,
} from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  X,
  Plus,
  PanelLeft,
  Menu,
  LucideIcon,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Represents a navigation item in the sidebar.
 */
export interface NavItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Label text to display */
  label: string;
  /** Icon component to render */
  icon: LucideIcon;
}

/**
 * Represents a single browser-like tab.
 */
export interface Tab {
  /** Unique identifier for the tab */
  id: string;
  /** ID of the active navigation item within this tab */
  activeNavId: string;
}

/**
 * Props for the main SidebarWithTabs component.
 */
export interface SidebarWithTabsProps {
  /** Optional custom logo component */
  logo?: React.ReactNode;
  /** Name of the company/application */
  companyName?: string;
  /** List of navigation items */
  navItems: NavItem[];
  /** Function to render content based on the active navigation ID */
  renderContent: (navId: string) => React.ReactNode;
  /** ID of the default active navigation item */
  defaultNavId?: string;
  /** Optional footer content (e.g. user profile) */
  footer?: React.ReactNode;
}

interface TabsContextValue {
  tabs: Tab[];
  activeTabId: string;
  activeNavId: string;
  setActiveNav: (navId: string) => void;
  addTab: (navId?: string) => void;
  closeTab: (tabId: string) => void;
  closeOthers: (tabId: string) => void;
  closeToRight: (tabId: string) => void;
  closeToLeft: (tabId: string) => void;
  closeAll: () => void;
  setActiveTab: (tabId: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Custom hook to access tab context.
 * Must be used within a SidebarWithTabs provider.
 */
export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within SidebarWithTabs');
  }
  return context;
}

/**
 * Individual tab component ensuring accessibility and animation.
 */
function ChromeTab({
  tab,
  isActive,
  isFirst,
  isLast,
  canClose,
  navItems,
  hasRightNeighborActive,
  onTabClick,
  onTabClose,
  onCloseOthers,
  onCloseToRight,
  onCloseToLeft,
  hasOtherTabs,
  hasTabsToRight,
  hasTabsToLeft,
}: {
  tab: Tab;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  canClose: boolean;
  navItems: NavItem[];
  hasRightNeighborActive: boolean;
  onTabClick: () => void;
  onTabClose: () => void;
  onCloseOthers: () => void;
  onCloseToRight: () => void;
  onCloseToLeft: () => void;
  hasOtherTabs: boolean;
  hasTabsToRight: boolean;
  hasTabsToLeft: boolean;
}) {
  const nav = navItems.find((n) => n.id === tab.activeNavId);
  const Icon = nav?.icon;
  const label = nav?.label || 'New Tab';
  const tabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && tabRef.current) {
      // Standard scroll into view
      tabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });

      if (isLast) {
        // Tiny timeout to let layout settle
        setTimeout(() => {
          const plusBtn = tabRef.current
            ?.closest('.flex')
            ?.querySelector('.new-tab-btn');
          if (plusBtn) {
            plusBtn.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center',
            });
          }
        }, 250);
      }
    }
  }, [isActive, isLast]);

  // Ensure active tab is centered on initial load (handling refresh)
  useEffect(() => {
    if (isActive && tabRef.current) {
      // Small delay to ensure layout is ready
      setTimeout(() => {
        tabRef.current?.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'center',
        });
      }, 200);
    }
  }, []);

  const handleAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1 && canClose) {
      e.preventDefault();
      onTabClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabClick();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (canClose) {
        e.preventDefault();
        onTabClose();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTab = (e.target as HTMLElement)
        .closest('li')
        ?.nextElementSibling?.querySelector('[role="tab"]') as HTMLElement;
      nextTab?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevTab = (e.target as HTMLElement)
        .closest('li')
        ?.previousElementSibling?.querySelector('[role="tab"]') as HTMLElement;
      prevTab?.focus();
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          role='tab'
          aria-selected={isActive}
          tabIndex={isActive ? 0 : -1}
          className={cn(
            'relative flex items-center gap-2 px-4 py-2.5 ml-[10px] sm:ml-0 text-sm cursor-pointer active:cursor-grabbing transition-colors duration-150 min-w-[140px] max-w-[220px] outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar',
            isActive
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={onTabClick}
          onAuxClick={handleAuxClick}
          onKeyDown={handleKeyDown}
          ref={tabRef}
        >
          {isActive && (
            <motion.div
              className='absolute inset-0 bg-background rounded-t-xl'
              layoutId='activeTabBg'
              transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            >
              <div
                className={cn(
                  'absolute -left-3 bottom-0 w-3 h-3 overflow-hidden'
                )}
              >
                <div className='absolute right-0 bottom-0 w-6 h-6 bg-sidebar rounded-full z-1' />
                <div className='absolute inset-0 bg-background' />
              </div>
              <div className='absolute -right-3 bottom-0 w-3 h-3 overflow-hidden'>
                <div className='absolute left-0 bottom-0 w-6 h-6 bg-sidebar rounded-full z-1' />
                <div className='absolute inset-0 bg-background' />
              </div>
            </motion.div>
          )}

          <div className='relative flex items-center gap-2 flex-1 min-w-0'>
            {Icon && <Icon className='h-4 w-4 flex-shrink-0' />}
            <span className='truncate flex-1 font-medium select-none'>
              {label}
            </span>

            {canClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose();
                }}
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full transition-colors flex-shrink-0',
                  isActive
                    ? 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    : 'opacity-0 group-hover:opacity-100 hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground'
                )}
              >
                <X className='h-3 w-3' />
              </button>
            )}
          </div>

          {!isActive && !hasRightNeighborActive && (
            <div className='absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-4 bg-sidebar-border' />
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className='w-48'>
        <ContextMenuItem onClick={onTabClose} disabled={!canClose}>
          Close Tab
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onCloseOthers} disabled={!hasOtherTabs}>
          Close Other Tabs
        </ContextMenuItem>
        <ContextMenuItem onClick={onCloseToRight} disabled={!hasTabsToRight}>
          <ChevronRight className='mr-2 h-4 w-4' />
          Close Tabs to the Right
        </ContextMenuItem>
        <ContextMenuItem onClick={onCloseToLeft} disabled={!hasTabsToLeft}>
          <ChevronLeft className='mr-2 h-4 w-4' />
          Close Tabs to the Left
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/**
 * Navigation items list component.
 */
function SidebarNavigation({
  navItems,
  activeNavId,
  isCollapsed,
  onItemClick,
}: {
  navItems: NavItem[];
  activeNavId: string;
  isCollapsed: boolean;
  onItemClick: (item: NavItem) => void;
}) {
  return (
    <nav className='space-y-1 px-3'>
      {navItems.map((item) => {
        const isActive = item.id === activeNavId;
        const NavButton = (
          <button
            key={item.id}
            onClick={() => onItemClick(item)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left relative',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <item.icon
              className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive
                  ? 'text-sidebar-accent-foreground'
                  : 'text-muted-foreground'
              )}
            />
            <AnimatePresence>
              {!isCollapsed && (
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                      className='font-medium text-sm whitespace-nowrap overflow-hidden'
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </AnimatePresence>
            {isActive && !isCollapsed && (
              <motion.div
                layoutId='activeNavIndicator'
                className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-r-full'
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );

        if (isCollapsed) {
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
              <TooltipContent side='right' className='font-medium'>
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        }

        return NavButton;
      })}
    </nav>
  );
}

function MobileSidebar({
  logo,
  companyName,
  navItems,
  activeNavId,
  onItemClick,
}: {
  logo?: React.ReactNode;
  companyName: string;
  navItems: NavItem[];
  activeNavId: string;
  onItemClick: (item: NavItem) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleItemClick = (item: NavItem) => {
    onItemClick(item);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-9 w-9 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0'
        >
          <Menu className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-72 p-0 border-r-0'>
        <SheetTitle className='sr-only'>Sidebar Navigation</SheetTitle>
        <div className='flex flex-col h-full bg-sidebar'>
          <div className='flex items-center gap-3 p-5 border-b border-sidebar-border'>
            {logo || (
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary'>
                <span className='text-sm font-bold text-sidebar-primary-foreground'>
                  A
                </span>
              </div>
            )}
            <span className='text-base font-bold text-sidebar-foreground'>
              {companyName}
            </span>
          </div>
          <div className='flex-1 py-4'>
            <SidebarNavigation
              navItems={navItems}
              activeNavId={activeNavId}
              isCollapsed={false}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Button to add a new tab, supporting tap-to-add and hold-for-menu interactions.
 */
function NewTabButton({
  navItems,
  onAddTab,
}: {
  navItems: NavItem[];
  onAddTab: (navId?: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const lastTouchTime = useRef(0);

  const handleTouchStart = () => {
    lastTouchTime.current = Date.now();
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setIsOpen(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const isTouch = Date.now() - lastTouchTime.current < 1000;
    if (isTouch) {
      if (isLongPress.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      setIsOpen(false);
      onAddTab();
    } else {
      onAddTab();
    }
  };

  return (
    <HoverCard
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent opening on touch interaction (simulated hover) unless it's a confirmed long press
        const isTouch = Date.now() - lastTouchTime.current < 1000;
        if (open && isTouch && !isLongPress.current) {
          return;
        }
        setIsOpen(open);
      }}
      openDelay={200}
      closeDelay={100}
    >
      <HoverCardTrigger asChild>
        <button
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className='flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground ml-1 mb-0.5 flex-shrink-0 new-tab-btn'
        >
          <Plus className='h-4 w-4' />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        align='start'
        className='w-48 p-1 bg-popover border-border'
        sideOffset={8}
      >
        <div className='text-xs text-muted-foreground px-2 py-1.5 font-medium'>
          Quick Open
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onAddTab(item.id)}
            className='w-full flex items-center gap-2 px-2 py-2 text-sm text-popover-foreground hover:bg-accent rounded-md transition-colors'
          >
            <item.icon className='h-4 w-4 text-muted-foreground' />
            <span>{item.label}</span>
          </button>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}

/**
 * Main Layout component featuring a sidebar and tabbed navigation.
 */
export function SidebarWithTabs({
  logo,
  companyName = 'Acme Inc',
  navItems,
  renderContent,
  defaultNavId,
  footer,
}: SidebarWithTabsProps) {
  const defaultNav = defaultNavId || navItems[0]?.id || '';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState('');
  const [isClient, setIsClient] = useState(false);
  const tabCounterRef = useRef(1);

  // Load state from localStorage on mount
  // Hydrate state from storage
  useEffect(() => {
    setIsClient(true);
    const savedState = localStorage.getItem('sidebar-tabs-state');

    if (savedState) {
      try {
        const { tabs: savedTabs, activeTabId: savedActiveId } =
          JSON.parse(savedState);
        setTabs(savedTabs);
        setActiveTabId(savedActiveId);

        // Sync tab counter
        const maxId = savedTabs.reduce((max: number, tab: Tab) => {
          const match = tab.id.match(/tab-(\d+)-/);
          return match ? Math.max(max, parseInt(match[1])) : max;
        }, 1);
        tabCounterRef.current = maxId;
      } catch (error) {
        console.error('State structure mismatch', error);
        // Reset to default on error
        setTabs([{ id: 'tab-1', activeNavId: defaultNav }]);
        setActiveTabId('tab-1');
      }
    } else {
      setTabs([{ id: 'tab-1', activeNavId: defaultNav }]);
      setActiveTabId('tab-1');
    }
  }, [defaultNav]);

  // Persist state efficiently
  useEffect(() => {
    if (!isClient || tabs.length === 0) return;

    const handler = setTimeout(() => {
      localStorage.setItem(
        'sidebar-tabs-state',
        JSON.stringify({ tabs, activeTabId })
      );
    }, 500); // Debounce to prevent heavy writes

    return () => clearTimeout(handler);
  }, [tabs, activeTabId, isClient]);

  useEffect(() => {
    if (isClient && tabs.length === 0) {
      setTabs([{ id: 'tab-1', activeNavId: defaultNav }]);
      setActiveTabId('tab-1');
    }
  }, [isClient, tabs.length, defaultNav]);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeNavId = activeTab?.activeNavId || defaultNav;
  const activeTabIndex = tabs.findIndex((t) => t.id === activeTabId);

  const setActiveNav = useCallback(
    (navId: string) => {
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId ? { ...tab, activeNavId: navId } : tab
        )
      );
    },
    [activeTabId]
  );

  const addTab = useCallback(
    (navId?: string) => {
      tabCounterRef.current += 1;
      const newTabId = `tab-${tabCounterRef.current}-${Date.now()}`;
      const newTab: Tab = {
        id: newTabId,
        activeNavId: navId || defaultNav,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTabId);
    },
    [defaultNav]
  );

  const closeTab = useCallback(
    (tabId: string) => {
      if (tabs.length === 1) return;
      const tabIndex = tabs.findIndex((t) => t.id === tabId);
      const newTabs = tabs.filter((t) => t.id !== tabId);
      setTabs(newTabs);

      if (activeTabId === tabId) {
        // Select the next tab (right) if available, otherwise the previous (left)
        const newActiveIndex =
          tabIndex === newTabs.length ? tabIndex - 1 : tabIndex;
        // Ensure we have a valid index
        const safeIndex = Math.max(0, newActiveIndex);
        if (newTabs[safeIndex]) {
          setActiveTabId(newTabs[safeIndex].id);
        } else {
          // Fallback if no tabs left (shouldn't happen due to guard)
        }
      }
    },
    [tabs, activeTabId]
  );

  const closeOthers = useCallback((tabId: string) => {
    setTabs((prev) => prev.filter((t) => t.id === tabId));
    setActiveTabId(tabId);
  }, []);

  const closeToRight = useCallback(
    (tabId: string) => {
      const index = tabs.findIndex((t) => t.id === tabId);
      const newTabs = tabs.slice(0, index + 1);
      setTabs(newTabs);
      if (!newTabs.find((t) => t.id === activeTabId)) {
        setActiveTabId(tabId);
      }
    },
    [tabs, activeTabId]
  );

  const closeToLeft = useCallback(
    (tabId: string) => {
      const index = tabs.findIndex((t) => t.id === tabId);
      const newTabs = tabs.slice(index);
      setTabs(newTabs);
      if (!newTabs.find((t) => t.id === activeTabId)) {
        setActiveTabId(tabId);
      }
    },
    [tabs, activeTabId]
  );

  const closeAll = useCallback(() => {
    if (tabs.length <= 1) return;
    const firstTab = tabs[0];
    setTabs([firstTab]);
    setActiveTabId(firstTab.id);
  }, [tabs]);

  const setActiveTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const handleNavItemClick = useCallback(
    (item: NavItem) => {
      setActiveNav(item.id);
    },
    [setActiveNav]
  );

  const contextValue = useMemo(
    () => ({
      tabs,
      activeTabId,
      activeNavId,
      setActiveNav,
      addTab,
      closeTab,
      closeOthers,
      closeToRight,
      closeToLeft,
      closeAll,
      setActiveTab,
    }),
    [
      tabs,
      activeTabId,
      activeNavId,
      setActiveNav,
      addTab,
      closeTab,
      closeOthers,
      closeToRight,
      closeToLeft,
      closeAll,
      setActiveTab,
    ]
  );

  const canCloseTab = tabs.length > 1;
  const hasOtherTabs = tabs.length > 1;

  return (
    <TooltipProvider delayDuration={0}>
      <TabsContext.Provider value={contextValue}>
        <div className='flex h-screen w-full bg-sidebar overflow-hidden'>
          <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 64 : 240 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='hidden md:flex flex-col bg-sidebar overflow-hidden'
          >
            <div className='flex flex-col h-full overflow-hidden'>
              <div
                className={cn(
                  'flex items-center h-[52px] px-4 border-b border-sidebar-border',
                  isCollapsed ? 'justify-center' : 'justify-between'
                )}
              >
                <div className='flex items-center gap-3 min-w-0'>
                  {logo || (
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary flex-shrink-0'>
                      <span className='text-sm font-bold text-sidebar-primary-foreground'>
                        A
                      </span>
                    </div>
                  )}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                        className='text-sm font-bold text-sidebar-foreground truncate tracking-tight whitespace-nowrap ml-3'
                      >
                        {companyName}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {!isCollapsed && (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className='h-8 w-8 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0'
                  >
                    <PanelLeft className='h-4 w-4' />
                  </Button>
                )}
              </div>

              {isCollapsed && (
                <div className='flex justify-center py-2 border-b border-sidebar-border'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className='h-8 w-8 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0'
                  >
                    <PanelLeft className='h-4 w-4 rotate-180' />
                  </Button>
                </div>
              )}

              <div className='flex-1 py-4 overflow-y-auto scrollbar-hide'>
                <SidebarNavigation
                  navItems={navItems}
                  activeNavId={activeNavId}
                  isCollapsed={isCollapsed}
                  onItemClick={handleNavItemClick}
                />
              </div>

              <div className='p-4 border-t border-sidebar-border h-[73px] flex items-center justify-center overflow-hidden'>
                <AnimatePresence mode='wait'>
                  {!isCollapsed ? (
                    footer ? (
                      <motion.div
                        key='expanded'
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                        className='w-full'
                      >
                        {footer}
                      </motion.div>
                    ) : null
                  ) : (
                    <motion.div
                      key='collapsed'
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                      className='flex justify-center'
                    >
                      {logo || (
                        <div className='w-8 h-8 rounded-full bg-muted flex-shrink-0' />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>

          <div className='flex flex-1 flex-col overflow-hidden relative'>
            <div className='flex items-end bg-sidebar pt-2'>
              <div className='md:hidden flex-shrink-0 self-center ml-2'>
                <MobileSidebar
                  logo={logo}
                  companyName={companyName}
                  navItems={navItems}
                  activeNavId={activeNavId}
                  onItemClick={handleNavItemClick}
                />
              </div>

              <div
                className='flex items-end overflow-x-auto scrollbar-hide flex-1'
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <Reorder.Group
                  as='ol'
                  axis='x'
                  values={tabs}
                  onReorder={setTabs}
                  className='flex items-end'
                  role='tablist'
                >
                  <AnimatePresence initial={false}>
                    {tabs.map((tab, index) => {
                      const isActive = tab.id === activeTabId;
                      const isFirst = index === 0;
                      const isLast = index === tabs.length - 1;
                      const hasRightNeighborActive =
                        index < tabs.length - 1 &&
                        tabs[index + 1].id === activeTabId;

                      return (
                        <Reorder.Item
                          value={tab}
                          as='li'
                          layout
                          key={tab.id}
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          whileDrag={{ cursor: 'grabbing' }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className='relative group flex-shrink-0'
                          style={{ zIndex: isActive ? 10 : 1 }}
                        >
                          <ChromeTab
                            tab={tab}
                            isActive={isActive}
                            isFirst={isFirst}
                            isLast={isLast}
                            canClose={canCloseTab}
                            navItems={navItems}
                            hasRightNeighborActive={hasRightNeighborActive}
                            onTabClick={() => setActiveTab(tab.id)}
                            onTabClose={() => closeTab(tab.id)}
                            onCloseOthers={() => closeOthers(tab.id)}
                            onCloseToRight={() => closeToRight(tab.id)}
                            onCloseToLeft={() => closeToLeft(tab.id)}
                            hasOtherTabs={hasOtherTabs}
                            hasTabsToRight={index < tabs.length - 1}
                            hasTabsToLeft={index > 0}
                          />
                        </Reorder.Item>
                      );
                    })}
                  </AnimatePresence>
                </Reorder.Group>

                <motion.div layout className='flex-shrink-0'>
                  <NewTabButton navItems={navItems} onAddTab={addTab} />
                </motion.div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:bg-sidebar-accent rounded-lg mr-2 mb-0.5 flex-shrink-0'>
                    <MoreHorizontal className='h-5 w-5' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuItem onClick={() => addTab()}>
                    <Plus className='mr-2 h-4 w-4' />
                    New Tab
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={closeAll}
                    disabled={!hasOtherTabs}
                    className={cn(
                      hasOtherTabs && 'text-red-500 focus:text-red-500'
                    )}
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Close All Tabs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <main className='flex-1 overflow-hidden bg-sidebar p-0 md:pr-3 md:pb-3'>
              <div
                className={cn(
                  'h-full bg-background overflow-auto transition-all duration-300 ease-in-out',
                  'md:rounded-br-3xl md:rounded-bl-3xl md:rounded-tr-3xl',
                  activeTabIndex !== 0 && 'md:rounded-tl-3xl'
                )}
              >
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={`${activeTabId}-${activeNavId}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className='h-full'
                  >
                    {renderContent(activeNavId)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>
      </TabsContext.Provider>
    </TooltipProvider>
  );
}
