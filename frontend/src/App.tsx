import React, { useState, useEffect } from 'react';
import PDFUpload from './components/PDFUpload';
import ChatInterface from './components/ChatInterface';
import PDFViewer from './components/PDFViewer';
import { Document } from './types';

function App() {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(true);

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleDocumentUpload = (document: Document) => {
    setCurrentDocument(document);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadComplete = () => {
    setIsUploading(false);
  };

  const handleClose = () => {
    setCurrentDocument(null);
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!currentDocument ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <PDFUpload 
            onDocumentUpload={handleDocumentUpload}
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            isUploading={isUploading}
          />
        </div>
      ) : (
        <div className="flex h-screen">
          {/* Mobile Toggle Buttons */}
          {isMobile && (
            <div className="fixed top-4 right-4 z-50 flex space-x-2">
              <button
                onClick={() => setShowChat(true)}
                className={`px-3 py-1 text-sm rounded-md ${
                  showChat ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setShowChat(false)}
                className={`px-3 py-1 text-sm rounded-md ${
                  !showChat ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                PDF
              </button>
            </div>
          )}

          {/* Chat Interface - Left Panel */}
          <div className={`${
            isMobile 
              ? (showChat ? 'w-full' : 'hidden') 
              : 'w-1/3'
          } bg-white border-r border-gray-200 flex flex-col`}>
            <ChatInterface 
              document={currentDocument}
              onClose={handleClose}
            />
          </div>
          
          {/* PDF Viewer - Right Panel */}
          <div className={`${
            isMobile 
              ? (showChat ? 'hidden' : 'w-full') 
              : 'w-2/3'
          } bg-white`}>
            <PDFViewer document={currentDocument} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
