import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerManagement } from '../hooks/usePlayerManagement'
import styles from './PlayerSelectPage.module.scss'

/**
 * Player selection page component that allows choosing between players
 * Uses keyboard navigation (arrow up/down) and Enter key for validation
 * @returns {JSX.Element} Player selection page with retro gaming aesthetic
 * @example
 * // Used in React Router as the default route
 * <Route path="/" element={<PlayerSelectPage />} />
 */
export default function PlayerSelectPage() {
  const navigate = useNavigate()
  const { players, selectedIndex, setSelectedIndex, selectPlayer } = usePlayerManagement()

  /**
   * Handle player selection and navigate to home page
   */
  const handlePlayerSelect = useCallback((): void => {
    selectPlayer(selectedIndex)
    navigate('/home')
  }, [selectedIndex, selectPlayer, navigate])

  /**
   * Handle keyboard navigation and selection
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(Math.max(0, selectedIndex - 1))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(Math.min(players.length - 1, selectedIndex + 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handlePlayerSelect()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, players.length, setSelectedIndex, handlePlayerSelect])

  const getPlayerCardClass = (index: number) => {
    const classes = [styles.playerCard]
    if (index === selectedIndex) classes.push(styles.selected)
    return classes.join(' ')
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.clouds}>
        <div className={styles.cloud}>☁️</div>
        <div className={styles.cloud}>☁️</div>
        <div className={styles.cloud}>☁️</div>
      </div>

      <div className={styles.gameHeader}>
        <h1 className={styles.gameTitle}>⭐ MATH QUEST ⭐</h1>
        <div className={styles.subtitle}>Choose Your Player</div>
      </div>

      <div className={styles.playerList}>
        {players.map((player, index) => (
          <div
            key={player.id}
            className={getPlayerCardClass(index)}
            onClick={() => {
              selectPlayer(index)
              navigate('/home')
            }}
          >
            {index === selectedIndex && <span className={styles.cursor}>▶</span>}
            <span className={styles.playerName}>{player.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.instructions}>
        <div className={styles.instructionText}>↑ ↓ Arrow Keys to Navigate</div>
        <div className={styles.instructionText}>↵ Enter to Select</div>
      </div>

      <div className={styles.characterSprite}>🍄</div>
    </div>
  )
}
