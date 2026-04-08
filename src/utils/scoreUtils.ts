import type { ScoreEntry } from '../types/score'

/**
 * Represents a score with its rank information
 * @public
 */
export interface RankedScore extends ScoreEntry {
  rank: number
  medal?: string
}

/**
 * Represents calculated performance metrics for a game session
 * @public
 */
export interface GameMetrics {
  /** Accuracy percentage (0-100) */
  accuracy: number
  /** Average seconds per correct answer (lower = faster), or null if no correct answers */
  speed: number | null
  /** Number of correct answers */
  correctCount: number
  /** Total number of questions attempted */
  totalQuestions: number
}

/**
 * Calculate performance metrics from a results array
 * @param results - Array of question results
 * @returns Calculated metrics
 */
export function calculateMetrics(
  results: Array<{ question: string; correct: boolean }>
): GameMetrics {
  const correctCount = results.filter(r => r.correct).length
  const totalQuestions = results.length
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const GAME_DURATION_SECONDS = 60
  const speed = correctCount > 0 ? GAME_DURATION_SECONDS / correctCount : null

  return { accuracy, speed, correctCount, totalQuestions }
}

/**
 * Find indices of scores with best speed and accuracy metrics
 * @param scores - Array of score entries
 * @returns Objects with indices of best-speed and best-accuracy entries
 */
export function findBestMetrics(scores: ScoreEntry[]): {
  bestSpeedIndices: number[]
  bestAccuracyIndices: number[]
} {
  if (scores.length === 0) {
    return { bestSpeedIndices: [], bestAccuracyIndices: [] }
  }

  let bestSpeed: number | null = null
  let bestAccuracy = 0
  const bestSpeedIndices: number[] = []
  const bestAccuracyIndices: number[] = []

  // First pass: find best values
  scores.forEach(score => {
    const metrics = calculateMetrics(score.results)
    if (metrics.speed !== null) {
      if (bestSpeed === null || metrics.speed < bestSpeed) {
        bestSpeed = metrics.speed
      }
    }
    if (metrics.accuracy > bestAccuracy) {
      bestAccuracy = metrics.accuracy
    }
  })

  // Second pass: collect indices of best metrics
  scores.forEach((score, index) => {
    const metrics = calculateMetrics(score.results)
    if (metrics.speed !== null && bestSpeed !== null && metrics.speed === bestSpeed) {
      bestSpeedIndices.push(index)
    }
    if (metrics.accuracy === bestAccuracy && bestAccuracy > 0) {
      bestAccuracyIndices.push(index)
    }
  })

  return { bestSpeedIndices, bestAccuracyIndices }
}

/**
 * Calculate ranks for an array of scores, handling ties.
 * Scores are sorted highest-first; tied scores share the same rank.
 * @param scores - Array of score entries
 * @returns Scores with rank and medal information
 */
export function calculateRanks(scores: ScoreEntry[]): RankedScore[] {
  const sorted = [...scores].sort((a, b) => b.score - a.score)
  const ranked: RankedScore[] = []
  let currentRank = 1

  for (let i = 0; i < sorted.length; i++) {
    const score = sorted[i]
    if (i > 0 && score.score !== sorted[i - 1].score) {
      currentRank = i + 1
    }
    let medal: string | undefined
    if (currentRank === 1) medal = '🥇'
    else if (currentRank === 2) medal = '🥈'
    else if (currentRank === 3) medal = '🥉'

    ranked.push({ ...score, rank: currentRank, medal })
  }

  return ranked
}
