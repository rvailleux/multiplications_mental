import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerManagement } from '../hooks/usePlayerManagement'
import { useListNavigation } from '../hooks/useListNavigation'
import { useMusic } from '../contexts/MusicContext'
import JumpingArrow from '../components/JumpingArrow'
import KeyboardHints from '../components/KeyboardHints'
import styles from './PlayerSelectPage.module.scss'

/**
 * Player selection page component that allows choosing between players
 * Uses keyboard navigation (arrow up/down) with cyclic wrapping and Enter key for validation
 * Starts playing main theme music on mount
 * @returns {JSX.Element} Player selection page with retro gaming aesthetic
 * @example
 * // Used in React Router as the default route
 * <Route path="/" element={<PlayerSelectPage />} />
 */
export default function PlayerSelectPage() {
  const navigate = useNavigate()
  const { players, selectPlayer } = usePlayerManagement()
  const { playMainTheme } = useMusic()

  /**
   * Start main theme music on mount
   * Handles browser autoplay policy gracefully via MusicContext
   */
  useEffect(() => {
    playMainTheme()
  }, [playMainTheme])

  /**
   * Handle player selection and navigate to home page
   * @param index - Index of the selected player in the list
   * @returns void
   */
  const handlePlayerSelect = useCallback(
    (index: number): void => {
      selectPlayer(index)
      navigate('/home')
    },
    [selectPlayer, navigate]
  )

  const { selectedIndex, navigateUp, navigateDown, confirmSelection } = useListNavigation({
    items: players,
    defaultIndex: 0,
    onSelect: handlePlayerSelect,
  })

  /**
   * Handle keyboard navigation and selection
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        navigateUp()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        navigateDown()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        confirmSelection()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigateUp, navigateDown, confirmSelection])

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
            onClick={() => handlePlayerSelect(index)}
          >
            <JumpingArrow visible={index === selectedIndex} />
            <span className={styles.playerName}>{player.name}</span>
          </div>
        ))}
      </div>

      <KeyboardHints screenId="player-select" />

      <div className={styles.characterSprite}>🍄</div>
    </div>
  )
}
