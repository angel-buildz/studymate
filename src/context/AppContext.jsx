import React, { createContext, useState, useEffect } from 'react';
import { personas } from '../services/aiService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- Load Initial State from LocalStorage or Defaults ---
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('sm_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('sm_streak');
    return saved ? parseInt(saved, 10) : 3; // Default 3 days to look neat
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('sm_theme');
    return saved ? saved : 'dark'; // Premium dark mode by default
  });

  const [mood, setMood] = useState(() => {
    const saved = localStorage.getItem('sm_mood');
    return saved ? saved : 'neutral';
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('sm_assignments');
    if (saved) return JSON.parse(saved);
    // Starter templates
    return [
      { id: '1', title: 'Read Chemistry Chapter 4 (Gas Laws)', dueDate: '2026-06-04', completed: false },
      { id: '2', title: 'Outline English Essay Thesis', dueDate: '2026-06-06', completed: false },
      { id: '3', title: 'Math practice set on derivatives', dueDate: '2026-06-08', completed: false }
    ];
  });

  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('sm_chat_history');
    if (saved) return JSON.parse(saved);
    
    // Create base history with tutor greetings
    const initial = {};
    Object.keys(personas).forEach(key => {
      initial[key] = [
        {
          id: 'greeting',
          sender: 'tutor',
          text: personas[key].greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
    return initial;
  });

  // Canvas Config State
  const [canvasConfig, setCanvasConfig] = useState(() => {
    const saved = localStorage.getItem('sm_canvas_config');
    return saved ? JSON.parse(saved) : { url: '', token: '', lastSynced: '' };
  });

  // --- Synchronize states to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('sm_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('sm_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('sm_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sm_mood', mood);
    document.documentElement.setAttribute('data-mood', mood);
  }, [mood]);

  useEffect(() => {
    localStorage.setItem('sm_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('sm_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('sm_canvas_config', JSON.stringify(canvasConfig));
  }, [canvasConfig]);

  // --- XP & Gamification helpers ---
  const addXP = (amount) => {
    setXp((prev) => Math.max(0, prev + amount));
  };

  const incrementStreak = () => {
    setStreak((prev) => prev + 1);
    addXP(15); // +15 XP for check-in/streak increase
  };

  // --- Theme Toggle ---
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // --- Mood Emotional Check-in Handler ---
  const handleMoodCheckIn = (selectedMood) => {
    setMood(selectedMood);
    addXP(10); // Reward for doing check-in
  };

  // --- Assignment Management ---
  const addAssignment = (title, dueDate) => {
    const newAss = {
      id: Date.now().toString(),
      title,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      completed: false
    };
    setAssignments((prev) => [newAss, ...prev]);
  };

  const toggleAssignment = (id) => {
    setAssignments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.completed;
          if (newStatus) {
            addXP(15); // +15 XP for completing assignments
          } else {
            addXP(-15);
          }
          return { ...item, completed: newStatus };
        }
        return item;
      })
    );
  };

  const deleteAssignment = (id) => {
    setAssignments((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Canvas Integration sync ---
  const importCanvasAssignments = (url, token, newTasks) => {
    // Deduplicate and merge: filter out any tasks that are already in list
    setAssignments((prev) => {
      const filteredNew = newTasks.filter(
        (nt) => !prev.some((pt) => pt.id === nt.id || pt.title === nt.title)
      );
      return [...filteredNew, ...prev];
    });

    // Award bonus XP on first Canvas Link!
    const isFirstSync = !canvasConfig.lastSynced;
    if (isFirstSync && newTasks.length > 0) {
      addXP(50);
    } else {
      addXP(10); // Normal sync rewards +10 XP
    }

    setCanvasConfig({
      url,
      token,
      lastSynced: new Date().toLocaleString()
    });
  };

  const disconnectCanvas = () => {
    setCanvasConfig({ url: '', token: '', lastSynced: '' });
    // Optional: delete imported canvas tasks, or just let them stay
    setAssignments((prev) => prev.filter((item) => !item.id.startsWith('canvas_')));
  };

  // --- Chat Management ---
  const addChatMessage = (personaId, sender, text) => {
    const newMsg = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory((prev) => ({
      ...prev,
      [personaId]: [...(prev[personaId] || []), newMsg]
    }));
  };

  const clearChatHistory = (personaId) => {
    setChatHistory((prev) => ({
      ...prev,
      [personaId]: [
        {
          id: 'greeting',
          sender: 'tutor',
          text: personas[personaId].greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
  };

  // Dynamic Level computation
  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;
  const xpNeededForNextLevel = 100;

  return (
    <AppContext.Provider
      value={{
        xp,
        streak,
        theme,
        mood,
        assignments,
        chatHistory,
        canvasConfig,
        level,
        xpInCurrentLevel,
        xpNeededForNextLevel,
        addXP,
        incrementStreak,
        toggleTheme,
        handleMoodCheckIn,
        addAssignment,
        toggleAssignment,
        deleteAssignment,
        importCanvasAssignments,
        disconnectCanvas,
        addChatMessage,
        clearChatHistory
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
