// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

// Register Types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  firstName: string;
  lastName: string;
}
// 
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  tokenType: string;
  scope: string;
}

export interface RegisterResponse {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Category Types
export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Quiz Types
export interface QuizResponse {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  visibility: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResponse {
  id: string;
  questionText: string;
  questionType: string;
  options: OptionResponse[];
  correctAnswer?: string;
}

export interface OptionResponse {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

// Game/Session Types
export interface QuizSessionResponse {
  id: string;
  quizId: string;
  participantId: string;
  status: string;
  score: number;
  startedAt: string;
  completedAt?: string;
}

export interface ParticipantAnswerRequest {
  questionId: string;
  selectedOptionId: string;
}

export interface LeaderboardResponse {
  participantId: string;
  participantName: string;
  score: number;
  completedAt: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
