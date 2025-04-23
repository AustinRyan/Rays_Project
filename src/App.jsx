import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import './App.css'
import GameCard from './components/GameCard'
import FilterControls from './components/FilterControls'
import { getAllGames } from './utils/dataUtils'

function App() {
  const [gamesData, setGamesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    sortBy: 'date-desc',
    pitcher: '',
    gameResult: 'all'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=139&hydrate=probablePitcher,stats&startDate=2025-03-01&endDate=2025-06-01'
        )
        setGamesData(response.data)
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
  
  // Extract only Rays pitchers for the filter dropdown
  const raysPitchers = useMemo(() => {
    const pitchersMap = new Map()
    
    allGames.forEach(game => {
      // If Rays are away team, get away pitcher
      if (game.teams.away.team.id === 139 && game.teams.away.probablePitcher) {
        const pitcher = game.teams.away.probablePitcher
        pitchersMap.set(pitcher.id, {
          id: pitcher.id,
          name: pitcher.fullName
        })
      }
      
      // If Rays are home team, get home pitcher
      if (game.teams.home.team.id === 139 && game.teams.home.probablePitcher) {
        const pitcher = game.teams.home.probablePitcher
        pitchersMap.set(pitcher.id, {
          id: pitcher.id,
          name: pitcher.fullName
        })
      }
    })
    
    return Array.from(pitchersMap.values())
  }, [allGames])
  
  // Apply filters and sorting to the games
  const filteredGames = useMemo(() => {
    let result = [...allGames]
    
    // Only show completed games (abstractGameState === 'Final')
    result = result.filter(game => game.status.abstractGameState === 'Final')
    
    // Filter by pitcher (Rays pitchers only)
    if (filters.pitcher) {
      const pitcherId = parseInt(filters.pitcher)
      result = result.filter(game => {
        // Only look for the pitcher in the Rays team (home or away)
        if (game.teams.home.team.id === 139) {
          return game.teams.home.probablePitcher?.id === pitcherId
        } else {
          return game.teams.away.probablePitcher?.id === pitcherId
        }
      })
    }
    
    // Filter by game result (win/loss for Rays)
    if (filters.gameResult !== 'all') {
      result = result.filter(game => {
        const raysAreHome = game.teams.home.team.id === 139;
        const raysScore = raysAreHome ? game.teams.home.score : game.teams.away.score;
        const opponentScore = raysAreHome ? game.teams.away.score : game.teams.home.score;
        const raysWon = raysScore > opponentScore;

        if (filters.gameResult === 'win') {
          return raysWon;
        } else if (filters.gameResult === 'loss') {
          return !raysWon;
        }
        return true; // Should not happen if filter is 'win' or 'loss'
      });
    }

    // Sort the games
    result.sort((a, b) => {
      if (filters.sortBy === 'date-desc') {
        return new Date(b.gameDate) - new Date(a.gameDate)
      } else if (filters.sortBy === 'date-asc') {
        return new Date(a.gameDate) - new Date(b.gameDate)
      }
      return 0
    })
    
    return result
  }, [allGames, filters])

  return (
    <div className="App">
      <h1>Tampa Bay Rays Games</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {allGames.length > 0 && (
        <>
          <FilterControls 
            filters={filters} 
            setFilters={setFilters} 
            raysPitchers={raysPitchers}
          />
          
          {filteredGames.length > 0 ? (
            <div className="games-container">
              {filteredGames.map(game => (
                <GameCard key={game.gamePk} game={game} />
              ))}
            </div>
          ) : (
            <p className="no-games-message">No games match your selected filters. Try adjusting your filters.</p>
          )}
        </>
      )}
    </div>
  )
}

export default App
