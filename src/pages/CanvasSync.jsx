import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { syncCanvasAPI } from '../services/canvasService';
import { Calendar, CheckCircle2, AlertTriangle, ShieldAlert, Key, Link2, LogOut, Terminal, Play } from 'lucide-react';

export default function CanvasSync() {
  const { canvasConfig, importCanvasAssignments, disconnectCanvas } = useContext(AppContext);
  
  const [url, setUrl] = useState(canvasConfig.url || '');
  const [token, setToken] = useState(canvasConfig.token || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState([]);
  const consoleEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom of terminal whenever logs update
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSync = async (e) => {
    e.preventDefault();
    if (!url.trim() || !token.trim()) return;

    setIsSyncing(true);
    setLogs([]);

    const logLine = (msg) => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs((prev) => [...prev, `[${time}] ${msg}`]);
    };

    // Perform Sync
    const importedAssignments = await syncCanvasAPI(url, token, logLine);

    if (importedAssignments && importedAssignments.length > 0) {
      importCanvasAssignments(url, token, importedAssignments);
    }
    
    setIsSyncing(false);
  };

  const handleDisconnect = () => {
    if (window.confirm("Disconnect Canvas sync? This will remove all imported Canvas assignments from your checklist.")) {
      disconnectCanvas();
      setUrl('');
      setToken('');
      setLogs([]);
    }
  };

  const isConnected = !!canvasConfig.lastSynced;

  return (
    <div className="canvas-sync-view animate-fade-in">
      <div className="canvas-grid">
        
        {/* Left Column: Config Panel */}
        <div className="canvas-col">
          <section className="config-card card">
            <div className="card-header">
              <h3>Canvas LMS Integration</h3>
              <span className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? 'Connected' : 'Not Linked'}
              </span>
            </div>

            {isConnected ? (
              <div className="connected-status-panel">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={32} />
                </div>
                <div className="status-meta">
                  <h4>Successfully Synced</h4>
                  <p className="last-sync-time">Last update: {canvasConfig.lastSynced}</p>
                  <p className="sync-detail-sub">Canvas Host: <code>{canvasConfig.url}</code></p>
                </div>
                
                <button className="btn btn-secondary disconnect-btn" onClick={handleDisconnect}>
                  <LogOut size={16} /> Disconnect Canvas
                </button>
              </div>
            ) : (
              <form onSubmit={handleSync} className="sync-setup-form">
                <p className="form-helper-text">
                  Provide your school's Canvas portal URL and your personal API developer token to sync assignments instantly.
                </p>

                <div className="input-group">
                  <label htmlFor="canvas-url">Institution Canvas URL</label>
                  <div className="input-wrapper">
                    <Link2 className="input-icon" size={18} />
                    <input
                      id="canvas-url"
                      type="text"
                      placeholder="e.g., canvas.instructure.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      disabled={isSyncing}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="canvas-token">Personal Access Token</label>
                  <div className="input-wrapper">
                    <Key className="input-icon" size={18} />
                    <input
                      id="canvas-token"
                      type="password"
                      placeholder="Paste your token here..."
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                      disabled={isSyncing}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary sync-submit-btn" 
                  disabled={isSyncing || !url.trim() || !token.trim()}
                >
                  {isSyncing ? (
                    <>
                      <span className="spinner-icon"></span> Syncing assignments...
                    </>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" /> Sync Coursework
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* Sync Console Log Panel */}
          {(logs.length > 0 || isSyncing) && (
            <section className="terminal-card card">
              <div className="terminal-header">
                <Terminal size={18} />
                <span>Canvas Sync Log Terminal</span>
              </div>
              <div className="terminal-body">
                {logs.map((log, idx) => (
                  <p key={idx} className="terminal-line">{log}</p>
                ))}
                {isSyncing && (
                  <p className="terminal-line cursor-blink">⏳ Processing query stream...</p>
                )}
                <div ref={consoleEndRef} />
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Setup Instructions Guide */}
        <div className="canvas-col">
          <section className="guide-card card">
            <div className="card-header">
              <h3>Setup Guide</h3>
              <span className="card-tag">Help Desk</span>
            </div>
            
            <div className="guide-steps">
              <div className="guide-step">
                <span className="step-num">1</span>
                <div>
                  <h4>Log into Canvas</h4>
                  <p>Open your institution's official Canvas webpage and log in with your student credentials.</p>
                </div>
              </div>

              <div className="guide-step">
                <span className="step-num">2</span>
                <div>
                  <h4>Go to Account Settings</h4>
                  <p>Click on **Account** in the left navigation sidebar of Canvas, and select **Settings** from the menu.</p>
                </div>
              </div>

              <div className="guide-step">
                <span className="step-num">3</span>
                <div>
                  <h4>Generate New Access Token</h4>
                  <p>Scroll down to the **Approved Integrations** section, click the **+ New Access Token** button, add a purpose (e.g., "StudyMate Sync"), and generate it.</p>
                </div>
              </div>

              <div className="guide-step">
                <span className="step-num">4</span>
                <div>
                  <h4>Copy & Paste Settings</h4>
                  <p>Copy the long character string immediately (Canvas only shows it once!) and paste it into the credentials form on the left alongside your institution's URL.</p>
                </div>
              </div>
            </div>

            <div className="security-notice">
              <ShieldAlert size={20} />
              <div>
                <strong>Security Guarantee:</strong> Your developer token is stored strictly in your browser's local sandbox state (`LocalStorage`). We never upload credentials to third-party database nodes.
              </div>
            </div>
          </section>
        </div>

      </div>

      <style>{`
        .canvas-sync-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .canvas-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .canvas-grid {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }

        .canvas-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .status-badge.connected {
          background-color: var(--accent-green-bg);
          color: var(--accent-green);
        }

        .status-badge.disconnected {
          background-color: var(--border-color);
          color: var(--text-tertiary);
        }

        .form-helper-text {
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        /* Form Controls */
        .sync-setup-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-tertiary);
          pointer-events: none;
        }

        .input-wrapper input {
          width: 100%;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          background-color: var(--bg-card-hover);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 12px 14px 12px 42px;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .input-wrapper input:focus {
          border-color: var(--primary);
        }

        .sync-submit-btn {
          margin-top: 8px;
          padding: 12px;
          width: 100%;
        }

        /* Connected UI Dashboard */
        .connected-status-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px 0;
        }

        .success-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          background-color: var(--accent-green-bg);
          color: var(--accent-green);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 0 16px rgba(74, 222, 128, 0.2);
          animation: pulseSuccess 2s infinite alternate ease-in-out;
        }

        @keyframes pulseSuccess {
          0% { box-shadow: 0 0 4px rgba(74, 222, 128, 0.2); }
          100% { box-shadow: 0 0 20px rgba(74, 222, 128, 0.5); }
        }

        .status-meta h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .last-sync-time {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .sync-detail-sub {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-bottom: 24px;
        }

        .sync-detail-sub code {
          background-color: var(--bg-card-hover);
          padding: 2px 6px;
          border-radius: var(--radius-xs);
          font-family: monospace;
        }

        .disconnect-btn {
          width: 100%;
          max-width: 220px;
        }

        /* Log Console / Terminal Card */
        .terminal-card {
          background-color: #050508;
          border: 1px solid #1f1f2e;
          padding: 0;
          overflow: hidden;
        }

        .terminal-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border-bottom: 1px solid #1f1f2e;
          background-color: #0b0b10;
          color: #a1a1aa;
          font-family: monospace;
          font-size: 0.8rem;
        }

        .terminal-body {
          padding: 16px 20px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.85rem;
          line-height: 1.6;
          color: #10b981;
          background-color: #050508;
          max-height: 220px;
          overflow-y: auto;
        }

        .terminal-line {
          margin-bottom: 4px;
          word-break: break-all;
        }

        .cursor-blink {
          color: #38bdf8;
        }

        /* Instruction Guide Panel */
        .guide-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }

        .guide-step {
          display: flex;
          gap: 16px;
        }

        .step-num {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }

        .guide-step h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .guide-step p {
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .security-notice {
          display: flex;
          gap: 12px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid var(--primary-glow);
          color: var(--primary);
          padding: 16px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          line-height: 1.4;
        }

        /* Sync Spinner */
        .spinner-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: var(--radius-full);
          animation: spin 1s infinite linear;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
