export interface Project {
  name: string;
  sessions: string[];
}

export interface Message {
  parentUuid: string | null;
  uuid: string;
  timestamp: string;
  type: string;
  message?: {
    role: 'user' | 'assistant' | 'system';
    content: string | ContentItem[];
  };
  toolUseResult?: any;
}

export interface ContentItem {
  type: 'text' | 'tool_use' | 'tool_result';
  text?: string;
  name?: string;
  input?: any;
  content?: string;
  output?: string;
  is_error?: boolean;
  tool_use_id?: string;
}

export interface SearchResult {
  project: string;
  session: string;
  messageUuid: string;
  messageIndex: number;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  context: string;
  matchIndex: number;
}