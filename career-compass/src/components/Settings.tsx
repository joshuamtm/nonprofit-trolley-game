import React, { useState } from 'react';
import { UserData, CareerPath } from '../types';

interface SettingsProps {
  userData: UserData;
  onUpdate: (data: Partial<UserData>) => void;
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ userData, onUpdate, onReset }) => {
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [pathForm, setPathForm] = useState<Partial<CareerPath>>({});
  
  const handleFinancialUpdate = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    onUpdate({
      financialMetrics: {
        ...userData.financialMetrics,
        [field]: numValue
      }
    });
  };
  
  const handlePatternUpdate = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    onUpdate({
      patternMetrics: {
        ...userData.patternMetrics,
        [field]: numValue
      }
    });
  };
  
  const startEditPath = (path: CareerPath) => {
    setEditingPath(path.id);
    setPathForm(path);
  };
  
  const savePathEdit = () => {
    if (editingPath && pathForm) {
      const updatedPaths = userData.careerPaths.map(path =>
        path.id === editingPath ? { ...path, ...pathForm } : path
      );
      onUpdate({ careerPaths: updatedPaths });
      setEditingPath(null);
      setPathForm({});
    }
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Metrics</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Monthly Income
              </label>
              <input
                type="number"
                value={userData.financialMetrics.currentMonthlyIncome}
                onChange={(e) => handleFinancialUpdate('currentMonthlyIncome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Obligations
              </label>
              <input
                type="number"
                value={userData.financialMetrics.monthlyObligations}
                onChange={(e) => handleFinancialUpdate('monthlyObligations', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Savings Runway (months)
              </label>
              <input
                type="number"
                value={userData.financialMetrics.savingsRunway}
                onChange={(e) => handleFinancialUpdate('savingsRunway', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Monthly Income
              </label>
              <input
                type="number"
                value={userData.financialMetrics.targetIncome}
                onChange={(e) => handleFinancialUpdate('targetIncome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Pattern Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pattern Metrics</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days Since Executive Engagement
              </label>
              <input
                type="number"
                value={userData.patternMetrics.daysSinceExecutiveEngagement}
                onChange={(e) => handlePatternUpdate('daysSinceExecutiveEngagement', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frustration Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={userData.patternMetrics.frustrationLevel}
                onChange={(e) => handlePatternUpdate('frustrationLevel', e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span className="font-bold">{userData.patternMetrics.frustrationLevel}</span>
                <span>High</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engagement Score (0-100)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={userData.patternMetrics.engagementScore}
                onChange={(e) => handlePatternUpdate('engagementScore', e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Disengaged</span>
                <span className="font-bold">{userData.patternMetrics.engagementScore}%</span>
                <span>Engaged</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days at 60% Capacity
              </label>
              <input
                type="number"
                value={userData.patternMetrics.daysAt60Percent}
                onChange={(e) => handlePatternUpdate('daysAt60Percent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Career Paths */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Career Path Confidence Levels</h2>
        
        <div className="space-y-3">
          {userData.careerPaths.map(path => (
            <div key={path.id} className="border rounded-lg p-4">
              {editingPath === path.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={pathForm.name || ''}
                    onChange={(e) => setPathForm({ ...pathForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="text-sm">Confidence (1-10)</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={pathForm.confidenceLevel || 5}
                        onChange={(e) => setPathForm({ ...pathForm, confidenceLevel: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <span className="font-bold">{pathForm.confidenceLevel}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={savePathEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPath(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{path.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${path.confidenceLevel * 10}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{path.confidenceLevel}/10</span>
                    </div>
                  </div>
                  <button
                    onClick={() => startEditPath(path)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Data Management */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              Your data is automatically saved locally in your browser. 
              It will persist between sessions.
            </p>
            <p className="text-xs text-gray-500">
              Last updated: {new Date(userData.lastUpdated).toLocaleString()}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data to defaults?')) {
                  onReset();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reset to Defaults
            </button>
            
            <button
              onClick={() => {
                const dataStr = JSON.stringify(userData, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `career-compass-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;