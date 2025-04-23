import React from 'react'
import { getPlayerHeadshot } from '../../utils/dataUtils'
import './PitcherInfo.css'

const PitcherInfo = ({ pitcher, team }) => {
  return (
    <div className="pitcher">
      <h4>{team} Pitcher</h4>
      {pitcher ? (
        <>
          <div className="pitcher-header">
            {pitcher.id && (
              <div className="pitcher-headshot">
                <img 
                  src={getPlayerHeadshot(pitcher.id, '180')} 
                  alt={`${pitcher.name} headshot`} 
                  onError={(e) => {
                    // If image fails to load, show generic silhouette
                    e.target.src = 'https://img.mlbstatic.com/mlb-photos/image/upload/w_180/v1/people/generic/headshot/67/current';
                  }}
                />
              </div>
            )}
            <div className="pitcher-info">
              <p className="pitcher-name">{pitcher.name}</p>
              <p className="pitcher-summary">{pitcher.summary}</p>
            </div>
          </div>
          <div className="pitcher-stats">
            <p>IP: <strong>{pitcher.inningsPitched}</strong></p>
            <p>ER: <strong>{pitcher.earnedRuns}</strong></p>
            <p>K: <strong>{pitcher.strikeOuts}</strong></p>
            <p>BB: <strong>{pitcher.baseOnBalls}</strong></p>
          </div>
        </>
      ) : <p>No pitcher data available</p>}
    </div>
  )
}

export default PitcherInfo
