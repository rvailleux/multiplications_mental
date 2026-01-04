import { useState, useEffect } from 'react'

/**
 * Custom hook that provides countdown timer functionality with auto-decrement and reset capability
 * @param {number} initialSeconds - The starting countdown value in seconds
 * @returns {object} Timer state and controls
 * @returns {number} returns.secondsLeft - Current seconds remaining in the countdown
 * @returns {Function} returns.reset - Function to reset timer back to initial value
 * @example
 * const { secondsLeft, reset } = useTimer(60);
 * // Timer starts at 60 and decrements every second
 * // Call reset() to restart from 60
 */
export function useTimer(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const reset = () => setSecondsLeft(initialSeconds)

  return { secondsLeft, reset }
}
