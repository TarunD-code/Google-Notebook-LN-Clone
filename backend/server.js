require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { generateEnhancedAIResponse, generateEmbedding, getRelevantChunks } = require('./ai-config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// In-memory storage (in production, use a proper database)
const documents = new Map();
const chatHistory = new Map();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Google NotebookLM Clone Backend API',
    status: 'running',
    endpoints: [
      'POST /api/upload - Upload PDF file',
      'GET /api/documents/:id - Get document details',
      'POST /api/chat - Send chat message',
      'GET /api/chat/:documentId - Get chat history'
    ]
  });
});

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const documentId = uuidv4();
    const document = {
      id: documentId,
      filename: req.file.originalname,
      filepath: req.file.path,
      uploadDate: new Date().toISOString(),
      pages: [],
      textContent: ''
    };

    // Parse PDF and extract text
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    
    document.textContent = data.text;
    
    // Better page extraction - split by form feed or large gaps
    const pageBreaks = data.text.split(/\f|\n\s*\n\s*\n/);
    document.pages = pageBreaks.map((pageContent, index) => ({
      pageNumber: index + 1,
      content: pageContent.trim()
    })).filter(page => page.content.length > 20); // Filter out very short segments
    
    // If no proper pages found, create artificial pages
    if (document.pages.length === 0) {
      const wordsPerPage = 500;
      const words = data.text.split(' ');
      const totalPages = Math.ceil(words.length / wordsPerPage);
      
      for (let i = 0; i < totalPages; i++) {
        const startIndex = i * wordsPerPage;
        const endIndex = Math.min((i + 1) * wordsPerPage, words.length);
        const pageContent = words.slice(startIndex, endIndex).join(' ');
        
        document.pages.push({
          pageNumber: i + 1,
          content: pageContent.trim()
        });
      }
    }

    // After splitting pages, generate embeddings for each page
    document.pages = await Promise.all(document.pages.map(async (page) => {
      let embedding = [];
      try {
        embedding = await generateEmbedding(page.content);
      } catch (e) {
        console.error('Embedding error:', e);
      }
      return {
        ...page,
        embedding
      };
    }));

    documents.set(documentId, document);
    chatHistory.set(documentId, []);

    res.json({
      success: true,
      documentId,
      filename: req.file.originalname,
      pages: document.pages.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

app.get('/api/documents/:id', (req, res) => {
  const document = documents.get(req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json(document);
});

app.post('/api/chat', async (req, res) => {
  try {
    const { documentId, message } = req.body;
    
    if (!documentId || !message) {
      return res.status(400).json({ error: 'Document ID and message are required' });
    }

    const document = documents.get(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Get chat history
    const history = chatHistory.get(documentId) || [];

    // === Semantic Search: Find relevant chunks ===
    const chunks = document.pages.map(page => ({
      content: page.content,
      embedding: page.embedding
    }));
    let relevantChunks = [];
    try {
      relevantChunks = await getRelevantChunks(message, chunks, 3); // Top 3 relevant
    } catch (e) {
      console.error('Semantic search error:', e);
      relevantChunks = chunks.slice(0, 3); // fallback
    }

    // Pass only relevant chunks as context
    const contextDocument = {
      ...document,
      textContent: relevantChunks.map(c => c.content).join('\n\n'),
      pages: document.pages.filter(page => relevantChunks.some(c => c.content === page.content))
    };

    // Enhanced AI response generation
    const response = await generateEnhancedAIResponse(message, contextDocument, history);
    
    // Add to chat history
    const chatEntry = {
      id: uuidv4(),
      message,
      response,
      timestamp: new Date().toISOString()
    };
    
    history.push(chatEntry);
    chatHistory.set(documentId, history);

    res.json(chatEntry);

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.get('/api/chat/:documentId', (req, res) => {
  const history = chatHistory.get(req.params.documentId) || [];
  res.json(history);
});

// Serve PDF files
app.get('/api/documents/:id/file', (req, res) => {
  const document = documents.get(req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  res.sendFile(document.filepath, { root: '.' });
});



// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
