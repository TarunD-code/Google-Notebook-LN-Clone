import React from 'react';
import { Citation } from '../types';

interface CitationButtonProps {
  citation: Citation;
  documentId: string;
}

const CitationButton: React.FC<CitationButtonProps> = ({ citation, documentId }) => {
  const handleCitationClick = () => {
    // This will be handled by the PDF viewer component
    // For now, we'll just log the citation
    console.log(`Navigate to page ${citation.page} in document ${documentId}`);
    
    // You can implement a custom event or callback to communicate with the PDF viewer
    const event = new CustomEvent('navigateToPage', {
      detail: { page: citation.page, documentId }
    });
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={handleCitationClick}
      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors"
    >
      {citation.text}
    </button>
  );
};

export default CitationButton; 