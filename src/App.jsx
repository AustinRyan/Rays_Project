import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import GameSummary from './components/GameSummary/GameSummary'
import FilterControls from './components/FilterControls/FilterControls'
import { getAllGames } from './utils/dataUtils'

import './styles/base.css'
import './styles/variables.css'
import './styles/utils.css'


function App() {
  // State to store the raw API response data
  const [gamesData, setGamesData] = useState(null)
  // Loading state for showing spinner/loading message
  const [loading, setLoading] = useState(true)
  // Error state for handling API request failures
  const [error, setError] = useState(null)
  // Filter state to control game filtering and sorting
  const [filters, setFilters] = useState({
    sortBy: 'date-desc',  // Default sort: newest to oldest
    pitcher: '',         // Default: show all pitchers
    gameResult: 'all'    // Default: show all games (wins and losses)
  })

  /**
   * Fetch game data from MLB API when component mounts
   * The empty dependency array [] ensures this only runs once on initial render
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make GET request to MLB Stats API for Rays games (team ID: 139)
        const response = await axios.get(
          'https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=139&hydrate=probablePitcher,stats&startDate=2025-03-01&endDate=2025-06-01'
        )
        // Store the API response in state
        setGamesData(response.data)
        // Turn off loading state
        setLoading(false)
        console.log(response.data)
      } catch (err) {
        setError('Error fetching data: ' + err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, []) 

  // Get all games from the API response data
  const allGames = gamesData ? getAllGames(gamesData) : []
  
  /**
   * Extract just the Rays pitchers from all games for the filter dropdown
   * Using useMemo ensures this only recalculates when allGames changes
   */
  const raysPitchers = useMemo(() => {
    // Use a Map to ensure unique pitchers (by ID) - prevents duplicates
    const pitchersMap = new Map()
    
    allGames.forEach(game => {
      // If Rays are away team, get away pitcher
      if (game.teams.away.team.id === 139 && game.teams.away.probablePitcher) {
        const pitcher = game.teams.away.probablePitcher
        // Store pitcher with ID as key to prevent duplicates
        pitchersMap.set(pitcher.id, {
          id: pitcher.id,
          name: pitcher.fullName
        })
      }
      
      // If Rays are home team, get home pitcher
      if (game.teams.home.team.id === 139 && game.teams.home.probablePitcher) {
        const pitcher = game.teams.home.probablePitcher
        // Store pitcher with ID as key to prevent duplicates
        pitchersMap.set(pitcher.id, {
          id: pitcher.id,
          name: pitcher.fullName
        })
      }
    })
    
    // Convert Map values to array for rendering in select dropdown
    return Array.from(pitchersMap.values())
  }, [allGames]) // Only recalculate when games data changes
  
  /**
   * Apply filters and sorting to the games
   * This useMemo hook processes all games based on the current filter settings
   * It will recompute only when the games data or filter settings change
   */
  const filteredGames = useMemo(() => {
    // Start with a copy of all games to avoid mutating the original
    let result = [...allGames]
    
    // This filters out games that are upcoming or in progress
    result = result.filter(game => game.status.abstractGameState === 'Final')
    
    // Filter by pitcher (if a specific Rays pitcher is selected)
    if (filters.pitcher) {
      const pitcherId = parseInt(filters.pitcher) // Convert ID from string to number
      result = result.filter(game => {
        // Need to check both home/away since Rays can be either home or away team
        if (game.teams.home.team.id === 139) {  // Rays are home team (139 = Rays team ID)
          return game.teams.home.probablePitcher?.id === pitcherId
        } else {  // Rays are away team
          return game.teams.away.probablePitcher?.id === pitcherId
        }
      })
    }
    
    // Filter by game result (win/loss for Rays)
    if (filters.gameResult !== 'all') {
      result = result.filter(game => {
        // Determine if Rays are home team (139 = Rays team ID)
        const raysAreHome = game.teams.home.team.id === 139;
        // Get Rays score (from either home or away position)
        const raysScore = raysAreHome ? game.teams.home.score : game.teams.away.score;
        // Get opponent score (opposite of Rays position)
        const opponentScore = raysAreHome ? game.teams.away.score : game.teams.home.score;
        // Determine if Rays won by comparing scores
        const raysWon = raysScore > opponentScore;

        // Return games matching the selected filter
        if (filters.gameResult === 'win') {
          return raysWon;  // Only show Rays wins
        } else if (filters.gameResult === 'loss') {
          return !raysWon; // Only show Rays losses
        }
        return true; // Default case: show all games (should not happen with current filters)
      });
    }

    // Sort the filtered games by date
    result.sort((a, b) => {
      if (filters.sortBy === 'date-desc') {
        // Newest first (descending order)
        return new Date(b.gameDate) - new Date(a.gameDate)
      } else if (filters.sortBy === 'date-asc') {
        // Oldest first (ascending order)
        return new Date(a.gameDate) - new Date(b.gameDate)
      }
      return 0 // Default case (should not happen with current filters)
    })
    
    return result
  }, [allGames, filters]) // Recalculate when games data or filters change

  // Render the UI with conditional sections based on app state
  return (
    <div className="App">
      <h1>Tampa Bay Rays Recent Games</h1>
      
      {/* Show loading message when data is being fetched */}
      {loading && <p>Loading...</p>}
      
      {/* Show error message if API request failed */}
      {error && <p>{error}</p>}
      
      {/* Only show content when we have games data */}
      {allGames.length > 0 && (
        <>
          {/* Filter controls section */}
          <FilterControls 
            filters={filters}     
            setFilters={setFilters} 
            raysPitchers={raysPitchers} 
          />
          
          {filteredGames.length > 0 ? (
            <div className="games-container">
              {/* Map through filtered games and render a GameSummary for each */}
              {filteredGames.map(game => (
                <GameSummary key={game.gamePk} game={game} />
              ))}
            </div>
          ) : (
            // If no games match the filters, show a message
            <p className="no-games-message">No games match your selected filters. Try adjusting your filters.</p>
          )}
        </>
      )}
    </div>
  )
}

export default App
