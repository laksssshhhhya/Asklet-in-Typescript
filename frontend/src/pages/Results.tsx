import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Download, Home, RotateCcw } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { quizResults, quizSettings, quizData, quizEvaluation } = useQuiz();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!quizResults) {
    navigate('/');
    return null;
  }

  const correctAnswers = quizResults.filter(result => result.is_correct).length;
  const totalQuestions = quizResults.length;
  const percentage = (correctAnswers / totalQuestions) * 100;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleDownload = async () => {
    if (!quizData || !quizEvaluation) {
      alert('Quiz data not available for download');
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/quiz/${quizData.quiz_id}/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizEvaluation),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz_results_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Summary */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">Quiz Results</h1>
        
        <div className={`text-6xl font-bold mb-4 ${getScoreColor(percentage)}`}>
          {percentage.toFixed(1)}%
        </div>
        
        <p className="text-xl text-slate-300 mb-6">
          You scored {correctAnswers} out of {totalQuestions} questions correctly
        </p>
        
        {quizSettings && (
          <div className="text-sm text-slate-400 space-y-1">
            <p>Topic: {quizSettings.topic}</p>
            <p>Level: {quizSettings.level}</p>
            <p>Difficulty: {quizSettings.difficulty}</p>
          </div>
        )}
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Detailed Results</h2>
        
        {quizResults.map((result, index) => (
          <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {result.is_correct ? (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100 mb-2">
                  Question {result.question_no}: {result.question}
                </h3>
                
                {result.options && (
                  <div className="mb-3">
                    <p className="text-sm text-slate-400 mb-1">Options:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {result.options.map((option, i) => (
                        <span
                          key={i}
                          className={`text-sm px-2 py-1 rounded ${
                            option === result.correct_answer
                              ? 'bg-green-900 text-green-100'
                              : option === result.user_answer && !result.is_correct
                              ? 'bg-red-900 text-red-100'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-1 text-sm">
                  <p className="text-slate-300">
                    <span className="font-medium">Your Answer:</span> {result.user_answer || 'No answer'}
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium">Correct Answer:</span> {result.correct_answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>{isDownloading ? 'Generating PDF...' : 'Download Report'}</span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="bg-slate-700 hover:bg-slate-600 focus:ring-slate-500 text-slate-100 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Take Another Quiz</span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="bg-slate-700 hover:bg-slate-600 focus:ring-slate-500 text-slate-100 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Home className="h-5 w-5" />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  );
};

export default Results;