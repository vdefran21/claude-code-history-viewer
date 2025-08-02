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
  const scrollAttemptRef = React.useRef(0);
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
  const scrollToMessage = React.useCallback((uuid: string, attempt: number = 0) => {
    const element = document.getElementById(`message-${uuid}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      scrollAttemptRef.current = 0;
    } else if (attempt < 5) {
      // Retry up to 5 times with increasing delays
      setTimeout(() => scrollToMessage(uuid, attempt + 1), 100 * (attempt + 1));
    }
  }, []);

  React.useEffect(() => {
    if (highlightMessageUuid && messages.length > 0) {
      scrollAttemptRef.current += 1;
      // Reset scroll attempts for new UUID
      if (scrollAttemptRef.current === 1) {
        setTimeout(() => scrollToMessage(highlightMessageUuid), 100);
      }
    }
  }, [highlightMessageUuid, messages.length, sessionId, scrollToMessage]);

  // Additional effect for when filtered messages change (component fully rendered)
  React.useEffect(() => {
    if (highlightMessageUuid && filteredMessages.length > 0) {
      setTimeout(() => scrollToMessage(highlightMessageUuid), 150);
    }
  }, [filteredMessages.length, highlightMessageUuid, scrollToMessage]);

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