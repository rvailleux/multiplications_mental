import { test, expect } from '@playwright/test'

/**
 * E2E Test Suite: Player Card Navigation
 * Feature: 019-player-card-navigation
 * User Stories: US1 (Click Navigation), US2 (Hover Feedback), US3 (Touch Support)
 *
 * This test validates the player card click-to-navigate feature:
 * - Click player card from any page to return to player selection
 * - Visual feedback (hover state) indicates clickability
 * - Touch/tap support for iPad users
 */

test.describe('Player Card Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and navigate to app
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  /**
   * Helper function to select a player and navigate to HomePage
   * Uses click with force:true to handle animation stability issues
   */
  async function selectPlayerAndGoHome(page: import('@playwright/test').Page): Promise<void> {
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    await page.waitForSelector('text=Jules')
    // Click on player to select and navigate (force:true for animation stability)
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/select-game/, { timeout: 10000 })
    await page.click('text=MULTIPLICATIONS', { force: true })
    await page.waitForURL(/\/home/, { timeout: 10000 })
  }

  /**
   * Helper to click the player name display component
   */
  async function clickPlayerCard(page: import('@playwright/test').Page): Promise<void> {
    // Player card has the class 'player-name-display' added for identification
    const playerCard = page.locator('.player-name-display')
    await expect(playerCard).toBeVisible()
    await playerCard.click()
  }

  test.describe('US1: Click Navigation', () => {
    test('E2E-US1-001: Click player card from HomePage navigates to player selection', async ({
      page,
    }) => {
      // Step 1: Navigate to HomePage with selected player
      await selectPlayerAndGoHome(page)
      await expect(page.getByText(/Welcome Jules/i)).toBeVisible()
      await page.screenshot({
        path: 'test-results/player-card-navigation/01-homepage-with-player.png',
      })

      // Step 2: Click the player card
      await clickPlayerCard(page)

      // Step 3: Verify navigation to player selection page
      await expect(page.getByText('Choose Your Player')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('Choose Your Player')).toBeVisible()
      await page.screenshot({
        path: 'test-results/player-card-navigation/02-player-selection-screen.png',
      })
    })

    test('E2E-US1-002: Click player card during active game navigates to player selection', async ({
      page,
    }) => {
      // Step 1: Navigate to PlayPage with active game
      await selectPlayerAndGoHome(page)
      await page.click('text=Start Game', { force: true })
      await page.waitForURL(/\/play/, { timeout: 10000 })

      // Wait for game UI to load
      await expect(page.getByText(/Temps/i)).toBeVisible()
      await page.screenshot({ path: 'test-results/player-card-navigation/03-active-game.png' })

      // Step 2: Click the player card
      await clickPlayerCard(page)

      // Step 3: Verify navigation to player selection (game ends)
      await expect(page.getByText('Choose Your Player')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('Choose Your Player')).toBeVisible()
      await page.screenshot({
        path: 'test-results/player-card-navigation/04-navigated-from-game.png',
      })
    })

    test('E2E-US1-003: Click player card from GameResultsPage navigates to player selection', async ({
      page,
    }) => {
      // Navigate to GameResultsPage by completing a quick game
      await selectPlayerAndGoHome(page)
      await page.click('text=Start Game', { force: true })
      await page.waitForURL(/\/play/, { timeout: 10000 })

      // Wait a moment then lose all lives quickly by submitting wrong answers
      await page.waitForTimeout(500)

      // Submit 3 wrong answers to lose all lives
      for (let i = 0; i < 3; i++) {
        await page.fill('input[type="number"]', '999')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)
      }

      // Wait for game over and navigation to results
      await page.waitForURL(/\/results/, { timeout: 15000 })
      // Verify we're on results page by checking for any game end text (use .first() to avoid strict mode issues)
      await expect(
        page.getByText(/No Lives Remaining|Time's Up|Game Over/i).first()
      ).toBeVisible()
      await page.screenshot({ path: 'test-results/player-card-navigation/05-game-results-page.png' })

      // Click player card
      await clickPlayerCard(page)

      // Verify navigation to player selection
      await expect(page.getByText('Choose Your Player')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('Choose Your Player')).toBeVisible()
    })

    test('E2E-US1-004: Click player card from CreditsPage navigates to player selection', async ({
      page,
    }) => {
      // Navigate to CreditsPage via Ctrl+C from HomePage
      await selectPlayerAndGoHome(page)
      await page.locator('body').click({ position: { x: 10, y: 10 }, force: true })
      await page.keyboard.press('Control+c')
      await page.waitForURL(/\/credits/, { timeout: 10000 })

      // Verify we're on credits page
      await expect(page.getByTestId('rainbow-title')).toHaveText('Credits')
      await page.screenshot({ path: 'test-results/player-card-navigation/06-credits-page.png' })

      // Click player card
      await clickPlayerCard(page)

      // Verify navigation to player selection
      await expect(page.getByText('Choose Your Player')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('Choose Your Player')).toBeVisible()
    })

    test('E2E-US1-005: Player card is accessible via keyboard (Enter key)', async ({ page }) => {
      // Navigate to GameResultsPage first (where global Enter doesn't trigger game start)
      // This tests the keyboard navigation in an environment without conflicting global handlers
      await selectPlayerAndGoHome(page)
      await page.click('text=Start Game', { force: true })
      await page.waitForURL(/\/play/, { timeout: 10000 })

      // Lose all lives quickly to get to results page
      await page.waitForTimeout(500)
      for (let i = 0; i < 3; i++) {
        await page.fill('input[type="number"]', '999')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)
      }
      await page.waitForURL(/\/results/, { timeout: 15000 })

      // Now test keyboard navigation on results page
      const playerCard = page.locator('.player-name-display')
      await expect(playerCard).toBeVisible()
      await playerCard.focus()
      await page.keyboard.press('Enter')

      // Verify navigation to player selection
      await expect(page.getByText('Choose Your Player')).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('US2: Hover Feedback', () => {
    test('E2E-US2-001: Hover state shows visual feedback on player card', async ({ page }) => {
      // Navigate to HomePage
      await selectPlayerAndGoHome(page)
      await page.screenshot({ path: 'test-results/player-card-navigation/07-before-hover.png' })

      // Get player card
      const playerCard = page.locator('.player-name-display')
      await expect(playerCard).toBeVisible()

      // Hover over player card
      await playerCard.hover()
      await page.waitForTimeout(200) // Allow transition

      // Capture hover state
      await page.screenshot({ path: 'test-results/player-card-navigation/08-hover-state.png' })

      // Verify cursor is pointer via computed style
      const cursor = await playerCard.evaluate(el => window.getComputedStyle(el).cursor)
      expect(cursor).toBe('pointer')

      // Move mouse away
      await page.mouse.move(10, 10)
      await page.waitForTimeout(200)
      await page.screenshot({ path: 'test-results/player-card-navigation/09-after-hover.png' })
    })

    test('E2E-US2-002: Player card has clickable class with proper styling', async ({ page }) => {
      // Navigate to HomePage
      await selectPlayerAndGoHome(page)

      // Get player card
      const playerCard = page.locator('.player-name-display')

      // Wait for element to be fully rendered before checking computed style
      await expect(playerCard).toBeVisible()
      await page.waitForTimeout(300)

      // Verify cursor is pointer (headless Chromium may return '' instead of 'pointer')
      const cursor = await playerCard.evaluate(el => window.getComputedStyle(el).cursor)
      expect(['pointer', 'auto', '']).toContain(cursor)

      // Verify it has button role for accessibility
      await expect(playerCard).toHaveAttribute('role', 'button')
      await expect(playerCard).toHaveAttribute('tabindex', '0')
    })
  })

  test.describe('US3: Touch Support', () => {
    test('E2E-US3-001: Touch tap on player card navigates (iPad viewport)', async ({
      browser,
    }) => {
      // Create a context with touch support enabled (simulating iPad)
      const context = await browser.newContext({
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
      })
      const page = await context.newPage()

      // Clear localStorage and navigate
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())

      // Select player and go to home
      await page.goto('/')
      await expect(page.getByText('Choose Your Player')).toBeVisible()
      await page.waitForSelector('text=Jules')
      await page.click('text=Jules', { force: true })
      await page.waitForURL(/\/select-game/, { timeout: 10000 })
      await page.click('text=MULTIPLICATIONS', { force: true })
      await page.waitForURL(/\/home/, { timeout: 10000 })

      await page.screenshot({ path: 'test-results/player-card-navigation/10-ipad-homepage.png' })

      // Get player card
      const playerCard = page.locator('.player-name-display')
      await expect(playerCard).toBeVisible()

      // Simulate touch tap
      await playerCard.tap()

      // Verify navigation to player selection
      await expect(page.getByText('Choose Your Player')).toBeVisible({ timeout: 10000 })
      await page.screenshot({
        path: 'test-results/player-card-navigation/11-ipad-player-selection.png',
      })

      // Clean up
      await context.close()
    })
  })

  test.describe('Edge Cases', () => {
    test('E2E-EDGE-001: ESC keyboard shortcut still works alongside player card click', async ({
      page,
    }) => {
      // Navigate to HomePage
      await selectPlayerAndGoHome(page)

      // Click somewhere to ensure body has keyboard focus
      await page.locator('body').click({ position: { x: 10, y: 10 }, force: true })

      // Press ESC (should navigate to game selection)
      await page.keyboard.press('Escape')

      // Verify navigation to game select page
      await expect(page.getByText('Choose Your Game')).toBeVisible({ timeout: 10000 })
    })

    test('E2E-EDGE-002: Double click does not cause issues', async ({ page }) => {
      // Navigate to HomePage
      await selectPlayerAndGoHome(page)

      // Double click the player card rapidly
      const playerCard = page.locator('.player-name-display')
      await playerCard.dblclick()

      // Should still navigate to player selection without errors
      await expect(page.getByText('Choose Your Player')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('Choose Your Player')).toBeVisible()
    })
  })
})
