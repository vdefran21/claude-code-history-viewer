# Claude History Viewer - React + Material-UI

A modern web application for viewing Claude conversation history with a clean Material-UI interface. This is a completely standalone Node.js/Express application - no Python required!

## Features

- 🎨 Modern Material-UI design
- 📁 Automatic loading from `~/.claude/projects`
- 🔄 Collapsible tool sections
- 📱 Responsive layout
- 🎯 Type-safe with TypeScript
- ⚡ Fast development with Vite
- 🚀 Production-ready Express server
- 🐍 No Python dependencies - pure Node.js

## Quick Start

```bash
cd claude-viewer-react
./start.sh
```

## Manual Setup

1. Install dependencies:
```bash
cd claude-viewer-react
npm install
```

2. Development mode (with hot reload):
```bash
npm run dev
```

3. Build and run production server:
```bash
npm start
```

Or separately:
```bash
npm run build  # Build the React app
npm run server # Run the Express server
```

## Architecture

- **Frontend**: React + TypeScript + Material-UI
- **Build Tool**: Vite
- **Server**: Express.js
- **API Endpoints**:
  - `GET /api/projects` - List all projects and sessions
  - `GET /api/session?project=X&session=Y` - Get messages for a session

## Components

- `App.tsx` - Main application with navigation drawer
- `ChatViewer.tsx` - Displays conversation for selected session
- `Message.tsx` - Individual message component
- `ToolSection.tsx` - Collapsible tool usage/result sections

## Customization

The theme can be customized in `App.tsx` by modifying the Material-UI theme configuration.