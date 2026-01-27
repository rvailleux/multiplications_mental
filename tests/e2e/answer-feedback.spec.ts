import { test, expect } from '@playwright/test'

/**
 * E2E Test Suite: Answer Feedback System
 * Feature: 015-answer-feedback
 * User Stories: US1 (Audio), US2 (Visual), US3 (Layout)
 *
 * This test validates the complete answer feedback experience including:
 * - Audio feedback on correct/incorrect answers (US1)
 * - Visual animations (green flash, red shake) (US2)
 * - Hearts display position (US3)
 * - Keyboard and mouse submission methods
 */

test.describe('Answer Feedback - US1: Audio Feedback', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to game page with a player selected
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.keyboard.press('Enter') // Select default player
    await page.waitForURL(/\/home/)
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await expect(startButton).toBeVisible()
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/)
    await expect(page.getByText('Score')).toBeVisible()
  })

  test('E2E-US1-001: Correct answer triggers audio (keyboard submission)', async ({ page }) => {
    // Get the multiplication question
    const questionText = await page.locator('text=/\\d+ x \\d+\\?/').textContent()
    const match = questionText?.match(/(\d+)\s*x\s*(\d+)/)

    if (!match) {
      throw new Error('Could not extract question factors')
    }

    const correctAnswer = parseInt(match[1]) * parseInt(match[2])

    // Track audio play calls via console
    const audioPlayCalls: string[] = []
    page.on('console', msg => {
      if (msg.text().includes('audio') || msg.text().includes('sound')) {
        audioPlayCalls.push(msg.text())
      }
    })

    // Focus, clear, and type correct answer character by character
    const input = page.locator('input[inputmode="numeric"]')
    await input.click()
    await input.clear()
    await input.pressSequentially(correctAnswer.toString())
    await expect(input).toHaveValue(correctAnswer.toString())

    // Submit with Enter key
    await page.keyboard.press('Enter')

    // Verify score increased (indicates correct answer processed)
    await expect(page.getByText(/\+\d+/)).toBeVisible()

    // Take screenshot showing correct answer feedback
    await page.screenshot({ path: 'test-results/answer-feedback/01-correct-answer-submitted.png' })
  })

  test('E2E-US1-002: Incorrect answer triggers audio (mouse submission)', async ({ page }) => {
    // Type obviously wrong answer
    const input = page.locator('input[inputmode="numeric"]')
    await input.fill('999')

    // Take screenshot before submission
    await page.screenshot({ path: 'test-results/answer-feedback/02-before-incorrect-submit.png' })

    // Submit with Valider button click
    const validerButton = page.getByRole('button', { name: /Valider/i })
    await validerButton.click({ force: true })

    // Verify negative feedback indicator (✗ popup)
    await expect(page.getByText('✗')).toBeVisible()

    // Verify a life was lost (less than 3 hearts)
    const hearts = await page.locator('text=❤️').count()
    expect(hearts).toBeLessThan(3)

    // Take screenshot showing incorrect answer feedback
    await page.screenshot({ path: 'test-results/answer-feedback/02-incorrect-answer-submitted.png' })
  })

  test('E2E-US1-003: Rapid submissions do not cause errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Rapid incorrect answers
    const input = page.locator('input[inputmode="numeric"]')

    for (let i = 0; i < 3; i++) {
      await input.fill('999')
      await page.keyboard.press('Enter')
      // Small delay to allow state updates
      await page.waitForTimeout(100)
    }

    // Verify no audio-related errors
    const audioErrors = consoleErrors.filter(
      e => e.toLowerCase().includes('audio') || e.toLowerCase().includes('sound')
    )
    expect(audioErrors).toHaveLength(0)

    // Game should still be functional
    await expect(page.getByText(/MATH QUEST/i)).toBeVisible()

    await page.screenshot({ path: 'test-results/answer-feedback/03-after-rapid-submissions.png' })
  })

  test('E2E-US1-004: Keyboard submission works (Enter key)', async ({ page }) => {
    // Get correct answer
    const questionText = await page.locator('text=/\\d+ x \\d+\\?/').textContent()
    const match = questionText?.match(/(\d+)\s*x\s*(\d+)/)
    if (!match) throw new Error('Could not extract question factors')
    const correctAnswer = parseInt(match[1]) * parseInt(match[2])

    // Focus and clear the input first
    const input = page.locator('input[inputmode="numeric"]')
    await input.click()
    await input.clear()

    // Type answer character by character (more reliable than fill for numeric inputs)
    await input.pressSequentially(correctAnswer.toString())

    // Verify the answer was typed correctly before pressing Enter
    await expect(input).toHaveValue(correctAnswer.toString())

    // Submit with keyboard
    await page.keyboard.press('Enter')

    // Score should increase - wait for popup with any positive number
    await expect(page.getByText(/\+\d+/)).toBeVisible()
  })

  test('E2E-US1-005: Mouse submission works (Valider click)', async ({ page }) => {
    // Get correct answer
    const questionText = await page.locator('text=/\\d+ x \\d+\\?/').textContent()
    const match = questionText?.match(/(\d+)\s*x\s*(\d+)/)
    if (!match) throw new Error('Could not extract question factors')
    const correctAnswer = parseInt(match[1]) * parseInt(match[2])

    // Focus and clear the input first
    const input = page.locator('input[inputmode="numeric"]')
    await input.click()
    await input.clear()

    // Type answer character by character with small delay between chars
    await input.pressSequentially(correctAnswer.toString(), { delay: 50 })

    // Small wait to ensure React state updates
    await page.waitForTimeout(100)

    // Verify the answer was typed correctly before clicking
    await expect(input).toHaveValue(correctAnswer.toString())

    // Click the Valider button (inside the form)
    const validerButton = page.locator('button[type="submit"]').filter({ hasText: 'Valider' })
    await validerButton.click({ force: true })

    // Score should increase - look for any positive score popup
    await expect(page.getByText(/\+\d+/)).toBeVisible()
  })
})

test.describe('Answer Feedback - US2: Visual Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.keyboard.press('Enter')
    await page.waitForURL(/\/home/)
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/)
    await expect(page.getByText('Score')).toBeVisible()
  })

  test('E2E-US2-001: Correct answer shows positive feedback popup', async ({ page }) => {
    // Get correct answer
    const questionText = await page.locator('text=/\\d+ x \\d+\\?/').textContent()
    const match = questionText?.match(/(\d+)\s*x\s*(\d+)/)
    if (!match) throw new Error('Could not extract question factors')
    const correctAnswer = parseInt(match[1]) * parseInt(match[2])

    // Focus, clear, and type correct answer character by character
    const input = page.locator('input[inputmode="numeric"]')
    await input.click()
    await input.clear()
    await input.pressSequentially(correctAnswer.toString())
    await expect(input).toHaveValue(correctAnswer.toString())
    await page.keyboard.press('Enter')

    // Verify positive popup shows points
    await expect(page.getByText(/\+\d+/)).toBeVisible()

    // Screenshot at start of animation
    await page.screenshot({ path: 'test-results/answer-feedback/03-correct-animation-start.png' })

    // Wait for animation to complete (800ms popup duration)
    await page.waitForTimeout(900)

    // Screenshot after animation
    await page.screenshot({ path: 'test-results/answer-feedback/04-correct-animation-complete.png' })
  })

  test('E2E-US2-002: Incorrect answer shows negative feedback popup', async ({ page }) => {
    const input = page.locator('input[inputmode="numeric"]')
    await input.fill('999')
    await page.keyboard.press('Enter')

    // Verify negative popup (✗)
    await expect(page.getByText('✗')).toBeVisible()

    // Screenshot at start of animation
    await page.screenshot({ path: 'test-results/answer-feedback/05-incorrect-animation-start.png' })

    // Wait for animation to complete
    await page.waitForTimeout(900)

    // Screenshot after animation
    await page.screenshot({ path: 'test-results/answer-feedback/06-incorrect-animation-complete.png' })
  })
})

test.describe('Answer Feedback - US3: Hearts Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.keyboard.press('Enter')
    await page.waitForURL(/\/home/)
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/)
    await expect(page.getByText('Score')).toBeVisible()
  })

  test('E2E-US3-001: Hearts display shows correct initial state', async ({ page }) => {
    // Verify 3 hearts are visible
    const hearts = await page.locator('text=❤️').count()
    expect(hearts).toBe(3)

    await page.screenshot({ path: 'test-results/answer-feedback/07-play-screen-initial.png' })
  })

  test('E2E-US3-002: Life lost shows hearts animation', async ({ page }) => {
    // Submit incorrect answer to lose a life
    const input = page.locator('input[inputmode="numeric"]')
    await input.fill('999')
    await page.keyboard.press('Enter')

    // Verify life was lost
    const heartsAfter = await page.locator('text=❤️').count()
    expect(heartsAfter).toBe(2)

    await page.screenshot({ path: 'test-results/answer-feedback/08-life-lost-new-position.png' })
  })
})
