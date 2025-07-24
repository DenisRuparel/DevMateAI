import React, { useState, useEffect } from 'react'

const TimerComponent = ({ start }) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval = null
    
    if (start) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [start])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="text-lg font-mono">
      {formatTime(time)}
    </div>
  )
}

export default TimerComponent
