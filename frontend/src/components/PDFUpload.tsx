import React from 'react';
import { Upload, FileText, X } from 'lucide-react';
import axios from 'axios';
import { Document, UploadResponse } from '../types';

interface PDFUploadProps {
  onDocumentUpload: (document: Document) => void;
  onUploadStart: () => void;
  onUploadComplete: () => void;
  isUploading: boolean;
}

const PDFUpload: React.FC<PDFUploadProps> = ({
  onDocumentUpload,
  onUploadStart,
  onUploadComplete,
  isUploading
}) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [toast, setToast] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDrag = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        handleFileUpload(file);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    onUploadStart();
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev: number) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
      const response = await axios.post<UploadResponse>('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
      // Fetch the full document details
      const documentResponse = await axios.get(`/api/documents/${response.data.documentId}`);
      const document: Document = documentResponse.data;
      setTimeout(() => {
        onDocumentUpload(document);
        onUploadComplete();
        setToast({ type: 'success', message: 'PDF uploaded successfully!' });
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      onUploadComplete();
      setUploadProgress(0);
      setSelectedFile(null);
      setToast({ type: 'error', message: 'Failed to upload PDF. Please try again.' });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  if (isUploading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        {toast && (
          <div className={`mb-4 px-4 py-2 rounded text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
            role="alert">
            {toast.message}
          </div>
        )}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-500 rounded-full animate-pulse"></div>
          </div>
          <span className="text-primary-700 font-medium">Uploading PDF</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
        <div className="text-right">
          <span className="text-primary-700 font-medium">{uploadProgress}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
      {toast && (
        <div className={`mb-4 px-4 py-2 rounded text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          role="alert">
          {toast.message}
        </div>
      )}
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload PDF to start chatting
              </h3>
              <p className="text-gray-600 text-sm">
                Click or drag and drop your file here
              </p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Choose PDF file to upload"
              />
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                tabIndex={0}
                aria-label="Choose File">
                Choose File
              </span>
            </label>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-primary-600" />
            <span className="text-lg font-medium text-gray-900">{selectedFile.name}</span>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Remove selected file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => handleFileUpload(selectedFile)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Upload PDF"
          >
            Upload PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFUpload; 