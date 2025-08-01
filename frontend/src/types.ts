export interface Document {
  id: string;
  filename: string;
  filepath: string;
  uploadDate: string;
  pages: Page[];
  textContent: string;
}

export interface Page {
  pageNumber: number;
  content: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: ChatResponse;
  timestamp: string;
}

export interface ChatResponse {
  text: string;
  citations: Citation[];
}

export interface Citation {
  page: number;
  text: string;
}

export interface UploadResponse {
  success: boolean;
  documentId: string;
  filename: string;
  pages: number;
} 