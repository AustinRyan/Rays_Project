// Takes in date string returns formatted date string
export const formatDate = (dateString) => {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

// Takes in game data returns opponent information
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

// Takes in pitcher data returns formatted version of pitcher data 
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

// Takes in API response data returns array of all games
export const getAllGames = (gamesData) => {
  if (!gamesData || !gamesData.dates) return []
  
  // Flatten the games arrays from all dates
  return gamesData.dates.reduce((allGames, date) => {
    return allGames.concat(date.games)
  }, [])
}

// Takes in game object returns content link for article
export const getGameContentLink = (game) => {
  if (game && game.content && game.content.link) {
    return game.content.link;
  }
  return null;
}

// Takes in game PK returns content for article
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

// Takes in game content data returns processed content to get article summary and image and url
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

// Takes in player ID returns headshot image URL
export const getPlayerHeadshot = (playerId, size = '213') => {
  if (!playerId) return null;
  
  // Convert playerId to string if it's a number
  const id = String(playerId);
  
  // MLB headshot image URL format with fallback to generic headshot
  return `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_${size},q_auto:good/v1/people/${id}/headshot/67/current`;
}


