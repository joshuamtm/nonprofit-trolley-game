import React from 'react';
import { ProgressMetrics, DailyAction } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressProps {
  progressMetrics: ProgressMetrics;
  dailyActions: DailyAction[];
}

const Progress: React.FC<ProgressProps> = ({ progressMetrics, dailyActions }) => {
  const confidenceData = progressMetrics.confidenceTrending.map((value, index) => ({
    week: `Week ${index + 1}`,
    confidence: value
  }));

  const completedActions = dailyActions.filter(a => a.completed).length;
  const totalActions = dailyActions.length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Progress & Accountability</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Decision Progress</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-2xl font-bold">{progressMetrics.decisionProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressMetrics.decisionProgress}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Experiments Completed</span>
              <span className="font-semibold">{progressMetrics.experimentsCompleted}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Information Gathered</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
                <span className="text-xs text-gray-600">65%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Next Milestone:</strong> Complete financial analysis for top 2 paths
            </p>
          </div>
        </div>

        {/* Action Velocity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Action Velocity</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {progressMetrics.actionStreak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {progressMetrics.completionRate}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Actions Completed</span>
              <span>{completedActions} / {totalActions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${totalActions > 0 ? (completedActions / totalActions) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">This Week</span>
              <span className="font-medium">12 actions</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Week</span>
              <span className="font-medium">8 actions</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Trend</span>
              <span className="font-medium text-green-600">↑ 50%</span>
            </div>
          </div>
        </div>

        {/* Confidence Trending */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Confidence Trending</h2>
          
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Confidence</span>
              <span className="text-xl font-bold">
                {progressMetrics.confidenceTrending[progressMetrics.confidenceTrending.length - 1]}/10
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Your confidence has been steadily increasing. Keep maintaining momentum!
            </p>
          </div>
        </div>
      </div>
      
      {/* Achievement Badges */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm font-medium">Week 1 Complete</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-sm font-medium">Data Driven</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">🔄</div>
            <div className="text-sm font-medium">Pattern Breaker</div>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-lg opacity-50">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-sm font-medium text-gray-400">Decision Maker</div>
            <div className="text-xs text-gray-400">Locked</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;