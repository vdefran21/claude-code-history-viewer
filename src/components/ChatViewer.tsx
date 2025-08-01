import React from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { Message as MessageType } from '../types';
import Message from './Message';

interface ChatViewerProps {
  projectName: string;
  sessionId: string;
  messages: MessageType[];
  highlightMessageUuid?: string | null;
  searchQuery?: string;
}

const ChatViewer: React.FC<ChatViewerProps> = ({ 
  projectName, 
  sessionId, 
  messages, 
  highlightMessageUuid,
  searchQuery 
}) => {
  // Filter out tool result messages that are just responses to assistant tool calls
  const filteredMessages = messages.filter((entry) => {
    if (!entry.message) return false;
    
    // Skip tool result only messages
    if (entry.type === 'user' && entry.message.content && Array.isArray(entry.message.content)) {
      const hasOnlyToolResults = entry.message.content.every(
        (item) => item.type === 'tool_result' || item.tool_use_id
      );
      if (hasOnlyToolResults) return false;
    }
    
    return entry.message.role === 'user' || entry.message.role === 'assistant';
  });

  // Scroll to highlighted message when it changes
  React.useEffect(() => {
    if (highlightMessageUuid) {
      const element = document.getElementById(`message-${highlightMessageUuid}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightMessageUuid]);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
        <Typography variant="h5" gutterBottom>
          {projectName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          {sessionId}
        </Typography>
        {searchQuery && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            Showing results for: "{searchQuery}"
          </Typography>
        )}
      </Paper>
      
      <Box>
        {filteredMessages.map((message) => (
          <Message 
            key={message.uuid} 
            message={message}
            isHighlighted={message.uuid === highlightMessageUuid}
            searchQuery={searchQuery}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ChatViewer;