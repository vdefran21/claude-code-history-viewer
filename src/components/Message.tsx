import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import { Message as MessageType, ContentItem } from '../types';
import ToolSection from './ToolSection';
import { formatDistanceToNow } from '../utils/dateUtils';

interface MessageProps {
  message: MessageType;
  isHighlighted?: boolean;
  searchQuery?: string;
}

const Message: React.FC<MessageProps> = ({ message, isHighlighted, searchQuery }) => {
  const isUser = message.message?.role === 'user';
  
  const highlightText = (text: string, query?: string) => {
    if (!query || !text) return text;
    
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <Box key={index} component="span" sx={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
          {part}
        </Box>
      ) : part
    );
  };
  
  const renderContent = (content: string | ContentItem[]) => {
    if (typeof content === 'string') {
      return (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {highlightText(content, searchQuery)}
        </Typography>
      );
    }
    
    return content.map((item, index) => {
      if (item.type === 'text') {
        return (
          <Typography key={index} variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
            {highlightText(item.text || '', searchQuery)}
          </Typography>
        );
      }
      
      if (item.type === 'tool_use') {
        return (
          <ToolSection
            key={index}
            title={`Tool: ${item.name}`}
            content={item.input}
          />
        );
      }
      
      return null;
    });
  };

  return (
    <Paper
      id={`message-${message.uuid}`}
      elevation={isHighlighted ? 3 : 1}
      sx={{
        mb: 2,
        p: 2,
        borderLeft: 4,
        borderLeftColor: isUser ? 'primary.main' : 'success.main',
        bgcolor: isHighlighted 
          ? 'rgba(255, 193, 7, 0.2)' 
          : isUser 
            ? 'rgba(44, 62, 80, 0.08)' 
            : 'rgba(39, 174, 96, 0.08)',
        boxShadow: isHighlighted ? '0 0 10px rgba(255, 193, 7, 0.5)' : undefined,
        transition: 'all 0.3s ease',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Chip
          label={message.message?.role}
          size="small"
          color={isUser ? 'primary' : 'success'}
        />
        <Typography variant="caption" color="text.secondary">
          {formatDistanceToNow(message.timestamp)}
        </Typography>
      </Box>
      
      <Box>
        {message.message?.content && renderContent(message.message.content)}
      </Box>
      
      {message.toolUseResult && (
        <Box sx={{ mt: 1 }}>
          <ToolSection
            title="Tool Result"
            content={
              message.toolUseResult.stdout ||
              message.toolUseResult.stderr ||
              message.toolUseResult.type ||
              message.toolUseResult
            }
            isResult
          />
        </Box>
      )}
    </Paper>
  );
};

export default Message;