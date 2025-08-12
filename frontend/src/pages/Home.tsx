import React from 'react';
import { Brain, Zap, Target, BarChart3 } from 'lucide-react';
import QuizForm from '../components/QuizForm';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-100 animate-fade-in">
          Welcome to <span className="text-primary-400">Asklet</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          AI-powered quiz generation that adapts to your learning needs. Create personalized quizzes
          for any topic and skill level.
        </p>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-6 text-center space-y-4 hover:bg-slate-750 transition-colors">
          <div className="mx-auto w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100">AI-Powered</h3>
          <p className="text-slate-400">
            Advanced language models generate high-quality questions tailored to your specifications.
          </p>
        </div>

        <div className="card p-6 text-center space-y-4 hover:bg-slate-750 transition-colors">
          <div className="mx-auto w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100">Customizable</h3>
          <p className="text-slate-400">
            Choose your topic, difficulty level, and question type to create the perfect quiz.
          </p>
        </div>

        <div className="card p-6 text-center space-y-4 hover:bg-slate-750 transition-colors">
          <div className="mx-auto w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100">Analytics</h3>
          <p className="text-slate-400">
            Track your performance with detailed results and downloadable reports.
          </p>
        </div>
      </section>

      {/* Quiz Form */}
      <section>
        <QuizForm />
      </section>
    </div>
  );
};

export default Home;