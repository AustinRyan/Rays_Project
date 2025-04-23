import React, { useState, useEffect } from 'react'
import PitcherInfo from '../PitcherInfo/PitcherInfo'
import GameDetails from '../GameDetails/GameDetails'
import Modal from '../Modal/Modal'
import { formatDate, getRaysOpponent, getPitcherData, fetchGameContent } from '../../utils/dataUtils'
import './GameSummary.css'

/**
 * 
 * Displays a card with summary information about a single baseball game.
 * Shows game date, teams, score, pitcher information, and game content.
 * Includes functionality to open a modal with detailed game statistics.
 */

const GameSummary = ({ game }) => {
  // State to control the detailed stats modal visibility
  const [modalOpen, setModalOpen] = useState(false)
  // State to store the article/headline content for this game
  const [gameContent, setGameContent] = useState(null)
  // Loading state for fetching content
  const [loadingContent, setLoadingContent] = useState(false)
  // Extract opponent info, scores, etc. using utility function
  const gameInfo = getRaysOpponent(game)
  
  /**
   * Fetch game content (articles, headlines, images) when component mounts
   * or when the game prop changes
   */
  useEffect(() => {
    const getGameContent = async () => {
      // Only fetch if we have a valid game ID
      if (game && game.gamePk) {
        setLoadingContent(true);
        // Call the utility function to fetch content from MLB API
        const content = await fetchGameContent(game.gamePk);
        setGameContent(content);
        setLoadingContent(false);
      }
    };
    
    getGameContent();
  }, [game]) // Re-run if the game prop changes
  // Get Rays pitcher data based on whether they are home or away team
  const raysPitcher = gameInfo.raysAreAway 
    ? getPitcherData(game.teams.away.probablePitcher) // Rays are away
    : getPitcherData(game.teams.home.probablePitcher) // Rays are home
  
  // Get opponent pitcher data (opposite of Rays position)
  const opponentPitcher = gameInfo.raysAreAway
    ? getPitcherData(game.teams.home.probablePitcher) // Opponent is home
    : getPitcherData(game.teams.away.probablePitcher) // Opponent is away
    
  // Store original pitcher data for detailed view
  if (raysPitcher) {
    raysPitcher.originalData = gameInfo.raysAreAway 
      ? game.teams.away.probablePitcher
      : game.teams.home.probablePitcher
      
    // const raysPitcherData = raysPitcher.originalData;
    // if (raysPitcherData && raysPitcherData.link) {
    //   console.log('Rays Pitcher API Link:', raysPitcherData.link);
    //   console.log('Rays Pitcher Full Object:', raysPitcherData);
    // }
  }
  
  if (opponentPitcher) {
    opponentPitcher.originalData = gameInfo.raysAreAway
      ? game.teams.home.probablePitcher
      : game.teams.away.probablePitcher
      
    
    // const opponentPitcherData = opponentPitcher.originalData;
    // if (opponentPitcherData && opponentPitcherData.link) {
    //   console.log('Opponent Pitcher API Link:', opponentPitcherData.link);
    //   console.log('Opponent Pitcher Full Object:', opponentPitcherData);
    // }
  }

  //console.log('Game teams data:', game.teams)
  
 
  const openModal = () => {
    setModalOpen(true)
  }
  
  const closeModal = () => {
    setModalOpen(false)
  }
  
  return (
    <>
      <div className="game-card">
        <div className="game-header">
          <div className="game-header-left">
            <h2>{formatDate(game.gameDate)}</h2>
            {game.gameType === 'S' && <span className="game-type-badge">Spring Training</span>}
          </div>
          <p>{game.status.detailedState}</p>
        </div>
        
        <div className="game-matchup">
          <h3>
            Tampa Bay Rays {gameInfo.raysRecord && `(${gameInfo.raysRecord.wins}-${gameInfo.raysRecord.losses}) `} 
            vs {gameInfo.opponent} {gameInfo.opponentRecord && `(${gameInfo.opponentRecord.wins}-${gameInfo.opponentRecord.losses})`}
          </h3>
          {game.status.abstractGameState === 'Final' && (
            <div className="game-score">
              <span>Rays: {gameInfo.raysScore}</span>
              <span>{gameInfo.opponent}: {gameInfo.opponentScore}</span>
            </div>
          )}
        </div>
        
        <div className="pitchers-container">
          <PitcherInfo pitcher={raysPitcher} team="Rays" />
          <PitcherInfo pitcher={opponentPitcher} team={gameInfo.opponent} />
        </div>
        
        {gameContent && gameContent.hasContent && (
          <div className="game-content">
            {gameContent.image && (
              <div className="game-image">
                <img src={gameContent.image} alt={gameContent.headline || 'Game highlight'} />
              </div>
            )}
            <div className="game-content-text">
              {gameContent.headline && (
                <h4>
                  {gameContent.url ? (
                    <a href={gameContent.url} target="_blank" rel="noopener noreferrer" className="article-link">
                      {gameContent.headline}
                    </a>
                  ) : (
                    gameContent.headline
                  )}
                </h4>
              )}
              {gameContent.blurb && (
                <div className="game-blurb-container">
                  <p className="game-blurb">
                    {gameContent.blurb}
                  </p>
                  {gameContent.url && (
                    <span className="read-more">
                      <a href={gameContent.url} target="_blank" rel="noopener noreferrer">
                        Read Full Article
                      </a>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="view-details" onClick={openModal}>
          <span>View Detailed Stats</span>
        </div>
      </div>
      
      <Modal 
        isOpen={modalOpen} 
        onClose={closeModal}
        title={`Game Details: Rays vs ${gameInfo.opponent} - ${formatDate(game.gameDate)}`}
      >
        <GameDetails
          game={game}
          gameInfo={gameInfo}
          raysPitcher={raysPitcher}
          opponentPitcher={opponentPitcher}
        />
      </Modal>
    </>
  )
}

export default GameSummary
