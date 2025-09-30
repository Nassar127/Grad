import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { marked } from 'marked';
import { api } from '../lib/api';
import { userStore } from '../lib/auth';
import { Link } from '../components/ui/Link';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface AiChatbotProps {
  className?: string;
}

const formatMessage = (text: string) => {
  return marked.parse(text);
};

const AiChatbot: React.FC<AiChatbotProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm MediLearn's AI assistant. How can I help with your medical questions today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatId, setChatId] = useState<number | null>(null);
  const user = userStore.get();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || !user) return;

    setIsLoading(true);
    const optimisticId = Date.now().toString();

    setMessages(prev => [
      ...prev,
      { id: optimisticId, text, sender: 'user', timestamp: new Date() },
    ]);
    setInputValue('');

    try {
      let currentChatId = chatId;

      if (!currentChatId) {
        const newChat = await api.createChat('New Web Chat');
        currentChatId = newChat.id;
        setChatId(newChat.id);
      }

      const response = await api.sendMessage(currentChatId, text);

      const botMessage: Message = {
        id: response.botMessage.id.toString(),
        text: response.botMessage.text,
        sender: 'bot',
        timestamp: new Date(response.botMessage.createdAt),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat API error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: 'Oops! Something went wrong. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center h-full bg-gray-50 p-6 rounded-lg shadow-md ${className}`}
      >
        <MessageSquare className="h-12 w-12 text-blue-300 mb-4" />
        <h3 className="font-semibold text-lg text-gray-800 mb-2">Log in to Chat</h3>
        <p className="text-gray-600 mb-4">Please log in to save your conversations and access the AI assistant.</p>
        <Link to="/login">
          <Button variant="primary">
            Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full max-h-[500px]'
      } bg-white rounded-lg shadow-md ${className}`}
      style={{ overflow: 'hidden' }}
    >
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <MessageSquare className="h-6 w-6 mr-2" />
        <h3 className="font-semibold flex-1">Medical AI Assistant</h3>
        <button onClick={() => setIsFullscreen(prev => !prev)} className="ml-auto hover:text-blue-200">
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ minHeight: 0 }}>
        {messages.map(message => (
          <div key={message.id} className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 prose prose-sm max-w-none ${
                message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white shadow text-gray-800'
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} />
              <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={user ? 'Ask a medical question...' : 'Please log in to chat'}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            disabled={isLoading || !user}
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim() || !user}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-400"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AiChatbot;