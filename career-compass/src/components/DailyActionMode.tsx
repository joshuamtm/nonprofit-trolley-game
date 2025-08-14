import React, { useState } from 'react';
import { DailyAction, PatternMetrics, QuickWin } from '../types';
import { format } from 'date-fns';

interface DailyActionModeProps {
  dailyActions: DailyAction[];
  patternMetrics: PatternMetrics;
  onActionComplete: (actionId: string) => void;
  onQuickWinComplete: (winId: string) => void;
}

const DailyActionMode: React.FC<DailyActionModeProps> = ({
  dailyActions,
  patternMetrics,
  onActionComplete,
  onQuickWinComplete
}) => {
  const [morningPrompt] = useState("How can you demonstrate unique value in your current role today while exploring future options?");
  
  const quickWins: QuickWin[] = [
    {
      id: 'qw1',
      title: 'Update LinkedIn headline',
      timeEstimate: 5,
      impact: 'medium',
      category: 'networking',
      completed: false
    },
    {
      id: 'qw2',
      title: 'Message one strategic contact',
      timeEstimate: 10,
      impact: 'high',
      category: 'networking',
      completed: false
    },
    {
      id: 'qw3',
      title: 'Complete AI course module',
      timeEstimate: 30,
      impact: 'high',
      category: 'skill',
      completed: false
    }
  ];

  const todayActions = dailyActions.filter(action => 
    format(new Date(action.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const mustDoActions = todayActions.filter(a => a.priority === 'must' && !a.completed);
  const shouldDoActions = todayActions.filter(a => a.priority === 'should' && !a.completed);
  const niceToDoActions = todayActions.filter(a => a.priority === 'nice' && !a.completed);

  const getEngagementColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getEngagementMessage = () => {
    if (patternMetrics.engagementScore < 40) {
      return {
        level: 'Critical',
        message: 'Disengagement pattern detected. Immediate intervention required.',
        color: 'text-red-700 bg-red-50'
      };
    }
    if (patternMetrics.engagementScore < 70) {
      return {
        level: 'Warning',
        message: 'Engagement declining. Take proactive steps today.',
        color: 'text-yellow-700 bg-yellow-50'
      };
    }
    return {
      level: 'Healthy',
      message: 'Good engagement level. Maintain momentum.',
      color: 'text-green-700 bg-green-50'
    };
  };

  const engagement = getEngagementMessage();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Daily Action Mode</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Mission Control */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Mission Control</h2>
          
          {/* Morning Prompt */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">Morning Reflection</h3>
            <p className="text-sm text-blue-800 italic">{morningPrompt}</p>
          </div>

          {/* Three Actions for Today */}
          <div className="space-y-3">
            {mustDoActions.length > 0 && (
              <div>
                <h3 className="font-medium text-red-700 mb-2">Must Do Today</h3>
                {mustDoActions.map(action => (
                  <div key={action.id} className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.description}</p>
                      <p className="text-xs text-gray-600">{action.timeEstimate} min</p>
                    </div>
                    <button
                      onClick={() => onActionComplete(action.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                    >
                      Complete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {shouldDoActions.length > 0 && (
              <div>
                <h3 className="font-medium text-yellow-700 mb-2">Should Do</h3>
                {shouldDoActions.map(action => (
                  <div key={action.id} className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.description}</p>
                      <p className="text-xs text-gray-600">{action.timeEstimate} min</p>
                    </div>
                    <button
                      onClick={() => onActionComplete(action.id)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700"
                    >
                      Complete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {niceToDoActions.length > 0 && (
              <div>
                <h3 className="font-medium text-green-700 mb-2">Nice to Do</h3>
                {niceToDoActions.map(action => (
                  <div key={action.id} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.description}</p>
                      <p className="text-xs text-gray-600">{action.timeEstimate} min</p>
                    </div>
                    <button
                      onClick={() => onActionComplete(action.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                    >
                      Complete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {todayActions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No actions scheduled for today.</p>
                <p className="text-sm mt-2">Add actions to get started!</p>
              </div>
            )}
          </div>

          {/* Quick Wins */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Quick Wins Available</h3>
            <div className="space-y-2">
              {quickWins.map(win => (
                <div key={win.id} className="flex items-center justify-between border border-gray-200 p-2 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{win.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{win.timeEstimate} min</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        win.impact === 'high' ? 'bg-red-100 text-red-700' :
                        win.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {win.impact} impact
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onQuickWinComplete(win.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Do Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern Breaker Alert System */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pattern Breaker Alert System</h2>
          
          {/* Engagement Thermometer */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Engagement Thermometer</h3>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className={`h-8 rounded-full flex items-center justify-end pr-3 text-white font-bold transition-all duration-500 ${getEngagementColor(patternMetrics.engagementScore)}`}
                  style={{ width: `${patternMetrics.engagementScore}%` }}
                >
                  {patternMetrics.engagementScore}%
                </div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Disengaged</span>
                <span>Engaged</span>
              </div>
            </div>
            <div className={`mt-3 p-3 rounded-lg ${engagement.color}`}>
              <p className="font-medium">{engagement.level}</p>
              <p className="text-sm">{engagement.message}</p>
            </div>
          </div>

          {/* Warning Triggers */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Warning Triggers</h3>
            <div className="space-y-2">
              {patternMetrics.daysSinceExecutiveEngagement > 14 && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-700">
                      {patternMetrics.daysSinceExecutiveEngagement} days since executive check-in
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Schedule a meeting this week to maintain influence
                    </p>
                  </div>
                </div>
              )}
              
              {patternMetrics.frustrationLevel > 6 && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-600">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-700">
                      Frustration level elevated ({patternMetrics.frustrationLevel}/10)
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Focus on controllable actions and small wins
                    </p>
                  </div>
                </div>
              )}
              
              {patternMetrics.influenceAttempts < 3 && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-600">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-700">
                      Low influence activity this month
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Present an idea or proposal to leadership
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Intervention Prompt */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Today's Pattern Breaker</h3>
            <p className="text-sm text-blue-800 mb-3">
              Break the cycle with this specific action:
            </p>
            <div className="bg-white rounded-lg p-3">
              <p className="font-medium text-sm">
                Send a strategic email to your executive director
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Share one concrete improvement idea with ROI analysis
              </p>
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700">
                Mark as Complete
              </button>
            </div>
          </div>

          {/* Historical Pattern Note */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Remember:</strong> You're at year 4-5 in your current role. 
              This is typically when your engagement drops. 
              Breaking this pattern is critical for any career path you choose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyActionMode;