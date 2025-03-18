
// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';

// const GeminiAIComponent: React.FC = () => {
//   const [prompt, setPrompt] = useState<string>('');
//   const [responseText, setResponseText] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setPrompt(e.target.value);
//   };

//   const handleGenerate = async () => {
//     setIsLoading(true);
//     setError(null);
//     setResponseText('');

//     try {
//       console.log("start")
//       const response = await fetch('/api/v1/gemini/gen', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',

//         body: JSON.stringify({ prompt }),
//       });
//       console.log("api route hit")

//       if (!response.ok) {
//         throw new Error('Failed to fetch response from API');
//       }


//       const reader = response.body?.getReader();
//       const decoder = new TextDecoder();

//       if (reader) {
//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;

//           const chunk = decoder.decode(value);
//           setResponseText((prevText) => prevText + chunk);
//         }
//       }
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('An unexpected error occurred.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl">
//       <div className="  ">
//         <label htmlFor="prompt">:</label>
//         <Textarea
//           id="prompt"
//           value={prompt}
//           onChange={handlePromptChange}
//           rows={4}
//           cols={50}
//         />
//       </div>
//       <Button onClick={handleGenerate} disabled={isLoading || prompt.trim() === ''}>
//         Generate
//       </Button>
//       {isLoading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
//       {responseText && (
//         <div>
//           <h2>:</h2>
//           <p>{responseText}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GeminiAIComponent;





import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-pro');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 flash lite' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = async () => {
    if (prompt.trim() === '') return;
    
    const userMessage: Message = {
      text: prompt,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);
    setPrompt('');
    
    try {
      const response = await fetch('/api/v1/gemini/gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          prompt,
          model: selectedModel 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response from API');
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let responseText = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          responseText += chunk;
          
          // Update the message in real-time with streaming
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            // Check if we already have an AI response message
            const aiMessageIndex = newMessages.findIndex(
              msg => !msg.isUser && msg.timestamp > userMessage.timestamp
            );
            
            if (aiMessageIndex !== -1) {
              // Update existing AI message
              newMessages[aiMessageIndex] = {
                ...newMessages[aiMessageIndex],
                text: responseText
              };
            } else {
              // Add new AI message
              newMessages.push({
                text: responseText,
                isUser: false,
                timestamp: new Date()
              });
            }
            return newMessages;
          });
        }
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col h-screen mx-auto max-w-4xl">
      {/* Chat messages area - will scroll independently */}
      <div className="flex-1 overflow-y-auto p-4 pb-20"> {/* Added bottom padding to ensure messages aren't hidden behind input */}
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Start a conversation
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-gray-700 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            Error: {error}
          </div>
        )}
      </div>
      
      {/* Fixed bottom input area - fixed position so it's always visible */}
      <div className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto p-4 flex flex-col shadow-lg">
        <div className="flex items-center mb-3">
          <span className="mr-2 text-sm font-medium text-gray-700">Model:</span>
          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end space-x-2">
          <Textarea
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            rows={2}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || prompt.trim() === ''}
            className="ml-2"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;