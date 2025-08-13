// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { QuizProvider } from './context/QuizContext';
import Header from './components/Header';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';

function App() {
  return (
    <ThemeProvider>
      <QuizProvider>
        <Router>
          <div className="min-h-screen bg-slate-900 text-slate-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
              </Routes>
            </main>
          </div>
        </Router>
      </QuizProvider>
    </ThemeProvider>
  );
}

export default App;