import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  ChevronRight,
  Menu,
  BookOpen,
  Code,
  Save,
  Flag,
  Play,
  Bell,
  Globe
} from 'lucide-react';

interface Module {
  title: string;
  items: {
    type: 'video' | 'reading' | 'plugin';
    title: string;
    duration: string;
    active?: boolean;
  }[];
}

interface Breadcrumb {
  label: string;
  href: string;
}

interface VideoSource {
  src: string;
  type: string;
  label: string;
  res: number;
}

interface VideoPlayerScreenProps {
  videoSources: VideoSource[];
  title: string;
  breadcrumbs: Breadcrumb[];
  modules: Module[];
  transcriptContent: string;
}

export function VideoPlayerScreen({
  videoSources,
  title,
  breadcrumbs,
  modules,
  transcriptContent
}: VideoPlayerScreenProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentQuality, setCurrentQuality] = useState(videoSources[0]?.label || '360p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    // Load Video.js CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://vjs.zencdn.net/8.10.0/video-js.css';
    document.head.appendChild(link);

    // Load Video.js script
    const script = document.createElement('script');
    script.src = 'https://vjs.zencdn.net/8.10.0/video.min.js';
    script.async = true;
    
    script.onload = () => {
      if (videoRef.current && (window as any).videojs && !playerRef.current) {
        const videoElement = document.createElement('video');
        videoElement.className = 'video-js vjs-big-play-centered vjs-theme-custom';
        videoRef.current.appendChild(videoElement);

        playerRef.current = (window as any).videojs(videoElement, {
          controls: true,
          fluid: true,
          responsive: true,
          preload: 'auto',
          playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
          controlBar: {
            children: [
              'playToggle',
              'volumePanel',
              'currentTimeDisplay',
              'timeDivider',
              'durationDisplay',
              'progressControl',
              'remainingTimeDisplay',
              'playbackRateMenuButton',
              'fullscreenToggle'
            ]
          }
        });

        playerRef.current.src(videoSources[0]);

        // Add quality selector button to control bar
        const controlBar = playerRef.current.controlBar.el();
        const fullscreenToggle = playerRef.current.controlBar.getChild('fullscreenToggle').el();
        
        const qualityButton = document.createElement('div');
        qualityButton.className = 'vjs-quality-selector vjs-control vjs-button';
        qualityButton.innerHTML = `
          <button class="vjs-quality-button" type="button">
            <span class="vjs-icon-placeholder"></span>
            <span class="vjs-quality-text">${currentQuality}</span>
          </button>
          <div class="vjs-quality-menu vjs-hidden">
            <ul class="vjs-menu-content">
              ${videoSources.map(source => `
                <li class="vjs-menu-item ${source.label === currentQuality ? 'vjs-selected' : ''}" data-quality="${source.label}">
                  ${source.label}
                </li>
              `).join('')}
            </ul>
          </div>
        `;
        
        controlBar.insertBefore(qualityButton, fullscreenToggle);

        // Quality button click handler
        const button = qualityButton.querySelector('.vjs-quality-button');
        const menu = qualityButton.querySelector('.vjs-quality-menu');
        
        button?.addEventListener('click', (e) => {
          e.stopPropagation();
          menu?.classList.toggle('vjs-hidden');
        });

        // Quality menu item click handlers
        const menuItems = qualityButton.querySelectorAll('.vjs-menu-item');
        menuItems.forEach(item => {
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            const quality = (item as HTMLElement).getAttribute('data-quality');
            const source = videoSources.find(s => s.label === quality);
            
            if (source && playerRef.current) {
              const currentTime = playerRef.current.currentTime();
              const wasPaused = playerRef.current.paused();
              
              playerRef.current.src(source);
              
              playerRef.current.one('loadedmetadata', () => {
                playerRef.current.currentTime(currentTime);
                if (!wasPaused) {
                  playerRef.current.play();
                }
              });
              
              setCurrentQuality(source.label);
              
              // Update UI
              const qualityText = qualityButton.querySelector('.vjs-quality-text');
              if (qualityText) {
                qualityText.textContent = source.label;
              }
              
              menuItems.forEach(mi => mi.classList.remove('vjs-selected'));
              item.classList.add('vjs-selected');
              menu?.classList.add('vjs-hidden');
            }
          });
        });

        // Close menu on outside click
        document.addEventListener('click', () => {
          menu?.classList.add('vjs-hidden');
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoSources, currentQuality]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'reading':
        return <BookOpen className="h-4 w-4" />;
      case 'plugin':
        return <Code className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const SidebarContent = () => (
    <div className="p-4 h-full overflow-y-auto">
      <Button
        variant="ghost"
        className="mb-4 text-primary w-full justify-start lg:flex hidden"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu className="h-4 w-4 mr-2" />
        Hide menu
      </Button>

      {modules.map((module, idx) => (
        <div key={idx} className="mb-6">
          <h3 className="font-semibold mb-3 text-sm md:text-base">{module.title}</h3>
          <div className="space-y-1">
            {module.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className={`flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  item.active
                    ? 'bg-primary/10 border-l-4 border-primary'
                    : 'hover:bg-muted hover:translate-x-1'
                }`}
              >
                <div className="mt-1 shrink-0">{getIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs md:text-sm leading-tight mb-1">
                    <span className="hidden md:inline">
                      {item.type === 'video' ? 'Video: ' : item.type === 'reading' ? 'Reading: ' : 'Ungraded Plugin: '}
                    </span>
                    {item.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 md:px-6 py-3 gap-2">
          <div className="flex items-center gap-2 md:gap-6 min-w-0 flex-1">
            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px]">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              <span className="text-base md:text-xl font-bold text-primary">coursera</span>
              <span className="text-base md:text-xl font-semibold hidden sm:inline">Google</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search in course"
                className="px-4 py-2 border rounded-l bg-background w-full text-sm"
              />
              <Button className="rounded-l-none">Search</Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Globe className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block w-80 border-r bg-card transition-all duration-300 overflow-y-auto h-[calc(100vh-73px)] ${showSidebar ? '' : '-ml-80'}`}>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-73px)] w-full min-w-0">
          {/* Breadcrumb */}
          <div className="border-b bg-card px-3 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm overflow-x-auto scrollbar-hide min-w-0 flex-1">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <a href={crumb.href} className="text-primary hover:underline transition-colors whitespace-nowrap">
                    <span className="hidden md:inline">{crumb.label}</span>
                    <span className="md:hidden">{crumb.label.length > 20 ? crumb.label.slice(0, 20) + '...' : crumb.label}</span>
                  </a>
                  {idx < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 md:h-4 md:w-4 shrink-0" />}
                </React.Fragment>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 transition-colors shrink-0 ml-2">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 sm:ml-1" />
            </Button>
          </div>

          {/* Video Player */}
          <div className="p-3 md:p-6">
            <div className="max-w-7xl mx-auto">
              <div 
                ref={videoRef}
                className="rounded-lg overflow-hidden border md:border-2 border-border shadow-xl md:shadow-2xl mb-4 md:mb-6"
                style={{ background: 'linear-gradient(to bottom, #000 0%, #1a1a1a 100%)' }}
              />

              {/* Report Issue */}
              <Button variant="link" className="text-primary mb-4 hover:translate-x-1 transition-transform px-0 text-xs md:text-sm">
                <Flag className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Report an issue
              </Button>

              {/* Title and Save Note */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{title}</h1>
                <Button variant="outline" className="text-primary hover:bg-primary/10 transition-all w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save note
                </Button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="transcript" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto scrollbar-hide">
                  <TabsTrigger
                    value="transcript"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all text-xs md:text-sm whitespace-nowrap"
                  >
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all text-xs md:text-sm whitespace-nowrap"
                  >
                    Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="downloads"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all text-xs md:text-sm whitespace-nowrap"
                  >
                    Downloads
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transcript" className="mt-4 md:mt-6 animate-in fade-in-50 duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4 mb-4">
                    <div className="text-xs md:text-sm text-muted-foreground">0:00</div>
                    <div className="text-xs md:text-sm">
                      <span className="text-muted-foreground">Transcript language:</span>
                      <span className="ml-2 font-medium">English</span>
                    </div>
                  </div>
                  <div className="prose prose-sm md:prose-base max-w-none">
                    <p className="text-sm md:text-base leading-relaxed">{transcriptContent}</p>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-4 md:mt-6 animate-in fade-in-50 duration-300">
                  <div className="text-muted-foreground text-sm md:text-base">No notes yet. Start taking notes to help you remember key points!</div>
                </TabsContent>

                <TabsContent value="downloads" className="mt-4 md:mt-6 animate-in fade-in-50 duration-300">
                  <div className="text-muted-foreground text-sm md:text-base">Download course materials and resources here.</div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .video-js {
          width: 100%;
          height: 100%;
          aspect-ratio: 16/9;
        }
        
        .vjs-theme-custom .vjs-big-play-button {
          border-radius: 50%;
          width: 2.5em;
          height: 2.5em;
          line-height: 2.5em;
          border: none;
          background-color: rgba(255, 255, 255, 0.9);
          transition: all 0.2s ease;
        }
        
        @media (min-width: 768px) {
          .vjs-theme-custom .vjs-big-play-button {
            width: 3em;
            height: 3em;
            line-height: 3em;
          }
        }
        
        .vjs-theme-custom .vjs-big-play-button:hover {
          background-color: rgba(255, 255, 255, 1);
          transform: scale(1.1);
        }
        
        .vjs-theme-custom .vjs-control-bar {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          backdrop-filter: blur(10px);
          font-size: 13px;
        }
        
        @media (min-width: 768px) {
          .vjs-theme-custom .vjs-control-bar {
            font-size: 15px;
          }
        }
        
        .vjs-theme-custom .vjs-play-progress {
          background-color: hsl(var(--primary));
        }
        
        .vjs-theme-custom .vjs-volume-level {
          background-color: hsl(var(--primary));
        }
        
        .vjs-theme-custom .vjs-slider:hover .vjs-play-progress,
        .vjs-theme-custom .vjs-slider:hover .vjs-volume-level {
          background-color: hsl(var(--primary));
        }
        
        /* Quality Selector Styles */
        .vjs-quality-selector {
          position: relative;
        }
        
        .vjs-quality-button {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: white;
          padding: 0 8px;
          font-size: inherit;
          height: 100%;
        }
        
        .vjs-quality-text {
          font-weight: 600;
          font-size: 0.9em;
        }
        
        .vjs-quality-menu {
          position: absolute;
          bottom: 100%;
          right: 0;
          margin-bottom: 8px;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          min-width: 120px;
        }
        
        .vjs-quality-menu.vjs-hidden {
          display: none;
        }
        
        .vjs-menu-content {
          list-style: none;
          margin: 0;
          padding: 4px 0;
        }
        
        .vjs-menu-item {
          padding: 10px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          color: white;
          font-size: 0.9em;
        }
        
        .vjs-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .vjs-menu-item.vjs-selected {
          background-color: hsl(var(--primary));
          font-weight: 600;
        }
        
        .vjs-menu-item.vjs-selected:hover {
          background-color: hsl(var(--primary));
          opacity: 0.9;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 640px) {
          .vjs-theme-custom .vjs-current-time,
          .vjs-theme-custom .vjs-time-divider,
          .vjs-theme-custom .vjs-duration,
          .vjs-theme-custom .vjs-remaining-time {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}