// AssistantView.jsx - Cosmos AI Chat Node & Quiz Generator
import React, { useState, useEffect, useRef } from 'react';
import { suggestedPrompts, knowledgeBase, quizQuestions } from '../data/assistantPrompts';
import spaceSounds from '../components/SoundManager';

const AssistantView = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Awaiting incoming transmission sequence. Ask me about Exoplanets, Webb Telescope discoveries, or Voyager 1 telemetry feeds.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatCanvasRef = useRef(null);

  // Gamified Quiz Mode states
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Auto-scroll chat window
  useEffect(() => {
    if (chatCanvasRef.current) {
      chatCanvasRef.current.scrollTop = chatCanvasRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    spaceSounds.playClick();
    
    // User message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking and typing latency
    setTimeout(() => {
      let aiResponse = '';
      const queryLower = text.toLowerCase();

      // Check if user is requesting a quiz
      if (queryLower.includes('quiz') || queryLower.includes('test')) {
        startQuizMode();
        setIsTyping(false);
        return;
      }

      // Keyword matching matching knowledge base
      const match = knowledgeBase.find(kb => 
        kb.keywords.some(keyword => queryLower.includes(keyword))
      );

      if (match) {
        aiResponse = match.response;
      } else {
        aiResponse = `### Telemetry Analysis: Unknown Vector\n\nI scanned the cosmic databases for **"${text}"**, but no exact match was found in Sector 001. \n\n*   **Recommended Queries:** Ask me about the *Webb Telescope*, *Voyager 1 status*, or *Compare Earth and Venus*.\n*   **System Action:** Tap "Generate Space Quiz" below to test your astronomical telemetry knowledge decks!`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
      spaceSounds.playHover(); // Play completion sound
    }, 1500);
  };

  const startQuizMode = () => {
    spaceSounds.playAchievement();
    setQuizMode(true);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setScore(0);
    setQuizFinished(false);
  };

  const handleOptionClick = (optIdx) => {
    if (selectedOptionIdx !== null) return; // Answered already
    
    setSelectedOptionIdx(optIdx);
    const correctAns = quizQuestions[currentQuestionIdx].answer;
    
    if (optIdx === correctAns) {
      spaceSounds.playClick();
      setScore(prev => prev + 1);
    } else {
      spaceSounds.playHover(); // fail blip
    }
  };

  const handleNextQuestion = () => {
    spaceSounds.playClick();
    setSelectedOptionIdx(null);

    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      spaceSounds.playAchievement();
      
      // Dispatch achievement event if score is 5/5
      if (score === 5) {
        window.dispatchEvent(new CustomEvent('unlock-achievement', {
          detail: {
            id: 'supernova-scholar',
            title: 'Supernova Scholar',
            desc: 'Scored a perfect 5/5 on the AI assistant deep cosmology evaluation test!'
          }
        }));
      }
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 160px)', gap: 'var(--gutter)' }} className="assistant-layout">
      
      {/* 1. Left Sidebar - Comms Logs History list */}
      <aside 
        style={{
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          flexShrink: 0
        }}
        className="hidden-mobile"
      >
        <button 
          onClick={startQuizMode}
          onMouseEnter={() => spaceSounds.playHover()}
          className="btn-primary"
          style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', width: '100%', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>school</span>
          Generate Space Quiz
        </button>

        {/* Comms Logs */}
        <div className="glass-panel" style={{ padding: '16px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--on-surface-variant)' }}>COMMS LOG LOGS</span>
          
          <button 
            onClick={() => handleSendMessage('James Webb Telescope discoveries')} 
            className="comms-history-btn"
          >
            Webb Telescope Findings
          </button>
          
          <button 
            onClick={() => handleSendMessage('Compare Earth and Venus')} 
            className="comms-history-btn"
          >
            Earth & Venus Telemetry
          </button>
          
          <button 
            onClick={() => handleSendMessage('Explain Dark Matter')} 
            className="comms-history-btn"
          >
            Dark Matter Theories
          </button>

          <button 
            onClick={() => handleSendMessage('recommend learning path')} 
            className="comms-history-btn"
            style={{ color: 'var(--primary-container)', fontWeight: 'bold' }}
          >
            🎓 Cosmology Study Path
          </button>

          <button 
            onClick={() => handleSendMessage('start interactive session')} 
            className="comms-history-btn"
            style={{ color: 'var(--primary-container)', fontWeight: 'bold' }}
          >
            🖥️ Interactive Tutorial
          </button>

          <button 
            onClick={() => handleSendMessage('overview')} 
            className="comms-history-btn"
          >
            📝 Module Summaries
          </button>
        </div>
      </aside>

      {/* 2. Central Chat / Quiz Workspace */}
      <section className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <header style={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="holo-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0, 240, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--primary-container)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-container)' }}>auto_awesome</span>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary-fixed)' }}>COSMOS AI NODE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: 'var(--on-surface-variant)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-container)' }} className="pulse-glow-node" />
                ONLINE • SECURE DSN LINK
              </div>
            </div>
          </div>
          {quizMode && (
            <button 
              onClick={() => { spaceSounds.playClick(); setQuizMode(false); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer', fontFamily: 'var(--font-data)', fontSize: '11px' }}
            >
              TERMINATE QUIZ
            </button>
          )}
        </header>

        {/* 3. Render Quiz Mode vs Chat Mode */}
        {quizMode ? (
          /* Interactive Quiz Panel */
          <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {!quizFinished ? (
              <div style={{ animation: 'fadeIn 0.3s ease-out', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-data)', fontSize: '11px', color: 'var(--on-surface-variant)' }}>
                  <span>COSMOLOGY LEVEL CHECK</span>
                  <span>QUESTION {currentQuestionIdx + 1} OF {quizQuestions.length}</span>
                </div>
                
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', margin: 0, lineHeight: '30px' }}>
                  {quizQuestions[currentQuestionIdx].question}
                </h3>

                {/* Option Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                  {quizQuestions[currentQuestionIdx].options.map((opt, idx) => {
                    const isSelected = selectedOptionIdx === idx;
                    const isCorrect = quizQuestions[currentQuestionIdx].answer === idx;
                    
                    let bg = 'rgba(255,255,255,0.02)';
                    let border = '1px solid rgba(255,255,255,0.06)';
                    let textColor = 'var(--on-surface)';

                    if (selectedOptionIdx !== null) {
                      if (isCorrect) {
                        bg = 'rgba(46, 204, 113, 0.15)';
                        border = '1px solid #2ecc71';
                        textColor = '#2ecc71';
                      } else if (isSelected) {
                        bg = 'rgba(231, 76, 60, 0.15)';
                        border = '1px solid #e74c3c';
                        textColor = '#e74c3c';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        style={{
                          background: bg,
                          border: border,
                          color: textColor,
                          padding: '16px',
                          borderRadius: '8px',
                          textAlign: 'left',
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          cursor: selectedOptionIdx !== null ? 'default' : 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        className={selectedOptionIdx === null ? "glow-hover" : ""}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation text block */}
                {selectedOptionIdx !== null && (
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', borderLeft: '3px solid var(--primary-container)', borderRadius: '0 8px 8px 0', fontSize: '13px', lineHeight: '22px', color: 'var(--on-surface-variant)', animation: 'fadeIn 0.2s ease-out' }}>
                    <strong>EXPLANATION:</strong> {quizQuestions[currentQuestionIdx].explanation}
                  </div>
                )}

                {/* Next button */}
                {selectedOptionIdx !== null && (
                  <button 
                    onClick={handleNextQuestion} 
                    className="btn-primary" 
                    style={{ alignSelf: 'flex-end', padding: '12px 32px', borderRadius: '4px' }}
                  >
                    {currentQuestionIdx === quizQuestions.length - 1 ? 'Finish Test' : 'Next Question'}
                  </button>
                )}
              </div>
            ) : (
              /* Quiz Score results summary view */
              <div style={{ textAlign: 'center', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px', animation: 'fadeIn 0.4s ease-out' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '72px', color: 'var(--primary-container)' }}>
                  emoji_events
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#fff', margin: 0 }}>Evaluation Complete</h3>
                <p style={{ fontFamily: 'var(--font-data)', fontSize: '18px', color: 'var(--primary-fixed-dim)', margin: 0 }}>
                  SCORE: {score} / {quizQuestions.length} ({Math.round((score / quizQuestions.length) * 100)}%)
                </p>
                <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '22px' }}>
                  {score === 5 
                    ? 'Supernova Master status achieved! You possess absolute alignment knowledge of cosmic telemetry.' 
                    : score >= 3 
                      ? 'Orbital Cadet status achieved. Solid basic alignments, but minor anomalies persist.' 
                      : 'Space Dust status. Planetary systems require further study logs.'
                  }
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
                  <button onClick={startQuizMode} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '4px' }}>Restart Quiz</button>
                  <button onClick={() => { spaceSounds.playClick(); setQuizMode(false); }} className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '4px' }}>Return to Chat</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Standard chat mode workspace */
          <>
            {/* Conversations canvas container */}
            <div ref={chatCanvasRef} style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {messages.map((msg, idx) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end', width: '100%', gap: '12px' }}>
                    {isAI && (
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', background: 'rgba(255,255,255,0.03)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary-fixed)' }}>auto_awesome</span>
                      </div>
                    )}
                    
                    <div 
                      style={{
                        maxWidth: '80%',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        fontSize: '14px',
                        lineHeight: '24px',
                        backgroundColor: isAI ? 'rgba(0, 240, 255, 0.03)' : 'rgba(255, 255, 255, 0.04)',
                        borderLeft: isAI ? '3px solid var(--primary-container)' : 'none',
                        borderRight: !isAI ? '3px solid var(--secondary-container)' : 'none',
                        color: isAI ? 'var(--on-surface)' : '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      className="markdown-chat-bubble"
                    >
                      {/* Simple custom markdown renderer line breaks and lists */}
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (line.startsWith('### ')) {
                          return <h4 key={lIdx} style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--primary-container)', margin: '12px 0 8px 0' }}>{line.replace('### ', '')}</h4>;
                        }
                        if (line.startsWith('* ')) {
                          return <li key={lIdx} style={{ marginLeft: '16px', marginBottom: '4px' }}>{line.replace('* ', '')}</li>;
                        }
                        return <p key={lIdx} style={{ margin: '0 0 8px 0' }}>{line}</p>;
                      })}
                    </div>
                  </div>
                );
              })}
              
              {/* Simulated typing status */}
              {isTyping && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--on-surface-variant)', fontSize: '11px', fontFamily: 'var(--font-data)', marginLeft: '40px' }}>
                  <span className="pulse-glow-node" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-container)' }}></span>
                  COSMOS NODE COMPUTING DATA...
                </div>
              )}
            </div>

            {/* Input & quick actions area */}
            <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Quick suggestion chips */}
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }} className="no-scrollbar">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.text)}
                    onMouseEnter={() => spaceSounds.playHover()}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '6px 14px',
                      borderRadius: '24px',
                      fontFamily: 'var(--font-data)',
                      fontSize: '10px',
                      color: 'var(--on-surface-variant)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease'
                    }}
                    className="glow-hover"
                  >
                    {p.text}
                  </button>
                ))}
              </div>

              {/* Text input form wrapper */}
              <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Transmit query to deep space database..."
                  style={{
                    flex: 1,
                    background: 'rgba(5, 20, 36, 0.65)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    height: '52px',
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    resize: 'none',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => handleSendMessage()}
                  style={{
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    color: '#fff',
                    width: '52px',
                    height: '52px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <style>{`
        .comms-history-btn {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          padding: 8px 12px;
          text-align: left;
          color: var(--on-surface-variant);
          font-family: var(--font-body);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .comms-history-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        @media (max-width: 768px) {
          .assistant-layout {
            height: calc(100vh - 120px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AssistantView;
