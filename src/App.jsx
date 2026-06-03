import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TutorChat from './pages/TutorChat';
import CanvasSync from './pages/CanvasSync';
import PracticeQuizzes from './pages/PracticeQuizzes';
import './styles/main.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'tutor':
        return <TutorChat />;
      case 'tracker':
        return <CanvasSync />;
      case 'quizzes':
        return <PracticeQuizzes />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
