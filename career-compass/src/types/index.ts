// Career Path Types
export interface CareerPath {
  id: string;
  name: string;
  description: string;
  sixMonthIncome: number;
  timeToImplementation: number; // in weeks
  confidenceLevel: number; // 1-10
  fitScore: number; // calculated
  financialReadiness: number; // 1-5
  marketTiming: number; // 1-5
  skillReadiness: number; // 1-5
  networkStrength: number; // 1-5
  familyAlignment: number; // 1-5
  pros: string[];
  cons: string[];
  nextSteps: string[];
}

// Daily Action Types
export interface DailyAction {
  id: string;
  date: Date;
  priority: 'must' | 'should' | 'nice';
  description: string;
  timeEstimate: number; // in minutes
  completed: boolean;
  pathId?: string;
  category: 'networking' | 'skill' | 'application' | 'research' | 'internal' | 'financial';
}

// Pattern Tracking
export interface PatternMetrics {
  daysSinceExecutiveEngagement: number;
  frustrationLevel: number; // 1-10
  influenceAttempts: number;
  upwardCommunicationFrequency: number;
  daysAt60Percent: number;
  engagementScore: number; // 1-100
}

// Financial Metrics
export interface FinancialMetrics {
  currentMonthlyIncome: number;
  monthlyObligations: number;
  savingsRunway: number; // in months
  incomeGap: number;
  targetIncome: number;
}

// Progress Tracking
export interface ProgressMetrics {
  decisionProgress: number; // percentage
  experimentsCompleted: number;
  confidenceTrending: number[];
  actionStreak: number;
  completionRate: number;
}

// User Data
export interface UserData {
  name: string;
  currentRole: string;
  careerPaths: CareerPath[];
  dailyActions: DailyAction[];
  patternMetrics: PatternMetrics;
  financialMetrics: FinancialMetrics;
  progressMetrics: ProgressMetrics;
  weeklyQuestion: string;
  criticalExperiment: string;
  lastUpdated: Date;
}

// Quick Win Types
export interface QuickWin {
  id: string;
  title: string;
  timeEstimate: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
}

// Alert Types
export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  message: string;
  action?: string;
  timestamp: Date;
}