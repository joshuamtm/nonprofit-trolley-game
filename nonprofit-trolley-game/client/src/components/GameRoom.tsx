import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { mockScenarios, MockRoomService, isMockMode } from '../services/mockData';
import { RoomService } from '../services/rooms';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import WordCloud from './WordCloud';
import FacilitatorDashboard from './FacilitatorDashboard';
import { moderateText, calculateStemmedWordFrequencies, rateLimiter } from '../utils/textProcessing';
import { useKeyboardNavigation, focusElement } from '../hooks/useKeyboardNavigation';
import { useScreenReader } from '../hooks/useScreenReader';
import './GameRoom.css';

const GameRoom: React.FC = () => {
  const { roomCode } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const isFacilitator = role === 'facilitator';

  const {
    session,
    participant,
    currentScenario,
    loading,
    error,
    hasVoted,
    myVote,
    myRationale,
    timerActive,
    secondsRemaining,
    showResults,
    voteSummary,
    submitVote,
    setError,
    joinRoom,
    startScenario,
    startTimer
  } = useGameStore();

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [rationale, setRationale] = useState('');
  const [gamePhase, setGamePhase] = useState<'waiting' | 'voting' | 'results'>('waiting');
  const [mockVotes, setMockVotes] = useState<Array<{vote: 'pull' | 'dont_pull', rationale: string}>>([]);
  const [moderationMessage, setModerationMessage] = useState<string>('');
  const [timerDuration, setTimerDuration] = useState(30);
  const [showFacilitatorView, setShowFacilitatorView] = useState(isFacilitator);
  const [selectedVoteIndex, setSelectedVoteIndex] = useState(0); // For keyboard navigation
  const [keyboardFocusMode, setKeyboardFocusMode] = useState(false);
  
  const gameRoomRef = useRef<HTMLDivElement>(null);
  const pullButtonRef = useRef<HTMLButtonElement>(null);
  const dontPullButtonRef = useRef<HTMLButtonElement>(null);

  // Use scenario from store, fallback to mock for demo mode
  const scenario = currentScenario || (isMockMode ? mockScenarios[currentScenarioIndex] : null);

  // Screen reader announcements
  const {
    announceGamePhase,
    announceVoteSubmitted,
    announceResults,
    announceTimer,
    announceScenarioChange,
    announceError,
    announceModeration
  } = useScreenReader();

  useEffect(() => {
    if (!session && !participant && roomCode) {
      // Join room if not already joined
      handleJoinRoom();
    }
  }, [roomCode]);

  // Handle scenario loading and game phase transitions
  useEffect(() => {
    if (scenario && !isMockMode) {
      // If we have a scenario loaded and we're not in mock mode, 
      // it means the facilitator started a scenario, so transition to voting
      setGamePhase('voting');
    } else if (!scenario && !isMockMode) {
      // If no scenario is loaded, we should be in waiting phase
      setGamePhase('waiting');
    }
  }, [scenario, isMockMode]);

  const handleJoinRoom = async () => {
    if (!roomCode) return;
    
    if (isMockMode && !isFacilitator) {
      const { participant, error } = await MockRoomService.joinRoom(roomCode);
      if (error) {
        setError(error.message);
      }
      // For demo purposes, we'll just continue
    } else if (!isMockMode) {
      await joinRoom(roomCode);
    }
  };

  const handleStartScenario = async () => {
    console.log('🚀 handleStartScenario called', { isMockMode, scenario: scenario?.title });
    
    if (isMockMode) {
      // Mock mode behavior
      setGamePhase('voting');
      announceGamePhase('voting', `Scenario: ${scenario?.title}. You have ${timerDuration} seconds to make your choice.`);
      announceScenarioChange(currentScenarioIndex, mockScenarios.length, scenario?.title || '');
      
      // Simulate starting timer with custom duration
      setTimeout(() => {
        setGamePhase('results');
      }, timerDuration * 1000);
    } else {
      // Real mode - use the store to start scenario with Supabase
      try {
        console.log('📡 Starting real scenario...', { session: session?.id });
        
        // Load the first scenario if none is loaded
        if (!scenario) {
          console.log('📚 Loading scenarios from database...');
          const { data: scenarios, error } = await RoomService.loadScenarios();
          if (scenarios && scenarios.length > 0) {
            console.log('✅ Starting scenario:', scenarios[0].title);
            await startScenario(scenarios[0].id);
          }
        } else {
          console.log('🎯 Starting existing scenario:', scenario.title);
          await startScenario(scenario.id);
        }
        
        // Start the timer for real mode
        console.log('⏰ Starting timer:', timerDuration, 'seconds');
        startTimer(timerDuration);
        
        console.log('✅ Scenario start completed');
      } catch (error: any) {
        console.error('❌ Failed to start scenario:', error);
        setError(error.message || 'Failed to start scenario');
      }
    }
  };

  const handleVote = async (vote: 'pull' | 'dont_pull') => {
    if (hasVoted) return;

    // Check rate limiting
    const identifier = window.navigator.userAgent + window.location.href;
    if (!rateLimiter.canSubmit(identifier)) {
      const remaining = Math.ceil(rateLimiter.getRemainingTime(identifier) / 1000);
      setModerationMessage(`Please wait ${remaining} seconds before voting again.`);
      return;
    }

    // Moderate the rationale
    let processedRationale = '';
    if (rationale.trim()) {
      const moderated = moderateText(rationale.trim());
      processedRationale = moderated.sanitized;
      
      if (moderated.moderated) {
        setModerationMessage('Your response has been filtered for inappropriate content.');
        announceModeration('Your response has been filtered for inappropriate content.');
      }
    }

    if (isMockMode) {
      // Simulate vote submission
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add to mock votes for word cloud demonstration
      setMockVotes(prev => [...prev, { vote, rationale: processedRationale || rationale.trim() }]);
      
      // Announce successful vote submission
      announceVoteSubmitted(vote, processedRationale || rationale.trim());
    } else {
      await submitVote(vote, processedRationale);
      announceVoteSubmitted(vote, processedRationale);
    }

    // Clear moderation message after 3 seconds
    if (moderationMessage) {
      setTimeout(() => setModerationMessage(''), 3000);
    }
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < mockScenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setGamePhase('waiting');
      setRationale('');
      setMockVotes([]); // Clear votes for new scenario
      setModerationMessage('');
      announceGamePhase('waiting', `Moving to scenario ${currentScenarioIndex + 2} of ${mockScenarios.length}.`);
    } else {
      setGamePhase('waiting');
      announceGamePhase('waiting', 'Game session complete. All scenarios have been finished.');
    }
  };

  // Calculate word cloud data for demo
  const pullRationales = mockVotes.filter(v => v.vote === 'pull').map(v => v.rationale);
  const dontPullRationales = mockVotes.filter(v => v.vote === 'dont_pull').map(v => v.rationale);
  
  const pullWords = calculateStemmedWordFrequencies(pullRationales);
  const dontPullWords = calculateStemmedWordFrequencies(dontPullRationales);

  // Keyboard navigation for voting phase
  useKeyboardNavigation({
    onArrowLeft: () => {
      if (gamePhase === 'voting' && !hasVoted) {
        setSelectedVoteIndex(0);
        setKeyboardFocusMode(true);
        pullButtonRef.current?.focus();
      }
    },
    onArrowRight: () => {
      if (gamePhase === 'voting' && !hasVoted) {
        setSelectedVoteIndex(1);
        setKeyboardFocusMode(true);
        dontPullButtonRef.current?.focus();
      }
    },
    onEnter: () => {
      if (gamePhase === 'voting' && !hasVoted && keyboardFocusMode) {
        if (selectedVoteIndex === 0) {
          handleVote('pull');
        } else {
          handleVote('dont_pull');
        }
      }
    },
    onSpace: () => {
      if (gamePhase === 'voting' && !hasVoted && keyboardFocusMode) {
        if (selectedVoteIndex === 0) {
          handleVote('pull');
        } else {
          handleVote('dont_pull');
        }
      }
    },
    onEscape: () => {
      setKeyboardFocusMode(false);
      gameRoomRef.current?.focus();
    },
    enabled: gamePhase === 'voting'
  });

  // Focus management for phase changes
  useEffect(() => {
    if (gamePhase === 'voting') {
      // Focus on the first vote button when entering voting phase
      setTimeout(() => {
        pullButtonRef.current?.focus();
      }, 100);
    } else if (gamePhase === 'results') {
      // Announce results
      const pullVotes = mockVotes.filter(v => v.vote === 'pull').length;
      const dontPullVotes = mockVotes.filter(v => v.vote === 'dont_pull').length;
      const decision = pullVotes > dontPullVotes ? 'pull' : 'dont_pull';
      
      announceResults(pullVotes, dontPullVotes, decision);
      announceGamePhase('results', 'Review the voting results and discussion.');
      
      if (isFacilitator) {
        // Focus on next scenario button in results
        setTimeout(() => {
          focusElement('.next-scenario-button');
        }, 100);
      }
    } else if (gamePhase === 'waiting') {
      announceGamePhase('waiting', 'Waiting for the facilitator to start the next scenario.');
    }
  }, [gamePhase, isFacilitator, mockVotes, announceGamePhase, announceResults]);

  if (error) {
    // Announce error to screen readers
    announceError(error);
    
    return (
      <div className="game-room error-state">
        <div className="error-container">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="game-room loading-state">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Show facilitator dashboard if requested
  if (showFacilitatorView && isFacilitator) {
    return (
      <FacilitatorDashboard
        roomCode={roomCode || ''}
        onStartScenario={handleStartScenario}
        onNextScenario={handleNextScenario}
        gamePhase={gamePhase}
        currentScenarioIndex={currentScenarioIndex}
        participantCount={3} // Mock participant count
        mockVotes={mockVotes}
        timerDuration={timerDuration}
        onTimerDurationChange={setTimerDuration}
      />
    );
  }

  return (
    <div 
      className="game-room" 
      role="main" 
      aria-label="Nonprofit Trolley Game Room"
      ref={gameRoomRef}
      tabIndex={-1}
    >
      <header className="room-header" role="banner">
        <div className="room-info">
          <h1 id="room-title">Room: {roomCode}</h1>
          <div className="participant-count" aria-live="polite" aria-atomic="true">
            {isFacilitator ? 'Facilitator View' : 'Participant'} • 3 participants
          </div>
        </div>
        
        {isFacilitator && (
          <div className="view-toggle" role="tablist" aria-label="View options">
            <button
              className={`toggle-btn ${!showFacilitatorView ? 'active' : ''}`}
              onClick={() => setShowFacilitatorView(false)}
              role="tab"
              aria-selected={!showFacilitatorView}
              aria-controls="game-content"
              id="game-view-tab"
            >
              Game View
            </button>
            <button
              className={`toggle-btn ${showFacilitatorView ? 'active' : ''}`}
              onClick={() => setShowFacilitatorView(true)}
              role="tab"
              aria-selected={showFacilitatorView}
              aria-controls="facilitator-dashboard"
              id="dashboard-tab"
            >
              Dashboard
            </button>
          </div>
        )}
        
        {gamePhase === 'voting' && (
          <div className="timer-container" role="timer" aria-label="Voting countdown timer">
            <CountdownCircleTimer
              isPlaying={timerActive}
              duration={timerDuration}
              colors={['#2ecc71', '#f39c12', '#e74c3c']}
              colorsTime={[timerDuration * 0.67, timerDuration * 0.33, 0]}
              size={80}
              onComplete={() => {
                console.log('⏰ Timer completed');
                // Transition to results phase when timer completes
                setGamePhase('results');
                return { shouldRepeat: false, delay: 0 };
              }}
            >
              {({ remainingTime }) => (
                <div className="timer-display" aria-live="assertive" aria-atomic="true">
                  <span className="sr-only">Time remaining: </span>
                  {remainingTime}
                  <span className="sr-only"> seconds</span>
                </div>
              )}
            </CountdownCircleTimer>
          </div>
        )}
      </header>

      <main className="game-content" id="game-content" role="tabpanel" aria-labelledby={showFacilitatorView ? 'dashboard-tab' : 'game-view-tab'}>
        {gamePhase === 'waiting' ? (
          <section className="waiting-phase" aria-labelledby="waiting-heading">
            <h2 id="waiting-heading">Ready for Next Scenario?</h2>
            {isMockMode ? (
              <p aria-label={`Currently on scenario ${currentScenarioIndex + 1} of ${mockScenarios.length} total scenarios`}>
                Scenario {currentScenarioIndex + 1} of {mockScenarios.length}
              </p>
            ) : (
              <p>Scenario {session ? '1 of 3' : 'Loading...'}</p>
            )}
            
            {isFacilitator ? (
              <button 
                className="start-scenario-button"
                onClick={handleStartScenario}
                aria-describedby="scenario-title-preview"
                disabled={!isMockMode && !scenario}
              >
                Start Scenario: <span id="scenario-title-preview">{scenario?.title || 'Select a scenario'}</span>
              </button>
            ) : (
              <p role="status" aria-live="polite">Waiting for facilitator to start the next scenario...</p>
            )}
            
            {isMockMode && (
              <div className="demo-controls">
                <p><em>Demo Mode: Click "Start Scenario" to begin</em></p>
              </div>
            )}
          </section>
        ) : gamePhase === 'voting' && scenario ? (
          <section className="voting-phase" aria-labelledby="scenario-heading">
            <div className="scenario-layout">
              <div className="scenario-content">
                <header className="scenario-header">
                  <h2 id="scenario-heading">{scenario?.title}</h2>
                  {scenario?.content_warnings && scenario.content_warnings.length > 0 && (
                    <div className="content-warnings" role="alert" aria-label="Content warning">
                      ⚠️ Content warnings: {scenario.content_warnings.join(', ')}
                    </div>
                  )}
                </header>

                <div className="scenario-context" role="region" aria-labelledby="context-heading">
                  <h3 id="context-heading" className="sr-only">Scenario Context</h3>
                  <p>{scenario?.context}</p>
                </div>

                <fieldset className="voting-options" role="radiogroup" aria-labelledby="voting-heading" aria-required="true">
                  <legend id="voting-heading" className="sr-only">Choose your response to the trolley problem</legend>
                  
                  <button
                    ref={pullButtonRef}
                    className={`vote-button pull-lever ${myVote === 'pull' ? 'selected' : ''}`}
                    onClick={() => handleVote('pull')}
                    disabled={hasVoted}
                    role="radio"
                    aria-checked={myVote === 'pull'}
                    aria-describedby="pull-description"
                    aria-label="Pull lever to use AI option"
                    data-keyboard-focus={keyboardFocusMode && selectedVoteIndex === 0}
                  >
                    <div className="vote-icon" aria-hidden="true">🔄</div>
                    <div className="vote-label">Pull Lever</div>
                    <div className="vote-description" id="pull-description">{scenario?.ai_option}</div>
                  </button>

                  <button
                    ref={dontPullButtonRef}
                    className={`vote-button dont-pull ${myVote === 'dont_pull' ? 'selected' : ''}`}
                    onClick={() => handleVote('dont_pull')}
                    disabled={hasVoted}
                    role="radio"
                    aria-checked={myVote === 'dont_pull'}
                    aria-describedby="dont-pull-description"
                    aria-label="Don't pull lever to use human option"
                    data-keyboard-focus={keyboardFocusMode && selectedVoteIndex === 1}
                  >
                    <div className="vote-icon" aria-hidden="true">🛑</div>
                    <div className="vote-label">Don't Pull</div>
                    <div className="vote-description" id="dont-pull-description">{scenario?.non_ai_option}</div>
                  </button>
                </fieldset>

                {!hasVoted && (
                  <div className="rationale-input" role="region" aria-labelledby="rationale-heading">
                    <label htmlFor="rationale" id="rationale-heading">
                      Why? (optional, max 80 characters)
                    </label>
                    <input
                      id="rationale"
                      type="text"
                      value={rationale}
                      onChange={(e) => {
                        console.log('🖊️ Rationale input changed:', e.target.value);
                        setRationale(e.target.value);
                      }}
                      maxLength={80}
                      placeholder="Brief explanation of your choice..."
                      aria-describedby="char-count rationale-help"
                      autoComplete="off"
                    />
                    <div id="rationale-help" className="sr-only">
                      Enter a brief explanation for your voting choice. This is optional and will be used anonymously in the word cloud.
                    </div>
                    <div className="char-count" id="char-count" aria-live="polite">
                      {rationale.length}/80
                      <span className="sr-only"> characters used</span>
                    </div>
                    {moderationMessage && (
                      <div className="moderation-message" role="alert" aria-live="assertive">
                        ⚠️ {moderationMessage}
                      </div>
                    )}
                  </div>
                )}

                {hasVoted && (
                  <div className="vote-confirmation" role="status" aria-live="polite">
                    <p>
                      <span aria-hidden="true">✅</span>
                      <span className="sr-only">Success: </span>
                      Vote submitted! You chose to <strong>{myVote === 'pull' ? 'Pull the Lever' : 'Not Pull'}</strong>
                    </p>
                    {myRationale && <p>Your reasoning: "{myRationale}"</p>}
                  </div>
                )}
              </div>

              <aside className="word-clouds-container" role="complementary" aria-labelledby="live-reasoning-heading">
                <h3 id="live-reasoning-heading">Live Reasoning</h3>
                <div className="cloud-container">
                  <section className="cloud-section" aria-labelledby="pull-cloud-heading">
                    <h4 id="pull-cloud-heading" className="pull-title">Pull Lever</h4>
                    <WordCloud 
                      words={pullWords}
                      width={280}
                      height={180}
                      type="pull"
                      className="word-cloud-component"
                    />
                  </section>
                  
                  <section className="cloud-section" aria-labelledby="dont-pull-cloud-heading">
                    <h4 id="dont-pull-cloud-heading" className="dont-pull-title">Don't Pull</h4>
                    <WordCloud 
                      words={dontPullWords}
                      width={280}
                      height={180}
                      type="dont_pull"
                      className="word-cloud-component"
                    />
                  </section>
                </div>
              </aside>
            </div>
          </section>
        ) : (
          <section className="results-phase" aria-labelledby="results-heading">
            <h2 id="results-heading">Results</h2>
            <div className="results-summary" role="region" aria-labelledby="results-heading">
              <div className="vote-tally" role="table" aria-label="Vote count results">
                <div className="tally-item pull" role="cell">
                  <span className="count" aria-label="3 votes">3</span>
                  <span className="label">Pull Lever</span>
                </div>
                <div className="tally-item dont-pull" role="cell">
                  <span className="count" aria-label="2 votes">2</span>
                  <span className="label">Don't Pull</span>
                </div>
              </div>
              
              <div className="decision" role="status" aria-live="polite">
                <h3>The group chose to <strong>Pull the Lever</strong></h3>
                <p>The trolley goes to the AI track</p>
              </div>

              <div className="trolley-animation" role="img" aria-label="Animated trolley moving to the chosen track">
                <div className="trolley" aria-hidden="true">🚂</div>
                <div className="tracks" role="presentation">
                  <div className="track ai-track active" aria-label="AI Track - chosen path">AI Track</div>
                  <div className="track human-track" aria-label="Human Track - not chosen">Human Track</div>
                </div>
              </div>
            </div>

            {isFacilitator && (
              <nav className="facilitator-controls" aria-label="Facilitator game controls">
                <button 
                  className="next-scenario-button"
                  onClick={handleNextScenario}
                  aria-describedby="next-action-desc"
                >
                  {currentScenarioIndex < mockScenarios.length - 1 ? 'Next Scenario' : 'End Game'}
                </button>
                <div id="next-action-desc" className="sr-only">
                  {currentScenarioIndex < mockScenarios.length - 1 
                    ? 'Proceed to the next scenario in the game'
                    : 'End the current game session'
                  }
                </div>
              </nav>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default GameRoom;