import React, { useState, useEffect } from 'react'
import PitcherInfo from './PitcherInfo'
import GameDetails from './GameDetails'
import Modal from './Modal'
import { formatDate, getRaysOpponent, getPitcherData, fetchGameContent } from '../utils/dataUtils'

const GameCard = ({ game }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [gameContent, setGameContent] = useState(null)
  const [loadingContent, setLoadingContent] = useState(false)
  const gameInfo = getRaysOpponent(game)
  
  // Fetch game content when component mounts
  useEffect(() => {
    const getGameContent = async () => {
      if (game && game.gamePk) {
        setLoadingContent(true);
        const content = await fetchGameContent(game.gamePk);
        setGameContent(content);
        setLoadingContent(false);
      }
    };
    
    getGameContent();
  }, [game])
  // Not using decision pitchers as they can be inaccurate in spring training games
  const raysPitcher = gameInfo.raysAreAway 
    ? getPitcherData(game.teams.away.probablePitcher)
    : getPitcherData(game.teams.home.probablePitcher)
  const opponentPitcher = gameInfo.raysAreAway
    ? getPitcherData(game.teams.home.probablePitcher)
    : getPitcherData(game.teams.away.probablePitcher)
    
  // Store original pitcher data for detailed view
  if (raysPitcher) {
    raysPitcher.originalData = gameInfo.raysAreAway 
      ? game.teams.away.probablePitcher
      : game.teams.home.probablePitcher
  }
  
  if (opponentPitcher) {
    opponentPitcher.originalData = gameInfo.raysAreAway
      ? game.teams.home.probablePitcher
      : game.teams.away.probablePitcher
  }
  
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
                <p className="game-blurb">
                  {gameContent.blurb.substring(0, 150)}...
                  {gameContent.url && (
                    <span className="read-more">
                      <a href={gameContent.url} target="_blank" rel="noopener noreferrer">
                        Read More
                      </a>
                    </span>
                  )}
                </p>
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

export default GameCard
