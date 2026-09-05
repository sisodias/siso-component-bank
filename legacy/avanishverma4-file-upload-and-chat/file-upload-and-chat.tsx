import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Paperclip, Send, Moon, Sun, X, FileText, Image, Video, Music, Archive, MessageCircle, Bot, User } from 'lucide-react';

const FileUploadChat = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m here to help you with your files and answer any questions you might have. Feel free to upload files and start chatting!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return <Image className="w-4 h-4" />;
    if (['mp4', 'avi', 'mkv', 'mov', 'webm'].includes(ext)) return <Video className="w-4 h-4" />;
    if (['mp3', 'wav', 'flac', 'ogg', 'aac'].includes(ext)) return <Music className="w-4 h-4" />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Add system message about file upload
    const fileNames = newFiles.map(f => f.name).join(', ');
    const systemMessage = {
      id: Date.now(),
      type: 'system',
      content: `📎 Added ${newFiles.length} file(s): ${fileNames}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const generateAIResponse = (userMessage, files) => {
    const responses = [
      `I can see you've shared "${userMessage}". ${files.length > 0 ? `Along with ${files.length} file(s), ` : ''}How can I help you further?`,
      `Thanks for your message! ${files.length > 0 ? `I notice you've uploaded ${files.length} file(s). ` : ''}What would you like to know?`,
      `Got it! ${files.length > 0 ? `I see you've attached ${files.map(f => f.name).join(', ')}. ` : ''}What's your next question?`,
      `Understood! ${files.length > 0 ? `Those files look interesting - ${files.length} in total. ` : ''}Feel free to ask me anything else!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = () => {
    if (inputValue.trim() || uploadedFiles.length > 0) {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        content: inputValue.trim(),
        files: [...uploadedFiles],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      
      const messageContent = inputValue.trim();
      const attachedFiles = [...uploadedFiles];
      
      setInputValue('');
      setUploadedFiles([]);
      setIsTyping(true);
      
      // Simulate AI response with typing delay
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: generateAIResponse(messageContent, attachedFiles),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    uploadArea: isDragOver 
      ? (isDarkMode ? 'bg-blue-900/50 border-blue-500' : 'bg-blue-50 border-blue-400')
      : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'),
    userMessage: isDarkMode ? 'bg-blue-600' : 'bg-blue-500',
    aiMessage: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
    systemMessage: isDarkMode ? 'bg-yellow-900/30 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${themeClasses.background}`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className={`rounded-2xl shadow-xl border ${themeClasses.cardBg} ${themeClasses.border} mb-6`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${themeClasses.text}`}>File Upload & Chat</h1>
                  <p className={`mt-1 ${themeClasses.textSecondary}`}>Upload files and chat with AI assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-lg ${themeClasses.border} ${themeClasses.inputBg} ${themeClasses.text}`}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>

            {/* Quick Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${themeClasses.uploadArea}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files)}
                multiple
                className="hidden"
              />
              <div className="flex items-center justify-center gap-4">
                <Upload className={`w-8 h-8 ${themeClasses.textSecondary}`} />
                <div>
                  <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
                    {isDragOver ? 'Drop files here!' : 'Quick File Upload'}
                  </h3>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>
                    Drag files here or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-500 hover:text-blue-600 underline font-medium"
                    >
                      browse
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Files Ready to Send */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-sm font-medium ${themeClasses.text}`}>
                    Files ready to send ({uploadedFiles.length})
                  </h4>
                  <button
                    onClick={() => setUploadedFiles([])}
                    className={`text-xs px-3 py-1 rounded-full ${themeClasses.textSecondary} hover:text-red-500 transition-colors`}
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className={`flex items-center gap-3 p-3 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg}`}>
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${themeClasses.text}`}>{file.name}</p>
                        <p className={`text-xs ${themeClasses.textSecondary}`}>{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className={`p-1 rounded-full hover:bg-red-500/20 ${themeClasses.textSecondary} hover:text-red-500 transition-colors`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`rounded-2xl shadow-xl border ${themeClasses.cardBg} ${themeClasses.border}`}>
          {/* Chat Header */}
          <div className={`px-6 py-4 border-b ${themeClasses.border}`}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className={`font-semibold ${themeClasses.text}`}>Chat with AI Assistant</h3>
              <span className={`text-sm ${themeClasses.textSecondary}`}>Online</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}>
                {message.type !== 'system' && message.type === 'ai' && (
                  <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${themeClasses.inputBg}`}>
                    <Bot className="w-5 h-5 text-blue-500" />
                  </div>
                )}
                
                <div className={`max-w-xs lg:max-w-md ${
                  message.type === 'user' ? `${themeClasses.userMessage} text-white ml-3` :
                  message.type === 'ai' ? `${themeClasses.aiMessage} ${themeClasses.text}` :
                  `${themeClasses.systemMessage} text-xs`
                } px-4 py-3 rounded-2xl ${message.type === 'user' ? 'rounded-br-md' : message.type === 'ai' ? 'rounded-bl-md' : 'rounded-lg'}`}>
                  {message.content && <p className="break-words">{message.content}</p>}
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.files.map(file => (
                        <div key={file.id} className="flex items-center gap-2 text-sm opacity-90 bg-black/10 rounded px-2 py-1">
                          {getFileIcon(file.name)}
                          <span className="truncate">{file.name}</span>
                          <span className="text-xs">({formatFileSize(file.size)})</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.type === 'user' && (
                  <div className={`w-8 h-8 rounded-full ml-3 flex items-center justify-center ${themeClasses.userMessage}`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${themeClasses.inputBg}`}>
                  <Bot className="w-5 h-5 text-blue-500" />
                </div>
                <div className={`px-4 py-3 rounded-2xl rounded-bl-md ${themeClasses.aiMessage}`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className={`border-t p-4 ${themeClasses.border}`}>
            <div className="flex gap-3 items-end">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-lg ${themeClasses.border} ${themeClasses.inputBg} ${themeClasses.text}`}
                title="Attach files"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 max-h-32 ${themeClasses.inputBg} ${themeClasses.border} ${themeClasses.text} placeholder-gray-400`}
                  style={{ minHeight: '48px' }}
                />
                
                {/* Character count */}
                {inputValue.length > 0 && (
                  <div className={`absolute bottom-1 right-3 text-xs ${themeClasses.textSecondary}`}>
                    {inputValue.length}
                  </div>
                )}
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() && uploadedFiles.length === 0}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* Quick Actions */}
            {uploadedFiles.length === 0 && inputValue.length === 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setInputValue('Can you help me analyze this file?')}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors hover:bg-blue-500 hover:text-white hover:border-blue-500 ${themeClasses.border} ${themeClasses.textSecondary}`}
                >
                  Analyze file
                </button>
                <button
                  onClick={() => setInputValue('What can you do with uploaded files?')}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors hover:bg-blue-500 hover:text-white hover:border-blue-500 ${themeClasses.border} ${themeClasses.textSecondary}`}
                >
                  File capabilities
                </button>
                <button
                  onClick={() => setInputValue('Hello! How can you help me today?')}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors hover:bg-blue-500 hover:text-white hover:border-blue-500 ${themeClasses.border} ${themeClasses.textSecondary}`}
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadChat;