# Overview

Your Paycheck Planner is a client-side web application designed to help users organize and plan their personal finances in a supportive, encouraging manner. The application guides users through a step-by-step process to allocate their paycheck across various expense categories including housing, utilities, food, transportation, and personal goals. The app emphasizes positive reinforcement and emotional support throughout the financial planning journey.

## Project Status
- **Completed**: August 15, 2025
- **Deployment Ready**: Configured for GitHub Pages deployment
- **Files Required**: index.html, styles.css, script.js

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a vanilla JavaScript single-page application (SPA) architecture with a page-based navigation system. The core design pattern implements:

- **State Management**: Centralized application state through a single `paycheckData` object that tracks all financial categories
- **Page Navigation**: Custom page transition system using CSS transforms and opacity changes for smooth user experience
- **Progressive Disclosure**: Step-by-step wizard interface that reveals information gradually to avoid overwhelming users

## User Interface Design
- **Responsive Layout**: Mobile-first design with a maximum container width of 600px for optimal mobile experience
- **Visual Feedback**: Progress bars and balance displays provide immediate feedback on financial allocation
- **Emotional Design**: Incorporates encouraging language, emojis, and supportive messaging throughout the user journey

## Data Flow Architecture
The application follows a simple unidirectional data flow:
1. User input captured through form elements
2. Data validated and parsed using utility functions
3. Application state updated in the central `paycheckData` object
4. UI updated to reflect new state and remaining balance calculations

## Client-Side Processing
All calculations and data processing happen entirely in the browser with no server communication required. This design choice provides:
- **Immediate Response**: No network latency for calculations
- **Privacy**: No financial data transmitted or stored externally
- **Offline Capability**: Application works without internet connection after initial load

# External Dependencies

## Frontend Libraries
- **Google Fonts**: Inter font family for typography consistency
- **Feather Icons**: Icon library for UI elements (CSS CDN)

## Browser APIs
- **Intl.NumberFormat**: Native browser API for currency formatting
- **DOM APIs**: Standard browser APIs for element manipulation and event handling

## Development Tools
The application requires only basic web technologies:
- HTML5 for structure
- CSS3 for styling and animations
- Vanilla JavaScript (ES6+) for functionality
- Modern browser with support for CSS Grid, Flexbox, and ES6 features