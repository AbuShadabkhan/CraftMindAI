# 🚀 CraftMindAI - AI-Powered Creative Suite

<div align="center">
  <img src="https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18.0.0-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.1.0-black?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Clerk-Auth-purple?style=for-the-badge&logo=clerk" alt="Clerk" />
</div>

<br>

<div align="center">
  <h3>🎨 Transform Your Ideas into Reality with AI</h3>
  <p>CraftMindAI is a comprehensive AI-powered platform that helps you create stunning images, generate articles, review resumes, and more - all powered by cutting-edge AI technology.</p>
</div>

## ✨ Features

### 🎭 AI Image Generation
- **Pollinations AI Cloud Integration**: Generate stunning cloud-based images from text prompts instantly and      reliably.
- **Diverse Art Styles**: Choose from multiple artistic styles including Realistic, Ghibli, Pixel Art, Cartoon, Fantasy, and 3D styles.
- **Public/Private Sharing**: Opt to keep your generations private or publish them to share your creations with others.
- **High-Resolution Export**: Easily download your final creations directly to your device with a single click.

### 📝 Content Creation
- **Article Generation**: AI-powered article writing with custom layouts
- **Blog Title Suggestions**: Instant catchy title generation
- **Community Hub**: Share and like community creations

### 📄 Resume Review
- **AI-Powered Analysis**: Get detailed feedback on your resume
- **PDF Support**: Upload and analyze PDF resumes
- **Professional Insights**: Receive actionable recommendations
- **Strengths & Weaknesses**: Comprehensive evaluation of your document

### 🖼️ Image Editing
- **Background Removal**: Remove backgrounds from images instantly
- **Object Removal**: Clean up images by removing unwanted objects
- **High-Quality Results**: Professional-grade image processing

### 👥 Community Features
- **Share Creations**: Publish your AI-generated content
- **Like & Interact**: Engage with other users' creations
- **User Dashboard**: Track your creation history and usage

### 🔐 Authentication & Security
- **Clerk Integration**: Secure user authentication
- **Premium Plans**: Freemium model with usage limits
- **API Rate Limiting**: Fair usage policies

## 🛠️ Tech Stack

### Frontend 
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL (Neon)** - Database
- **Multer** - File upload handling
- **PDF Parse** - PDF text extraction

### AI Services & Cloud Integrations
- **Google Gemini (Gemini Flash)** - Advanced text generation, comprehensive article writing, blog title generation, resume review, and AI website/React code generation
- **Pollinations AI** - Cloud-based image generation supporting multiple artistic styles and public/private publishing controls
- **Remove.bg & ClipDrop APIs** - Professional-grade background removal and advanced object cleanup/removal
- **Smart Credit Tracking System** - Automated per-tool, per-day usage limits (5 free / 50 pro) with built-in midnight resets and database synchronization

### Authentication & Storage
- **Clerk** - User authentication
- **Cloudinary** - Image storage and optimization

```
CraftMindAI/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── assets/          # Images and other assets
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── server/                  # Backend Node.js API
│   ├── configs/             # Configuration files
│   │   ├── db.js            # Database connection
│   │   └── multer.js        # File upload configuration
│   ├── controllers/         # Route controllers
│   │   ├── aiController.js
│   │   └── userController.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js          # Authentication middleware
│   ├── routes/              # API routes
│   │   ├── aiRoutes.js
│   │   └── userRoutes.js
│   ├── temp/                # Temporary file storage
│   ├── tmp/                 # Additional temporary files
│   ├── .env                 # Server environment variables
│   ├── server.js            # Main server file
│   ├── package.json
│   └── README.md
├── node_modules/            # Root dependencies
├── package.json             # Root package.json
├── vercel.json              # Vercel deployment config
└── README.md                # Main Project README
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)
- API keys for AI services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/72897/Buddhimaan.git
   cd Buddhimaan
   ```

2. **Install dependencies for all parts**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables** (see Environment Variables section)

4. **Start the development servers**
   ```bash
   # Start frontend (in one terminal)
   npm run dev
   
   # Start backend (in another terminal)
   npm run dev:server
   ```

5. **Open your browser and visit** `http://localhost:5173`

## ⚙️ Environment Variables

### Frontend (client/.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:3000
```

### Backend (server/.env)
```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key


# Cloud AI Integrations & Smart Credit System
# Text Generation & Analysis: Handled seamlessly via Google Gemini API.
# Image Generation & Processing: Powered by Pollinations AI, Remove.bg, and ClipDrop APIs.
# Usage Limits & Credit Tracking: Enforces per-tool, per-day limits (5 free / 50 pro) with automated midnight resets synchronized via PostgreSQL database.

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🗄️ Database Setup

1. Create a PostgreSQL database (Neon recommended)
2. Update the `DATABASE_URL` in your server `.env` file
3. The database tables will be created automatically on first run

## 📡 API Endpoints

### User Routes (`/api/user`)
- `GET /get-user-creations` - Get user's creations history
- `GET /get-published-creations` - Get all community published creations
- `POST /toggle-like-creations` - Toggle like/unlike on a specific creation

### AI Routes (`/api/ai`)
- `POST /write-article` - Generate articles and text content
- `POST /blog-titles` - Generate engaging blog titles
- `POST /generate-images` - Generate images via Pollinations AI
- `POST /remove-background` - Remove image backgrounds via Remove.bg API
- `POST /remove-object` - Remove specific objects from images via ClipDrop API
- `POST /resume-review` - Parse and review PDF resumes 
- `POST /generate-website` - Generate responsive React website components

## 📜 Available Scripts

### Root Level
- `npm run install-all` - Install dependencies for all parts
- `npm run build` - Build frontend for production
- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend development server

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel deployment with:
- Frontend: Static build deployment
- Backend: Serverless functions
- Automatic scaling
- Environment variable management

### Local Development

For local development, make sure to:
1. Set up your environment variables
2. Have a PostgreSQL database running
3. Configure CORS for frontend-backend communication

## 📁 File Upload

The backend handles file uploads using Multer:
- Images: JPEG, PNG, WebP formats
- Documents: PDF files for resume review
- Temporary storage in `/tmp` directory (Vercel-compatible)

## 🛡️ Security

- JWT token validation via Clerk
- CORS configuration
- File type validation
- Rate limiting (recommended for production)
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Frontend Documentation**: [client/README.md](client/README.md)
- **Backend Documentation**: [server/README.md](server/README.md)





