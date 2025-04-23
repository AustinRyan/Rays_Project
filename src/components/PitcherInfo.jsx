import React from 'react'

const PitcherInfo = ({ pitcher, team }) => {
  return (
    <div className="pitcher">
      <h4>{team} Pitcher</h4>
      {pitcher ? (
        <>
          <p>{pitcher.name}</p>
          <p>{pitcher.summary}</p>
          <div className="pitcher-stats">
            <p>IP: {pitcher.inningsPitched}</p>
            <p>ER: {pitcher.earnedRuns}</p>
            <p>K: {pitcher.strikeOuts}</p>
            <p>BB: {pitcher.baseOnBalls}</p>
          </div>
        </>
      ) : <p>No pitcher data available</p>}
    </div>
  )
}

export default PitcherInfo
