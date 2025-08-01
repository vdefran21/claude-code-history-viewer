import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
  Toolbar,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Project, Message, SearchResult } from './types';
import ChatViewer from './components/ChatViewer';
import SearchResults from './components/SearchResults';
import NavigationBar from './components/NavigationBar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
      light: '#34495e',
      dark: '#1a252f',
    },
    secondary: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2980b9',
    },
    success: {
      main: '#27ae60',
      light: '#2ecc71',
      dark: '#229954',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

const drawerWidth = 300;

type ViewMode = 'home' | 'search' | 'session';

function App() {
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  
  // Search state
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [highlightMessageUuid, setHighlightMessageUuid] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      const projectsData: Record<string, Project> = {};
      for (const [name, sessions] of Object.entries(data)) {
        projectsData[name] = {
          name,
          sessions: sessions as string[],
        };
      }
      
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (projectName: string, sessionFile: string, highlightUuid?: string) => {
    try {
      setLoading(true);
      setSelectedProject(projectName);
      setSelectedSession(sessionFile);
      setViewMode('session');
      setHighlightMessageUuid(highlightUuid || null);
      
      const response = await fetch(
        `/api/session?project=${encodeURIComponent(projectName)}&session=${encodeURIComponent(sessionFile)}`
      );
      const data = await response.json();
      
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    try {
      setSearchLoading(true);
      setSearchQuery(query);
      setViewMode('search');
      setSearchError(null);
      
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      setSearchResults(data);
    } catch (err) {
      setSearchError('Failed to search');
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    loadSession(result.project, result.session, result.messageUuid);
  };

  const handleHome = () => {
    setViewMode('home');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedProject(null);
    setSelectedSession(null);
    setMessages([]);
    setHighlightMessageUuid(null);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const toggleProject = (projectName: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectName)) {
      newExpanded.delete(projectName);
    } else {
      newExpanded.add(projectName);
    }
    setExpandedProjects(newExpanded);
  };

  const formatProjectName = (name: string) => {
    return name
      .replace(/-Users-[^-]+-/g, '')
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const renderMainContent = () => {
    if (viewMode === 'search') {
      return (
        <SearchResults
          query={searchQuery}
          results={searchResults}
          loading={searchLoading}
          error={searchError}
          onResultClick={handleSearchResultClick}
        />
      );
    }

    if (viewMode === 'session' && selectedProject && selectedSession) {
      return (
        <ChatViewer
          projectName={formatProjectName(selectedProject)}
          sessionId={selectedSession.replace('.jsonl', '')}
          messages={messages}
          highlightMessageUuid={highlightMessageUuid}
          searchQuery={searchQuery}
        />
      );
    }

    // Home view
    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      );
    }

    if (loading && Object.keys(projects).length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Welcome to Claude History Viewer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select a project and session from the sidebar to view conversation history,
          or use the search bar above to find specific conversations.
        </Typography>
      </Paper>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <NavigationBar
          onSearch={performSearch}
          onHome={handleHome}
          searchQuery={searchQuery}
        />
        
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <IconButton 
                onClick={loadProjects} 
                size="small"
                sx={{ mb: 1 }}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
              {loading && Object.keys(projects).length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </Box>
            
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {loading && !Object.keys(projects).length ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {Object.entries(projects).map(([projectName, project]) => (
                    <React.Fragment key={projectName}>
                      <ListItemButton onClick={() => toggleProject(projectName)}>
                        <ListItemText
                          primary={formatProjectName(projectName)}
                          secondary={`${project.sessions.length} session${
                            project.sessions.length > 1 ? 's' : ''
                          }`}
                        />
                        {expandedProjects.has(projectName) ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={expandedProjects.has(projectName)} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {project.sessions.map((session) => (
                            <ListItemButton
                              key={session}
                              sx={{ pl: 4 }}
                              selected={selectedProject === projectName && selectedSession === session && viewMode === 'session'}
                              onClick={() => loadSession(projectName, session)}
                            >
                              <ListItemText
                                primary={session.replace('.jsonl', '')}
                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </Drawer>
        
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {renderMainContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;