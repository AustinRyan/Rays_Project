import React from 'react'
import './GameDetails.css'

const GameDetails = ({ game, raysPitcher, opponentPitcher }) => {
  const getAdvancedPitcherStats = (pitcher) => {
    if (!pitcher) return null
    
    const gameLog = pitcher.stats?.find(stat => 
      stat.type.displayName === 'gameLog' && stat.group.displayName === 'pitching'
    )
    
    return {
      gameStats: gameLog?.stats || {}
    }
  }
  
  const raysAdvancedStats = getAdvancedPitcherStats(raysPitcher?.originalData)
  const opponentAdvancedStats = getAdvancedPitcherStats(opponentPitcher?.originalData)
  
  return (
    <div className="game-details">
      <div className="details-section">
        <h3>Game Details</h3>
        <div className="details-grid">
          <div>
            <strong>Venue:</strong> {game.venue?.name || 'N/A'}
          </div>
          <div>
            <strong>Game Type:</strong> {game.gameType === 'R' ? 'Regular Season' : 
                                      game.gameType === 'S' ? 'Spring Training' : 
                                      game.gameType === 'P' ? 'Playoff' : game.gameType}
          </div>
      
        </div>
      </div>
      
        <div className="game-pitching-details">
          <h3>Detailed Pitching Stats</h3>
          
          <div className="pitching-comparison">
            <div className="pitcher-detailed">
              <h4>{raysPitcher?.name} - This Game</h4>
              {raysAdvancedStats?.gameStats ? (
                <div className="advanced-stats-grid">
                  <div><strong>IP:</strong> {raysAdvancedStats.gameStats.inningsPitched || 'N/A'}</div>
                  <div><strong>ER:</strong> {raysAdvancedStats.gameStats.earnedRuns || '0'}</div>
                  <div><strong>K:</strong> {raysAdvancedStats.gameStats.strikeOuts || '0'}</div>
                  <div><strong>BB:</strong> {raysAdvancedStats.gameStats.baseOnBalls || '0'}</div>
                  <div><strong>Pitches:</strong> {raysAdvancedStats.gameStats.pitchesThrown || '0'}</div>
                  <div><strong>Strikes:</strong> {raysAdvancedStats.gameStats.strikes || '0'}</div>
                  <div><strong>Balls:</strong> {raysAdvancedStats.gameStats.balls || '0'}</div>
                  <div><strong>Strike %:</strong> {raysAdvancedStats.gameStats.strikePercentage || 'N/A'}</div>
                  <div><strong>Batters Faced:</strong> {raysAdvancedStats.gameStats.battersFaced || 'N/A'}</div>
                  <div><strong>Ground Outs:</strong> {raysAdvancedStats.gameStats.groundOuts || 'N/A'}</div>
                  <div><strong>Home Runs Allowed:</strong> {raysAdvancedStats.gameStats.homeRuns || '0'}</div>
                  <div><strong>Hits:</strong> {raysAdvancedStats.gameStats.hits || 'N/A'}</div>
                  <div><strong>Wild Pitches:</strong> {raysAdvancedStats.gameStats.wildPitches || '0'}</div>
                  <div><strong>HBP:</strong> {raysAdvancedStats.gameStats.hitBatsmen || '0'}</div>
                </div>
              ) : <p>No game stats available</p>}
            </div>
            
            <div className="pitcher-detailed">
              <h4>{opponentPitcher?.name} - This Game</h4>
              {opponentAdvancedStats?.gameStats ? (
                <div className="advanced-stats-grid">
                  <div><strong>IP:</strong> {opponentAdvancedStats.gameStats.inningsPitched || '0'}</div>
                  <div><strong>ER:</strong> {opponentAdvancedStats.gameStats.earnedRuns || '0'}</div>
                  <div><strong>K:</strong> {opponentAdvancedStats.gameStats.strikeOuts || '0'}</div>
                  <div><strong>BB:</strong> {opponentAdvancedStats.gameStats.baseOnBalls || '0'}</div>
                  <div><strong>Pitches:</strong> {opponentAdvancedStats.gameStats.pitchesThrown || '0'}</div>
                  <div><strong>Strikes:</strong> {opponentAdvancedStats.gameStats.strikes || '0'}</div>
                  <div><strong>Balls:</strong> {opponentAdvancedStats.gameStats.balls || 'N/A'}</div>
                  <div><strong>Strike %:</strong> {opponentAdvancedStats.gameStats.strikePercentage || 'N/A'}</div>
                  <div><strong>Batters Faced:</strong> {opponentAdvancedStats.gameStats.battersFaced || 'N/A'}</div>
                  <div><strong>Ground Outs:</strong> {opponentAdvancedStats.gameStats.groundOuts || 'N/A'}</div>
                  <div><strong>Home Runs Allowed:</strong> {opponentAdvancedStats.gameStats.homeRuns || '0'}</div>
                  <div><strong>Hits:</strong> {opponentAdvancedStats.gameStats.hits || 'N/A'}</div>
                  <div><strong>Wild Pitches:</strong> {opponentAdvancedStats.gameStats.wildPitches || '0'}</div>
                  <div><strong>HBP:</strong> {opponentAdvancedStats.gameStats.hitBatsmen || '0'}</div>
                </div>
              ) : <p>No game stats available</p>}
            </div>
          </div>
        </div>
      
    </div>
  )
}

export default GameDetails
