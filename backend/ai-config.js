// AI Configuration for Google NotebookLM Clone
// This file contains configuration for different AI providers

require('dotenv').config();

const AI_CONFIG = {
  // OpenAI Configuration
  openai: {
    model: 'gpt-3.5-turbo',
    maxTokens: 1500,
    temperature: 0.3,
    systemPrompt: `You are a helpful AI assistant that helps users understand PDF documents. 
    You should provide accurate, detailed responses based on the document content.
    Always include relevant page citations when possible.
    Structure your responses clearly and provide specific information from the document.
    If you find relevant information, cite the specific pages where it appears.
    If you cannot find specific information, politely say so and suggest alternative questions.`
  },

  // Basic NLP Configuration (fallback)
  nlp: {
    languages: ['en'],
    threshold: 0.7,
    maxResponses: 3
  },

  // Response Templates
  templates: {
    summary: "Based on the document, here's a summary: {content}",
    tools: "The document mentions these tools and skills: {content}",
    general: "I found relevant information in the document: {content}",
    error: "I'm sorry, I couldn't find specific information about that in the document. Could you try rephrasing your question?"
  },

  // Citation Settings
  citations: {
    maxCitations: 5,
    minRelevanceScore: 0.3
  }
};

// Enhanced AI Response Generator
async function generateEnhancedAIResponse(message, document, history) {
  try {
    // Check if OpenAI is configured
    if (process.env.OPENAI_API_KEY) {
      return await generateOpenAIResponse(message, document, history);
    } else {
      return await generateBasicResponse(message, document, history);
    }
  } catch (error) {
    console.error('AI response generation error:', error);
    return {
      text: AI_CONFIG.templates.error,
      citations: []
    };
  }
}

// OpenAI Response Generator
async function generateOpenAIResponse(message, document, history) {
  const OpenAI = require('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // Prepare context from document
  const documentContext = document.textContent.substring(0, 3000); // Limit context size
  
  // Prepare conversation history
  const conversationHistory = history.slice(-5).map(msg => ({
    role: 'user',
    content: msg.message
  }));

  const messages = [
    { role: 'system', content: AI_CONFIG.openai.systemPrompt },
    { role: 'user', content: `Document content: ${documentContext}\n\nUser question: ${message}` },
    ...conversationHistory
  ];

  const completion = await openai.chat.completions.create({
    model: AI_CONFIG.openai.model,
    messages: messages,
    max_tokens: AI_CONFIG.openai.maxTokens,
    temperature: AI_CONFIG.openai.temperature
  });

  const response = completion.choices[0].message.content;

  // Extract citations (simple keyword matching for now)
  const citations = extractCitations(message, document);

  return {
    text: response,
    citations: citations
  };
}

// Basic Response Generator (fallback)
async function generateBasicResponse(message, document, history) {
  const { NLP } = require('node-nlp');
  const nlp = new NLP({ languages: AI_CONFIG.nlp.languages });
  
  const keywords = message.toLowerCase().split(' ').filter(word => word.length > 3);
  const relevantPages = [];
  
  // Find relevant pages
  document.pages.forEach((page, index) => {
    const pageContent = page.content.toLowerCase();
    const matches = keywords.filter(keyword => pageContent.includes(keyword));
    if (matches.length > 0) {
      relevantPages.push(index + 1);
    }
  });

  // Generate response based on content type
  let response = '';
  if (message.toLowerCase().includes('summary') || message.toLowerCase().includes('main topic')) {
    response = AI_CONFIG.templates.summary.replace('{content}', document.textContent.substring(0, 200) + '...');
  } else if (message.toLowerCase().includes('tools') || message.toLowerCase().includes('skills')) {
    response = AI_CONFIG.templates.tools.replace('{content}', document.textContent.substring(0, 300) + '...');
  } else {
    response = AI_CONFIG.templates.general.replace('{content}', document.textContent.substring(0, 250) + '...');
  }

  return {
    text: response,
    citations: relevantPages.map(page => ({
      page,
      text: `Page ${page}`
    }))
  };
}

// Extract citations from document with enhanced relevance scoring
function extractCitations(message, document) {
  const keywords = message.toLowerCase().split(' ').filter(word => word.length > 2);
  const citations = [];
  const pageScores = [];

  // Calculate relevance score for each page
  document.pages.forEach((page, index) => {
    const pageContent = page.content.toLowerCase();
    let score = 0;
    let matchedKeywords = [];
    
    // Basic keyword matching
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = pageContent.match(regex);
      if (matches) {
        score += matches.length * 0.5;
        matchedKeywords.push(keyword);
      }
    });
    
    // Boost score for exact phrase matches
    const messageLower = message.toLowerCase();
    if (pageContent.includes(messageLower)) {
      score += 3;
    }
    
    // Boost score for important sections
    const importantSections = ['skills', 'experience', 'education', 'projects', 'summary', 'about', 'work', 'job', 'career'];
    importantSections.forEach(section => {
      if (pageContent.includes(section) && keywords.some(k => k.includes(section))) {
        score += 2;
      }
    });
    
    // Boost score for technical terms
    const technicalTerms = ['java', 'python', 'javascript', 'react', 'node', 'sql', 'html', 'css', 'api', 'database'];
    technicalTerms.forEach(term => {
      if (pageContent.includes(term) && keywords.some(k => k.includes(term))) {
        score += 1.5;
      }
    });
    
    if (score > 0) {
      pageScores.push({
        page: index + 1,
        score,
        matchedKeywords,
        content: page.content.substring(0, 150) + '...'
      });
    }
  });

  // Sort by relevance and take top citations
  pageScores
    .sort((a, b) => b.score - a.score)
    .slice(0, AI_CONFIG.citations.maxCitations)
    .forEach(pageScore => {
      citations.push({
        page: pageScore.page,
        text: `Page ${pageScore.page}`,
        relevance: pageScore.score,
        preview: pageScore.content
      });
    });

  return citations;
}

// === Embedding & Semantic Search Utilities ===
const EMBEDDING_MODEL = 'text-embedding-ada-002';

/**
 * Generate an embedding vector for a given text using OpenAI API.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
async function generateEmbedding(text) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API key required for embeddings');
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.substring(0, 1000) // Truncate to fit model limits
  });
  return response.data[0].embedding;
}

/**
 * Compute cosine similarity between two vectors.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

/**
 * Given a query and a list of chunks (with embeddings), return the top N most relevant chunks.
 * @param {string} query
 * @param {Array<{content: string, embedding: number[]}>} chunks
 * @param {number} topN
 * @returns {Promise<Array<{content: string, similarity: number}>>}
 */
async function getRelevantChunks(query, chunks, topN = 3) {
  const queryEmbedding = await generateEmbedding(query);
  const scored = chunks.map(chunk => ({
    ...chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));
  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, topN);
}

module.exports = {
  AI_CONFIG,
  generateEnhancedAIResponse,
  generateOpenAIResponse,
  generateBasicResponse,
  extractCitations,
  generateEmbedding,
  cosineSimilarity,
  getRelevantChunks
};
