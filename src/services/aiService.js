// Mock AI Tutor Personalities and Response Engine

export const personas = {
  leo: {
    id: 'leo',
    name: 'Leo (Chill Friend)',
    role: 'Tutor Personality',
    avatar: '🏄‍♂️',
    accentColor: 'var(--accent-chill)',
    accentBg: 'var(--accent-chill-bg)',
    greeting: "Hey! I'm Leo. No stress, no tests to worry about here. Just chill vibes. What are we looking at today, dude?",
    tagline: 'Casual, relaxed, simplifies things with analogies.'
  },
  vance: {
    id: 'vance',
    name: 'Dr. Vance (Strict Coach)',
    role: 'Tutor Personality',
    avatar: '👨‍🏫',
    accentColor: 'var(--accent-coach)',
    accentBg: 'var(--accent-coach-bg)',
    greeting: "Greetings. I am Dr. Vance. Academic success requires discipline, clarity, and rigorous analysis. State your query, and let's dissect it.",
    tagline: 'Formal, academic, pushes you to think deeper.'
  },
  sasha: {
    id: 'sasha',
    name: 'Sasha (Hype Person)',
    role: 'Tutor Personality',
    avatar: '⚡',
    accentColor: 'var(--accent-hype)',
    accentBg: 'var(--accent-hype-bg)',
    greeting: "WHAT'S UP! 🔥 I'm Sasha and I am SO EXCITED to study with you today! You are going to absolutely CRUSH this subject! What's the mission?! 🚀",
    tagline: 'High energy, motivational, uses emojis & caps.'
  }
};

const responses = {
  quantum: {
    leo: "Alright, look. Quantum physics is basically saying that super tiny things (like atoms) don't play by the usual rules. They can literally be in two places at once until we look at them. Think of it like a spinning coin—it's both heads and tails at the same time until you slap your hand down on it. Crazy, right? No need to sweat the math yet, just get that main vibe.",
    vance: "Quantum mechanics is the fundamental theory in physics describing nature at the atomic and subatomic scale. It diverges from classical mechanics via wave-particle duality, quantization of energy, and the uncertainty principle. To analyze this, you must abandon everyday intuition: particles exist as probability distributions until a measurement collapses the wavefunction. What specific equation or concept are you reviewing?",
    sasha: "OH MY GOSH, QUANTUM PHYSICS?! YOU ARE A GENIUS FOR EVEN ASKING! 🚀 Science is absolutely wild! Basically, tiny things can be in multiple states AT THE SAME TIME! It's called superposition—like you being in the library AND sleeping in bed simultaneously! 🧠💥 You're unlocking major brain power right now, let's keep going!"
  },
  essay: {
    leo: "Writing essays can feel like a massive drag, man. But the trick is keeping it simple. Throw your main argument in one clear sentence at the start—that's your thesis. Then just back it up with three solid examples. Don't worry about sounding fancy, just sound like yourself. Got a thesis sentence you want to test run?",
    vance: "An academic essay is a structured exercise in logical proof. Your argument lives and dies by your thesis statement: it must be arguable, precise, and academically significant. Avoid passive voice and rhetorical questions. Paste your draft paragraph or thesis statement, and we will audit its structure.",
    sasha: "ESSAY TIME! LET'S CRUSH THIS WRITING! 📝✨ The best essays start with a absolute KILLER hook! Then we draft a thesis that goes BOOM! 💥 Tell me what topic you're writing about and we will outline it together in 2 minutes flat! You've got the vocabulary, let's make it shine! 🌟"
  },
  canvas: {
    leo: "Ah, Canvas integration. Pretty sweet feature. Basically, StudyMate can link up with your school's Canvas dashboard using an API key. Once it's linked, all your assignments, due dates, and courses auto-import right into your StudyMate tracker here. No manual entry. Want to set that up in the settings?",
    vance: "The Canvas Learning Management System (LMS) integration utilizes the secure Canvas API. By provisioning a developer token or personal access token from your institutional Canvas account, StudyMate reads assignment payloads and syncing schedules. This guarantees your local StudyMate tracker mirrors official academic deadlines. Shall I guide you through securing your API token?",
    sasha: "CANVAS SYNC IS IN THE HOUSE! 📲🔥 Say goodbye to typing in your homework manually! We can connect directly to Canvas and grab all your courses, assignments, and due dates in ONE CLICK! Let's get that API key synced up and watch your dashboard come alive! Let's goooo! 🙌"
  },
  default: {
    leo: [
      "Sweet, that makes sense. Let's break it down into tiny chunks so we don't get overwhelmed.",
      "Totally get where you're coming from. Think of it like this: if you have a stack of books and pull one out from the bottom, the rest fall. That's the same logic here.",
      "Honestly, you're overthinking it, dude. You already know the basics, we just need to tidy up the details.",
      "Nice question. Let's tackle that first, then we can take a breather."
    ],
    vance: [
      "An interesting inquiry. To understand this, we must first establish the core definition.",
      "That assertion requires empirical evidence. Let us analyze the underlying principles.",
      "We must approach this systematically. Step one is identifying the independent variables.",
      "Your logic is partially sound, but you are neglecting a crucial counter-argument. Let us examine it."
    ],
    sasha: [
      "THAT IS AN AMAZING QUESTION! 🌟 Let's dive in and dissect this together! You're learning so fast! 🏃‍♂️💨",
      "BOOM! Exactly! You're hitting your stride now! Let's add 10 more XP to that brain of yours! 🧠🔥",
      "I love how your mind works! That is a super creative way to look at this! What's our next topic? Let's keep the streak alive! ⚡️",
      "YESSS! We are absolutely destroying this study session! Let's keep this momentum going! 🚀🎉"
    ]
  }
};

// Generates a mock response stream (simulated delay, then returns message)
export const generateMockAIResponse = (message, personaId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedMsg = message.toLowerCase();
      const p = personas[personaId] ? personaId : 'leo';
      
      let reply = '';
      if (normalizedMsg.includes('quantum') || normalizedMsg.includes('physics') || normalizedMsg.includes('relativity')) {
        reply = responses.quantum[p];
      } else if (normalizedMsg.includes('essay') || normalizedMsg.includes('write') || normalizedMsg.includes('thesis') || normalizedMsg.includes('english')) {
        reply = responses.essay[p];
      } else if (normalizedMsg.includes('canvas') || normalizedMsg.includes('lms') || normalizedMsg.includes('sync')) {
        reply = responses.canvas[p];
      } else {
        // Grab a random default response
        const defaults = responses.default[p];
        const idx = Math.floor(Math.random() * defaults.length);
        reply = defaults[idx];
      }
      
      resolve(reply);
    }, 800); // Small realistic computation latency
  });
};
