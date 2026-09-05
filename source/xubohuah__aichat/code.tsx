'use client'

// import { Suspense, lazy, useState, useEffect, useRef } from 'react'
// const Spline = lazy(() => import('@splinetool/react-spline'))
// // import { Cinzel } from 'next/font/google';

// interface SplineSceneProps {
//   scene: string
//   className?: string
// }

// function SplineScene({ scene, className }: SplineSceneProps) {
//   return (
//     <Suspense
//       fallback={
//         <div className="w-full h-full flex items-center justify-center">
//           <span className="loader"></span>
//         </div>
//       }
//     >
//       <Spline
//         scene={scene}
//         className={className}
//       />
//     </Suspense>
//   )
// }




// interface Message {
//   id: number;
//   content: string;
//   position: { x: number; y: number };
//   isExpanded: boolean;
//   isUser: boolean;
//   parentId?: number | null;
//   conversationId: number;
//   timestamp?: Date;
// }

// // const cinzel = Cinzel({ 
// //   subsets: ['latin'],
// //   weight: ['400', '500', '600', '700'],
// // });

// export function AIDialogDemo() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       content: "Hello! I'm an AI assistant",
//       position: { x: 70, y: 30 },
//       isExpanded: true,
//       isUser: false,
//       conversationId: -1,  // Introduction conversation
//       timestamp: new Date()
//     },
//     {
//       id: 2,
//       content: "I can help answer your questions",
//       position: { x: 20, y: 50 },
//       isExpanded: false,
//       isUser: false,
//       conversationId: -1,
//       timestamp: new Date()
//     },
//     {
//       id: 3,
//       content: "Click anywhere in the 3D space to ask",
//       position: { x: 50, y: 70 },
//       isExpanded: false,
//       isUser: false,
//       conversationId: -1,
//       timestamp: new Date()
//     }
//   ]);

//   const [newMessage, setNewMessage] = useState("");
//   const [isInputActive, setIsInputActive] = useState(false);
//   const [activePosition, setActivePosition] = useState({ x: 0, y: 0 });
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [replyingTo, setReplyingTo] = useState<number | null>(null);
//   const [currentConversation, setCurrentConversation] = useState(0);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const nextIdRef = useRef(4);
//   const nextConversationIdRef = useRef(1);

//   // Add model selection related states
//   const [currentModel, setCurrentModel] = useState('Claude-3 Sonnet');
//   const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

//   const models = [
//     'Claude-3 Sonnet',
//     'Claude-3 Opus',
//     'GPT-4',
//     'GPT-3.5 Turbo',
//     'Gemini Pro'
//   ];

//   // Track mouse position for hover effects
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);

//   // Listen for keyboard events to toggle sidebar with 'S' key
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 's' || e.key === 'S') {
//         if (!isInputActive) { // Only toggle sidebar when input is not active
//           setSidebarVisible(prev => !prev);
//         }
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [isInputActive]);

//   // Add click outside handler to close dropdown menu
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest('.model-selector')) {
//         setIsModelDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Calculate next message position
//   const calculateNextPosition = (lastMessagePosition: { x: number; y: number }, isAI: boolean) => {
//     // Base position calculation
//     let newX = isAI ? lastMessagePosition.x + 10 : lastMessagePosition.x - 10;
//     let newY = lastMessagePosition.y + 8;

//     // Prevent positions from going outside visible area
//     // Check horizontal boundaries (5%-95% range)
//     if (newX < 5) newX = 5;
//     if (newX > 95) newX = 95;

//     // Check vertical boundaries (5%-95% range)
//     if (newY < 5) newY = 5;
//     if (newY > 95) newY = 95;

//     return { x: newX, y: newY };
//   };

//   // Get last message in conversation
//   const getLastMessageInConversation = (conversationId: number) => {
//     const conversationMessages = messages.filter(m => m.conversationId === conversationId);
//     if (conversationMessages.length === 0) return null;

//     return conversationMessages[conversationMessages.length - 1];
//   };

//   // Handle click in 3D space to create new input
//   const handleSceneClick = (e: React.MouseEvent) => {
//     if (isInputActive) {
//       setIsInputActive(false);
//       setReplyingTo(null);
//       return;
//     }

//     const sceneRect = e.currentTarget.getBoundingClientRect();

//     // Calculate click position ratio considering sidebar
//     let x = ((e.clientX - sceneRect.left) / sceneRect.width) * 100;
//     let y = ((e.clientY - sceneRect.top) / sceneRect.height) * 100;

//     // Ensure position is within safe range (5%-95%)
//     if (x < 5) x = 5;
//     if (x > 95) x = 95;
//     if (y < 5) y = 5;
//     if (y > 95) y = 95;

//     setActivePosition({ x, y });
//     setIsInputActive(true);
//     setReplyingTo(null);

//     // Create new conversation on each click
//     const newConversationId = nextConversationIdRef.current++;
//     setCurrentConversation(newConversationId);

//     // Collapse all message bubbles
//     setMessages(prev => prev.map(m => ({ ...m, isExpanded: false })));

//     // Close sidebar on mobile
//     if (window.innerWidth < 768) {
//       setSidebarOpen(false);
//     }
//   };

//   // Reply to specific message
//   const handleReplyToMessage = (messageId: number, e: React.MouseEvent) => {
//     e.stopPropagation();

//     const messageToReply = messages.find(m => m.id === messageId);
//     if (!messageToReply || messageToReply.conversationId === -1) return; // Don't allow replies to introduction messages

//     const conversationId = messageToReply.conversationId;
//     setCurrentConversation(conversationId);

//     const lastMessage = getLastMessageInConversation(conversationId);
//     if (!lastMessage) return;

//     const newPosition = calculateNextPosition(lastMessage.position, false);

//     setActivePosition(newPosition);
//     setIsInputActive(true);
//     setReplyingTo(messageId);

//     // Expand all messages in this conversation
//     setMessages(prev => prev.map(m => {
//       if (m.conversationId === conversationId) {
//         return { ...m, isExpanded: true };
//       }
//       return { ...m, isExpanded: false };
//     }));
//   };

//   // Clear all conversations
//   const handleClearMessages = () => {
//     // Keep only introduction messages (conversationId: -1)
//     const introMessages = messages.filter(m => m.conversationId === -1);
//     setMessages(introMessages);
//     setIsInputActive(false);
//     setReplyingTo(null);
//     nextConversationIdRef.current = 1;
//   };

//   // Add function to delete introduction
//   const handleDeleteIntro = () => {
//     setMessages(prev => prev.filter(m => m.conversationId !== -1));
//   };

//   // Add function to delete single conversation
//   const handleDeleteConversation = (conversationId: number, e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent event bubbling to conversation selection

//     // Filter out the conversation to delete
//     const filteredMessages = messages.filter(m => m.conversationId !== conversationId);
//     setMessages(filteredMessages);

//     // If deleting current conversation, reset current conversation
//     if (conversationId === currentConversation) {
//       // Find the most recent conversation ID, or set to 0 if no other conversations
//       const conversationIds = [...new Set(filteredMessages.map(m => m.conversationId))];
//       const newCurrentId = conversationIds.filter(id => id !== 0).sort((a, b) => b - a)[0] || 0;
//       setCurrentConversation(newCurrentId);
//     }
//   };

//   // Focus on specific conversation
//   const handleFocusConversation = (conversationId: number) => {
//     setCurrentConversation(conversationId);

//     // Expand all messages in selected conversation
//     setMessages(prev => prev.map(m => {
//       if (m.conversationId === conversationId) {
//         return { ...m, isExpanded: true };
//       }
//       return { ...m, isExpanded: false };
//     }));

//     // Close sidebar on mobile
//     if (window.innerWidth < 768) {
//       setSidebarOpen(false);
//     }

//     // No longer auto-expand sidebar
//     // Sidebar visibility is now controlled entirely by keyboard shortcut or Toggle button
//   };

//   // Generate different responses based on model
//   const generateModelResponse = (userMessage: string) => {
//     const responses = {
//       'Claude-3 Sonnet': `Let me help you with your question: "${userMessage}"`,
//       'Claude-3 Opus': `I'm Claude-3 Opus. Regarding your question: "${userMessage}". Let me analyze it in detail.`,
//       'GPT-4': `As GPT-4, I'm happy to answer your question: "${userMessage}"`,
//       'GPT-3.5 Turbo': `GPT-3.5 Turbo here. Let me help you with: "${userMessage}"`,
//       'Gemini Pro': `Hi, I'm Gemini Pro. Let me answer your question: "${userMessage}"`
//     };

//     return responses[currentModel as keyof typeof responses] || responses['Claude-3 Sonnet'];
//   };

//   // 修改handleAddMessage函数
//   const handleAddMessage = () => {
//     if (!newMessage.trim()) return;

//     const newId = nextIdRef.current++;

//     // 使用当前选定的会话ID
//     const conversationId = currentConversation;

//     // Create user message
//     const userMessage = {
//       id: newId,
//       content: newMessage,
//       position: activePosition,
//       isExpanded: true,
//       isUser: true,
//       parentId: replyingTo,
//       conversationId,
//       timestamp: new Date()
//     };

//     // Add user message
//     setMessages(prev => [...prev, userMessage]);

//     setNewMessage("");
//     setIsInputActive(false);

//     // Save current position for AI response
//     const messagePosition = { ...activePosition };

//     // Simulate AI response with selected model
//     setTimeout(() => {
//       // Calculate AI response position
//       const replyPosition = calculateNextPosition(messagePosition, true);

//       const replyId = nextIdRef.current++;
//       setMessages(prev => [
//         ...prev,
//         {
//           id: replyId,
//           content: generateModelResponse(newMessage),
//           position: replyPosition,
//           isExpanded: true,
//           isUser: false,
//           parentId: newId,
//           conversationId,
//           timestamp: new Date()
//         }
//       ]);
//       // Expand all messages in this conversation
//       setMessages(prev => prev.map(m => {
//         if (m.conversationId === conversationId) {
//           return { ...m, isExpanded: true };
//         }
//         return m;
//       }));
//     }, 1000);
//   };

//   // Toggle message expand/collapse
//   const toggleMessage = (id: number, e: React.MouseEvent) => {
//     e.stopPropagation();

//     const clickedMessage = messages.find(m => m.id === id);
//     if (!clickedMessage) return;

//     const conversationId = clickedMessage.conversationId;

//     // Toggle expand/collapse for the entire conversation
//     setMessages(prev => {
//       const isCurrentlyExpanded = prev
//         .filter(m => m.conversationId === conversationId)
//         .some(m => m.isExpanded);

//       return prev.map(msg => {
//         if (msg.conversationId === conversationId) {
//           return { ...msg, isExpanded: !isCurrentlyExpanded };
//         }
//         return { ...msg, isExpanded: false };
//       });
//     });
//   };

//   // Get all conversations
//   const getConversations = () => {
//     const conversationIds = [...new Set(messages.map(m => m.conversationId))];

//     return conversationIds.map(id => {
//       const conversationMessages = messages.filter(m => m.conversationId === id);
//       const previewMessage = conversationMessages.find(m => m.isUser) || conversationMessages[0];
//       const messageCount = conversationMessages.length;
//       const timestamp = conversationMessages[conversationMessages.length - 1]?.timestamp;

//       return {
//         id,
//         previewMessage,
//         messageCount,
//         timestamp,
//         messages: conversationMessages,
//         isIntro: id === -1
//       };
//     }).sort((a, b) => {
//       if (a.isIntro) return -1;  // 介绍对话始终在最前
//       if (b.isIntro) return 1;
//       const timeA = a.timestamp?.getTime() || 0;
//       const timeB = b.timestamp?.getTime() || 0;
//       return timeB - timeA;
//     });
//   };

//   // Format relative time (e.g., "2m ago")
//   const formatRelativeTime = (date?: Date) => {
//     if (!date) return '';

//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffSec = Math.floor(diffMs / 1000);
//     const diffMin = Math.floor(diffSec / 60);
//     const diffHour = Math.floor(diffMin / 60);

//     if (diffSec < 60) return 'just now';
//     if (diffMin < 60) return `${diffMin}m ago`;
//     if (diffHour < 24) return `${diffHour}h ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="h-screen bg-black text-white relative overflow-hidden flex">
//       {/* Logo title - Temporarily disabled
//       <div className={`absolute top-0 left-0 p-7 z-30 transition-all duration-500 ${
//         sidebarVisible 
//           ? 'opacity-0 -translate-x-2 pointer-events-none' 
//           : 'opacity-100 translate-x-0'
//       }`}>
//         <div className="flex flex-col items-start">
//           <h1 className={`${cinzel.className} text-xl font-medium tracking-wider bg-gradient-to-r from-white via-white/90 to-zinc-400 text-transparent bg-clip-text`}>
//             AI Chat
//           </h1>
//           <div className="mt-1.5 flex items-center space-x-2.5">
//             <div className="h-[1px] w-6 bg-gradient-to-r from-white/50 to-transparent"></div>
//             <span className="text-[9px] text-zinc-400 uppercase tracking-[0.25em] font-light">AI Playground</span>
//           </div>
//         </div>
//       </div>
//       */}

//       {/* Sidebar control button - Mobile */}
//       <button
//         className={`absolute top-6 left-6 z-30 md:hidden ${!sidebarVisible && 'opacity-0 pointer-events-none'}`}
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         <div className="flex flex-col space-y-1">
//           <div className="w-5 h-0.5 bg-white"></div>
//           <div className="w-5 h-0.5 bg-white"></div>
//           <div className="w-5 h-0.5 bg-white"></div>
//         </div>
//       </button>

//       {/* Add custom scrollbar styles */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 3px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(255, 255, 255, 0.2);
//         }

//         /* Firefox */
//         .custom-scrollbar {
//           scrollbar-width: thin;
//           scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
//         }

//         /* Add message spacing to prevent bubble overlap */
//         .message-bubble {
//           margin: 10px;
//           position: absolute;
//           z-index: 20;
//           transform: translate(-50%, -50%);
//         }

//         /* Add 3D scene centering styles */
//         .scene-container {
//           position: absolute;
//           inset: 0;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }

//         /* 添加发光效果基础样式 */
//         .pulse-glow::before {
//           content: '';
//           position: absolute;
//           inset: -8px;
//           background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
//           border-radius: inherit;
//           z-index: -1;
//         }
//       `}</style>

//       {/* Conversations sidebar */}
//       <div
//         className={`absolute md:relative h-full z-20 transition-all duration-400 ease-in-out ${!sidebarVisible ? 'w-0 opacity-0 -translate-x-full pointer-events-none border-r-0' :
//           sidebarOpen ? 'translate-x-0 border-r border-zinc-800/60' : '-translate-x-full md:translate-x-0 border-r border-zinc-800/60'
//           } ${sidebarVisible ? 'w-72' : 'w-0'
//           } bg-zinc-900/95 backdrop-blur-md overflow-hidden shadow-2xl`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-5 border-b border-zinc-800/70 flex items-center justify-between">
//             <h2 className="text-sm font-medium text-zinc-200 tracking-wide">Conversations</h2>
//             <button
//               className="text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-zinc-800/50"
//               onClick={handleClearMessages}
//             >
//               Clear All
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto custom-scrollbar">
//             {getConversations().map(conversation => {
//               if (conversation.id === 0) return null;

//               const isActive = currentConversation === conversation.id;
//               const preview = conversation.previewMessage?.content || '';
//               const truncatedPreview = preview.length > 30 ? `${preview.substring(0, 30)}...` : preview;

//               return (
//                 <div
//                   key={`sidebar-conv-${conversation.id}`}
//                   className={`p-4 cursor-pointer border-l-2 transition-all duration-200 ${isActive
//                     ? 'border-white bg-zinc-800/60 text-white'
//                     : 'border-transparent hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200'
//                     }`}
//                   onClick={() => handleFocusConversation(conversation.id)}
//                 >
//                   <div className="flex justify-between items-start mb-1.5">
//                     <span className="text-xs font-medium">
//                       {conversation.isIntro ? 'Introduction' : `Conversation ${conversation.id}`}
//                     </span>
//                     <div className="flex items-center space-x-1">
//                       <span className="text-[10px] text-zinc-500">
//                         {formatRelativeTime(conversation.timestamp)}
//                       </span>
//                       <button
//                         className="text-zinc-500 hover:text-red-400 transition-colors p-0.5 rounded"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (conversation.isIntro) {
//                             handleDeleteIntro();
//                           } else {
//                             handleDeleteConversation(conversation.id, e);
//                           }
//                         }}
//                         title={conversation.isIntro ? "Delete introduction" : "Delete this conversation"}
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="12"
//                           height="12"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M3 6h18"></path>
//                           <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
//                           <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                   <p className="text-xs line-clamp-2 opacity-80">{truncatedPreview}</p>
//                   <div className="flex items-center mt-2">
//                     <span className="text-[10px] text-zinc-500">
//                       {conversation.messageCount} messages
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}

//             {getConversations().filter(c => c.id !== 0).length === 0 && (
//               <div className="flex flex-col items-center justify-center h-full text-center p-6">
//                 <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mb-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="text-zinc-500"
//                   >
//                     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//                   </svg>
//                 </div>
//                 <p className="text-sm text-zinc-400 font-light">No conversations yet</p>
//                 <p className="text-xs text-zinc-500 mt-2 font-light">Click anywhere in the space to start a new conversation</p>
//               </div>
//             )}
//           </div>

//           {/* Optimize sidebar close button */}
//           <div className="py-4 px-5 border-t border-zinc-800/70 flex justify-between items-center">
//             <div className="text-xs text-zinc-500">
//               <span className="text-zinc-400">S</span> to toggle sidebar
//             </div>
//             <button
//               className="w-8 h-8 rounded-md flex items-center justify-center bg-zinc-800/50 hover:bg-zinc-700 transition-all group"
//               onClick={() => setSidebarVisible(false)}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="text-zinc-400 group-hover:text-white transition-colors"
//               >
//                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
//                 <line x1="9" y1="3" x2="9" y2="21"></line>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main content area */}
//       <div className={`flex-1 relative transition-all duration-300 origin-center`}>
//         {/* Background effects */}
//         <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-30"></div>
//         <div className="absolute inset-0 bg-dot-pattern bg-dot-size opacity-20"></div>
//         <div className="absolute inset-0 bg-gradient-radial from-zinc-800/10 to-black"></div>

//         {/* Dynamic cursor follow effect */}
//         <div
//           className="fixed w-40 h-40 rounded-full bg-gradient-radial from-white/5 to-transparent pointer-events-none z-0 opacity-50 transition-transform duration-1000"
//           style={{
//             left: `${mousePosition.x}px`,
//             top: `${mousePosition.y}px`,
//             transform: 'translate(-50%, -50%)'
//           }}
//         ></div>

//         {/* Top bar */}
//         <header className="absolute top-0 right-0 p-6 z-10 flex justify-end items-center">
//           <div className="relative model-selector">
//             <button
//               onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
//               className="flex items-center space-x-3 bg-zinc-900/70 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-zinc-800/70 transition-colors min-w-[160px]"
//             >
//               <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
//               <span className="text-xs text-zinc-300 font-medium tracking-wider flex-1 text-left">{currentModel}</span>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className={`transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`}
//               >
//                 <polyline points="6 9 12 15 18 9"></polyline>
//               </svg>
//             </button>

//             {/* Model selection dropdown menu */}
//             {isModelDropdownOpen && (
//               <div className="absolute top-full right-0 mt-2 w-full bg-zinc-900/95 backdrop-blur-sm border border-zinc-800/60 rounded-lg shadow-xl">
//                 <div className="py-1">
//                   {models.map((model) => (
//                     <button
//                       key={model}
//                       onClick={() => {
//                         setCurrentModel(model);
//                         setIsModelDropdownOpen(false);
//                       }}
//                       className={`w-full px-4 py-2 text-left text-xs ${currentModel === model
//                         ? 'bg-white/10 text-white'
//                         : 'text-zinc-400 hover:bg-white/5 hover:text-white'
//                         } transition-colors`}
//                     >
//                       {model}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </header>

//         {/* 3D scene as entire background - Modified to center display */}
//         <div
//           className="scene-container cursor-crosshair"
//           onClick={handleSceneClick}
//         >
//           <SplineScene
//             scene="https://prod.spline.design/EQrHaDxHBjmoBdMQ/scene.splinecode"
//             className="w-full h-full transform"
//           />
//         </div>

//         {/* Conversations with connecting lines */}
//         {getConversations().map(conversation => {
//           if (conversation.id === 0) return null; // Don't show system messages

//           const conversationMessages = conversation.messages;
//           if (conversationMessages.length === 0) return null;

//           // Only show the current conversation or all if none selected
//           if (currentConversation !== 0 && conversation.id !== currentConversation) return null;

//           return (
//             <div key={`conversation-${conversation.id}`} className="absolute inset-0 z-10 pointer-events-none">
//               {/* Connection lines */}
//               <svg className="absolute inset-0 w-full h-full pointer-events-none">
//                 {conversationMessages.map((message, index) => {
//                   if (index === 0) return null; // Skip first message

//                   const prevMessage = conversationMessages[index - 1];

//                   // Generate curved path between messages
//                   const startX = prevMessage.position.x;
//                   const startY = prevMessage.position.y;
//                   const endX = message.position.x;
//                   const endY = message.position.y;

//                   // Control point for smooth curve
//                   const midX = (startX + endX) / 2;
//                   const midY = (startY + endY) / 2 + 2; // Slight downward curve

//                   const path = `
//                     M ${startX}% ${startY}%
//                     Q ${midX}% ${midY}% ${endX}% ${endY}%
//                   `;

//                   return (
//                     <path
//                       key={`line-${message.id}`}
//                       d={path}
//                       fill="none"
//                       stroke={`rgba(255,255,255,${message.isExpanded ? 0.2 : 0.1})`}
//                       strokeWidth="1"
//                       strokeDasharray="3,3"
//                       className="animate-fade-in"
//                     />
//                   );
//                 })}
//               </svg>

//               {/* Message bubbles - Added message-bubble class */}
//               {conversationMessages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`message-bubble animate-fade-in pointer-events-auto`}
//                   style={{
//                     left: `${message.position.x}%`,
//                     top: `${message.position.y}%`
//                   }}
//                 >
//                   <div
//                     className={`relative cursor-pointer group`}
//                     onClick={(e) => toggleMessage(message.id, e)}
//                   >
//                     {/* Message bubble content */}
//                     {message.isExpanded ? (
//                       <div className={`glass-panel p-4 max-w-[260px] ${message.isUser ? 'border-white/20' : 'border-zinc-800'}`}>
//                         <p className="text-sm">{message.content}</p>

//                         {/* Reply button - Only shown in non-introduction messages */}
//                         {message.conversationId !== -1 && (
//                           <div className="mt-2 flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button
//                               onClick={(e) => handleReplyToMessage(message.id, e)}
//                               className="text-xs text-white/60 hover:text-white/90 flex items-center gap-1"
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="12"
//                                 height="12"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               >
//                                 <polyline points="9 17 4 12 9 7"></polyline>
//                                 <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
//                               </svg>
//                               Reply
//                             </button>
//                           </div>
//                         )}

//                         {/* Connection point */}
//                         <div className={`absolute -bottom-1 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 translate-y-1/2 ${message.isUser ? 'bg-white/30' : 'bg-white/10'
//                           }`}></div>
//                       </div>
//                     ) : (
//                       <div className={`relative w-8 h-8 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 transition-transform ${message.isUser ? 'border-white/20' : 'border-zinc-800'
//                         }`}>
//                         <div className={`w-2 h-2 rounded-full ${message.isUser ? 'bg-white/60' : 'bg-white/30'
//                           } group-hover:bg-white/70 transition-colors`}></div>
//                         <div className="absolute inset-0 rounded-full pulse-glow"></div>

//                         {/* Conversation identifier */}
//                         <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white/30"></div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           );
//         })}

//         {/* System messages - Added message-bubble class */}
//         {messages.filter(m => m.conversationId === 0).map((message) => (
//           <div
//             key={message.id}
//             className={`message-bubble animate-fade-in`}
//             style={{
//               left: `${message.position.x}%`,
//               top: `${message.position.y}%`
//             }}
//           >
//             <div
//               className={`relative cursor-pointer group`}
//               onClick={(e) => toggleMessage(message.id, e)}
//             >
//               {/* Message bubble content */}
//               {message.isExpanded ? (
//                 <div className="glass-panel p-4 max-w-[260px]">
//                   <p className="text-sm">{message.content}</p>
//                 </div>
//               ) : (
//                 <div className="relative w-8 h-8 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <div className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors"></div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}

//         {/* New message input */}
//         {isInputActive && (
//           <div
//             className="message-bubble animate-fade-in z-30"
//             style={{
//               left: `${activePosition.x}%`,
//               top: `${activePosition.y}%`
//             }}
//           >
//             <div className="glass-panel p-2 border-white/20">
//               {replyingTo && (
//                 <div className="text-xs px-3 py-1 text-white/50 flex items-center gap-1">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="10"
//                     height="10"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <polyline points="9 17 4 12 9 7"></polyline>
//                     <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
//                   </svg>
//                   Replying to message
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setReplyingTo(null);
//                     }}
//                     className="ml-1 hover:text-white"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               )}
//               <div className="flex">
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
//                   placeholder="Type your message..."
//                   autoFocus
//                   className="flex-1 bg-transparent text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
//                 />
//                 <button
//                   onClick={handleAddMessage}
//                   disabled={!newMessage.trim()}
//                   className="glass-button w-8 h-8 flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="group-hover:translate-x-1 transition-transform"
//                   >
//                     <path d="M5 12h14"></path>
//                     <path d="m12 5 7 7-7 7"></path>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Interface elements */}
//         <div className="absolute bottom-6 right-0 px-6 flex justify-end items-center z-10">
//           <p className="text-xs text-zinc-500 uppercase tracking-wider">Click anywhere to interact</p>
//         </div>

//         {/* Sidebar toggle button - Only shown when sidebar is not visible */}
//         {!sidebarVisible && (
//           <div className="absolute bottom-6 left-6 z-30">
//             <button
//               className="flex items-center justify-center bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-md px-3 py-1.5 text-white hover:bg-zinc-800/80 transition-colors shadow-lg"
//               onClick={() => setSidebarVisible(true)}
//             >
//               <div className="flex items-center space-x-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
//                   <line x1="9" y1="3" x2="9" y2="21"></line>
//                 </svg>
//                 <span className="text-xs font-medium mx-1">Toggle Sidebar</span>
//                 <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">S</span>
//               </div>
//             </button>
//           </div>
//         )}

//         {/* 底部脉冲按钮 */}
//         <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
//           <button
//             onClick={() => {
//               setActivePosition({ x: 50, y: 95 });
//               setIsInputActive(true);
//               setReplyingTo(null);
//             }}
//             className="relative w-16 h-16 flex items-center justify-center rounded-full focus:outline-none hover:scale-105 transition-all duration-300 pulse-glow before:animate-glow"
//             aria-label="与AI对话"
//           >
//             <span className="relative flex items-end space-x-1.5 z-10">
//               <span className="w-1.5 h-6 bg-white/60 rounded-full animate-pulse-bar"></span>
//               <span className="w-1.5 h-4 bg-white/60 rounded-full animate-pulse-bar-delay"></span>
//               <span className="w-1.5 h-6 bg-white/60 rounded-full animate-pulse-bar-delay2"></span>
//               <span className="w-1.5 h-4 bg-white/60 rounded-full animate-pulse-bar-delay"></span>
//               <span className="w-1.5 h-6 bg-white/60 rounded-full animate-pulse-bar"></span>
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

export function AIDialogDemo() {
  return <>test < />
}