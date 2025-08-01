import React, { useState, useEffect } from 'react';
import { Document } from '../types';
import 'react/jsx-runtime';

interface PDFViewerProps {
  document: Document;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ document }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    // Create a blob URL for the PDF file
    const fetchPdf = async () => {
      try {
        const response = await fetch(`/api/documents/${document.id}/file`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Failed to load PDF:', error);
      }
    };
    fetchPdf();
    // Cleanup function
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [document.id]);

  useEffect(() => {
    // Listen for navigation events from citation buttons
    const handleNavigateToPage = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.documentId === document.id) {
        setCurrentPage(customEvent.detail.page);
      }
    };
    window.addEventListener('navigateToPage', handleNavigateToPage as EventListener);
    return () => {
      window.removeEventListener('navigateToPage', handleNavigateToPage as EventListener);
    };
  }, [document.id]);

  const totalPages = document.pages.length;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* PDF Viewer Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {document.filename}
        </h2>
        {/* Page Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to previous page"
            title="Previous Page"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to next page"
            title="Next Page"
          >
            Next
          </button>
        </div>
      </div>
      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-4">
        {pdfUrl ? (
          <div className="max-w-4xl mx-auto">
            {/* PDF Display */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4">
              <iframe
                src={`${pdfUrl}#page=${currentPage}`}
                className="w-full h-96 border-0"
                title="PDF Viewer"
              />
            </div>
            {/* Text Content Display */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Page {currentPage} Content
              </h3>
              <div className="prose max-w-none">
                {document.pages[currentPage - 1] ? (
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {document.pages[currentPage - 1].content}
                  </div>
                ) : (
                  <p className="text-gray-500">No content available for this page.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">Loading PDF...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer; 