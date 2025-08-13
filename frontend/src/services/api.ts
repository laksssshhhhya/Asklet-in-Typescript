import axios from 'axios';
import type { QuizData, QuizSettings, QuizEvaluation } from '../types/quiz';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://asklet-backend.onrender.com/api'  // Replace with your actual backend URL
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateQuiz = async (settings: QuizSettings): Promise<QuizData> => {
  try {
    const response = await api.post('/quiz/generate', settings);
    return response.data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
};

export const submitQuiz = async (submission: {
  quiz_id: string;
  answers: Array<{ question_index: number; user_answer: string }>;
}): Promise<QuizEvaluation> => {
  try {
    const response = await api.post('/quiz/submit', submission);
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw new Error('Failed to submit quiz');
  }
};

export const downloadResults = async (quizId: string): Promise<Blob> => {
  try {
    const response = await api.get(`/quiz/${quizId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading results:', error);
    throw new Error('Failed to download results');
  }
};

export default api;