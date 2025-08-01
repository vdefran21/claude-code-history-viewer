const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// API Routes
app.get('/api/projects', async (req, res) => {
  try {
    const claudeDir = path.join(os.homedir(), '.claude', 'projects');
    const projects = {};
    
    try {
      const dirs = await fs.readdir(claudeDir);
      
      for (const dir of dirs) {
        const projectPath = path.join(claudeDir, dir);
        const stats = await fs.stat(projectPath);
        
        if (stats.isDirectory()) {
          const files = await fs.readdir(projectPath);
          const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
          
          if (jsonlFiles.length > 0) {
            projects[dir] = jsonlFiles;
          }
        }
      }
    } catch (error) {
      console.error('Error reading claude directory:', error);
    }
    
    res.json(projects);
  } catch (error) {
    console.error('Error in /api/projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.get('/api/session', async (req, res) => {
  try {
    const { project, session } = req.query;
    
    if (!project || !session) {
      return res.status(400).json({ error: 'Missing project or session parameter' });
    }
    
    const claudeDir = path.join(os.homedir(), '.claude', 'projects');
    const filePath = path.join(claudeDir, project, session);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.trim().split('\n');
      const messages = [];
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            messages.push(JSON.parse(line));
          } catch (parseError) {
            console.error('Error parsing line:', parseError);
          }
        }
      }
      
      res.json(messages);
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ error: 'Session file not found' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in /api/session:', error);
    res.status(500).json({ error: 'Failed to load session' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Missing search query' });
    }
    
    const claudeDir = path.join(os.homedir(), '.claude', 'projects');
    const searchResults = [];
    const searchTerm = query.toLowerCase();
    
    try {
      const dirs = await fs.readdir(claudeDir);
      
      for (const dir of dirs) {
        const projectPath = path.join(claudeDir, dir);
        const stats = await fs.stat(projectPath);
        
        if (stats.isDirectory()) {
          const files = await fs.readdir(projectPath);
          const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
          
          for (const sessionFile of jsonlFiles) {
            const filePath = path.join(projectPath, sessionFile);
            
            try {
              const fileContent = await fs.readFile(filePath, 'utf8');
              const lines = fileContent.trim().split('\n');
              
              for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                const line = lines[lineIndex];
                if (line.trim()) {
                  try {
                    const message = JSON.parse(line);
                    
                    // Search in message content
                    if (message.message && message.message.content) {
                      let textToSearch = '';
                      
                      if (typeof message.message.content === 'string') {
                        textToSearch = message.message.content;
                      } else if (Array.isArray(message.message.content)) {
                        textToSearch = message.message.content
                          .filter(item => item.type === 'text' && item.text)
                          .map(item => item.text)
                          .join(' ');
                      }
                      
                      if (textToSearch.toLowerCase().includes(searchTerm)) {
                        // Find the specific position of the match
                        const matchIndex = textToSearch.toLowerCase().indexOf(searchTerm);
                        const contextStart = Math.max(0, matchIndex - 100);
                        const contextEnd = Math.min(textToSearch.length, matchIndex + searchTerm.length + 100);
                        const context = textToSearch.substring(contextStart, contextEnd);
                        
                        searchResults.push({
                          project: dir,
                          session: sessionFile,
                          messageUuid: message.uuid,
                          messageIndex: lineIndex,
                          role: message.message.role,
                          timestamp: message.timestamp,
                          context: context,
                          matchIndex: matchIndex - contextStart
                        });
                      }
                    }
                  } catch (parseError) {
                    // Skip invalid JSON lines
                  }
                }
              }
            } catch (fileError) {
              console.error(`Error reading file ${filePath}:`, fileError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading claude directory:', error);
    }
    
    // Sort results by timestamp (newest first)
    searchResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.json(searchResults);
  } catch (error) {
    console.error('Error in /api/search:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing - serve index.html for all non-API routes
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Claude History Viewer running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
  console.log('\nMake sure to run "npm run build" first to create the dist folder!');
});