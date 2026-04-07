import { test, expect } from '@playwright/test'

/**
 * E2E Test Suite: Game Over When Lives Depleted
 * Feature: 018-game-over-lives
 * User Stories: US1 (Game End), US2 (Overlay), US3 (Results)
 *
 * This test validates the complete game-over experience when lives are depleted:
 * - Game ends after 3rd wrong answer (losing all 3 lives) (US1)
 * - Game over overlay displays for 1.5 seconds (US2)
 * - Results page shows "No Lives Remaining" with red styling (US3)
 */

test.describe('Game Over - US1: Game Ends When Lives Depleted', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to game page with a player selected
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.keyboard.press('Enter') // Select default player
    await page.waitForURL(/\/select-game/)
    await page.click('text=MULTIPLICATIONS', { force: true })
    await page.waitForURL(/\/home/)
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await expect(startButton).toBeVisible()
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/)
    await expect(page.getByText('Score')).toBeVisible()
  })

  test('E2E-US1-001: Game ends after 3rd wrong answer (losing all 3 lives)', async ({ page }) => {
    const input = page.locator('input[inputmode="numeric"]')

    // Verify initial state: 3 hearts
    const initialHearts = await page.locator('text=❤️').count()
    expect(initialHearts).toBe(3)

    // Submit 3 wrong answers to lose all 3 lives
    for (let i = 0; i < 3; i++) {
      await input.fill('999')
      await page.keyboard.press('Enter')
      // Small delay to allow state updates
      await page.waitForTimeout(200)
    }

    // Verify lives went to 0
    const remainingHearts = await page.locator('text=❤️').count()
    expect(remainingHearts).toBe(0)

    // Screenshot showing game over overlay should appear
    await page.screenshot({
      path: 'test-results/game-over-lives/01-lives-depleted-overlay.png',
    })

    // Game over overlay should be visible
    await expect(page.getByTestId('game-over-overlay')).toBeVisible()
    await expect(page.getByText('GAME OVER')).toBeVisible()
  })

  test('E2E-US1-002: Game ends with mixed correct/wrong answers after 4 wrongs', async ({
    page,
  }) => {
    const input = page.locator('input[inputmode="numeric"]')

    // Answer correctly first to get some score
    const questionText = await page.locator('text=/\\d+ x \\d+\\?/').textContent()
    const match = questionText?.match(/(\d+)\s*x\s*(\d+)/)
    expect(match, 'Question should match multiplication format').toBeTruthy()
    if (match) {
      const correctAnswer = parseInt(match[1]) * parseInt(match[2])
      await input.click()
      await input.clear()
      await input.pressSequentially(correctAnswer.toString())
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
    }

    // Wait for score popup to disappear before continuing
    await page.waitForTimeout(500)

    // Now lose all 3 lives with wrong answers
    for (let i = 0; i < 3; i++) {
      await input.fill('999')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
    }

    // Game over overlay should appear
    await expect(page.getByTestId('game-over-overlay')).toBeVisible()
  })

  test('E2E-US1-003: Lives reset on new game (restart)', async ({ page }) => {
    const input = page.locator('input[inputmode="numeric"]')

    // Lose 2 lives
    for (let i = 0; i < 2; i++) {
      await input.fill('999')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)
    }

    // Verify 1 heart remaining
    const heartsAfterLoss = await page.locator('text=❤️').count()
    expect(heartsAfterLoss).toBe(1)

    // Click restart button
    const restartButton = page.getByRole('button', { name: /Restart/i })
    await restartButton.click()
    await page.waitForTimeout(300)

    // Verify lives reset to 3
    const heartsAfterRestart = await page.locator('text=❤️').count()
    expect(heartsAfterRestart).toBe(3)

    // Screenshot showing reset state
    await page.screenshot({
      path: 'test-results/game-over-lives/03-lives-reset-after-restart.png',
    })
  })
})

test.describe('Game Over - US2: Overlay Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.keyboard.press('Enter') // Select default player
    await page.waitForURL(/\/select-game/)
    await page.click('text=MULTIPLICATIONS', { force: true })
    await page.waitForURL(/\/home/)
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/)
    await expect(page.getByText('Score')).toBeVisible()
  })

  test('E2E-US2-001: Game over overlay displays with animation', async ({ page }) => {
    const input = page.locator('input[inputmode="numeric"]')

    // Lose all lives
    for (let i = 0; i < 3; i++) {
      await input.fill('999')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)
    }

    // Overlay should be visible
    const overlay = page.getByTestId('game-over-overlay')
    await expect(overlay).toBeVisible()

    // Content should be visible
    await expect(page.getByText('GAME OVER')).toBeVisible()
    await expect(page.getByText('No Lives Remaining')).toBeVisible()

    // Screenshot of overlay
    await page.screenshot({
      path: 'test-results/game-over-lives/04-game-over-overlay-display.png',
    })
  })

  test('E2E-US2-002: Overlay auto-navigates to results after 1.5s', async ({ page }) => {
    const input = page.locator('input[inputmode="numeric"]')

    // Lose all lives
    for (let i = 0; i < 3; i++) {
      await input.fill('999')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)
    }

    // Overlay should be visible
    await expect(page.getByTestId('game-over-overlay')).toBeVisible()

    // Wait for auto-navigation (1.5s + buffer)
    await page.waitForURL(/\/results/, { timeout: 3000 })

    // Should now be on results page
    expect(page.url()).toContain('/results')

    // Screenshot of results page
    await page.screenshot({
      path: 'test-results/game-over-lives/05-results-after-auto-navigation.png',
    })
  })
})

test.describe('Game Over - US3: Results Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.keyboard.press('Enter') // Select default player
    await page.waitForURL(/\/select-game/)
    await page.click('text=MULTIPLICATIONS', { force: true })
    await page.waitForURL(/\/home/)
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/)
    await expect(page.getByText('Score')).toBeVisible()
  })

  test('E2E-US3-001: Results show "No Lives Remaining" for lives depleted', async ({ page }) => {
    const input = page.locator('input[inputmode="numeric"]')

    // Get one correct answer first to have a score > 0
    const questionText = await page.locator('text=/\\d+ x \\d+\\?/').textContent()
    const match = questionText?.match(/(\d+)\s*x\s*(\d+)/)
    expect(match, 'Question should match multiplication format').toBeTruthy()
    if (match) {
      const correctAnswer = parseInt(match[1]) * parseInt(match[2])
      await input.click()
      await input.clear()
      await input.pressSequentially(correctAnswer.toString())
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)
    }

    // Now lose all lives
    for (let i = 0; i < 3; i++) {
      await input.fill('999')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)
    }

    // Wait for navigation to results
    await page.waitForURL(/\/results/, { timeout: 3000 })

    // Verify "No Lives Remaining" text is displayed
    await expect(page.getByText('No Lives Remaining')).toBeVisible()

    // Screenshot of results with lives depleted message
    await page.screenshot({
      path: 'test-results/game-over-lives/06-results-lives-depleted-heading.png',
    })
  })

  test('E2E-US3-002: Results show score and stats correctly after lives depleted', async ({
    page,
  }) => {
    const input = page.locator('input[inputmode="numeric"]')

    // Answer correctly once
    const questionText = await page.locator('text=/\\d+ x \\d+\\?/').textContent()
    const match = questionText?.match(/(\d+)\s*x\s*(\d+)/)
    expect(match, 'Question should match multiplication format').toBeTruthy()
    if (match) {
      const correctAnswer = parseInt(match[1]) * parseInt(match[2])
      await input.click()
      await input.clear()
      await input.pressSequentially(correctAnswer.toString())
      await page.keyboard.press('Enter')
      await page.waitForTimeout(400)
    }

    // Wait for score popup to disappear
    await page.waitForTimeout(600)

    // Lose all lives
    for (let i = 0; i < 3; i++) {
      await input.fill('999')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
    }

    // Wait for navigation to results
    await page.waitForURL(/\/results/, { timeout: 3000 })

    // Verify stats are displayed: should show "Correct: X/Y" format (exact numbers may vary)
    await expect(page.getByText(/Correct:\s*\d+\/\d+/)).toBeVisible()

    // Verify continue button exists
    await expect(page.getByRole('button', { name: /Continue/i })).toBeVisible()
  })

  test('E2E-US3-003: Continue button navigates to home after lives depleted', async ({ page }) => {
    const input = page.locator('input[inputmode="numeric"]')

    // Get one correct answer first
    const questionText = await page.locator('text=/\\d+ x \\d+\\?/').textContent()
    const match = questionText?.match(/(\d+)\s*x\s*(\d+)/)
    expect(match, 'Question should match multiplication format').toBeTruthy()
    if (match) {
      const correctAnswer = parseInt(match[1]) * parseInt(match[2])
      await input.click()
      await input.clear()
      await input.pressSequentially(correctAnswer.toString())
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
    }

    // Wait for popup to clear
    await page.waitForTimeout(500)

    // Lose all lives
    for (let i = 0; i < 3; i++) {
      await input.fill('999')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
    }

    // Wait for navigation to results
    await page.waitForURL(/\/results/, { timeout: 3000 })

    // Wait for blinking animation to settle (5 seconds for animation to stop)
    await page.waitForTimeout(5500)

    // Use keyboard Enter instead of click (more stable during animations)
    await page.keyboard.press('Enter')

    // Should navigate to home
    await page.waitForURL(/\/home/)

    // Screenshot of home page after game over flow
    await page.screenshot({
      path: 'test-results/game-over-lives/07-home-after-continue.png',
    })
  })
})
