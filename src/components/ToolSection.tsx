import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

interface ToolSectionProps {
  title: string;
  content: any;
  isResult?: boolean;
}

const ToolSection: React.FC<ToolSectionProps> = ({ title, content, isResult = false }) => {
  const [expanded, setExpanded] = useState(false);

  const formatContent = () => {
    if (typeof content === 'string') {
      return content;
    }
    return JSON.stringify(content, null, 2);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        mt: 1,
        overflow: 'hidden',
        bgcolor: isResult ? 'rgba(255, 193, 7, 0.08)' : 'rgba(158, 158, 158, 0.08)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 0.5,
          bgcolor: isResult ? 'rgba(255, 193, 7, 0.2)' : 'rgba(158, 158, 158, 0.2)',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: isResult ? 'rgba(255, 193, 7, 0.3)' : 'rgba(158, 158, 158, 0.3)',
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          <Typography
            component="pre"
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              m: 0,
            }}
          >
            {formatContent()}
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ToolSection;