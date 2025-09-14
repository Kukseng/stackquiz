// All event names
export type GameEvent =
  | "CREATE_GAME"
  | "JOIN_GAME"
  | "GAME_START"
  | "NEW_QUESTION"
  | "ANSWER"
  | "TIME_UP"
  | "QUESTION_RESULT"
  | "GAME_OVER";


interface PlayerJoinedPayload {
  playerId: string;
  playerName: string;
}

interface GameStartedPayload {
  roundNumber: number;
}
// Message format
export interface GameMessage {
  type: 'player_joined' | 'game_started'; // Specify the message types
  pin: string;
  payload?: PlayerJoinedPayload | GameStartedPayload;
}

// Specific payloads
export interface CreateGamePayload {
  pin: string;
}

export interface JoinGamePayload {
  player: string;
}

export interface QuestionPayload {
  questionId: string;
  text: string;
  options: string[];
  time: number;
}

export interface AnswerPayload {
  player: string;
  questionId: string;
  answer: number; // index of option
}
