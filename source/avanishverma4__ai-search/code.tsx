import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, MoreHorizontal, MessageSquarePlus, Upload, X, Search } from 'lucide-react';

const OrthogonalGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let offset = 0;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 40;
      offset += 0.3;
      
      if (offset >= spacing) {
        offset = 0;
      }

      // Draw vertical lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      
      for (let x = -spacing + (offset % spacing); x < canvas.width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = -spacing + (offset % spacing); y < canvas.height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Add some brighter accent lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      
      for (let x = -spacing + (offset % spacing); x < canvas.width + spacing; x += spacing * 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = -spacing + (offset % spacing); y < canvas.height + spacing; y += spacing * 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const plusMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target)) {
        setShowPlusMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleNewConversation = () => {
    setInputValue('');
    setUploadedFiles([]);
    setShowPlusMenu(false);
    console.log('Starting new conversation');
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
    setShowPlusMenu(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGoogleSearch = () => {
    if (inputValue.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(inputValue)}`, '_blank');
    }
  };

  const handleMic = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately after permission
    } catch (error) {
      alert('Microphone access denied. Please allow microphone access to use voice input.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started. Speak now...');
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const isFinal = event.results[0].isFinal;
      
      setInputValue(transcript);
      
      if (isFinal) {
        console.log('Final transcript:', transcript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      } else if (event.error === 'network') {
        alert('Network error. Please check your internet connection.');
      } else {
        alert(`Error: ${event.error}. Please try again.`);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      console.log('Voice recognition ended');
    };
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
      alert('Failed to start voice recognition. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() || uploadedFiles.length > 0) {
      console.log('Searching for:', inputValue);
      console.log('Uploaded files:', uploadedFiles);
      // Perform search action here
      alert(`Searching for: ${inputValue || 'files only'}`);
    }
  };

  return (
    <>
      {/* Orthogonal Grid Background */}
      <OrthogonalGrid />

      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <h1>Premium AI Search Bar - Voice & File Upload Enabled</h1>
        <p>Advanced search interface with voice recognition, file upload capabilities, and Google integration. Modern, accessible search experience.</p>
      </div>

      <main className="w-full relative flex flex-col items-center justify-center min-h-screen bg-black p-6" role="main" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-5xl font-light text-white mb-3 tracking-tight">Search Anything</h2>
          <p className="text-gray-400 text-lg font-light">Premium AI-powered search with voice and file support</p>
        </header>

        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <section className="w-full max-w-3xl mb-4 flex flex-wrap gap-3" aria-label="Uploaded files">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-transparent bg-opacity-5 border border-white border-opacity-10 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm hover:bg-opacity-10 transition-all"
              >
                <span className="max-w-xs truncate font-light">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="hover:bg-white hover:bg-opacity-10 rounded-full p-1 transition-all"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </section>
        )}

        {/* Search Bar */}
        <section className="w-full max-w-3xl" aria-label="Search interface">
          <form 
            onSubmit={handleSubmit} 
            className="w-full relative flex items-center w-full bg-neutral-950 bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl px-3 py-3 shadow-2xl hover:border-opacity-20 transition-all"
            role="search"
          >
            {/* Left Icon with Menu */}
            <div className="relative flex items-center" ref={plusMenuRef}>
              <button 
                type="button"
                onClick={() => setShowPlusMenu(!showPlusMenu)}
                className="text-white p-3 hover:bg-gray-800 hover:bg-opacity-10 rounded-xl transition-all"
                title="Options"
                aria-label="Open options menu"
                aria-expanded={showPlusMenu}
                aria-haspopup="true"
              >
                <Plus size={22} strokeWidth={1.5} />
              </button>
              
              {/* Plus Menu Dropdown */}
              {showPlusMenu && (
                <nav 
                  className="absolute left-0 top-16 bg-black border border-white border-opacity-10 rounded-2xl shadow-2xl py-2 min-w-56 z-10 backdrop-blur-xl"
                  role="menu"
                  aria-label="Options menu"
                >
                  <button
                    type="button"
                    onClick={handleNewConversation}
                    className="w-full flex items-center gap-3 px-5 py-3 text-white hover:bg-gray-800 hover:bg-opacity-5 transition-all text-left font-light"
                    role="menuitem"
                  >
                    <MessageSquarePlus size={20} strokeWidth={1.5} />
                    <span>New Conversation</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    className="w-full flex items-center gap-3 px-5 py-3 text-white hover:bg-gray-800 hover:bg-opacity-5 transition-all text-left font-light"
                    role="menuitem"
                  >
                    <Upload size={20} strokeWidth={1.5} />
                    <span>Upload Files</span>
                  </button>
                </nav>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              aria-label="File upload input"
            />

            {/* Input Field */}
            <label htmlFor="search-input" className="sr-only">Search query</label>
            <input
              id="search-input"
              type="text"
              className="flex-1 bg-transparent border-none text-white text-base px-4 py-2 placeholder-gray-500 focus:outline-none font-light"
              placeholder="Ask anything..."
              value={inputValue}
              onChange={handleInputChange}
              aria-label="Search input"
            />

            {/* Right Icons */}
            <div className="relative flex items-center gap-1">
              {/* Search Button */}
              <button 
                type="submit"
                className="text-white p-3 hover:bg-gray-800 hover:bg-opacity-10 rounded-xl transition-all"
                title="Search"
                aria-label="Search"
                disabled={!inputValue.trim() && uploadedFiles.length === 0}
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Microphone Button */}
              <button 
                type="button"
                onClick={handleMic}
                className={`text-white p-3 rounded-xl transition-all ${
                  isListening 
                    ? 'bg-gray-800 text-black animate-pulse' 
                    : 'hover:bg-gray-800 hover:bg-opacity-10'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                aria-pressed={isListening}
              >
                <Mic size={20} strokeWidth={1.5} />
              </button>

              {/* More Options Button */}
              <div className="relative" ref={moreMenuRef}>
                <button 
                  type="button"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="text-white p-3 hover:bg-gray-800 hover:bg-opacity-10 rounded-xl transition-all"
                  title="More options"
                  aria-label="More options"
                  aria-expanded={showMoreMenu}
                  aria-haspopup="true"
                >
                  <MoreHorizontal size={20} strokeWidth={1.5} />
                </button>

                {/* More Menu Dropdown */}
                {showMoreMenu && (
                  <nav 
                    className="absolute right-0 top-16 bg-black border border-white border-opacity-10 rounded-2xl shadow-2xl py-2 min-w-44 z-10 backdrop-blur-xl"
                    role="menu"
                    aria-label="More options menu"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        alert('Settings clicked');
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-5 py-3 text-white hover:bg-white hover:bg-opacity-5 transition-all text-left font-light"
                      role="menuitem"
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        alert('History clicked');
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-5 py-3 text-white hover:bg-white hover:bg-opacity-5 transition-all text-left font-light"
                      role="menuitem"
                    >
                      History
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        alert('Help clicked');
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-5 py-3 text-white hover:bg-white hover:bg-opacity-5 transition-all text-left font-light"
                      role="menuitem"
                    >
                      Help
                    </button>
                  </nav>
                )}
              </div>
            </div>
          </form>
        </section>

        {/* Features Section */}
        <footer className="mt-12 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-500 text-sm font-light">
            <div className="flex items-center gap-2">
              <Search size={16} strokeWidth={1.5} />
              <span>AI Search</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic size={16} strokeWidth={1.5} />
              <span>Voice Input</span>
            </div>
            <div className="flex items-center gap-2">
              <Upload size={16} strokeWidth={1.5} />
              <span>File Upload</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default SearchBar;