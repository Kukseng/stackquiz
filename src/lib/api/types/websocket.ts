export type WebSocketMessageType =
  | 'GAME_STATE'
  | 'QUESTION'
  | 'LEADERBOARD'
  | 'PARTICIPANT_UPDATE'
  | 'HOST_COMMAND'
  | 'JOIN_RESPONSE';

export interface WebSocketMessage {
  messageType: WebSocketMessageType;
  timestamp: number;
}

export interface GameStateMessage extends WebSocketMessage {
  messageType: 'GAME_STATE';
  action: 'SESSION_STARTED' | 'SESSION_ENDED' | 'PAUSED' | 'RESUMED';
  hostMessage?: string;
  timeLeft: number;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionMessage extends WebSocketMessage {
  messageType: 'QUESTION';
  questionId: string;
  text: string;
  options: QuestionOption[];
  questionNumber: number;
  totalQuestions: number;
  timeLimit: number;
}

export interface LeaderboardEntry {
  participantId: string;
  nickname: string;
  totalScore: number;
  position: number;
}

export interface LeaderboardMessage extends WebSocketMessage {
  messageType: 'LEADERBOARD';
  entries: LeaderboardEntry[];
  totalParticipants: number;
}

export interface ParticipantMessage extends WebSocketMessage {
  messageType: 'PARTICIPANT_UPDATE';
  totalParticipants: number;
  participants: { participantId: string; nickname: string }[];
  action: 'JOIN' | 'LEAVE';
}

export interface QuestionResponseMessage extends WebSocketMessage {
  messageType: 'JOIN_RESPONSE';
  participantId: string;
  success: boolean;
  error?: string;
}