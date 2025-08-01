import React, { useState, useEffect, useRef } from 'react';
import { Send, X, FileText } from 'lucide-react';
import axios from 'axios';
import { Document, ChatMessage } from '../types';
import CitationButton from './CitationButton';

interface ChatInterfaceProps {
  document: Document;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ document, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history when document changes
    loadChatHistory();
  }, [document.id]);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`/api/chat/${document.id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        documentId: document.id,
        message: userMessage
      });

      const newMessage: ChatMessage = response.data;
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: userMessage,
        response: {
          text: 'Sorry, I encountered an error while processing your request. Please try again.',
          citations: []
        },
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exampleQuestions = [
    'What is the main topic of this document?',
    'Can you summarize the key points?',
    'What are the conclusions or recommendations?'
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary-50 border-b border-primary-200">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-primary-900">
              Your document is ready!
            </h2>
            <p className="text-sm text-primary-700">
              {document.filename}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="mb-4">You can now ask questions about your document. For example:</p>
            <div className="space-y-2">
              {exampleQuestions.map((question, index) => (
                <div
                  key={index}
                  className="text-sm text-primary-600 hover:text-primary-800 cursor-pointer"
                  onClick={() => setInputMessage(question)}
                >
                  • {question}
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-primary-600 text-white rounded-lg px-4 py-2 max-w-xs">
                  {message.message}
                </div>
              </div>
              
              {/* AI Response */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <p className="text-gray-900 mb-3">{message.response.text}</p>
                    
                    {/* Citations */}
                    {message.response.citations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.response.citations.map((citation, index) => (
                          <CitationButton
                            key={index}
                            citation={citation}
                            documentId={document.id}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-primary-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the document..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 