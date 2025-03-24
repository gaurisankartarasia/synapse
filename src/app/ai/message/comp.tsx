
// // src/components/GeminiComponent.tsx
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { generateTextAsync, clearGeneratedText } from '@/redux/features/gemini/geminiSlice';
// import { RootState, AppDispatch } from '@/redux/store'; 

// const GeminiComponent: React.FC = () => {
//   const [prompt, setPrompt] = useState('');
//   const [model, setModel] = useState('gemini-2.0-flash');
//   const dispatch = useDispatch<AppDispatch>(); // Explicitly type useDispatch
//   const { generatedText, loading, error } = useSelector((state: RootState) => state.gemini);

//   const handleGenerate = () => {
//     dispatch(generateTextAsync({ prompt, model }));
//   };

//   const handleClear = () => {
//     dispatch(clearGeneratedText());
//     setPrompt("");
//   };

//   return (
//     <div>
//       <select value={model} onChange={(e) => setModel(e.target.value)}>
//         <option value="gemini-2.0-flash">gemini-2.0-flash</option>
//         <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite</option>
//         <option value="gemini-1.5">gemini-1.5</option>
//         <option value="gemini-1.5-pro">gemini-1.5-pro</option>
//       </select>
//       <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
//       <button onClick={handleGenerate} disabled={loading}>
//         Generate
//       </button>
//       <button onClick={handleClear}>Clear</button>
//       {loading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
//       {generatedText && <p>{generatedText}</p>}
//     </div>
//   );
// };

// export default GeminiComponent;





// src/components/GeminiChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateTextAsync, clearGeneratedText } from '@/redux/features/gemini/geminiSlice';
import { RootState, AppDispatch } from '@/redux/store';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const GeminiChat: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { generatedText, loading, error } = useSelector((state: RootState) => state.gemini);
  
  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  // Add AI response to chat when generated
  useEffect(() => {
    if (generatedText && !loading) {
      addMessageToChat(generatedText, false);
    }
  }, [generatedText, loading]);
  
  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const addMessageToChat = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Add user message to chat
    addMessageToChat(prompt, true);
    
    // Generate AI response
    dispatch(generateTextAsync({ prompt, model }));
    
    // Clear input
    setPrompt('');
  };

  const handleClear = () => {
    dispatch(clearGeneratedText());
    setChatHistory([]);
    setPrompt('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Gemini Chat</h1>
          <div className="flex items-center space-x-2">
            <label htmlFor="model-select" className="text-sm font-medium text-gray-600">
              Model:
            </label>
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="text-sm border rounded-md px-2 py-1 bg-white"
            >
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</option>
              <option value="gemini-1.5">Gemini 1.5</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
            <button
              onClick={handleClear}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-md transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Start a conversation with Gemini
          </div>
        ) : (
          chatHistory.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.text}</div>
                <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-3xl px-4 py-2 rounded-lg bg-white border border-gray-200 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="max-w-3xl px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600">
              Error: {error}
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiChat;