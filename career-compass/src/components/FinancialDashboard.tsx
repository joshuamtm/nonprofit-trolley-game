import React from 'react';
import { CareerPath, FinancialMetrics } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

interface FinancialDashboardProps {
  careerPaths: CareerPath[];
  financialMetrics: FinancialMetrics;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  careerPaths,
  financialMetrics
}) => {
  // Generate 6-month projection data for each path
  const generateProjectionData = () => {
    const months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
    return months.map((month, index) => {
      const dataPoint: any = { month };
      
      careerPaths.forEach(path => {
        // Calculate ramp-up based on implementation time
        const rampUpMonths = Math.ceil(path.timeToImplementation / 4);
        let monthlyIncome;
        
        if (index < rampUpMonths) {
          // During ramp-up, gradually increase from current to target
          const progress = (index + 1) / rampUpMonths;
          monthlyIncome = financialMetrics.currentMonthlyIncome + 
            (path.sixMonthIncome / 12 - financialMetrics.currentMonthlyIncome) * progress;
        } else {
          // After ramp-up, full income
          monthlyIncome = path.sixMonthIncome / 12;
        }
        
        dataPoint[path.id] = Math.round(monthlyIncome);
      });
      
      return dataPoint;
    });
  };

  const projectionData = generateProjectionData();

  // Calculate transition costs for each path
  const transitionCosts = careerPaths.map(path => {
    let costs = 0;
    let investments = [];
    
    if (path.id === 'external-employment') {
      costs = 2000; // Job search costs
      investments.push('Resume services, networking events');
    } else if (path.id === 'fractional-consulting') {
      costs = 5000; // Business setup, marketing
      investments.push('Website, LLC formation, marketing');
    } else if (path.id === 'teaching-nonprofit') {
      costs = 3000; // Certifications, training
      investments.push('Certifications, course development');
    } else if (path.id === 'hybrid-phi-consulting') {
      costs = 2500; // Minimal setup costs
      investments.push('Basic business setup, tools');
    }
    
    return {
      path: path.name,
      costs,
      investments: investments.join(', '),
      paybackPeriod: costs > 0 ? Math.ceil(costs / (path.sixMonthIncome / 12 - financialMetrics.currentMonthlyIncome)) : 0
    };
  });

  const getColorForPath = (pathId: string) => {
    const colors: { [key: string]: string } = {
      'current-optimized': '#3B82F6',
      'external-employment': '#10B981',
      'fractional-consulting': '#F59E0B',
      'hybrid-phi-consulting': '#8B5CF6',
      'teaching-nonprofit': '#EF4444'
    };
    return colors[pathId] || '#6B7280';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Financial Reality Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current State */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          
          <div className="space-y-4">
            <div className="border-b pb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Monthly Income (60%)</span>
                <span className="font-semibold">${financialMetrics.currentMonthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Monthly Obligations</span>
                <span className="font-semibold">${financialMetrics.monthlyObligations.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Gap</span>
                <span className="font-semibold text-red-600">
                  -${Math.abs(financialMetrics.incomeGap).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-yellow-900">Savings Runway</span>
                <span className="text-2xl font-bold text-yellow-900">
                  {financialMetrics.savingsRunway}
                </span>
              </div>
              <div className="text-sm text-yellow-700">months remaining</div>
              <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${Math.min((financialMetrics.savingsRunway / 12) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-700 mb-1">Target Monthly Income</div>
              <div className="text-2xl font-bold text-blue-900">
                ${financialMetrics.targetIncome.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Gap to target: ${(financialMetrics.targetIncome - financialMetrics.currentMonthlyIncome).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Path Projections */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">6-Month Income Projections</h2>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <ReferenceLine 
                y={financialMetrics.monthlyObligations} 
                stroke="red" 
                strokeDasharray="3 3"
                label="Monthly Obligations"
              />
              {careerPaths.map(path => (
                <Line
                  key={path.id}
                  type="monotone"
                  dataKey={path.id}
                  stroke={getColorForPath(path.id)}
                  name={path.name.split('(')[0].trim()}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            <h3 className="font-medium text-sm">Break-even Points</h3>
            {careerPaths.map(path => {
              const monthlyTarget = path.sixMonthIncome / 12;
              const breaksEven = monthlyTarget >= financialMetrics.monthlyObligations;
              const weeksToBreakeven = breaksEven ? path.timeToImplementation : 'Never';
              
              return (
                <div key={path.id} className="flex justify-between text-xs">
                  <span className="text-gray-600">{path.name.split('(')[0].trim()}</span>
                  <span className={breaksEven ? 'text-green-600' : 'text-red-600'}>
                    {weeksToBreakeven === 'Never' ? 'Below obligations' : `${weeksToBreakeven} weeks`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transition Budget */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Transition Budget</h2>
          
          <div className="space-y-3">
            {transitionCosts.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <h3 className="font-medium text-sm mb-1">{item.path}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">One-time costs</span>
                    <span className="font-medium">${item.costs.toLocaleString()}</span>
                  </div>
                  {item.investments && (
                    <div className="text-xs text-gray-500">
                      {item.investments}
                    </div>
                  )}
                  {item.paybackPeriod > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Payback period</span>
                      <span className="font-medium">{item.paybackPeriod} months</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <h3 className="font-medium text-sm mb-2">Minimum Viable Income</h3>
            <div className="text-2xl font-bold text-gray-800">
              ${financialMetrics.monthlyObligations.toLocaleString()}/mo
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Any path must reach this threshold to be sustainable
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-sm text-blue-900 mb-1">Recommendation</h3>
            <p className="text-xs text-blue-700">
              The Hybrid approach offers the best risk-adjusted transition, 
              maintaining base income while building additional revenue streams.
            </p>
          </div>
        </div>
      </div>
      
      {/* Financial Warning */}
      {financialMetrics.savingsRunway < 6 && (
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-red-600 text-xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-900">Urgent Financial Decision Required</h3>
              <p className="text-sm text-red-700 mt-1">
                With only {financialMetrics.savingsRunway} months of runway remaining, 
                you need to make a career path decision within the next 4 weeks to allow 
                adequate time for implementation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;