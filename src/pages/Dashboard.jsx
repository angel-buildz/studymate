import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Flame, 
  Plus, 
  Trash2, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  FileText, 
  Calendar,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Timer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Dashboard({ setCurrentPage }) {
  const {
    xp,
    streak,
    mood,
    assignments,
    level,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    handleMoodCheckIn,
    addAssignment,
    toggleAssignment,
    deleteAssignment
  } = useContext(AppContext);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [showXPAlert, setShowXPAlert] = useState(false);
  const [xpRewardVal, setXpRewardVal] = useState(0);

  // --- Pomodoro States ---
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' | 'break'
  const [timerCollapsed, setTimerCollapsed] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerMode === 'focus') {
        // Completed 25 mins focus block: +25 XP
        triggerXPNotification(25, 'Focus Session Complete! +25 XP 🌟');
        setTimerMode('break');
        setTimeLeft(300); // 5 mins break
      } else {
        triggerXPNotification(0, 'Break over! Ready to focus? 🧠');
        setTimerMode('focus');
        setTimeLeft(1500); // 25 mins focus
      }
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, timerMode]);

  const handleStartPause = () => {
    setTimerActive(!timerActive);
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimeLeft(timerMode === 'focus' ? 1500 : 300);
  };

  const handleFastForward = () => {
    setTimeLeft(5);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addAssignment(newTaskTitle.trim(), newTaskDate);
    setNewTaskTitle('');
    setNewTaskDate('');
    triggerXPNotification(10, 'Assignment Added! +10 XP');
  };

  const triggerXPNotification = (val, message) => {
    setXpRewardVal(message);
    setShowXPAlert(true);
    setTimeout(() => {
      setShowXPAlert(false);
    }, 2500);
  };

  const handleToggle = (id, wasCompleted) => {
    toggleAssignment(id);
    if (!wasCompleted) {
      triggerXPNotification(15, 'Task Completed! +15 XP 🚀');
    } else {
      triggerXPNotification(-15, 'Task Unchecked! -15 XP ⚠️');
    }
  };

  const moodsList = [
    { id: 'motivated', label: 'Motivated', emoji: '🎯', desc: 'Feeling energetic & focused' },
    { id: 'neutral', label: 'Neutral', emoji: '😐', desc: 'Standard study session' },
    { id: 'tired', label: 'Tired', emoji: '😴', desc: 'Low energy, steady pacing' },
    { id: 'stressed', label: 'Stressed', emoji: '🤯', desc: 'High pressure or burnout alert' }
  ];

  return (
    <div className="dashboard-grid animate-fade-in">
      {/* Floating XP Reward Indicator */}
      {showXPAlert && (
        <div className="xp-float-notification">
          <span>{xpRewardVal}</span>
        </div>
      )}

      {/* Hero Welcome banner */}
      <section className="hero-banner card">
        <div className="hero-text-content">
          <h1>Accelerate Your Learning ⚡</h1>
          <p>
            StudyMate helps you study smarter, track assignment milestones, and get personalized help from AI tutors built to match your style.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => setCurrentPage('tutor')}>
              Start AI Study Session <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="hero-graphic hide-mobile">🎓</div>
      </section>

      {/* Left Column: Gamification & Mood Check-In */}
      <div className="dashboard-left-col">
        {/* Pomodoro Timer Card */}
        <section className="pomodoro-card card">
          <div className="card-header" onClick={() => setTimerCollapsed(!timerCollapsed)} style={{ cursor: 'pointer' }}>
            <div className="header-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Timer size={20} className={timerActive ? 'active-timer-icon' : ''} />
              <h3>Study Timer</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`timer-mode-badge ${timerMode}`}>
                {timerMode === 'focus' ? 'Focus Block' : 'Short Break'}
              </span>
              <button className="btn-secondary btn-icon collapse-toggle" style={{ border: 'none', padding: 0 }}>
                {timerCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
            </div>
          </div>

          {!timerCollapsed && (
            <div className="timer-content-wrapper animate-fade-in">
              <div className="timer-display-circle-container">
                <div className={`timer-ring ${timerMode} ${timerActive ? 'running' : ''}`}>
                  <div className="timer-time-text">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="timer-sub-text">
                    {timerActive ? 'Keep studying!' : 'Ready?'}
                  </div>
                </div>
              </div>

              <div className="timer-controls-row">
                <button className={`btn ${timerActive ? 'btn-secondary' : 'btn-primary'} play-pause-btn`} onClick={handleStartPause}>
                  {timerActive ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                  <span>{timerActive ? 'Pause' : 'Start Focus'}</span>
                </button>
                <button className="btn btn-secondary reset-btn" onClick={handleResetTimer} title="Reset Timer">
                  <RotateCcw size={18} />
                </button>
                
                {/* Developer Fast-Forward Shortcut */}
                <button 
                  type="button" 
                  className="ff-btn" 
                  onClick={handleFastForward}
                  title="Testing Shortcut: Fast forward timer to 5 seconds"
                >
                  ⚡ Test Sync
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Gamification Card */}
        <section className="gamification-card card">
          <div className="card-header">
            <h3>Progress & Levelling</h3>
            <span className="card-tag">Profile Summary</span>
          </div>

          <div className="progress-details">
            <div className="level-badge-large">{level}</div>
            <div className="progress-stats">
              <p className="stat-label">Level {level} Student</p>
              <p className="stat-sub">{xp} Total XP Accumulated</p>
            </div>
          </div>

          <div className="xp-progress-bar-container">
            <div 
              className="xp-progress-bar" 
              style={{ width: `${(xpInCurrentLevel / xpNeededForNextLevel) * 100}%` }}
            ></div>
          </div>
          <div className="xp-labels">
            <span>{xpInCurrentLevel} XP</span>
            <span>{xpNeededForNextLevel} XP for Level {level + 1}</span>
          </div>

          <div className="streak-infobox">
            <div className="streak-icon-container">
              <Flame size={24} fill="#f97316" color="#f97316" />
            </div>
            <div>
              <h4>{streak} Day Study Streak!</h4>
              <p>Keep study check-ins active daily to grow your multiplier.</p>
            </div>
          </div>
        </section>

        {/* Mood Check-In Widget */}
        <section className="mood-card card">
          <div className="card-header">
            <h3>Daily Emotional Check-In</h3>
            <span className="card-tag">Burnout Prevention</span>
          </div>
          <p className="section-desc">
            How are you feeling right now? We will calibrate the AI's tone and app themes to support your mental health.
          </p>

          <div className="moods-selection">
            {moodsList.map((m) => {
              const isActive = mood === m.id;
              return (
                <button
                  key={m.id}
                  className={`mood-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    handleMoodCheckIn(m.id);
                    triggerXPNotification(10, `Checked in: ${m.label}! +10 XP ✨`);
                  }}
                  title={m.desc}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              );
            })}
          </div>

          {mood === 'stressed' && (
            <div className="burnout-warning-alert">
              <AlertCircle size={18} />
              <div>
                <strong>Burnout Risk Alert:</strong> Take a 15-minute screen break. Your study coaches will offer milder, stress-reducing guidance today.
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Right Column: Assignment Checklist & Features Quick Actions */}
      <div className="dashboard-right-col">
        {/* Assignment Checklist */}
        <section className="assignment-card card">
          <div className="card-header">
            <h3>Assignment Tracker</h3>
            <span className="card-tag">{assignments.filter(a => !a.completed).length} Pending</span>
          </div>

          <form onSubmit={handleCreateAssignment} className="assignment-form">
            <input
              type="text"
              placeholder="Read textbook, write essay thesis..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="form-input text-input"
              required
            />
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="form-input date-input"
            />
            <button type="submit" className="btn btn-primary add-task-btn" title="Add assignment">
              <Plus size={20} />
            </button>
          </form>

          <div className="assignments-list">
            {assignments.length === 0 ? (
              <div className="empty-tasks">
                <p>No active assignments. Add one above to start earning XP!</p>
              </div>
            ) : (
              assignments.map((item) => (
                <div key={item.id} className={`assignment-item ${item.completed ? 'completed' : ''}`}>
                  <button 
                    type="button"
                    className={`checkbox-btn ${item.completed ? 'checked' : ''}`} 
                    onClick={() => handleToggle(item.id, item.completed)}
                  >
                    {item.completed && <Check size={14} />}
                  </button>
                  <div className="task-details">
                    <p className="task-title">{item.title}</p>
                    {item.dueDate && (
                      <span className="task-due">Due: {item.dueDate}</span>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="delete-task-btn btn-secondary btn-icon" 
                    onClick={() => deleteAssignment(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Feature quick links */}
        <section className="features-grid-card">
          <div className="quick-actions-grid">
            <div className="quick-card card card-interactive" onClick={() => setCurrentPage('tutor')}>
              <div className="quick-icon-wrap bg-primary">
                <Sparkles size={22} />
              </div>
              <h4>AI Chatbot Tutor</h4>
              <p>Choose from 3 customized learning personas to practice concepts.</p>
            </div>
            
            <div className="quick-card card disabled-action">
              <div className="quick-icon-wrap bg-soon">
                <FileText size={22} />
              </div>
              <span className="badge-overlay">Soon</span>
              <h4>Notes Summarizer</h4>
              <p>Upload readings or lecture notes to extract instantly.</p>
            </div>

            <div className="quick-card card disabled-action">
              <div className="quick-icon-wrap bg-soon">
                <BookOpen size={22} />
              </div>
              <span className="badge-overlay">Soon</span>
              <h4>Practice Quizzes</h4>
              <p>Self-testing engine with immediate question generation.</p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          position: relative;
        }

        .xp-float-notification {
          position: fixed;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--accent-green);
          color: white;
          padding: 10px 24px;
          border-radius: var(--radius-full);
          font-weight: 600;
          box-shadow: var(--shadow-lg);
          z-index: 200;
          animation: slideDownFade 2.5s forwards;
        }

        @keyframes slideDownFade {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }

        /* Hero Banner */
        .hero-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, var(--primary-light) 0%, rgba(139, 92, 246, 0.05) 100%);
          border-color: var(--primary-glow);
          position: relative;
          overflow: hidden;
        }

        .hero-banner::after {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          background-color: var(--primary-glow);
          border-radius: var(--radius-full);
          filter: blur(80px);
          top: -50px;
          right: -50px;
          z-index: 0;
        }

        .hero-text-content {
          max-width: 60%;
          z-index: 1;
        }

        .hero-text-content h1 {
          margin-bottom: 12px;
          font-family: 'Outfit', sans-serif;
        }

        .hero-text-content p {
          margin-bottom: 24px;
          font-size: 1.05rem;
        }

        .hero-graphic {
          font-size: 8rem;
          line-height: 1;
          user-select: none;
          z-index: 1;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));
          animation: floatAnimation 4s infinite ease-in-out;
        }

        @keyframes floatAnimation {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        /* Layout Columns */
        .dashboard-left-col, .dashboard-right-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1fr;
          }
          .hero-banner {
            grid-column: span 2;
          }
          .features-grid-card {
            grid-column: span 1;
          }
        }

        /* Card Headers */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-tag {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          background-color: var(--border-color);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
        }

        .section-desc {
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        /* Gamification details */
        .progress-details {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .level-badge-large {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          background-color: var(--primary);
          color: var(--text-on-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          box-shadow: var(--shadow-glow);
        }

        .progress-stats .stat-label {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        
        .progress-stats .stat-sub {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        .xp-progress-bar-container {
          height: 10px;
          background-color: var(--border-color);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 8px;
        }

        .xp-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-hover) 100%);
          border-radius: var(--radius-full);
          transition: width 0.4s ease-out;
        }

        .xp-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-tertiary);
          margin-bottom: 20px;
        }

        .streak-infobox {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(249, 115, 22, 0.04);
          border: 1px solid rgba(249, 115, 22, 0.1);
          padding: 16px;
          border-radius: var(--radius-sm);
        }

        .streak-icon-container {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background-color: rgba(249, 115, 22, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .streak-infobox h4 {
          font-size: 0.95rem;
          color: #f97316;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .streak-infobox p {
          font-size: 0.8rem;
        }

        /* Mood check in styles */
        .moods-selection {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .mood-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mood-btn:hover {
          border-color: var(--border-focus);
          background-color: var(--bg-card-hover);
        }

        .mood-btn.active {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }

        .mood-emoji {
          font-size: 1.75rem;
          margin-bottom: 6px;
        }

        .mood-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .burnout-warning-alert {
          margin-top: 16px;
          display: flex;
          gap: 12px;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: var(--accent-coach);
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          line-height: 1.4;
        }

        /* Assignment Checklist */
        .assignment-form {
          display: flex;
          gap: 8px;
          margin-bottom: 18px;
        }

        .form-input {
          font-family: var(--font-sans);
          background-color: var(--bg-card-hover);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 12px;
          font-size: 0.9rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .form-input:focus {
          border-color: var(--primary);
        }

        .text-input {
          flex: 1;
        }

        .date-input {
          width: 140px;
        }

        .add-task-btn {
          padding: 12px;
        }

        .assignments-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .empty-tasks {
          text-align: center;
          padding: 40px 0;
          color: var(--text-tertiary);
        }

        .assignment-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .assignment-item:hover {
          border-color: var(--text-tertiary);
        }

        .assignment-item.completed {
          opacity: 0.6;
        }

        .assignment-item.completed .task-title {
          text-decoration: line-through;
          color: var(--text-tertiary);
        }

        .checkbox-btn {
          width: 22px;
          height: 22px;
          border-radius: var(--radius-xs);
          border: 2px solid var(--border-color);
          background: transparent;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all var(--transition-fast);
        }

        .checkbox-btn:hover {
          border-color: var(--primary);
        }

        .checkbox-btn.checked {
          border-color: var(--accent-green);
          background-color: var(--accent-green);
        }

        .task-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .task-title {
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .task-due {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-top: 2px;
        }

        .delete-task-btn {
          color: var(--text-tertiary);
          opacity: 0;
        }

        .assignment-item:hover .delete-task-btn {
          opacity: 1;
        }

        .delete-task-btn:hover {
          color: var(--accent-coach);
          background-color: var(--accent-coach-bg) !important;
        }

        /* Quick actions Grid cards */
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .quick-card {
          cursor: pointer;
          position: relative;
        }

        .quick-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .quick-icon-wrap.bg-primary {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .quick-icon-wrap.bg-soon {
          background-color: var(--border-color);
          color: var(--text-tertiary);
        }

        .quick-card h4 {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 6px;
          color: var(--text-primary);
        }

        .quick-card p {
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .disabled-action {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .disabled-action:hover {
          border-color: var(--border-color) !important;
          box-shadow: var(--shadow-sm) !important;
          transform: none !important;
        }

        .badge-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background-color: var(--border-color);
          color: var(--text-tertiary);
          text-transform: uppercase;
        }

        @media (max-width: 600px) {
          .hero-text-content {
            max-width: 100%;
          }
          .moods-selection {
            grid-template-columns: 1fr;
          }
          .assignment-form {
            flex-direction: column;
          }
          .date-input {
            width: 100%;
          }
          .delete-task-btn {
            opacity: 1;
          }
        }

        /* --- Pomodoro Timer Styling --- */
        .pomodoro-card {
          border-color: var(--primary-glow);
        }

        .active-timer-icon {
          color: var(--primary);
          animation: spinTimer 4s infinite linear;
        }

        @keyframes spinTimer {
          to { transform: rotate(360deg); }
        }

        .timer-mode-badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }

        .timer-mode-badge.focus {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .timer-mode-badge.break {
          background-color: var(--accent-green-bg);
          color: var(--accent-green);
        }

        .timer-content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 0;
        }

        .timer-display-circle-container {
          margin-bottom: 20px;
        }

        .timer-ring {
          width: 160px;
          height: 160px;
          border-radius: var(--radius-full);
          border: 4px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-card-hover);
          transition: all var(--transition-normal);
          position: relative;
        }

        .timer-ring.focus {
          border-color: var(--primary-glow);
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .timer-ring.focus.running {
          border-color: var(--primary);
          box-shadow: 0 0 20px var(--primary-glow);
          animation: pulseBorder 2s infinite alternate ease-in-out;
        }

        .timer-ring.break {
          border-color: rgba(74, 222, 128, 0.2);
          box-shadow: 0 0 10px rgba(74, 222, 128, 0.1);
        }

        .timer-ring.break.running {
          border-color: var(--accent-green);
          box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
          animation: pulseBorderGreen 2s infinite alternate ease-in-out;
        }

        @keyframes pulseBorder {
          0% { box-shadow: 0 0 10px var(--primary-glow); }
          100% { box-shadow: 0 0 25px var(--primary-glow); }
        }

        @keyframes pulseBorderGreen {
          0% { box-shadow: 0 0 10px rgba(74, 222, 128, 0.1); }
          100% { box-shadow: 0 0 25px rgba(74, 222, 128, 0.4); }
        }

        .timer-time-text {
          font-family: 'Courier New', Courier, monospace;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .timer-sub-text {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .timer-controls-row {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          justify-content: center;
        }

        .play-pause-btn {
          width: 140px;
        }

        .ff-btn {
          font-size: 0.7rem;
          background: transparent;
          border: 1px dashed var(--border-color);
          color: var(--text-tertiary);
          padding: 4px 8px;
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .ff-btn:hover {
          color: var(--primary);
          border-color: var(--primary);
          background-color: var(--primary-light);
        }
      `}</style>
    </div>
  );
}
