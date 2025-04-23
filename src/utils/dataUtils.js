/**
 * Format date to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

/**
 * Get information about the Rays' opponent for a game
 * @param {Object} game - Game data object
 * @returns {Object} Information about the opponent and scores
 */
export const getRaysOpponent = (game) => {
  const awayTeam = game.teams.away.team
  const homeTeam = game.teams.home.team
  
  if (awayTeam.id === 139) {
    return {
      raysAreAway: true,
      opponent: homeTeam.name,
      raysScore: game.teams.away.score,
      opponentScore: game.teams.home.score,
      raysRecord: game.teams.away.leagueRecord,
      opponentRecord: game.teams.home.leagueRecord
    }
  } else {
    return {
      raysAreAway: false,
      opponent: awayTeam.name,
      raysScore: game.teams.home.score,
      opponentScore: game.teams.away.score,
      raysRecord: game.teams.home.leagueRecord,
      opponentRecord: game.teams.away.leagueRecord
    }
  }
}

/**
 * Extract pitcher data in a standardized format
 * @param {Object} pitcher - Pitcher data object
 * @returns {Object|null} Formatted pitcher data or null if no data
 */
export const getPitcherData = (pitcher) => {
  if (!pitcher) return null
  
  // Find the pitching stats for the game log (most specific to the game)
  const pitchingStats = pitcher.stats?.find(stat => 
    stat.type.displayName === 'gameLog' && stat.group.displayName === 'pitching'
  )
  
  return {
    id: pitcher.id,
    name: pitcher.fullName,
    inningsPitched: pitchingStats?.stats?.inningsPitched || '0',
    earnedRuns: pitchingStats?.stats?.earnedRuns || '0',
    strikeOuts: pitchingStats?.stats?.strikeOuts || '0',
    baseOnBalls: pitchingStats?.stats?.baseOnBalls || '0',
    summary: pitchingStats?.stats?.summary || 'No stats available'
  }
}

/**
 * Extract all games from the dates array in the API response
 * @param {Object} gamesData - API response data
 * @returns {Array} Array of all games
 */
export const getAllGames = (gamesData) => {
  if (!gamesData || !gamesData.dates) return []
  
  // Flatten the games arrays from all dates
  return gamesData.dates.reduce((allGames, date) => {
    return allGames.concat(date.games)
  }, [])
}

/**
 * Get the decision pitchers (winning, losing, save) from a game
 * @param {Object} game - Game data object
 * @returns {Object} Object with winningPitcher, losingPitcher, and savePitcher
 */
export const getDecisionPitchers = (game) => {
  // Only search for decisions in completed games
  if (game.status.abstractGameState !== 'Final') {
    return { winningPitcher: null, losingPitcher: null, savePitcher: null }
  }
  
  let winningPitcher = null;
  let losingPitcher = null;
  let savePitcher = null;
  let holdPitcher = null;
  
  // Function to check a pitcher's stats for decision indicators
  const checkPitcherForDecision = (pitcher) => {
    if (!pitcher || !pitcher.stats) return;
    
    // Look at the game log stats for pitching
    const pitchingStats = pitcher.stats.find(stat => 
      stat.type.displayName === 'gameLog' && stat.group.displayName === 'pitching'
    );
    
    if (pitchingStats && pitchingStats.stats && pitchingStats.stats.note) {
      const note = pitchingStats.stats.note;
      
      // Check if this pitcher got a decision
      if (note.includes('(W')) {
        winningPitcher = {
          name: pitcher.fullName,
          id: pitcher.id
        };
      } else if (note.includes('(L')) {
        losingPitcher = {
          name: pitcher.fullName,
          id: pitcher.id
        };
      } else if (note.includes('(S')) {
        savePitcher = {
          name: pitcher.fullName,
          id: pitcher.id
        };
      } else if (note.includes('(H')) {
        holdPitcher = {
          name: pitcher.fullName,
          id: pitcher.id
        };
      }
    }
  };
  
  // Check all available pitchers in the game
  // Home team pitchers
  if (game.teams.home.probablePitcher) {
    checkPitcherForDecision(game.teams.home.probablePitcher);
  }
  
  // Away team pitchers
  if (game.teams.away.probablePitcher) {
    checkPitcherForDecision(game.teams.away.probablePitcher);
  }
  
  // For a complete implementation, we would need to check all pitchers that appeared in the game,
  // but we only have access to the probable pitchers in the current API response
  
  return {
    winningPitcher,
    losingPitcher,
    savePitcher,
    holdPitcher
  };
}

/**
 * Get the game content link from a game object
 * @param {Object} game - Game data object
 * @returns {string|null} The content link if available
 */
export const getGameContentLink = (game) => {
  if (game && game.content && game.content.link) {
    return game.content.link;
  }
  return null;
}

/**
 * Fetches the content (recap, headline, images) for a specific game
 * @param {number} gamePk - The unique identifier for the game
 * @returns {Promise<Object>} - The game content data
 */
export const fetchGameContent = async (gamePk) => {
  try {
    const response = await fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/content`);
    const data = await response.json();
    return processGameContent(data);
  } catch (error) {
    console.error(`Error fetching content for game ${gamePk}:`, error);
    return null;
  }
};

/**
 * Processes the game content data to extract useful information
 * @param {Object} contentData - The raw game content data from the API
 * @returns {Object} - Processed game content with headline, summary, image, and article URL
 */
export const processGameContent = (contentData) => {
  if (!contentData) return null;

  // Initialize the content object with empty/default values
  const content = {
    headline: '',
    blurb: '',
    image: null,
    url: '',
    hasContent: false
  };

  // Check if we have editorial content (recap)
  if (contentData.editorial?.recap?.mlb) {
    const recap = contentData.editorial.recap.mlb;
    content.headline = recap.headline || '';
    content.blurb = recap.blurb || '';
    
    // Construct the proper MLB.com article URL using the slug
    if (recap.slug) {
      content.url = `https://www.mlb.com/news/${recap.slug}`;
    } else {
      content.url = '';
    }
    
    content.hasContent = true;
    
    // Get a suitable image from the recap
    if (recap.image && recap.image.cuts && recap.image.cuts.length > 0) {
      // Find a medium-sized image (around 640x360 if available)
      const mediumImages = recap.image.cuts.filter(cut => 
        cut.width >= 640 && cut.width <= 800 && cut.aspectRatio === '16:9'
      );
      
      if (mediumImages.length > 0) {
        content.image = mediumImages[0].src;
      } else if (recap.image.cuts.length > 0) {
        // Fallback to any available image
        content.image = recap.image.cuts[0].src;
      }
    }
  }

  return content;
}
