
// lib/api/quiz.ts

// Types
interface QuizOption {
  id: string;
  optionText: string;
  isCorrected: boolean;
}

interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  questions: QuizQuestion[];
  category?: string;
  plays?: number;
  participants?: number;
}

// Updated API Functions for Quiz Detail Page

// Constants
const API_ENDPOINTS = {
  QUIZ_BY_ID: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`,
} as const;

// API Functions
const fetchQuizById = async (id: string): Promise<QuizData | null> => {
  try {
    const res = await fetch(API_ENDPOINTS.QUIZ_BY_ID(id), { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (res.status === 404) {
      return null;
    }
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const quiz: QuizData = await res.json();
    return quiz;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

// Alternative: With Authentication Token
const fetchQuizByIdWithAuth = async (id: string, token?: string): Promise<QuizData | null> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(API_ENDPOINTS.QUIZ_BY_ID(id), { 
      cache: "no-store",
      headers,
    });
    
    if (res.status === 404) {
      return null;
    }
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const quiz: QuizData = await res.json();
    return quiz;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

// Update Quiz Function (for PUT endpoint)
const updateQuiz = async (
  id: string, 
  data: {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    visibility?: string;
  },
  token?: string
): Promise<QuizData | null> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(API_ENDPOINTS.QUIZ_BY_ID(id), {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const updatedQuiz: QuizData = await res.json();
    return updatedQuiz;
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw error;
  }
};

// Delete Quiz Function (for DELETE endpoint)
const deleteQuiz = async (id: string, token?: string): Promise<boolean> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(API_ENDPOINTS.QUIZ_BY_ID(id), {
      method: 'DELETE',
      headers,
    });
    
    if (res.status === 204) {
      return true;
    }
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

export { fetchQuizById, fetchQuizByIdWithAuth, updateQuiz, deleteQuiz };
