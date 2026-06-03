import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { personas, generateMockAIResponse } from '../services/aiService';
import { Send, Trash2, HelpCircle, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export default function TutorChat() {
  const { chatHistory, addChatMessage, clearChatHistory, addXP, mood } = useContext(AppContext);
  const [activePersona, setActivePersona] = useState('leo');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Local streaming message state
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef(null);
  const chatPersona = personas[activePersona];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, activePersona, isTyping, streamingText]);

  // Adjust input placeholder based on app mood
  const getInputPlaceholder = () => {
    if (mood === 'stressed') {
      return "Ask anything. Take it easy, we are taking small steps...";
    }
    if (mood === 'motivated') {
      return "State your challenge. Let's conquer it! 🔥";
    }
    return `Message ${chatPersona.name}...`;
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping || isStreaming) return;

    if (!textToSend) {
      setInputValue('');
    }

    // 1. Add User Message
    addChatMessage(activePersona, 'user', text);
    setIsTyping(true);

    // 2. Fetch Mock AI Response
    try {
      const responseText = await generateMockAIResponse(text, activePersona);
      setIsTyping(false);
      
      // 3. Stream Response
      setIsStreaming(true);
      setStreamingText('');
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < responseText.length) {
          // Send characters in chunks of 3 for smooth rendering speed
          setStreamingText((prev) => prev + responseText.slice(index, index + 3));
          index += 3;
        } else {
          clearInterval(interval);
          // Commit to context
          addChatMessage(activePersona, 'tutor', responseText);
          setStreamingText('');
          setIsStreaming(false);
          // Reward XP for studying/chatting
          addXP(5);
        }
      }, 25);

    } catch (e) {
      setIsTyping(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickPrompts = [
    { label: 'Explain Quantum Physics simply', query: 'Can you explain Quantum Physics simply using a nice analogy?', icon: BookOpen },
    { label: 'Critique my essay outline', query: 'I have a thesis statement for my English essay: "AI is reshaping college education by automating writing tasks, which reduces critical thinking but enhances typing speed." Can you critique its outline?', icon: Sparkles },
    { label: 'Explain Canvas sync setup', query: 'How does the Canvas LMS integration work in StudyMate?', icon: HelpCircle }
  ];

  // Merge context history with local active stream
  const currentHistory = chatHistory[activePersona] || [];
  const displayMessages = [...currentHistory];
  if (isStreaming) {
    displayMessages.push({
      id: 'streaming',
      sender: 'tutor',
      text: streamingText,
      timestamp: 'Streaming...'
    });
  }

  return (
    <div className="tutor-chat-container animate-fade-in">
      {/* Persona Selection Header */}
      <div className="persona-nav">
        {Object.values(personas).map((p) => {
          const isActive = activePersona === p.id;
          return (
            <button
              key={p.id}
              className={`persona-card card ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (!isStreaming && !isTyping) {
                  setActivePersona(p.id);
                }
              }}
              style={{
                borderColor: isActive ? p.accentColor : 'var(--border-color)',
                backgroundColor: isActive ? p.accentBg : 'var(--bg-card)'
              }}
              disabled={isStreaming || isTyping}
            >
              <span className="persona-avatar">{p.avatar}</span>
              <div className="persona-meta">
                <h4>{p.name}</h4>
                <p className="hide-mobile">{p.tagline}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chat Window */}
      <div className="chat-window card">
        <div className="chat-header">
          <div className="active-tutor-profile">
            <span className="active-tutor-avatar">{chatPersona.avatar}</span>
            <div>
              <h3>{chatPersona.name}</h3>
              <p className="active-tutor-sub">{chatPersona.tagline}</p>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-icon clear-chat-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your chat history with this tutor?')) {
                clearChatHistory(activePersona);
              }
            }}
            title="Clear Chat History"
            disabled={isStreaming || isTyping}
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Chat History Panel */}
        <div className="chat-messages">
          {displayMessages.length <= 1 && (
            <div className="quick-prompts-overlay">
              <div className="prompt-intro">
                <Sparkles size={32} className="pulsing-icon" />
                <h3>Choose a Concept to Start</h3>
                <p>Select a quick-trigger prompt or type your own custom study question below.</p>
              </div>
              <div className="quick-prompts-grid">
                {quickPrompts.map((q, idx) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={idx}
                      className="quick-prompt-btn"
                      onClick={() => handleSend(q.query)}
                      disabled={isStreaming || isTyping}
                    >
                      <Icon size={16} style={{ color: chatPersona.accentColor }} />
                      <span>{q.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {displayMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`chat-bubble-row ${isUser ? 'user-row' : 'tutor-row'}`}>
                {!isUser && (
                  <span className="bubble-avatar">{chatPersona.avatar}</span>
                )}
                <div 
                  className={`chat-bubble ${isUser ? 'user-bubble' : 'tutor-bubble'}`}
                  style={{
                    borderLeft: !isUser ? `4px solid ${chatPersona.accentColor}` : undefined
                  }}
                >
                  <p className="bubble-text">{msg.text}</p>
                  <span className="bubble-time">{msg.timestamp}</span>
                </div>
                {isUser && (
                  <span className="bubble-avatar">🎓</span>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-bubble-row tutor-row">
              <span className="bubble-avatar">{chatPersona.avatar}</span>
              <div className="chat-bubble tutor-bubble typing-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input form */}
        <div className="chat-input-bar">
          <input
            type="text"
            className="chat-input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getInputPlaceholder()}
            disabled={isStreaming || isTyping}
          />
          <button
            className="btn btn-primary send-btn"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isStreaming || isTyping}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .tutor-chat-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
          height: calc(100vh - 120px);
        }

        .persona-nav {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .persona-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          cursor: pointer;
          transition: transform var(--transition-fast), border-color var(--transition-fast), background-color var(--transition-normal);
        }

        .persona-card:hover:not(.active) {
          transform: translateY(-2px);
        }

        .persona-avatar {
          font-size: 2rem;
        }

        .persona-meta h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .persona-meta p {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-top: 2px;
        }

        /* Chat Window styling */
        .chat-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          background-color: rgba(0,0,0,0.01);
        }

        .active-tutor-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .active-tutor-avatar {
          font-size: 1.75rem;
        }

        .active-tutor-sub {
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }

        /* Bubbles formatting */
        .chat-bubble-row {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          max-width: 80%;
          animation: fadeIn var(--transition-fast) forwards;
        }

        .user-row {
          align-self: flex-end;
        }

        .tutor-row {
          align-self: flex-start;
        }

        .bubble-avatar {
          font-size: 1.25rem;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background-color: var(--bg-card-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }

        .chat-bubble {
          padding: 14px 18px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .user-bubble {
          background-color: var(--primary);
          color: var(--text-on-primary);
          border-bottom-right-radius: 4px;
        }

        .user-bubble .bubble-text {
          color: var(--text-on-primary);
        }

        .user-bubble .bubble-time {
          color: rgba(255, 255, 255, 0.7);
        }

        .tutor-bubble {
          background-color: var(--bg-card-hover);
          border-bottom-left-radius: 4px;
        }

        .bubble-text {
          font-size: 0.95rem;
          line-height: 1.5;
          word-break: break-word;
          white-space: pre-wrap;
        }

        .bubble-time {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          align-self: flex-end;
        }

        /* Typing Dots */
        .typing-bubble {
          padding: 14px 20px;
        }

        .typing-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          background-color: var(--text-secondary);
          border-radius: var(--radius-full);
          display: inline-block;
          animation: dotBounce 1.4s infinite ease-in-out both;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        /* Quick Prompts Overlay */
        .quick-prompts-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }

        .prompt-intro {
          margin-bottom: 24px;
        }

        .pulsing-icon {
          color: var(--primary);
          animation: pulseIcon 2s infinite ease-in-out;
          margin-bottom: 12px;
        }

        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px var(--primary-glow)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 8px var(--primary-glow)); }
        }

        .quick-prompts-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 480px;
        }

        .quick-prompt-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-secondary);
          font-family: var(--font-sans);
          border-radius: var(--radius-sm);
          cursor: pointer;
          text-align: left;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }

        .quick-prompt-btn:hover {
          border-color: var(--primary);
          color: var(--text-primary);
          background-color: var(--bg-card-hover);
          transform: translateX(4px);
        }

        /* Input section styling */
        .chat-input-bar {
          display: flex;
          padding: 16px 24px;
          border-top: 1px solid var(--border-color);
          background-color: rgba(0,0,0,0.01);
          gap: 12px;
        }

        .chat-input-field {
          flex: 1;
          background-color: var(--bg-card-hover);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 14px 18px;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .chat-input-field:focus {
          border-color: var(--primary);
        }

        .send-btn {
          padding: 14px 20px;
        }

        @media (max-width: 768px) {
          .tutor-chat-container {
            height: calc(100vh - 90px);
          }
          .persona-nav {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          .persona-card {
            padding: 8px;
            justify-content: center;
          }
          .persona-avatar {
            font-size: 1.5rem;
          }
          .persona-meta h4 {
            font-size: 0.8rem;
          }
          .chat-bubble-row {
            max-width: 90%;
          }
          .chat-header, .chat-messages, .chat-input-bar {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
