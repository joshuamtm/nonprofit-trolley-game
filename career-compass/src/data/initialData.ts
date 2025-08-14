import { UserData, CareerPath } from '../types';

export const careerPaths: CareerPath[] = [
  {
    id: 'current-optimized',
    name: 'Current Role (Optimized)',
    description: 'Transform current role into fulfilling, full-time position',
    sixMonthIncome: 120000, // Assuming return to 100%
    timeToImplementation: 4,
    confidenceLevel: 6,
    fitScore: 65,
    financialReadiness: 4,
    marketTiming: 3,
    skillReadiness: 5,
    networkStrength: 3,
    familyAlignment: 4,
    pros: [
      'Familiar environment',
      'Existing relationships',
      'Known systems and processes',
      'Immediate income stability if successful'
    ],
    cons: [
      'Requires breaking 4-year pattern',
      'Depends on organizational funding',
      'Limited upward influence historically',
      'May perpetuate frustration cycle'
    ],
    nextSteps: [
      'Schedule meeting with executive leadership',
      'Develop business case for full-time return',
      'Document value contributions',
      'Create 90-day improvement plan'
    ]
  },
  {
    id: 'external-employment',
    name: 'External Employment',
    description: 'Find new full-time position with better fit and compensation',
    sixMonthIncome: 130000,
    timeToImplementation: 12,
    confidenceLevel: 5,
    fitScore: 60,
    financialReadiness: 3,
    marketTiming: 3,
    skillReadiness: 4,
    networkStrength: 2,
    familyAlignment: 3,
    pros: [
      'Fresh start opportunity',
      'Potential for higher compensation',
      'New learning environment',
      'Escape current frustrations'
    ],
    cons: [
      'Geographic constraints limit options',
      'Age bias in job market',
      'Risk of repeating 4-year pattern',
      'Lengthy job search process'
    ],
    nextSteps: [
      'Update resume and LinkedIn profile',
      'Identify target companies within commute radius',
      'Activate professional network',
      'Apply to 5 positions weekly'
    ]
  },
  {
    id: 'fractional-consulting',
    name: 'Fractional CTO/Consulting',
    description: 'Build consulting practice and fractional executive roles',
    sixMonthIncome: 90000,
    timeToImplementation: 8,
    confidenceLevel: 7,
    fitScore: 75,
    financialReadiness: 3,
    marketTiming: 4,
    skillReadiness: 5,
    networkStrength: 3,
    familyAlignment: 3,
    pros: [
      'Control over client relationships',
      'Higher hourly rates',
      'Flexible scheduling',
      'Multiple income streams',
      'Less organizational politics'
    ],
    cons: [
      'Income variability',
      'Need to build client base',
      'Business development required',
      'Benefits not included'
    ],
    nextSteps: [
      'Define service offerings',
      'Join fractional executive platforms',
      'Reach out to 3 potential clients',
      'Create consulting website'
    ]
  },
  {
    id: 'hybrid-phi-consulting',
    name: 'Hybrid (Current + Consulting)',
    description: 'Maintain current role while building consulting practice',
    sixMonthIncome: 105000,
    timeToImplementation: 4,
    confidenceLevel: 8,
    fitScore: 80,
    financialReadiness: 4,
    marketTiming: 4,
    skillReadiness: 5,
    networkStrength: 3,
    familyAlignment: 4,
    pros: [
      'Maintains income stability',
      'Low risk transition',
      'Time to build client base',
      'Tests consulting viability',
      'Gradual pattern breaking'
    ],
    cons: [
      'Time management challenges',
      'Potential conflicts of interest',
      'Energy split between roles',
      'Slower consulting growth'
    ],
    nextSteps: [
      'Clarify consulting boundaries with employer',
      'Identify non-competing client opportunities',
      'Dedicate 10 hours/week to consulting',
      'Launch first pilot project'
    ]
  },
  {
    id: 'teaching-nonprofit',
    name: 'Full Pivot (Teaching/Nonprofit)',
    description: 'Transition to education, training, or specialized nonprofit services',
    sixMonthIncome: 80000,
    timeToImplementation: 6,
    confidenceLevel: 6,
    fitScore: 70,
    financialReadiness: 2,
    marketTiming: 3,
    skillReadiness: 4,
    networkStrength: 2,
    familyAlignment: 3,
    pros: [
      'Mission-aligned work',
      'Less corporate politics',
      'Knowledge sharing focus',
      'Clear role boundaries',
      'Potential for impact'
    ],
    cons: [
      'Lower compensation initially',
      'New sector learning curve',
      'Limited immediate opportunities',
      'Credential requirements possible'
    ],
    nextSteps: [
      'Research local educational institutions',
      'Develop course proposals',
      'Connect with training companies',
      'Apply for adjunct positions'
    ]
  }
];

export const initialUserData: UserData = {
  name: 'Clark',
  currentRole: 'Director of IT (60% time)',
  careerPaths: careerPaths,
  dailyActions: [],
  patternMetrics: {
    daysSinceExecutiveEngagement: 21,
    frustrationLevel: 7,
    influenceAttempts: 2,
    upwardCommunicationFrequency: 1,
    daysAt60Percent: 45,
    engagementScore: 45
  },
  financialMetrics: {
    currentMonthlyIncome: 6000, // 60% of assumed $120k
    monthlyObligations: 8500,
    savingsRunway: 6,
    incomeGap: -2500,
    targetIncome: 10000
  },
  progressMetrics: {
    decisionProgress: 25,
    experimentsCompleted: 2,
    confidenceTrending: [4, 5, 5, 6],
    actionStreak: 0,
    completionRate: 0
  },
  weeklyQuestion: 'What specific value could you deliver that would justify returning to full-time?',
  criticalExperiment: 'Schedule and conduct a strategic conversation with your executive director about role expansion',
  lastUpdated: new Date()
};