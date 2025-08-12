export interface Question {
  type: 'MCQ' | 'Fill in the blank';
  question: string;
  options?: string[];
  correct_ans: string;
}

export interface QuizData {
  quiz_id: string;
  questions: Question[];
}

export interface QuizSettings {
  topic: string;
  level: string;
  difficulty: string;
  question_type: string;
  num_questions: number;
  api_key: string;
}

export interface UserAnswer {
  question_index: number;
  user_answer: string;
}

export interface QuizResult {
  question_no: number;
  question: string;
  question_type: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  options?: string[];
}

export interface QuizEvaluation {
  results: QuizResult[];
  score: number;
  total_questions: number;
  percentage: number;
}