import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface NavigationBarProps {
  onSearch: (query: string) => void;
  onHome: () => void;
  searchQuery: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onSearch, onHome, searchQuery }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    onHome();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onHome}
          sx={{ mr: 2 }}
        >
          <HomeIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ mr: 3 }}>
          Claude History Viewer
        </Typography>
        
        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, maxWidth: 600 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search across all conversations..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: localQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    sx={{ color: 'inherit' }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
                '& .MuiInputBase-input': {
                  color: 'inherit',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;