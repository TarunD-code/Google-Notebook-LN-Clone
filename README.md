# Google NotebookLM Clone

A complete implementation of a Google NotebookLM clone that allows users to upload PDF documents and interact with them through an AI-powered chat interface.

![Google NotebookLM Clone](https://img.shields.io/badge/Status-Ready%20for%20Deployment-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-22.17.1-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)

## 🚀 Live Demo

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000

## ✨ Features

✅ **PDF Upload**: Drag & drop or click to upload  
✅ **Chat Interface**: Ask questions about your document  
✅ **Citation System**: Click citations to navigate pages  
✅ **PDF Viewer**: Built-in document viewer  
✅ **AI Integration**: Powered by OpenAI (if API key configured)  
✅ **Responsive Design**: Works on desktop and mobile  

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **Multer** for file uploads
- **pdf-parse** for text extraction
- **OpenAI API** integration
- **In-memory storage**

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TarunD-code/Google-Notebook-LN-Clone.git
   cd Google-Notebook-LN-Clone
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   copy env.example .env
   # Edit .env with your OpenAI API key (optional)
   ```

4. **Start the application**
   ```bash
   # Use the reliable startup script
   .\start-reliable.ps1
   ```

## 🌐 Access URLs

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Test Page**: Open `test-app.html` in browser

## 📁 Project Structure

```
Google-Notebook-LN-Clone/
├── 📦 package.json                 # Root package with scripts
├── 📁 backend/                     # Backend application
│   ├── 📦 package.json            # Backend dependencies
│   ├── 🖥️ server.js              # Express server
│   ├── 🤖 ai-config.js            # AI configuration
│   └── ⚙️ .env                    # Environment variables
├── 📁 frontend/                    # React frontend
│   ├── 📦 package.json            # Frontend dependencies
│   ├── 📁 build/                  # Built files (served by http-server)
│   └── 📁 src/                    # Source code
├── 🚀 start-reliable.ps1          # Reliable startup script
├── 🚀 start-backend.ps1           # Backend startup script
├── 🚀 fix-and-start.ps1           # Comprehensive fix script
└── 📚 README.md                   # This file
```

## 🧪 Testing

1. **Upload a PDF**: Use the drag-and-drop interface
2. **Ask Questions**: Try questions like:
   - "What is the main topic?"
   - "What skills are mentioned?"
   - "Summarize the key points"
3. **Use Citations**: Click citation buttons to navigate pages
4. **Test Responsive**: Resize browser or use mobile view

## 🔒 Security & Performance

- File type validation (PDF only)
- File size limits (10MB)
- CORS configuration
- Input sanitization
- Optimized bundle size

## 🚨 Troubleshooting

### If Frontend Won't Start:
- The React development server may have issues with Node.js 22+
- Use the reliable startup script which builds and serves static files
- Alternative: Use `npm run build` and serve with `http-server`

### If Backend Won't Start:
- Check if port 5000 is available
- Ensure all dependencies are installed
- Check the `.env` file configuration

### If Ports Are Busy:
- Run the startup script which automatically clears ports
- Or manually: `taskkill /f /im node.exe`

## 📈 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication
- Advanced AI with vector embeddings
- Real-time collaboration
- Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Google NotebookLM
- Built with React and Node.js
- Uses OpenAI API for AI functionality

---

**Status**: ✅ Complete and Ready for Deployment

This implementation provides a fully functional Google NotebookLM clone with all requested features, modern UI design, and reliable startup procedures.

## 📞 Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure ports 3000 and 5000 are available
4. Try the test page to isolate frontend/backend issues

---

⭐ **Star this repository if you find it helpful!** 