import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerManagement } from '../hooks/usePlayerManagement'

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

  return (
    <div style={styles.gameContainer}>
      <div style={styles.clouds}>
        <div style={styles.cloud}>☁️</div>
        <div style={styles.cloud}>☁️</div>
        <div style={styles.cloud}>☁️</div>
      </div>

      <div style={styles.gameHeader}>
        <h1 style={styles.gameTitle}>⭐ MATH QUEST ⭐</h1>
        <div style={styles.subtitle}>Choose Your Player</div>
      </div>

      <div style={styles.playerList}>
        {players.map((player, index) => (
          <div
            key={player.id}
            style={{
              ...styles.playerCard,
              ...(index === selectedIndex ? styles.selectedCard : {}),
            }}
            onClick={() => {
              selectPlayer(index)
              navigate('/home')
            }}
          >
            {index === selectedIndex && <span style={styles.cursor}>▶</span>}
            <span style={styles.playerName}>{player.name}</span>
          </div>
        ))}
      </div>

      <div style={styles.instructions}>
        <div style={styles.instructionText}>↑ ↓ Arrow Keys to Navigate</div>
        <div style={styles.instructionText}>↵ Enter to Select</div>
      </div>

      <div style={styles.characterSprite}>🍄</div>
    </div>
  )
}

const styles = {
  gameContainer: {
    background: '#fff',
    border: '8px solid #000',
    boxShadow: `
      0 0 0 4px #fff,
      0 0 0 8px #000,
      12px 12px 0 0 rgba(0,0,0,0.3)
    `,
    maxWidth: '600px',
    width: '100%',
    padding: '30px',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  clouds: {
    position: 'absolute' as const,
    top: '20px',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'space-around',
    pointerEvents: 'none' as const,
  },
  cloud: {
    fontSize: '24px',
    opacity: 0.7,
    animation: 'float 8s ease-in-out infinite',
  },
  gameHeader: {
    background: 'linear-gradient(180deg, #ff6b6b 0%, #ee5a5a 100%)',
    border: '4px solid #000',
    padding: '20px',
    marginBottom: '30px',
    position: 'relative' as const,
    boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.2)',
    width: '100%',
    textAlign: 'center' as const,
  },
  gameTitle: {
    color: '#fff',
    fontSize: '20px',
    textShadow: `
      4px 4px 0 #000,
      -2px -2px 0 #000
    `,
    marginBottom: '10px',
    letterSpacing: '2px',
  },
  subtitle: {
    color: '#fff',
    fontSize: '12px',
    textShadow: '2px 2px 0 #000',
  },
  playerList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    width: '100%',
    marginBottom: '30px',
  },
  playerCard: {
    background: 'linear-gradient(180deg, #87ceeb 0%, #fff 100%)',
    border: '4px solid #000',
    padding: '20px 20px 20px 50px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'all 0.1s',
    boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.5)',
  },
  selectedCard: {
    background: 'linear-gradient(180deg, #ffd700 0%, #fff8dc 100%)',
    border: '4px solid #b8860b',
    boxShadow: `
      inset 0 4px 0 rgba(255,255,255,0.7),
      0 0 12px rgba(255, 215, 0, 0.5)
    `,
    transform: 'scale(1.05)',
  },
  cursor: {
    position: 'absolute' as const,
    left: '15px',
    fontSize: '20px',
    animation: 'bounce 1s ease-in-out infinite',
  },
  playerName: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold' as const,
    textShadow: '2px 2px 0 rgba(255,255,255,0.5)',
  },
  instructions: {
    background: 'linear-gradient(180deg, #4ecdc4 0%, #44b3aa 100%)',
    border: '4px solid #000',
    padding: '15px',
    textAlign: 'center' as const,
    width: '100%',
    boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.2)',
  },
  instructionText: {
    color: '#fff',
    fontSize: '10px',
    textShadow: '2px 2px 0 #000',
    marginBottom: '5px',
  },
  characterSprite: {
    position: 'absolute' as const,
    bottom: '-50px',
    right: '20px',
    fontSize: '64px',
    animation: 'bounce 1s ease-in-out infinite',
  },
}
