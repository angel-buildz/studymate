import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Smile, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

const sampleNotes = {
  photosynthesis: {
    title: "Biology: Photosynthesis Lecture Notes",
    content: "Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy. There are two primary stages: the Light-Dependent Reactions and the Light-Independent Reactions (Calvin Cycle).\n\n1. Light-Dependent Reactions: Take place in the thylakoid membranes of chloroplasts. Chlorophyll absorbs solar energy. This energy splits water molecules (photolysis), releasing oxygen gas as a byproduct. High-energy molecules ATP and NADPH are formed to power the next phase.\n\n2. Calvin Cycle (Light-Independent): Occurs in the stroma of chloroplasts. Carbon dioxide from the air is captured (carbon fixation) and converted into glucose (sugar) using the ATP and NADPH generated in the first stage. Enzymes like Rubisco act as catalysts in this pathway.\n\nKey equations: 6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2."
  },
  rome: {
    title: "History: Fall of the Western Roman Empire",
    content: "The Fall of the Western Roman Empire occurred in 476 AD when the last Roman emperor, Romulus Augustulus, was deposed by Odoacer, a Germanic chieftain. This marked the transition from Classical Antiquity to the Middle Ages in Europe.\n\nKey contributing factors:\n1. Barbarian Invasions: Heavy migrations and attacks from Germanic tribes (Visigoths, Vandals, Huns) put severe military pressure on Rome. Visigoths sacked Rome in 410 AD.\n2. Economic Weakness: Hyperinflation, heavy taxation of the lower classes, and reliance on slave labor weakened the internal economy. Agricultural production declined.\n3. Political Instability: Constant civil wars, corrupt administration, and the division of the empire into Western and Eastern halves (Byzantine Empire) led to administrative decay.\n4. Military Decline: Rome began relying heavily on barbarian mercenaries (foederati) who had little loyalty to the Roman state."
  },
  calculus: {
    title: "Math: Calculus Derivatives Basics",
    content: "A derivative represents the instantaneous rate of change of a function with respect to one of its variables. Geometrically, the derivative is the slope of the tangent line to the graph of the function at a given point.\n\nFundamental Rules:\n1. Power Rule: d/dx(x^n) = n * x^(n-1). For example, the derivative of x^4 is 4x^3.\n2. Product Rule: If u and v are functions, d/dx(u * v) = u'v + uv'.\n3. Quotient Rule: d/dx(u/v) = (u'v - uv') / v^2.\n4. Chain Rule: Used for composite functions, d/dx(f(g(x))) = f'(g(x)) * g'(x).\n\nLimits define the derivative mathematically: f'(x) = lim(h->0) [(f(x+h) - f(x)) / h]. This forms the backbone of rate calculations in physics, economics, and engineering."
  }
};

const summarizationOutputs = {
  photosynthesis: {
    tldr: [
      "Photosynthesis transforms light energy into chemical energy (glucose) in plants and algae.",
      "The Light-Dependent stage occurs in thylakoids, absorbs sunlight, splits water, and releases oxygen.",
      "The Calvin Cycle (Light-Independent) takes place in the stroma, fixing CO2 into sugars using ATP and NADPH.",
      "Rubisco is the critical catalyst enzyme driving carbon fixation."
    ],
    terms: [
      { term: "Chloroplast", def: "The specialized plant organelle where photosynthesis occurs." },
      { term: "Chlorophyll", def: "Green pigment that absorbs light energy to initiate reactions." },
      { term: "Photolysis", def: "The chemical process of splitting water molecules using light energy." },
      { term: "Stroma", def: "The fluid-filled space surrounding thylakoids where the Calvin Cycle happens." },
      { term: "Carbon Fixation", def: "Converting inorganic carbon dioxide (CO2) into organic compounds (sugars)." }
    ],
    cards: [
      { 
        title: "Stage 1: Light-Dependent Reactions", 
        detail: "Occurs in thylakoids. Sunlight strikes chlorophyll -> electrons become excited -> water is split into protons, electrons, and O2 (released). Protons build a gradient that synthesizes ATP and NADPH, which act as energy currency for the next phase." 
      },
      { 
        title: "Stage 2: The Calvin Cycle", 
        detail: "Occurs in stroma. Does not require direct sunlight but depends on ATP/NADPH. CO2 enters, attaches to RuBP via the enzyme Rubisco, and undergoes reduction to produce G3P (which builds glucose). The cycle regenerates RuBP to continue the loop." 
      },
      { 
        title: "The Core Chemical Balance", 
        detail: "Equation: 6CO2 + 6H2O + Light -> C6H12O6 + 6O2. Plants act as essential carbon sinks, taking greenhouse gases (carbon dioxide) from the atmosphere and returning oxygen gas." 
      }
    ]
  },
  rome: {
    tldr: [
      "The Western Roman Empire fell in 476 AD when Emperor Romulus Augustulus was deposed.",
      "Military decline was driven by relying on mercenary soldiers who lacked loyalty to Rome.",
      "Economic decay was accelerated by high inflation, heavy taxes, and agricultural decline.",
      "The Eastern half of the empire survived as the Byzantine Empire."
    ],
    terms: [
      { term: "Romulus Augustulus", def: "The last Western Roman Emperor, deposed at a young age in 476 AD." },
      { term: "Odoacer", def: "The Germanic chieftain who deposed the last emperor, ending Western Roman rule." },
      { term: "Sack of Rome", def: "The military looting of Rome by the Visigoths in 410 AD, shattering Rome's invincibility myth." },
      { term: "Foederati", def: "Barbarian mercenary units hired to defend Roman borders, often turning against Rome." },
      { term: "Byzantine Empire", def: "The surviving Eastern half of the Roman Empire, centered in Constantinople." }
    ],
    cards: [
      { 
        title: "External Invasions & Mercenaries", 
        detail: "Rome faced heavy migrations from Huns, Visigoths, and Vandals. To fight them, Rome hired foreign soldiers (foederati). These mercenaries was costly, poorly disciplined, and loyal to commanders rather than the Roman Senate." 
      },
      { 
        title: "Internal Economic Collapse", 
        detail: "Faced with high military spending, Rome debased its currency, triggering hyperinflation. Tax evasion by wealthy landowners forced high taxes on the poor, destroying the middle class and reducing farming outputs." 
      },
      { 
        title: "Administrative Division & Corruption", 
        detail: "The division of the empire by Diocletian meant the richer Eastern half rarely helped the poorer Western half. Corruption and constant civil wars between generals weakened political leadership." 
      }
    ]
  },
  calculus: {
    tldr: [
      "A derivative is the instantaneous rate of change, represented visually as a tangent line's slope.",
      "The Power Rule simplifies derivatives of polynomial terms: d/dx(x^n) = n * x^(n-1).",
      "Chain Rule solves composite functions by multiplying outer derivative by inner derivative.",
      "Limits form the mathematical definition of derivatives as interval spacing approaches zero."
    ],
    terms: [
      { term: "Derivative", def: "The rate at which one variable changes relative to another; the slope of a curve." },
      { term: "Tangent Line", def: "A straight line that touches a curve at exactly one point, matching its slope." },
      { term: "Power Rule", def: "Calculus shortcut: multiply by the exponent and subtract one from the power." },
      { term: "Chain Rule", def: "Rule for differentiating composition of functions: f'(g(x)) * g'(x)." },
      { term: "Limit", def: "The value that a function approaches as the input approaches some value." }
    ],
    cards: [
      { 
        title: "The Geometric Concept", 
        detail: "Average rate of change is a secant line connecting two points. By bringing those two points infinitely close together (using limits), the secant line collapses into a tangent line, showing the exact slope at a single instant." 
      },
      { 
        title: "Product and Quotient Rules", 
        detail: "For multiplying functions: (u*v)' = u'v + uv'. For dividing functions: (u/v)' = (u'v - uv') / v^2. These rules ensure changes in interrelated variables are scaled and accounted for correctly." 
      },
      { 
        title: "Practical Applications", 
        detail: "Used in Physics to derive velocity from position, and acceleration from velocity. In Economics, it identifies marginal cost and revenue to maximize profit thresholds." 
      }
    ]
  }
};

const customOutputTemplate = (topic) => {
  const t = topic.slice(0, 30) || 'Custom Notes';
  return {
    tldr: [
      `Completed overview of the core themes in ${t}.`,
      "Synthesized central points into actionable study sections.",
      "Identified primary terms and contextual variables.",
      "Formatted structure to support active recall and self-testing."
    ],
    terms: [
      { term: `${t} Core`, def: `The central theoretical framework representing the study topic.` },
      { term: "Primary Factor", def: "The strongest element influencing the outcome of this concept." },
      { term: "Secondary Factor", def: "Supporting variables that act to influence the primary framework." },
      { term: "Practical Application", def: "Real-world instances where this concept is actively applied." },
      { term: "Academic Standard", def: "The baseline criteria used to evaluate knowledge of this topic." }
    ],
    cards: [
      { 
        title: "Foundational Overview", 
        detail: `A summary of the core principles of ${t}. This outlines the introductory frameworks, historical contexts, and key assumptions needed for comprehensive review.` 
      },
      { 
        title: "Secondary Concepts & Interrelations", 
        detail: "An examination of how supporting concepts interrelate. Understanding these relationships is critical for solving multi-dimensional exam questions." 
      },
      { 
        title: "Practical Applications & Case Studies", 
        detail: "Real-world examples illustrating the principles in action. Applying theories to practical cases aids memory retention and helps on free-response questions." 
      }
    ]
  };
};

export default function NoteSummarizer() {
  const { mood, addXP } = useContext(AppContext);
  
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  
  const [activeTab, setActiveTab] = useState('tldr'); // 'tldr' | 'terms' | 'cards'
  const [copiedTerm, setCopiedTerm] = useState(null);
  const [openCardIdx, setOpenCardIdx] = useState({}); // { index: boolean }

  const handleLoadSample = (key) => {
    setInputText(sampleNotes[key].content);
  };

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    setSummaryData(null);

    const steps = [
      "Analyzing notes text structure...",
      "Extracting key concepts...",
      "Generating terminology glossary...",
      "Compiling flashcards...",
      "Finalizing study sheet..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i]);
      await new Promise(r => setTimeout(r, 600));
    }

    // Determine output data
    let result = null;
    const lowerText = inputText.toLowerCase();
    
    if (lowerText.includes('photosynthesis') || lowerText.includes('chloroplast')) {
      result = summarizationOutputs.photosynthesis;
    } else if (lowerText.includes('western roman') || lowerText.includes('barbarian')) {
      result = summarizationOutputs.rome;
    } else if (lowerText.includes('derivative') || lowerText.includes('chain rule')) {
      result = summarizationOutputs.calculus;
    } else {
      // Extract first line or make a template
      const firstLine = inputText.split('\n')[0] || 'Custom Topic';
      result = customOutputTemplate(firstLine);
    }

    setSummaryData(result);
    setIsProcessing(false);
    setActiveTab('tldr');
    addXP(20); // Award XP
  };

  const handleCopyTerm = (term, def, idx) => {
    navigator.clipboard.writeText(`${term}: ${def}`);
    setCopiedTerm(idx);
    setTimeout(() => setCopiedTerm(null), 1500);
  };

  const toggleCard = (idx) => {
    setOpenCardIdx((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getMoodHeader = () => {
    switch (mood) {
      case 'stressed':
        return {
          title: "Calm Study Mode Active 🌿",
          desc: "Take a deep breath. You don't have to learn everything at once. Let's look at this in absolute simple terms with no stress.",
          themeClass: "stressed-theme"
        };
      case 'motivated':
        return {
          title: "Focus Mode Unlocked 🚀",
          desc: "You are in the zone. Let's attack this topic and crush it! Here is your high-impact study guide.",
          themeClass: "motivated-theme"
        };
      case 'tired':
        return {
          title: "Smart Study Mode 😴",
          desc: "Rest first, study smart. Here is a streamlined, low-energy recap of the most critical concepts so you can finish up quickly.",
          themeClass: "tired-theme"
        };
      default:
        return {
          title: "Study Sheet Maker 🎓",
          desc: "Convert messy lecture notes or readings into structured summaries, key terminology lists, and expand-recall study decks.",
          themeClass: "neutral-theme"
        };
    }
  };

  const moodHeader = getMoodHeader();

  return (
    <div className="summarizer-page-wrapper animate-fade-in">
      
      {/* Mood Calibrated Header Banner */}
      <section className={`mood-banner card ${moodHeader.themeClass}`}>
        <div className="banner-content">
          <h1>{moodHeader.title}</h1>
          <p>{moodHeader.desc}</p>
        </div>
      </section>

      <div className="summarizer-grid">
        {/* Left Column: Note pasting interface */}
        <div className="summarizer-col">
          <section className="input-card card">
            <div className="card-header">
              <h3>Notes Workspace</h3>
              <div className="sample-buttons">
                <button className="btn-secondary btn-sample" onClick={() => handleLoadSample('photosynthesis')}>Bio Sample</button>
                <button className="btn-secondary btn-sample" onClick={() => handleLoadSample('rome')}>History Sample</button>
                <button className="btn-secondary btn-sample" onClick={() => handleLoadSample('calculus')}>Math Sample</button>
              </div>
            </div>

            <form onSubmit={handleSummarize} className="summarizer-form">
              <textarea
                placeholder="Paste your lecture notes, textbook chapters, or transcript paragraphs here (min 20 characters)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isProcessing}
                rows={12}
                required
              />

              <button
                type="submit"
                className="btn btn-primary summarize-submit-btn"
                disabled={isProcessing || inputText.trim().length < 20}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="spin-icon" size={18} /> {processingStep}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Summarize Notes (+20 XP)
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: Summarized Output Panel */}
        <div className="summarizer-col">
          <section className="output-card card">
            <div className="card-header">
              <h3>Study Guide Output</h3>
              {summaryData && (
                <span className="card-tag font-bold">Generated</span>
              )}
            </div>

            {!summaryData && !isProcessing && (
              <div className="empty-output-panel">
                <FileText size={48} className="empty-icon" />
                <h4>No Study Sheet Generated Yet</h4>
                <p>Paste notes in the workspace and click summarize to unlock TL;DR summaries, definitions, and flashcards.</p>
              </div>
            )}

            {isProcessing && (
              <div className="processing-loader-panel">
                <div className="pulse-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <h4>AI is processing your study sheet</h4>
                <p className="loading-step-text">{processingStep}</p>
              </div>
            )}

            {summaryData && !isProcessing && (
              <div className="output-workspace animate-fade-in">
                {/* Tabs selection */}
                <div className="output-tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'tldr' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tldr')}
                  >
                    TL;DR Summary
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                    onClick={() => setActiveTab('terms')}
                  >
                    Key Terms ({summaryData.terms.length})
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'cards' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cards')}
                  >
                    Study Decks
                  </button>
                </div>

                {/* Tab 1: TLDR Bulletpoints */}
                {activeTab === 'tldr' && (
                  <div className="tab-pane-content animate-fade-in">
                    <ul className="tldr-list">
                      {summaryData.tldr.map((point, idx) => (
                        <li key={idx} className="tldr-item">
                          <span className="bullet-point"></span>
                          <p>{point}</p>
                        </li>
                      ))}
                    </ul>
                    {mood === 'stressed' && (
                      <div className="calm-study-box">
                        <AlertCircle size={16} />
                        <p>Remember: You are doing great. Close your eyes, take a deep breath, and grab some water.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Glossary Key Terms */}
                {activeTab === 'terms' && (
                  <div className="tab-pane-content animate-fade-in">
                    <p className="tab-helper-txt">Click any term to copy the word and definition to your clipboard.</p>
                    <div className="terms-stack">
                      {summaryData.terms.map((item, idx) => {
                        const isCopied = copiedTerm === idx;
                        return (
                          <div 
                            key={idx} 
                            className="term-item card" 
                            onClick={() => handleCopyTerm(item.term, item.def, idx)}
                            title="Click to copy definition"
                          >
                            <div className="term-word-header">
                              <strong>{item.term}</strong>
                              <button className="copy-btn btn-secondary btn-icon">
                                {isCopied ? <Check size={14} className="copied-green" /> : <Copy size={14} />}
                              </button>
                            </div>
                            <p className="term-def">{item.def}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 3: Study Cards Decks */}
                {activeTab === 'cards' && (
                  <div className="tab-pane-content animate-fade-in">
                    <p className="tab-helper-txt">Click to expand details for active recall testing.</p>
                    <div className="cards-accordion-stack">
                      {summaryData.cards.map((card, idx) => {
                        const isOpen = !!openCardIdx[idx];
                        return (
                          <div key={idx} className={`accordion-card ${isOpen ? 'open' : ''}`}>
                            <button className="accordion-header" onClick={() => toggleCard(idx)}>
                              <span>{card.title}</span>
                              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {isOpen && (
                              <div className="accordion-body animate-fade-in">
                                <p>{card.detail}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <style>{`
        .summarizer-page-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Banner styling shifts depending on mood */
        .mood-banner {
          transition: all var(--transition-normal);
        }

        .neutral-theme {
          background: linear-gradient(135deg, var(--primary-light) 0%, rgba(139, 92, 246, 0.05) 100%);
          border-color: var(--primary-glow);
        }

        .stressed-theme {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(14, 165, 233, 0.02) 100%);
          border-color: rgba(14, 165, 233, 0.2);
        }

        .motivated-theme {
          background: linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(244, 63, 94, 0.02) 100%);
          border-color: rgba(244, 63, 94, 0.2);
        }

        .tired-theme {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .banner-content h1 {
          font-family: 'Outfit', sans-serif;
          margin-bottom: 6px;
        }

        .banner-content p {
          font-size: 1rem;
        }

        /* Layout Grid */
        .summarizer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .summarizer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .summarizer-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sample-buttons {
          display: flex;
          gap: 6px;
        }

        .btn-sample {
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: var(--radius-xs);
        }

        /* Textarea inputs */
        .summarizer-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .summarizer-form textarea {
          width: 100%;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          background-color: var(--bg-card-hover);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 16px;
          outline: none;
          resize: vertical;
          line-height: 1.6;
          transition: border-color var(--transition-fast);
        }

        .summarizer-form textarea:focus {
          border-color: var(--primary);
        }

        .summarize-submit-btn {
          padding: 14px;
        }

        .spin-icon {
          animation: spin 1s infinite linear;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Empty Output state */
        .empty-output-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 24px;
          color: var(--text-tertiary);
        }

        .empty-icon {
          color: var(--text-tertiary);
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-output-panel h4 {
          color: var(--text-primary);
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .empty-output-panel p {
          font-size: 0.85rem;
          max-width: 320px;
        }

        /* Processing/loading state animation */
        .processing-loader-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 24px;
        }

        .pulse-loader {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
        }

        .pulse-loader span {
          width: 12px;
          height: 12px;
          border-radius: var(--radius-full);
          background-color: var(--primary);
          animation: pulseFade 1.2s infinite ease-in-out both;
        }

        .pulse-loader span:nth-child(1) { animation-delay: -0.32s; }
        .pulse-loader span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes pulseFade {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }

        .processing-loader-panel h4 {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .loading-step-text {
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 500;
          font-family: monospace;
        }

        /* Tabs selection formatting */
        .output-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
          gap: 6px;
        }

        .tab-btn {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 600;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-secondary);
          padding: 10px 14px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .tab-pane-content {
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .tab-helper-txt {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          margin-bottom: 16px;
        }

        /* TLDR List points */
        .tldr-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .tldr-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .bullet-point {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background-color: var(--primary);
          margin-top: 8px;
          flex-shrink: 0;
        }

        .tldr-item p {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .calm-study-box {
          margin-top: 24px;
          display: flex;
          gap: 10px;
          background: rgba(14, 165, 233, 0.04);
          border: 1px solid rgba(14, 165, 233, 0.1);
          color: #0284c7;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
        }

        /* Glossary Terms stack styling */
        .terms-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .term-item {
          padding: 16px;
          cursor: pointer;
        }

        .term-word-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .term-def {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .copy-btn {
          opacity: 0;
          padding: 6px;
        }

        .term-item:hover .copy-btn {
          opacity: 1;
        }

        .copied-green {
          color: var(--accent-green);
        }

        /* Accordion Stack cards */
        .cards-accordion-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .accordion-card {
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          border-radius: var(--radius-sm);
          overflow: hidden;
          transition: all var(--transition-fast);
        }

        .accordion-card.open {
          border-color: var(--primary);
        }

        .accordion-header {
          width: 100%;
          background: transparent;
          border: none;
          padding: 16px 20px;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .accordion-header:hover {
          background-color: var(--bg-card-hover);
        }

        .accordion-body {
          padding: 0 20px 20px 20px;
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
