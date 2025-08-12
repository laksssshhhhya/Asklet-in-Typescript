import React, { createContext, useContext, useState} from 'react';
import type {ReactNode } from 'react';
import type { QuizData, QuizResult, QuizSettings, QuizEvaluation } from '../types/quiz';

interface QuizContextType {
  quizData: QuizData | null;
  setQuizData: (data: QuizData | null) => void;
  quizSettings: QuizSettings | null;
  setQuizSettings: (settings: QuizSettings | null) => void;
  quizResults: QuizResult[] | null;
  setQuizResults: (results: QuizResult[] | null) => void;
  quizEvaluation: QuizEvaluation | null;
  setQuizEvaluation: (evaluation: QuizEvaluation | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[] | null>(null);
  const [quizEvaluation, setQuizEvaluation] = useState<QuizEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <QuizContext.Provider value={{
      quizData,
      setQuizData,
      quizSettings,
      setQuizSettings,
      quizResults,
      setQuizResults,
      quizEvaluation,
      setQuizEvaluation,
      isLoading,
      setIsLoading
    }}>
      {children}
    </QuizContext.Provider>
  );
};