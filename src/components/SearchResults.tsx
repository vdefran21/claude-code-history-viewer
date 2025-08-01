import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { SearchResult } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  onResultClick: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  loading,
  error,
  onResultClick,
}) => {
  const formatProjectName = (name: string) => {
    return name
      .replace(/-Users-[^-]+-/g, '')
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const highlightMatch = (text: string, matchIndex: number, queryLength: number) => {
    if (matchIndex < 0) return text;
    
    const before = text.substring(0, matchIndex);
    const match = text.substring(matchIndex, matchIndex + queryLength);
    const after = text.substring(matchIndex + queryLength);
    
    return (
      <>
        {before}
        <Box component="span" sx={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
          {match}
        </Box>
        {after}
      </>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
        <Typography variant="h5" gutterBottom>
          Search Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </Typography>
      </Paper>

      {results.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No results found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try searching with different keywords
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          <List>
            {results.map((result, index) => (
              <React.Fragment key={`${result.project}-${result.session}-${result.messageUuid}`}>
                <ListItemButton
                  onClick={() => onResultClick(result)}
                  sx={{
                    p: 2,
                    alignItems: 'flex-start',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" component="span">
                          {formatProjectName(result.project)}
                        </Typography>
                        <Chip
                          label={result.role}
                          size="small"
                          color={result.role === 'user' ? 'primary' : 'secondary'}
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          {formatDistanceToNow(new Date(result.timestamp))}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontFamily: 'monospace', fontSize: '0.75rem' }}
                        >
                          {result.session.replace('.jsonl', '')}
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                          {result.context.startsWith('...') ? '' : '...'}
                          {highlightMatch(result.context, result.matchIndex, query.length)}
                          {result.context.endsWith('...') ? '' : '...'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
                {index < results.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchResults;