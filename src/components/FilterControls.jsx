import React from 'react'

const FilterControls = ({ filters, setFilters, raysPitchers }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label>Sort By:</label>
        <select 
          name="sortBy" 
          value={filters.sortBy} 
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="date-desc">Most Recent</option>
          <option value="date-asc">Oldest First</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Rays Pitcher:</label>
        <select 
          name="pitcher" 
          value={filters.pitcher} 
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Pitchers</option>
          {raysPitchers.map(pitcher => (
            <option key={pitcher.id} value={pitcher.id}>
              {pitcher.name}
            </option>
          ))}
        </select>
      </div>

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

      <button 
        className="filter-reset" 
        onClick={() => setFilters({
          sortBy: 'date-desc',
          pitcher: '',
          gameResult: 'all'
        })}
      >
        Reset Filters
      </button>
    </div>
  )
}

export default FilterControls
