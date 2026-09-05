import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, Share2, Globe,
  Loader2, CheckCircle2,
  Music,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

// --- Types ---
interface TicketProps {
  ticketId: string;
  eventName: string;
  amount: number;
  date: Date;
  location: string;
  cardHolder: string;
  last4Digits: string;
  barcodeValue: string;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

// --- Components ---

const RedesignedTicket: React.FC<TicketProps> = ({ 
  ticketId, eventName, amount, date, location, cardHolder, last4Digits, barcodeValue, onShowToast
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleBarcodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowToast("Redirecting to profile...", "info");
    setTimeout(() => {
      window.open('https://21st.dev/community/avanishverma4', '_blank');
    }, 500);
  };

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
    }).format(d);
  };

  const formatTime = (d: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d).toLowerCase();
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ticketRef.current || isDownloading) return;
    setIsDownloading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `Concert-Stub-${eventName.replace(/\s+/g, '-')}.png`;
      link.click();
      onShowToast("Ticket downloaded successfully!");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("Download failed", err);
      onShowToast("Download failed.", "info");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ticketRef.current || isSharing) return;
    setIsSharing(true);

    const shareTitle = `Ticket for ${eventName}`;
    const shareText = `I'm going to ${eventName} on New Year's Eve! See you there!`;
    const shareUrl = window.location.href;

    try {
      if (navigator.canShare && ticketRef.current) {
        onShowToast("Preparing shareable ticket...", "info");
        await new Promise(resolve => setTimeout(resolve, 600));

        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          const file = new File([blob], `Ticket-${eventName}.png`, { type: 'image/png' });
          const data = {
            files: [file],
            title: shareTitle,
            text: shareText,
          };

          if (navigator.canShare(data)) {
            await navigator.share(data);
            onShowToast("Shared successfully!");
            setIsSharing(false);
            return;
          }
        }
      }

      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onShowToast("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        onShowToast("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed", err);
      if ((err as Error).name !== 'AbortError') {
        onShowToast("Sharing failed. Link copied instead.", "info");
        try { await navigator.clipboard.writeText(shareUrl); } catch(e) {}
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className={`w-full max-w-sm h-[650px] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      
      <div className="relative w-full h-full group">
        {/* FRONT SIDE (STATIC) */}
        <div 
          ref={ticketRef}
          className="relative w-full h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl ticket-hover-effect transition-all duration-500"
        >
          {/* Top Striped Header */}
          <div className="h-6 w-full striped-header"></div>

          {/* Body Content */}
          <div className="flex-1 px-8 pt-10 text-center relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex flex-wrap gap-10 p-10 rotate-12">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[60px] border-b-indigo-600"></div>
               ))}
            </div>

            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Concert</span>
            <h2 className="text-3xl font-black text-indigo-600 uppercase tracking-tight mb-8">
              {eventName}
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Section</span>
                <p className="text-xl font-black text-slate-900">Floor</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Row</span>
                <p className="text-xl font-black text-slate-900">GA</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Entry</span>
                <p className="text-xl font-black text-slate-900">Gate 3</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10 border-t border-slate-100 pt-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Date</span>
                <p className="text-lg font-black text-slate-900">{formatDate(date)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Time</span>
                <p className="text-lg font-black text-slate-900">{formatTime(date)}</p>
              </div>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div 
                className="barcode-container relative group/barcode transition-transform hover:scale-105 cursor-pointer"
                onClick={handleBarcodeClick}
              >
                <div className="absolute -inset-2 bg-indigo-500/5 rounded-lg opacity-0 group-hover/barcode:opacity-100 transition-opacity"></div>
                <Barcode 
                  value={barcodeValue}
                  width={1.4}
                  height={50}
                  displayValue={false}
                  lineColor="#0f172a"
                  background="transparent"
                />
                <div className="flex items-center justify-center gap-1.5 mt-1 opacity-0 group-hover/barcode:opacity-100 transition-opacity no-print">
                   <ExternalLink className="w-2.5 h-2.5 text-indigo-600" />
                   <span className="text-[8px] font-bold uppercase tracking-widest text-indigo-600">Scan to verify</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-2">
                Serial Number: {ticketId.split('-').pop()}
              </span>
            </div>
          </div>

          {/* Notches */}
          <div className="ticket-notch ticket-notch-left shadow-inner"></div>
          <div className="ticket-notch ticket-notch-right shadow-inner"></div>

          {/* Footer Block */}
          <div className="bg-indigo-600 h-[170px] p-8 flex justify-between items-end relative overflow-hidden">
            <div className="space-y-4 z-10 text-white text-left">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block">Fan</span>
                <p className="text-xl font-black uppercase tracking-tight">{cardHolder}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block">Price</span>
                <p className="text-xl font-black">${amount.toFixed(0)}</p>
              </div>
            </div>

            <div className="w-24 h-24 bg-white rounded-xl p-2 z-10 shadow-lg">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://21st.dev/community/avanishverma4" 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute -right-20 top-0 flex flex-col gap-4 no-print opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <div className="relative">
            {isDownloading && (
              <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping"></span>
            )}
            <button 
              onClick={handleDownload}
              disabled={isDownloading || isSharing}
              title="Download ticket as image"
              className={`p-4 rounded-full shadow-xl transition-all border outline-none focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/60 dark:focus-visible:ring-indigo-400/60 ${
                isDownloading 
                  ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 scale-95 opacity-90 cursor-not-allowed text-slate-500 dark:text-slate-400' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:scale-110 active:scale-95 text-slate-800 dark:text-white'
              }`}
              aria-label="Download ticket as image"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="relative">
            {isSharing && (
              <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping"></span>
            )}
            <button 
              onClick={handleShare}
              disabled={isSharing || isDownloading}
              title="Share ticket"
              className={`p-4 rounded-full shadow-xl transition-all border outline-none focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/60 dark:focus-visible:ring-indigo-400/60 ${
                isSharing 
                  ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 scale-95 opacity-90 cursor-not-allowed text-slate-500 dark:text-slate-400' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:scale-110 active:scale-95 text-slate-800 dark:text-white'
              }`}
              aria-label="Share ticket"
            >
              {isSharing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast: React.FC<{ message: string; type: 'success' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900/90 dark:bg-white/95 backdrop-blur-xl text-white dark:text-slate-950 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 dark:border-black/5">
        {type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
        <span className="text-sm font-bold uppercase tracking-widest whitespace-nowrap">{message}</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    // Hardcoded dark mode to maintain the futuristic look.
    document.documentElement.classList.add('dark');
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="w-screen min-h-screen orthogonal-grid transition-colors duration-700 font-sans text-slate-900 dark:text-white selection:bg-indigo-500/20 flex flex-col items-center py-10 relative">
      
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 via-transparent to-indigo-100/30 dark:from-slate-950/80 dark:via-transparent dark:to-indigo-950/40 pointer-events-none -z-10"></div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 no-print">
        <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-8 relative w-full group mt-12 md:mt-0">
        <div className="mb-10 text-center space-y-2 no-print">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            Ring in the New Year
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.4em]">
            Official Concert Admission
          </p>
        </div>

        <RedesignedTicket
          ticketId="NYE-PASS-2025-998"
          eventName="The Final Countdown"
          location="Madison Square Garden, NY"
          amount={249.00}
          date={new Date("2025-12-31T21:00:00")}
          cardHolder="Awanish Verma"
          last4Digits="8237"
          barcodeValue="20251231998765"
          onShowToast={showToast}
        />
      </main>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;