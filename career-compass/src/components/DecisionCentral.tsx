import React from 'react';
import { CareerPath, PatternMetrics, FinancialMetrics } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from 'recharts';

interface DecisionCentralProps {
  careerPaths: CareerPath[];
  patternMetrics: PatternMetrics;
  financialMetrics: FinancialMetrics;
  weeklyQuestion: string;
  criticalExperiment: string;
  decisionProgress: number;
}

const DecisionCentral: React.FC<DecisionCentralProps> = ({
  careerPaths,
  patternMetrics,
  financialMetrics,
  weeklyQuestion,
  criticalExperiment,
  decisionProgress
}) => {
  // Prepare data for bar chart
  const pathComparisonData = careerPaths.map(path => ({
    name: path.name.split(' ')[0], // Shortened name for chart
    income: path.sixMonthIncome / 1000, // in thousands
    weeks: path.timeToImplementation,
    confidence: path.confidenceLevel * 10,
    fit: path.fitScore
  }));

  // Prepare data for radar chart
  const currentPath = careerPaths[0]; // Assuming first path is being evaluated
  const radarData = [
    { metric: 'Financial', value: currentPath.financialReadiness },
    { metric: 'Market', value: currentPath.marketTiming },
    { metric: 'Skills', value: currentPath.skillReadiness },
    { metric: 'Network', value: currentPath.networkStrength },
    { metric: 'Family', value: currentPath.familyAlignment }
  ];

  const getStatusColor = (value: number, threshold: number) => {
    if (value < threshold * 0.5) return 'text-red-600';
    if (value < threshold * 0.8) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Decision Central</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Path Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Path Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pathComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#3B82F6" name="Income (K)" />
              <Bar dataKey="fit" fill="#10B981" name="Fit Score" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {careerPaths.map(path => (
              <div key={path.id} className="border-l-4 border-blue-500 pl-3 py-1">
                <div className="font-medium text-sm">{path.name}</div>
                <div className="text-xs text-gray-600">
                  ${path.sixMonthIncome.toLocaleString()}/year • {path.timeToImplementation} weeks
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - This Week's Reality Check */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">This Week's Reality Check</h2>
          
          {/* Current Status Box */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-2">Current Status</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Days at 60% capacity:</span>
                <span className={getStatusColor(patternMetrics.daysAt60Percent, 90)}>
                  {patternMetrics.daysAt60Percent}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monthly income gap:</span>
                <span className="text-red-600">
                  -${Math.abs(financialMetrics.incomeGap).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Savings runway:</span>
                <span className={getStatusColor(financialMetrics.savingsRunway, 12)}>
                  {financialMetrics.savingsRunway} months
                </span>
              </div>
            </div>
          </div>

          {/* Decision Momentum */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Decision Momentum</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${decisionProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">{decisionProgress}% closer to decision</p>
          </div>

          {/* Key Question */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Key Question This Week</h3>
            <p className="text-sm text-gray-700 italic">{weeklyQuestion}</p>
          </div>

          {/* Critical Experiment */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
            <h3 className="font-medium text-blue-900 mb-1">Critical Experiment</h3>
            <p className="text-sm text-blue-800">{criticalExperiment}</p>
          </div>
        </div>

        {/* Right Panel - Risk & Readiness Radar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Risk & Readiness Radar</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 5]} />
              <Radar 
                name="Readiness" 
                dataKey="value" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6} 
              />
            </RadarChart>
          </ResponsiveContainer>
          
          {/* Pattern Alert */}
          {patternMetrics.daysSinceExecutiveEngagement > 14 && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3">
              <h3 className="font-medium text-yellow-900 mb-1">Pattern Alert</h3>
              <p className="text-sm text-yellow-800">
                {patternMetrics.daysSinceExecutiveEngagement} days since executive engagement.
                Risk of entering frustration cycle.
              </p>
            </div>
          )}
          
          {/* Engagement Score */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Engagement Score</span>
              <span className="text-sm font-bold">{patternMetrics.engagementScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  patternMetrics.engagementScore < 40 ? 'bg-red-500' :
                  patternMetrics.engagementScore < 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${patternMetrics.engagementScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionCentral;