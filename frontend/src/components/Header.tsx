import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Brain } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-400">
            <Brain className="h-8 w-8" />
            <span>Asklet</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-primary-400' : 'text-slate-300 hover:text-primary-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/quiz"
              className={`font-medium transition-colors ${
                isActive('/quiz') ? 'text-primary-400' : 'text-slate-300 hover:text-primary-400'
              }`}
            >
              Quiz
            </Link>
            <Link
              to="/results"
              className={`font-medium transition-colors ${
                isActive('/results') ? 'text-primary-400' : 'text-slate-300 hover:text-primary-400'
              }`}
            >
              Results
            </Link>
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;