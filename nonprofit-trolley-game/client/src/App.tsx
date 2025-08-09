import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import FacilitatorPage from './components/FacilitatorPage';
import ParticipantPage from './components/ParticipantPage';
import GameRoom from './components/GameRoom';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/facilitator" element={<FacilitatorPage />} />
            <Route path="/join/:roomCode?" element={<ParticipantPage />} />
            <Route path="/room/:roomCode" element={<GameRoom />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
