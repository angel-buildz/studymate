import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { generateQuiz } from '../services/quizService';
import { 
  BookOpen, 
  Beaker, 
  Globe, 
  Calculator, 
  PenTool, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Award, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export default function PracticeQuizzes() {
  const { addXP } = useContext(AppContext);
  
  // Navigation & configuration states
  const [view, setView] = useState('setup'); // 'setup' | 'active' | 'results'
  const [subject, setSubject] = useState('chemistry'); // 'chemistry' | 'history' | 'math' | 'custom'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' | 'medium' | 'hard'
  const [customTopic, setCustomTopic] = useState('');
  
  // Active quiz states
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIdx: optionIdx }
  
  // Results states
  const [score, setScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [isPerfect, setIsPerfect] = useState(false);

  // Setup handler
  const handleStartQuiz = () => {
    if (subject === 'custom' && !customTopic.trim()) return;
    
    const quizSet = generateQuiz(subject, difficulty, customTopic);
    setQuestions(quizSet);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setView('active');
  };

  // Answer handler
  const handleSelectOption = (optIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // Submit Handler
  const handleSubmitQuiz = () => {
    let finalScore = 0;
    
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        finalScore += 1;
      }
    });

    // XP Math: +10 XP per correct answer. If 5/5, get +20 XP perfect score bonus!
    let xpCalculated = finalScore * 10;
    let perfectBonus = false;
    
    if (finalScore === 5) {
      xpCalculated += 20;
      perfectBonus = true;
    }

    setScore(finalScore);
    setEarnedXP(xpCalculated);
    setIsPerfect(perfectBonus);
    
    // Add XP to Global State
    addXP(xpCalculated);
    setView('results');
  };

  const handleReset = () => {
    setView('setup');
    setCustomTopic('');
  };

  const subjectsList = [
    { id: 'chemistry', name: 'Chemistry', icon: Beaker, desc: 'Atoms, molecules, and gas laws' },
    { id: 'history', name: 'World History', icon: Globe, desc: 'Revolutions, treaties, and kingdoms' },
    { id: 'math', name: 'Mathematics', icon: Calculator, desc: 'Calculus derivatives and integrals' },
    { id: 'custom', name: 'Custom Topic', icon: PenTool, desc: 'Generate questions on any topic' }
  ];

  return (
    <div className="quizzes-page-wrapper animate-fade-in">
      
      {/* 1. SETUP VIEW */}
      {view === 'setup' && (
        <section className="setup-container">
          <div className="quiz-hero card">
            <h1>Test Your Knowledge 🧠</h1>
            <p>Generate practice questions, review detailed concepts, and accumulate XP blocks toward your level goals.</p>
          </div>

          <div className="setup-grid">
            {/* Subject card list */}
            <div className="subject-selection card">
              <div className="card-header">
                <h3>Select Subject</h3>
              </div>
              <div className="subjects-grid">
                {subjectsList.map((sub) => {
                  const Icon = sub.icon;
                  const isActive = subject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      className={`subject-card ${isActive ? 'active' : ''}`}
                      onClick={() => setSubject(sub.id)}
                    >
                      <Icon size={24} className="sub-icon" />
                      <div className="sub-text">
                        <h4>{sub.name}</h4>
                        <p>{sub.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {subject === 'custom' && (
                <div className="custom-topic-input-container animate-fade-in">
                  <label htmlFor="custom-topic-field">Enter Custom Study Topic</label>
                  <input
                    id="custom-topic-field"
                    type="text"
                    placeholder="e.g., Photosynthesis, Shakespeare, French Revolution..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {/* Difficulty settings */}
            <div className="difficulty-selection card">
              <div className="card-header">
                <h3>Select Difficulty</h3>
              </div>
              
              <div className="difficulties-list">
                {['easy', 'medium', 'hard'].map((diff) => {
                  const isActive = difficulty === diff;
                  return (
                    <button
                      key={diff}
                      className={`diff-btn ${diff} ${isActive ? 'active' : ''}`}
                      onClick={() => setDifficulty(diff)}
                    >
                      <span className="bullet"></span>
                      <span className="diff-label">{diff}</span>
                    </button>
                  );
                })}
              </div>

              <button 
                className="btn btn-primary start-quiz-btn"
                onClick={handleStartQuiz}
                disabled={subject === 'custom' && !customTopic.trim()}
              >
                Generate Quiz <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. ACTIVE QUIZ VIEW */}
      {view === 'active' && questions.length > 0 && (
        <section className="quiz-active-container card">
          <div className="quiz-progress-bar-header">
            <div className="progress-text">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span className="subject-badge">{subject} • {difficulty}</span>
            </div>
            <div className="progress-track-wrapper">
              <div 
                className="progress-fill-line" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="active-question-card">
            <h2 className="question-text">{questions[currentIdx].question}</h2>

            <div className="options-stack">
              {questions[currentIdx].options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentIdx] === oIdx;
                const letter = String.fromCharCode(65 + oIdx); // A, B, C, D
                return (
                  <button
                    key={oIdx}
                    className={`option-btn-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(oIdx)}
                  >
                    <span className="option-letter">{letter}</span>
                    <span className="option-label-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="quiz-navigation-controls">
            <button 
              className="btn btn-secondary nav-btn" 
              onClick={handleBack} 
              disabled={currentIdx === 0}
            >
              <ArrowLeft size={18} /> Back
            </button>

            {currentIdx === questions.length - 1 ? (
              <button 
                className="btn btn-primary nav-btn submit-trigger-btn" 
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < questions.length}
                title={Object.keys(selectedAnswers).length < questions.length ? "Please answer all questions before submitting" : ""}
              >
                Submit Quiz <Check size={18} />
              </button>
            ) : (
              <button 
                className="btn btn-secondary nav-btn" 
                onClick={handleNext}
                disabled={selectedAnswers[currentIdx] === undefined}
              >
                Next <ArrowRight size={18} />
              </button>
            )}
          </div>
        </section>
      )}

      {/* 3. RESULTS VIEW */}
      {view === 'results' && (
        <section className="results-container">
          <div className="results-hero-grid">
            {/* Score circle card */}
            <div className="scorecard card">
              <h3>Quiz Scorecard</h3>
              <div className="gauge-outer animate-pulse-glow" style={{ borderColor: isPerfect ? 'var(--accent-green)' : 'var(--primary)' }}>
                <span className="score-numerator">{score}</span>
                <span className="score-denominator">/ 5</span>
              </div>
              <p className="score-desc-text">
                {score === 5 ? "PERFECT SCORE! Outstanding Work! 🎉" : score >= 3 ? "Good job! You passed the concept test. 👍" : "Review the concepts and try again. 📚"}
              </p>
            </div>

            {/* XP details */}
            <div className="xp-earned-card card">
              <div className="xp-icon-wrap">
                <Award size={36} />
              </div>
              <h3>Experience Points</h3>
              <div className="xp-bonus-value">+{earnedXP} XP</div>
              
              <div className="xp-breakdown-details">
                <p>Correct answers: <strong>{score} × 10 XP</strong></p>
                {isPerfect && (
                  <p className="perfect-bonus-tag">Perfect Score Bonus: <strong>+20 XP 🚀</strong></p>
                )}
              </div>

              <button className="btn btn-primary retry-btn" onClick={handleReset}>
                <RotateCcw size={18} /> Practice Another Topic
              </button>
            </div>
          </div>

          {/* Question Explanations review review */}
          <div className="review-explanations-list card">
            <div className="card-header">
              <h3>Detailed Explanations</h3>
            </div>
            
            <div className="explanations-stack">
              {questions.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correct;
                return (
                  <div key={idx} className={`explanation-item ${isCorrect ? 'correct-item' : 'incorrect-item'}`}>
                    <div className="exp-item-header">
                      <div className="exp-item-icon">
                        {isCorrect ? <Check size={18} /> : <X size={18} />}
                      </div>
                      <h4>Question {idx + 1}: {q.question}</h4>
                    </div>

                    <div className="exp-options-grid">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userChoice === oIdx;
                        const isAnsCorrect = q.correct === oIdx;
                        let statusClass = '';
                        if (isSelected) {
                          statusClass = isCorrect ? 'correct-ans' : 'incorrect-ans';
                        } else if (isAnsCorrect) {
                          statusClass = 'correct-ans';
                        }
                        return (
                          <div key={oIdx} className={`exp-option ${statusClass}`}>
                            <span>{opt}</span>
                            {isSelected && <span className="user-indicator-tag">(Your Answer)</span>}
                            {!isSelected && isAnsCorrect && <span className="correct-indicator-tag">(Correct Answer)</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="exp-bubble-infobox">
                      <HelpCircle size={16} />
                      <p><strong>Concept explanation:</strong> {q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .quizzes-page-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .quiz-hero {
          background: linear-gradient(135deg, var(--primary-light) 0%, rgba(139, 92, 246, 0.05) 100%);
          border-color: var(--primary-glow);
          margin-bottom: 24px;
        }

        .setup-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .setup-grid {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }

        /* Subject selectors list */
        .subjects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 600px) {
          .subjects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .subject-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .subject-card:hover {
          border-color: var(--border-focus);
          background-color: var(--bg-card-hover);
          transform: translateY(-1px);
        }

        .subject-card.active {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }

        .subject-card.active .sub-icon {
          color: var(--primary);
        }

        .sub-icon {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .sub-text h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .sub-text p {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-top: 2px;
        }

        .custom-topic-input-container {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .custom-topic-input-container label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .custom-topic-input-container input {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          background-color: var(--bg-card-hover);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 12px;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .custom-topic-input-container input:focus {
          border-color: var(--primary);
        }

        /* Difficulties Selector */
        .difficulties-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .diff-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-weight: 600;
          cursor: pointer;
          text-transform: capitalize;
          transition: all var(--transition-fast);
        }

        .diff-btn:hover {
          background-color: var(--bg-card-hover);
        }

        .diff-btn.active {
          background-color: var(--primary-light);
          border-color: var(--primary);
        }

        .diff-btn .bullet {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
        }

        .diff-btn.easy .bullet { background-color: var(--accent-green); }
        .diff-btn.medium .bullet { background-color: #f59e0b; }
        .diff-btn.hard .bullet { background-color: var(--accent-coach); }

        .start-quiz-btn {
          width: 100%;
          padding: 14px;
        }

        /* Active Quiz UI Layout */
        .quiz-active-container {
          padding: 32px;
        }

        .quiz-progress-bar-header {
          margin-bottom: 28px;
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }

        .subject-badge {
          font-size: 0.75rem;
          background-color: var(--border-color);
          color: var(--text-secondary);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .progress-track-wrapper {
          height: 6px;
          background-color: var(--border-color);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill-line {
          height: 100%;
          background: var(--primary);
          border-radius: var(--radius-full);
          transition: width var(--transition-normal);
        }

        .active-question-card {
          margin-bottom: 32px;
        }

        .question-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
          margin-bottom: 24px;
        }

        .options-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-btn-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .option-btn-row:hover {
          border-color: var(--text-tertiary);
          background-color: var(--bg-card-hover);
        }

        .option-btn-row.selected {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }

        .option-letter {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          background-color: var(--bg-card-hover);
          transition: all var(--transition-fast);
        }

        .option-btn-row.selected .option-letter {
          background-color: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .option-label-text {
          flex: 1;
        }

        .quiz-navigation-controls {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--border-color);
          padding-top: 24px;
        }

        .nav-btn {
          width: 140px;
        }

        /* Results styling */
        .results-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .results-hero-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .scorecard {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          justify-content: center;
          padding: 32px;
        }

        .gauge-outer {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-full);
          border: 6px solid var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 24px 0;
        }

        .score-numerator {
          font-family: 'Outfit', sans-serif;
          font-size: 3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .score-denominator {
          font-size: 1.5rem;
          color: var(--text-tertiary);
          margin-left: 2px;
          margin-top: 12px;
        }

        .score-desc-text {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .xp-earned-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px;
        }

        .xp-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .xp-bonus-value {
          font-family: 'Outfit', sans-serif;
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--accent-green);
          margin-bottom: 16px;
        }

        .xp-breakdown-details {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .perfect-bonus-tag {
          color: var(--primary);
          font-weight: 600;
          margin-top: 4px;
        }

        .retry-btn {
          width: 100%;
          max-width: 260px;
        }

        /* Detailed Explanations review review */
        .explanations-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 16px;
        }

        .explanation-item {
          padding: 20px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .correct-item {
          background-color: rgba(74, 222, 128, 0.02);
          border-color: rgba(74, 222, 128, 0.1);
        }

        .incorrect-item {
          background-color: rgba(239, 68, 68, 0.02);
          border-color: rgba(239, 68, 68, 0.1);
        }

        .exp-item-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }

        .exp-item-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .correct-item .exp-item-icon {
          background-color: var(--accent-green-bg);
          color: var(--accent-green);
        }

        .incorrect-item .exp-item-icon {
          background-color: var(--accent-coach-bg);
          color: var(--accent-coach);
        }

        .exp-item-header h4 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .exp-options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }

        @media (min-width: 600px) {
          .exp-options-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .exp-option {
          padding: 10px 14px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          font-size: 0.85rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-secondary);
        }

        .exp-option.correct-ans {
          border-color: var(--accent-green);
          background-color: var(--accent-green-bg);
          color: var(--accent-green);
          font-weight: 600;
        }

        .exp-option.incorrect-ans {
          border-color: var(--accent-coach);
          background-color: var(--accent-coach-bg);
          color: var(--accent-coach);
          font-weight: 600;
        }

        .user-indicator-tag {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .correct-indicator-tag {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .exp-bubble-infobox {
          display: flex;
          gap: 10px;
          background-color: var(--bg-card-hover);
          padding: 12px 16px;
          border-radius: var(--radius-xs);
          font-size: 0.85rem;
          line-height: 1.4;
          color: var(--text-secondary);
        }

        .exp-bubble-infobox p {
          color: var(--text-secondary);
        }
      `}</style>

    </div>
  );
}
