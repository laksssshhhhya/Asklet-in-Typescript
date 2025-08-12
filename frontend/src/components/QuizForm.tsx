import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Loader2 } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { generateQuiz } from '../services/api';
import type { QuizSettings } from '../types/quiz';

const QuizForm: React.FC = () => {
  const navigate = useNavigate();
  const { setQuizData, setQuizSettings, isLoading, setIsLoading } = useQuiz();
  
  const [formData, setFormData] = useState<QuizSettings>({
    topic: '',
    level: '',
    difficulty: 'Medium',
    question_type: 'Multiple choice',
    num_questions: 5,
    api_key: 'GROQ1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const quizData = await generateQuiz(formData);
      setQuizData(quizData);
      setQuizSettings(formData);
      navigate('/quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_questions' ? parseInt(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Generate Quiz</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            API Key
          </label>
          <select
            name="api_key"
            value={formData.api_key}
            onChange={handleInputChange}
            className="select-field w-full"
            required
          >
            <option value="GROQ1">GROQ1</option>
            <option value="GROQ2">GROQ2</option>
            <option value="GROQ3">GROQ3</option>
            <option value="GROQ4">GROQ4</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Question Type
          </label>
          <select
            name="question_type"
            value={formData.question_type}
            onChange={handleInputChange}
            className="select-field w-full"
            required
          >
            <option value="Multiple choice">Multiple Choice</option>
            <option value="Fill in the Blank">Fill in the Blank</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Topic
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            placeholder="e.g., History, Geography, Science"
            className="input-field w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Level
          </label>
          <input
            type="text"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            placeholder="e.g., Grade 5, B.Tech, High School"
            className="input-field w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            className="select-field w-full"
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            name="num_questions"
            value={formData.num_questions}
            onChange={handleInputChange}
            min="1"
            max="20"
            className="input-field w-full"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            <span>Generate Quiz</span>
          </>
        )}
      </button>
    </form>
  );
};

export default QuizForm;