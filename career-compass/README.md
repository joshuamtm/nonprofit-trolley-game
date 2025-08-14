# Career Compass Dashboard

A comprehensive career decision support system designed to help IT professionals navigate career transitions while monitoring engagement patterns and maintaining focus on strategic career development.

## Overview

Career Compass Dashboard is a React-based web application built specifically to support career decision-making for experienced IT professionals facing transition periods. The application provides a structured approach to evaluating multiple career paths, tracking daily progress, monitoring financial implications, and identifying historical engagement patterns that might affect career decisions.

## Key Features

### 🎯 Decision Central
- **Multi-Path Comparison**: Visual comparison of up to 5 career paths with comprehensive scoring
- **Radar Chart Analysis**: Five-dimensional evaluation (Financial, Market, Skills, Network, Family alignment)
- **Implementation Timeline**: Clear visualization of time-to-implementation for each path
- **Progress Tracking**: Real-time monitoring of decision-making progress

### 📊 Financial Dashboard
- **Income Projection**: Six-month income forecasting for each career path
- **Runway Analysis**: Savings runway calculation and financial gap assessment
- **Risk Assessment**: Financial readiness scoring for career transitions
- **Target vs. Current**: Clear visualization of income gaps and financial goals

### ✅ Daily Action Mode
- **Priority-Based Tasks**: MoSCoW prioritization (Must/Should/Nice-to-have)
- **Time Estimation**: Built-in time tracking for better planning
- **Category Organization**: Actions organized by networking, skills, applications, research, internal, and financial categories
- **Streak Tracking**: Maintain momentum with action completion streaks

### 📈 Progress Tracking
- **Engagement Metrics**: Monitor 4-year disengagement pattern indicators
- **Completion Rates**: Track task completion and momentum
- **Confidence Trending**: Historical confidence level tracking
- **Pattern Recognition**: Early warning system for engagement drops

### ⚙️ Settings & Customization
- **Data Management**: Export/import functionality for data portability
- **Reset Options**: Clean slate functionality for new planning cycles
- **Profile Management**: Personal and role customization

## Target User Profile

This application was designed for **Clark**, a 60-year-old IT Director with:
- 30+ years of IT experience
- History of 4-year engagement cycles in roles
- Current role satisfaction challenges
- Multiple potential career transition options
- Need for structured decision-making support

The application is equally suitable for any experienced professional facing similar career transition decisions.

## Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/career-compass.git

# Navigate to project directory
cd career-compass

# Install dependencies
npm install

# Start development server
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Production Build
```bash
# Create optimized production build
npm run build

# The build folder will contain the production-ready application
```

## Usage Guide

### Getting Started
1. **Initial Setup**: Launch the application and navigate through the default data
2. **Career Path Definition**: Use the Settings page to define your specific career paths
3. **Daily Planning**: Add daily actions in the Daily Action Mode
4. **Regular Review**: Monitor progress through the Progress tracking page
5. **Financial Planning**: Use the Financial Dashboard for transition planning

### Data Flow
- All data is stored locally in browser localStorage
- Data persists between sessions
- Export functionality available for backup
- Reset functionality for clean starts

### Navigation
- **Home (Decision Central)**: Primary dashboard with career path comparison
- **Daily**: Task management and daily action tracking
- **Financial**: Financial analysis and planning tools
- **Progress**: Historical tracking and pattern analysis
- **Settings**: Configuration and data management

## Technical Details

### Technology Stack
- **Frontend**: React 19.1.1 with TypeScript
- **Styling**: Tailwind CSS 4.1.11
- **Charts**: Recharts 3.1.2 for data visualization
- **Routing**: React Router DOM 7.8.0
- **Date Handling**: date-fns 4.1.0
- **Testing**: Jest with React Testing Library

### Architecture
- Component-based architecture with clear separation of concerns
- TypeScript interfaces for type safety
- Local storage utilities for data persistence
- Responsive design with mobile-first approach

### Project Structure
```
src/
├── components/          # React components
│   ├── DecisionCentral.tsx
│   ├── DailyActionMode.tsx
│   ├── FinancialDashboard.tsx
│   ├── Navigation.tsx
│   ├── Progress.tsx
│   └── Settings.tsx
├── data/               # Initial data and configurations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx            # Main application component
```

### Data Models
- **CareerPath**: Complete career option with scoring metrics
- **DailyAction**: Task management with priority and categorization
- **PatternMetrics**: Engagement pattern tracking
- **FinancialMetrics**: Financial planning and analysis
- **ProgressMetrics**: Historical progress tracking

## Customization Options

### Adding New Career Paths
Career paths can be added through the Settings interface with the following attributes:
- Name and description
- Financial projections
- Implementation timeline
- Confidence scoring
- Multi-dimensional readiness assessment

### Modifying Action Categories
Action categories can be customized in the type definitions:
- networking
- skill
- application
- research
- internal
- financial

### Pattern Metrics Configuration
Engagement pattern tracking can be customized by modifying:
- Engagement score thresholds
- Pattern recognition triggers
- Alert configurations

## Development

### Available Scripts
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Eject (one-way operation)
npm run eject
```

### Contributing Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration with React rules
- Component-based architecture
- Responsive design principles
- Accessibility considerations

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations
- Local storage for data persistence (no server dependencies)
- Optimized bundle size with code splitting
- Responsive images and lazy loading
- Efficient re-rendering with React hooks

## Security & Privacy
- All data stored locally in browser
- No external API calls for user data
- No tracking or analytics by default
- Data export capability for user control

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or feature requests:
1. Check the [Issues](https://github.com/yourusername/career-compass/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs
4. Provide use case details for feature requests

## Acknowledgments

- Built with Create React App
- UI components inspired by modern dashboard design patterns
- Data visualization powered by Recharts
- Styling framework: Tailwind CSS

---

**Note**: This application is designed as a personal career planning tool. While it provides structured decision-making support, professional career counseling is recommended for significant career transitions.
