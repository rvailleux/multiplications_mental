import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentPlayer } from '../types/player'
import { useListNavigation } from '../hooks/useListNavigation'
import PlayerNameDisplay from '../components/PlayerNameDisplay'
import JumpingArrow from '../components/JumpingArrow'
import KeyboardHints from '../components/KeyboardHints'
import styles from './GameSelectPage.module.scss'

/**
 * Game module option definition
 * @public
 */
interface GameModule {
  /** Route to navigate to when selected */
  route: string
  /** Display emoji icon */
  icon: string
  /** Game title */
  title: string
  /** Short description shown under the title */
  description: string
  /** Badge color token key */
  color: 'teal' | 'orange'
}

/** Available game modules */
const GAME_MODULES: readonly GameModule[] = [
  {
    route: '/home',
    icon: '✖️',
    title: 'MULTIPLICATIONS',
    description: 'Master your times tables!',
    color: 'teal',
  },
  {
    route: '/complement10',
    icon: '➕',
    title: 'COMPLÉMENTS',
    description: 'Find the missing number to reach 10, 100…',
    color: 'orange',
  },
] as const

/**
 * Game selection screen — lets the current player pick which math module to play.
 * Keyboard navigation: ↑↓ to move between modules, Enter to confirm, ESC to change player.
 * @returns {JSX.Element} Game selection page
 * @example
 * // Used in React Router after player selection
 * <Route path="/select-game" element={<GameSelectPage />} />
 */
export default function GameSelectPage() {
  const navigate = useNavigate()
  const currentPlayer = getCurrentPlayer()

  /** Redirect to player selection if no player is selected */
  useEffect(() => {
    if (!currentPlayer) {
      navigate('/')
    }
  }, [currentPlayer, navigate])

  const { selectedIndex, navigateUp, navigateDown, confirmSelection } = useListNavigation({
    items: GAME_MODULES,
    defaultIndex: 0,
    onSelect: (index: number) => navigate(GAME_MODULES[index].route),
  })

  /** Keyboard navigation: ESC → player select, ↑↓ → navigate, Enter → confirm */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        navigate('/')
      } else if (e.key === 'ArrowUp') {
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
  }, [navigate, navigateUp, navigateDown, confirmSelection])

  if (!currentPlayer) return null

  return (
    <div className={styles.gameContainer}>
      <PlayerNameDisplay player={currentPlayer} onClick={() => navigate('/')} />

      <div className={styles.clouds}>
        <div className={styles.cloud}>☁️</div>
        <div className={styles.cloud}>☁️</div>
        <div className={styles.cloud}>☁️</div>
      </div>

      <div className={styles.gameHeader}>
        <h1 className={styles.gameTitle}>⭐ MATH QUEST ⭐</h1>
        <div className={styles.subtitle}>Choose Your Game</div>
      </div>

      <div className={styles.moduleList}>
        {GAME_MODULES.map((module, index) => (
          <div
            key={module.route}
            className={`${styles.moduleCard} ${styles[`moduleCard_${module.color}`]} ${index === selectedIndex ? styles.moduleCardSelected : ''}`}
            onClick={() => navigate(module.route)}
          >
            <JumpingArrow visible={index === selectedIndex} />
            <div className={styles.moduleContent}>
              <div className={styles.moduleIcon}>{module.icon}</div>
              <div className={styles.moduleText}>
                <div className={styles.moduleTitle}>{module.title}</div>
                <div className={styles.moduleDescription}>{module.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.characterSprite}>🍄</div>

      <KeyboardHints screenId="game-select" />
    </div>
  )
}
