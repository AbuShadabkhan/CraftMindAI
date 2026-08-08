# CraftMindAI Frontend

This is the frontend application for CraftMindAI, built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard**: View your AI creations, usage statistics, and active membership plan status.
- **Write Article**: Generate high-quality articles using AI.
- **Blog Titles**: Create engaging blog titles instantly.
- **Generate Images**: Create stunning AI-generated visuals.
- **Remove Background**: Effortlessly remove backgrounds from images.
- **Remove Object**: Seamlessly remove unwanted objects from your images.
- **Resume Reviewer**: Get AI-powered feedback to optimize your resume.
- **Community**: Share, explore, and like creations from other users.

## Tech Stack

- **React 18**: Frontend framework
- **Vite**: Ultra-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework (with custom utility configurations)
- **Clerk**: Authentication and user management
- **React Router**: Client-side routing
- **Axios**: HTTP client for robust API requests
- **Lucide / React Icons**: Modern icon sets

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation & Setup

1. Navigate to the client directory:
   ```bash
   cd client

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:3000
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
client/
├── public/           # Static assets (covers, patterns, etc.)
├── src/
│   ├── assets/       # Images and graphic assets
│   ├── components/   # Reusable React components & UI elements (Button, IconCloud, etc.)
│   ├── lib/          # Utility functions (cn merger, helpers)
│   ├── pages/        # Main page views (Dashboard, Community, etc.)
│   ├── App.jsx       # Main application layout and routing
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles & Tailwind directives
├── package.json
├── vite.config.js    # Vite configuration
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
