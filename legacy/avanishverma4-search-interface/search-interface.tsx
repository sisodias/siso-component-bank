import React from 'react';
import { Menu, Mic, History, User } from 'lucide-react';

// Divider component
const Divider = ({ className = "" }) => (
  <div className={`border-t border-gray-200 dark:border-gray-700 ${className}`} />
);

// SearchItem component
const SearchItem = ({ label, children, leftElement, rightElement, href }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
    <div className="flex items-center gap-3">
      {leftElement}
      <div className="flex flex-col">
        {label && <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>}
        {children && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {children}
          </div>
        )}
      </div>
    </div>
    {rightElement && (
      <span className="text-xs text-gray-500 dark:text-gray-400">{rightElement}</span>
    )}
  </div>
);

// LinkBox component
const LinkBox = ({ size, href, children }) => (
  <a 
    href={href} 
    className={`text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ${size === 'text-body-medium' ? 'text-sm' : ''}`}
  >
    {children}
  </a>
);

// IconButton component
const IconButton = ({ variant, icon, onClick, isActive = false, className = "" }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${className} ${
      variant === 'surface' 
        ? `${isActive 
          ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600' 
          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
        }` 
        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
  </button>
);

// Avatar component
const Avatar = ({ size, radius, smallBadge, badgeColor, src }) => (
  <div className="relative">
    <div 
      className={`bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white`}
      style={{ 
        width: size, 
        height: size, 
        borderRadius: radius === 999 ? '50%' : `${radius}px` 
      }}
    >
      {src ? (
        <img src={src} alt="Avatar" className="w-full h-full object-cover rounded-full" />
      ) : (
        <User size={size * 0.6} />
      )}
    </div>
    {smallBadge && (
      <div 
        className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${badgeColor || 'bg-green-400'}`}
      />
    )}
  </div>
);

// SearchInput component
const SearchInput = ({ type, id, name, placeholder, leftElement, rightElement, value, onChange }) => (
  <div className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
    {leftElement && <div className="pl-3">{leftElement}</div>}
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
    />
    {rightElement && <div className="pr-3 flex items-center gap-2">{rightElement}</div>}
  </div>
);

// Main Search component
const Search = ({ result, children }) => (
  <div className="w-full max-w-2xl mx-auto space-y-4">
    {children}
    {result && (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        {result}
      </div>
    )}
  </div>
);

// Main component
const SearchComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMicClick = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      setIsRecording(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Check if Speech Recognition is available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert("Speech recognition not supported");
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      recognition.onend = () => {
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      recognition.start();
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (isRecording) {
          recognition.stop();
        }
      }, 10000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert("Could not access microphone. Please check permissions.");
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      {/* Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={handleMenuClick}>
          <div 
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
                <IconButton
                  variant="surface"
                  icon={<Menu size={24} className="text-gray-600 dark:text-gray-400" />}
                  onClick={handleMenuClick}
                />
              </div>
              
              <nav className="space-y-4">
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Recent Searches
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Saved Items
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Settings
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Help & Support
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      <Search>
        <SearchInput
          type={"text"}
          id={"search"}
          name={"search"}
          placeholder={isRecording ? "Listening..." : "Enter request"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftElement={
            <IconButton
              variant="surface"
              icon={<Menu size={24} className="text-gray-600 dark:text-gray-400" />}
              onClick={handleMenuClick}
              isActive={isMenuOpen}
            />
          }
          rightElement={
            <>
              <IconButton
                variant="surface"
                icon={<Mic size={24} className={isRecording ? "text-red-500" : "text-gray-600 dark:text-gray-400"} />}
                onClick={handleMicClick}
                isActive={isRecording}
                className={isRecording ? "animate-pulse" : ""}
              />
              <Avatar
                size={24}
                radius={999}
                smallBadge={true}
                badgeColor={"bg-lime-400"}
                src={""}
              />
            </>
          }
        />
      </Search>

      {/* Recording indicator */}
      {isRecording && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span>Recording...</span>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;