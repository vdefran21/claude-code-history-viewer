#!/bin/bash

echo "🚀 Starting Claude History Viewer..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Always rebuild for latest changes
echo "🔨 Building React app..."
npm run build
echo ""

echo "✅ Starting server on http://localhost:8080"
echo "Press Ctrl+C to stop"
echo ""

npm run server