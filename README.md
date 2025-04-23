### How to install and run 

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open the application in your browser (default: http://localhost:5173)


### Tech Stack
- **Frontend Framework**: React.js 
- **Build Tool**: Vite (for fast development and optimized production builds)
- **API Communication**: Axios for data fetching
- **Styling**: Component-based CSS architecture with CSS variables


### Component Breakdown

### App.jsx
  - **Purpose**: Main application container, handles data fetching and state management
  - **Key Functions**: 
    - Fetches game data from MLB API
    - Maintains application state
    - Processes and filters game data
    - Renders main UI structure

### FilterControls.jsx
  - **Purpose**: Provides UI for filtering and sorting game data
  - **Features**:
    - Sort dropdown (recent/oldest)
    - Pitcher filter dropdown
    - Game result filter (all/wins/losses)
    - Reset button for clearing filters

### GameSummary.jsx
  - **Purpose**: Card component displaying game overview information
  - **Features**:
    - Game date and status
    - Teams and score
    - Pitcher information
    - Game content (articles, images)
  - Modal trigger for detailed stats

### PitcherInfo.jsx
  - **Purpose**: Displays pitcher data including headshot and basic stats
  - **Features**:
    - Pitcher headshot from MLB API
    - Basic pitching statistics (IP, ER, K, BB)
    - Fallback handling for missing data

### Modal.jsx
  - **Purpose**: Reusable modal component for displaying detailed information
  - **Features**:
    - Pitcher statistics
    - Game content
    - Close button


