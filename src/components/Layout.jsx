import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  GraduationCap, 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Calendar, 
  Flame, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Award
} from 'lucide-react';

export default function Layout({ children, currentPage, setCurrentPage }) {
  const { theme, toggleTheme, xp, streak, level, xpInCurrentLevel } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor', label: 'AI Tutor Chat', icon: MessageSquare },
    { id: 'summarizer', label: 'Note Summarizer', icon: FileText, disabled: false },
    { id: 'quizzes', label: 'Practice Quizzes', icon: BookOpen, disabled: false },
    { id: 'tracker', label: 'Canvas Sync', icon: Calendar, disabled: false }
  ];

  return (
    <div className="app-container">
      {/* Sidebar - Desktop */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo-container">
            <GraduationCap className="logo-icon" size={28} />
            <span className="logo-text">StudyMate</span>
          </div>
          <button className="sidebar-close-btn hide-desktop" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''} ${item.disabled ? 'disabled-nav' : ''}`}
                onClick={() => {
                  if (!item.disabled) {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }
                }}
                disabled={item.disabled}
                title={item.disabled ? 'Coming soon in Phase 2' : ''}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.disabled && <span className="badge-soon">Soon</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">🎓</div>
            <div className="user-info">
              <p className="user-name">Scholar Star</p>
              <p className="user-role">Level {level} Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Screen Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header Bar */}
        <header className="top-header">
          <button className="menu-toggle-btn hide-desktop" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="header-title-container hide-mobile">
            <h2>{currentPage === 'dashboard' ? 'Welcome Back!' : 'AI Tutor Chat'}</h2>
            <p className="header-subtitle">Your personalized learning environment</p>
          </div>

          <div className="header-actions">
            {/* Gamification Stats */}
            <div className="gamification-pills">
              {/* Streak */}
              <div className="stat-pill streak-pill animate-fade-in" title="Daily Streak">
                <Flame className="streak-icon" size={18} fill="currentColor" />
                <span>{streak} Days</span>
              </div>
              
              {/* Level / XP */}
              <div className="stat-pill xp-pill animate-fade-in" title="Total Experience Points">
                <Award className="xp-icon" size={18} />
                <div className="xp-text-group">
                  <span className="xp-lvl">Lvl {level}</span>
                  <span className="xp-details">{xpInCurrentLevel}/100 XP</span>
                </div>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button className="theme-toggle btn-secondary btn-icon" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        {/* Content container */}
        <div className="page-content-wrapper">
          {children}
        </div>
      </main>

      <style>{`
        /* Sidebar Styling */
        .sidebar {
          width: 260px;
          background: var(--bg-card);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: transform var(--transition-normal), background-color var(--transition-normal);
        }

        .sidebar-brand {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          color: var(--primary);
        }

        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .sidebar-close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .sidebar-nav {
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          width: 100%;
          border: none;
          background: transparent;
          text-align: left;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
        }

        .nav-item:hover:not(.disabled-nav) {
          background-color: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }

        .disabled-nav {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .badge-soon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 6px;
          background-color: var(--border-color);
          color: var(--text-secondary);
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid var(--border-color);
          background-color: rgba(0, 0, 0, 0.02);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          font-size: 1.5rem;
          background: var(--primary-light);
          width: 42px;
          height: 42px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        /* Top Header Styling */
        .top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
          background-color: var(--glass-bg);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-title-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .header-subtitle {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .gamification-pills {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
        }

        .streak-pill {
          color: #f97316;
          border-color: rgba(249, 115, 22, 0.15);
          background-color: rgba(249, 115, 22, 0.04);
        }

        .streak-icon {
          animation: flamePulse 1.5s infinite alternate ease-in-out;
        }

        .xp-pill {
          color: var(--primary);
          border-color: var(--primary-glow);
          background-color: var(--primary-light);
        }

        .xp-text-group {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .xp-lvl {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .xp-details {
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .menu-toggle-btn {
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        .page-content-wrapper {
          padding: 32px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* Responsiveness Drawer */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 95;
        }

        .hide-desktop {
          display: none !important;
        }

        @keyframes flamePulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 1px rgba(249,115,22,0.4)); }
          100% { transform: scale(1.1); filter: drop-shadow(0 0 6px rgba(249,115,22,0.8)); }
        }

        @media (min-width: 769px) {
          .sidebar {
            transform: translateX(0) !important;
          }
        }

        @media (max-width: 768px) {
          .hide-desktop {
            display: inline-flex !important;
          }
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
            box-shadow: var(--shadow-lg);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .top-header {
            padding: 16px 20px;
          }
          .page-content-wrapper {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
