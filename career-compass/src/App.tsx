import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DecisionCentral from './components/DecisionCentral';
import DailyActionMode from './components/DailyActionMode';
import FinancialDashboard from './components/FinancialDashboard';
import Progress from './components/Progress';
import Settings from './components/Settings';
import { UserData, DailyAction } from './types';
import { loadUserData, saveUserData, clearUserData } from './utils/localStorage';
import { initialUserData } from './data/initialData';

function App() {
  const [userData, setUserData] = useState<UserData>(loadUserData());

  // Auto-save on changes
  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  // Add sample daily actions if none exist
  useEffect(() => {
    if (userData.dailyActions.length === 0) {
      const sampleActions: DailyAction[] = [
        {
          id: 'action1',
          date: new Date(),
          priority: 'must',
          description: 'Schedule meeting with executive director',
          timeEstimate: 30,
          completed: false,
          category: 'internal'
        },
        {
          id: 'action2',
          date: new Date(),
          priority: 'should',
          description: 'Update LinkedIn profile with recent achievements',
          timeEstimate: 20,
          completed: false,
          category: 'networking'
        },
        {
          id: 'action3',
          date: new Date(),
          priority: 'nice',
          description: 'Complete one AI course module',
          timeEstimate: 45,
          completed: false,
          category: 'skill'
        }
      ];
      
      setUserData(prev => ({
        ...prev,
        dailyActions: sampleActions
      }));
    }
  }, []);

  const handleActionComplete = (actionId: string) => {
    setUserData(prev => ({
      ...prev,
      dailyActions: prev.dailyActions.map(action =>
        action.id === actionId ? { ...action, completed: true } : action
      ),
      progressMetrics: {
        ...prev.progressMetrics,
        actionStreak: prev.progressMetrics.actionStreak + 1,
        completionRate: Math.min(100, prev.progressMetrics.completionRate + 5)
      }
    }));
  };

  const handleQuickWinComplete = (winId: string) => {
    // Handle quick win completion
    console.log('Quick win completed:', winId);
  };

  const handleUserDataUpdate = (updates: Partial<UserData>) => {
    setUserData(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date()
    }));
  };

  const handleReset = () => {
    clearUserData();
    setUserData(initialUserData);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route 
            path="/" 
            element={
              <DecisionCentral
                careerPaths={userData.careerPaths}
                patternMetrics={userData.patternMetrics}
                financialMetrics={userData.financialMetrics}
                weeklyQuestion={userData.weeklyQuestion}
                criticalExperiment={userData.criticalExperiment}
                decisionProgress={userData.progressMetrics.decisionProgress}
              />
            } 
          />
          <Route 
            path="/daily" 
            element={
              <DailyActionMode
                dailyActions={userData.dailyActions}
                patternMetrics={userData.patternMetrics}
                onActionComplete={handleActionComplete}
                onQuickWinComplete={handleQuickWinComplete}
              />
            } 
          />
          <Route 
            path="/financial" 
            element={
              <FinancialDashboard
                careerPaths={userData.careerPaths}
                financialMetrics={userData.financialMetrics}
              />
            } 
          />
          <Route 
            path="/progress" 
            element={
              <Progress
                progressMetrics={userData.progressMetrics}
                dailyActions={userData.dailyActions}
              />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Settings
                userData={userData}
                onUpdate={handleUserDataUpdate}
                onReset={handleReset}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;