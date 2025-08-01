# Claude History Viewer - React + Material-UI

A modern web application for viewing Claude conversation history with a clean Material-UI interface. This is a completely standalone Node.js/Express application - no Python required!

## Features

- 🎨 Modern Material-UI design
- 🔍 **Global search** across all conversations with highlighted results
- 📁 Automatic loading from `~/.claude/projects`
- 🔄 Collapsible tool sections
- 📱 Responsive layout
- 🎯 Type-safe with TypeScript
- ⚡ Fast development with Vite
- 🚀 Production-ready Express server
- 🏠 Navigation bar with home and search functionality
- ✨ Message highlighting and auto-scroll to search results
- 🐍 No Python dependencies - pure Node.js

## Quick Start

```bash
cd claude-history-viewer-react
./start.sh
```

## Manual Setup

1. Install dependencies:
```bash
cd claude-history-viewer-react
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
  - `GET /api/search?query=X` - Search across all conversations

## How to Use

### Basic Navigation
1. **Browse Projects**: Use the sidebar to expand projects and view sessions
2. **View Conversations**: Click on any session to view the full conversation
3. **Search**: Use the search bar in the top navigation to find specific content
4. **Navigate Results**: Click on search results to jump directly to that message

### Search Features
- **Global Search**: Searches across all projects and sessions
- **Context Preview**: See surrounding text for each search result
- **Highlighted Results**: Search terms are highlighted in yellow
- **Auto-scroll**: Automatically scrolls to the highlighted message
- **Timestamp Sorting**: Results are sorted by newest first

## Components

- `App.tsx` - Main application with view routing and state management
- `NavigationBar.tsx` - Top navigation with search and home functionality
- `ChatViewer.tsx` - Displays conversation for selected session with search highlighting
- `SearchResults.tsx` - Shows search results with clickable navigation
- `Message.tsx` - Individual message component with highlighting support
- `ToolSection.tsx` - Collapsible tool usage/result sections

## Development

The `start.sh` script now always rebuilds the application to ensure you're running the latest changes:

```bash
./start.sh  # Installs deps (if needed), builds, and starts server
```

For active development with hot reload:
```bash
npm run dev  # Runs Vite dev server with proxy to backend
```

## Customization

The theme can be customized in `App.tsx` by modifying the Material-UI theme configuration. The search highlighting colors can be adjusted in the `Message.tsx` and `SearchResults.tsx` components.