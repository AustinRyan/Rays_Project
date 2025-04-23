import React from 'react'
import './FilterControls.css'

/**
 * 
 * This component renders the filtering and sorting controls for the Rays games list.
 * It receives the current filter state and a setter function from the parent component,
 * along with the list of Rays pitchers for the pitcher filter dropdown.
 */
const FilterControls = ({ filters, setFilters, raysPitchers }) => {
  /**
   * Handles changes to any filter dropdown selection
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,  
      [name]: value  
    }))
  }

  return (
    <div className="filter-controls">
      {/* Sort dropdown - Controls the chronological ordering of games */}
      <div className="filter-group">
        <label>Sort By:</label>
        <select 
          name="sortBy" 
          value={filters.sortBy} 
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="date-desc">Most Recent</option>
          <option value="date-asc">Oldest</option>
        </select>
      </div>

      {/* Pitcher dropdown - Filters games by Rays pitcher */}
      <div className="filter-group">
        <label>Rays Pitcher:</label>
        <select 
          name="pitcher" 
          value={filters.pitcher} 
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Pitchers</option>
          {/* Map through list of pitchers to create options */}
          {raysPitchers.map(pitcher => (
            <option key={pitcher.id} value={pitcher.id}>
              {pitcher.name}
            </option>
          ))}
        </select>
      </div>

      {/* Game result dropdown - Filters games by win/loss */}
      <div className="filter-group">
        <label>Game Result:</label>
        <select 
          name="gameResult" 
          value={filters.gameResult} 
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="all">All Games</option>
          <option value="win">Wins</option>
          <option value="loss">Losses</option>
        </select>
      </div>

      {/* Reset button - Clears all filters to default values */}
      <button 
        className="filter-reset" 
        onClick={() => setFilters({
          sortBy: 'date-desc', // Default: most recent first
          pitcher: '',         // Default: show all pitchers
          gameResult: 'all'    // Default: show all game results
        })}
      >
        Reset Filters
      </button>
    </div>
  )
}

export default FilterControls
