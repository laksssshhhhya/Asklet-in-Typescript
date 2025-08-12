import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { submitQuiz } from '../services/api';
import type { UserAnswer } from '../types/quiz';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { quizData, setQuizResults, setQuizEvaluation, isLoading, setIsLoading } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!quizData) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizData, navigate]);

  const handleAnswerChange = (answer: string) => {
    const newAnswers = answers.filter(a => a.question_index !== currentQuestion);
    newAnswers.push({
      question_index: currentQuestion,
      user_answer: answer
    });
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizData) return;
    
    setIsLoading(true);
    try {
      const evaluation = await submitQuiz({
        quiz_id: quizData.quiz_id,
        answers
      });
      setQuizResults(evaluation.results);
      setQuizEvaluation(evaluation);
      navigate('/results');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentAnswer = () => {
    const answer = answers.find(a => a.question_index === currentQuestion);
    return answer?.user_answer || '';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-100">Quiz in Progress</h1>
          <div className="flex items-center space-x-2 text-slate-300">
            <Clock className="h-5 w-5" />
            <span className={`font-mono ${timeLeft < 60 ? 'text-red-400' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-slate-400 mt-2">
          Question {currentQuestion + 1} of {quizData.questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">
          {question.question}
        </h2>

        {question.type === 'MCQ' && question.options ? (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-4 rounded-lg border border-slate-600 hover:border-blue-500 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={getCurrentAnswer() === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-slate-200">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={getCurrentAnswer()}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Enter your answer..."
              className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-full"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="bg-slate-700 hover:bg-slate-600 focus:ring-slate-500 text-slate-100 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-3">
          {currentQuestion < quizData.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Submit Quiz</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;