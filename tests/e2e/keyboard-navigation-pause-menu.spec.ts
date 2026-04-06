import { test, expect } from '@playwright/test'

/**
 * E2E Test Suite: Keyboard Navigation - Pause Menu
 * Feature: 012-keyboard-navigation
 * User Story: Enhanced keyboard navigation with pause menu functionality
 *
 * This test validates the complete user journey including:
 * - Player selection with keyboard
 * - Game navigation
 * - Pause menu activation (ESC key)
 * - Pause menu keyboard navigation (ArrowUp/Down)
 * - Continue and Quit functionality
 * - Visual state validation with screenshots
 */

test.describe('Keyboard Navigation - Pause Menu', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('E2E-US1-001: Player selects character, starts game, and uses pause menu with keyboard', async ({
    page,
  }) => {
    // Step 1: Navigate to app and select player with keyboard
    await page.goto('/')
    await page.screenshot({ path: 'test-results/pause-menu/01-player-select.png' })

    // Validate initial state
    await expect(page.getByText('Choose Your Player')).toBeVisible()

    // Use keyboard to confirm player selection (Jules is selected by default)
    await page.keyboard.press('Enter')

    // Step 2: Verify navigation to game select page
    await expect(page).toHaveURL(/\/select-game/)
    await expect(page.getByText('Choose Your Game')).toBeVisible()

    // Select Multiplications game (first option, selected by default)
    await page.keyboard.press('Enter')

    // Verify navigation to home page
    await expect(page).toHaveURL(/\/home/)
    await expect(page.getByText(/Welcome Jules/i)).toBeVisible()
    await page.screenshot({ path: 'test-results/pause-menu/02-home-page.png' })

    // Step 3: Start the game
    // Note: force:true needed because pulse animation makes element "not stable"
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await expect(startButton).toBeVisible()
    await startButton.click({ force: true })

    // Step 4: Verify game page loaded
    await expect(page).toHaveURL(/\/play/)
    await expect(page.getByText(/MATH QUEST/i)).toBeVisible()

    // Wait for game to be fully interactive (check for score display)
    await expect(page.getByText('Score')).toBeVisible()
    await page.screenshot({ path: 'test-results/pause-menu/03-game-playing.png' })

    // Step 5: Open pause menu with ESC key
    await page.keyboard.press('Escape')

    // Verify pause menu is visible
    await expect(page.getByText('⏸ PAUSE ⏸')).toBeVisible()
    await expect(page.getByRole('button', { name: /Continue/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Quit/i })).toBeVisible()

    // Verify Continue is selected by default (has ▶ indicator)
    await expect(page.getByRole('button', { name: /▶ Continue/i })).toBeVisible()
    await page.screenshot({ path: 'test-results/pause-menu/04-pause-menu-continue-selected.png' })

    // Step 6: Navigate to Quit option with ArrowDown
    await page.keyboard.press('ArrowDown')

    // Verify Quit is now selected
    await expect(page.getByRole('button', { name: /▶ Quit/i })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible() // No arrow
    await page.screenshot({ path: 'test-results/pause-menu/05-pause-menu-quit-selected.png' })

    // Step 7: Navigate back to Continue with ArrowUp
    await page.keyboard.press('ArrowUp')

    // Verify Continue is selected again
    await expect(page.getByRole('button', { name: /▶ Continue/i })).toBeVisible()

    // Step 8: Close pause menu with Escape
    await page.keyboard.press('Escape')

    // Verify pause menu is closed and game is visible
    await expect(page.getByText('⏸ PAUSE ⏸')).not.toBeVisible()
    await expect(page.getByText(/MATH QUEST/i)).toBeVisible()
    await page.screenshot({ path: 'test-results/pause-menu/06-game-resumed.png' })
  })

  test('E2E-US1-002: Pause menu Continue functionality resumes game', async ({ page }) => {
    // Navigate through to game
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    await page.waitForSelector('text=Jules', { state: 'visible' })
    await page.keyboard.press('Enter') // Select player
    await page.waitForURL(/\/select-game/, { timeout: 10000 })
    await page.keyboard.press('Enter') // Select Multiplications game
    await page.waitForURL(/\/home/, { timeout: 10000 })

    // Wait for home page to be fully rendered
    await expect(page.getByText(/Welcome/i)).toBeVisible()

    // Note: force:true needed because pulse animation makes element "not stable"
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await expect(startButton).toBeVisible()
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })

    // Wait for game to be fully interactive
    await expect(page.getByText('Score')).toBeVisible()
    await expect(page.locator('input[inputmode="numeric"]')).toBeVisible()

    // Open pause menu
    await page.keyboard.press('Escape')
    await expect(page.getByText('⏸ PAUSE ⏸')).toBeVisible({ timeout: 5000 })

    // Verify Continue button is visible and selected
    await expect(page.getByRole('button', { name: /▶ Continue/i })).toBeVisible()

    // Wait a moment (timer should be paused)
    await page.waitForTimeout(1000)

    // Continue with Enter key (Continue is selected by default)
    await page.keyboard.press('Enter')

    // Verify pause menu closed
    await expect(page.getByText('⏸ PAUSE ⏸')).not.toBeVisible({ timeout: 5000 })

    // Verify still on game page
    await expect(page).toHaveURL(/\/play/)
    await expect(page.getByText('Score')).toBeVisible()
  })

  test('E2E-US1-003: Pause menu Quit functionality returns to home', async ({ page }) => {
    // Navigate through to game
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    await page.waitForSelector('text=Jules', { state: 'visible' })
    await page.keyboard.press('Enter') // Select player
    await page.waitForURL(/\/select-game/, { timeout: 10000 })
    await page.keyboard.press('Enter') // Select Multiplications game
    await page.waitForURL(/\/home/, { timeout: 10000 })

    // Wait for home page to be fully rendered
    await expect(page.getByText(/Welcome/i)).toBeVisible()

    // Note: force:true needed because pulse animation makes element "not stable"
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await expect(startButton).toBeVisible()
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })

    // Wait for game to be fully interactive
    await expect(page.getByText('Score')).toBeVisible()
    await expect(page.locator('input[inputmode="numeric"]')).toBeVisible()

    // Open pause menu
    await page.keyboard.press('Escape')
    await expect(page.getByText('⏸ PAUSE ⏸')).toBeVisible({ timeout: 5000 })

    // Navigate to Quit and confirm
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('button', { name: /▶ Quit/i })).toBeVisible({ timeout: 5000 })

    // Press Enter to quit
    await page.keyboard.press('Enter')

    // Verify navigation to home page
    await expect(page).toHaveURL(/\/home/, { timeout: 10000 })
    await expect(page.getByText(/Welcome Jules/i)).toBeVisible()
  })

  test('E2E-US1-004: Mouse interactions work alongside keyboard', async ({ page }) => {
    // Navigate through to game
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    await page.waitForSelector('text=Jules', { state: 'visible' })
    await page.keyboard.press('Enter') // Select player
    await page.waitForURL(/\/select-game/, { timeout: 10000 })
    await page.keyboard.press('Enter') // Select Multiplications game
    await page.waitForURL(/\/home/, { timeout: 10000 })

    // Wait for home page to be fully rendered
    await expect(page.getByText(/Welcome/i)).toBeVisible()

    // Note: force:true needed because pulse animation makes element "not stable"
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await expect(startButton).toBeVisible()
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })

    // Wait for game to be fully interactive
    await expect(page.getByText('Score')).toBeVisible()
    await expect(page.locator('input[inputmode="numeric"]')).toBeVisible()

    // Open pause menu with keyboard
    await page.keyboard.press('Escape')
    await expect(page.getByText('⏸ PAUSE ⏸')).toBeVisible({ timeout: 5000 })

    // Use keyboard to navigate to Quit
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('button', { name: /▶ Quit/i })).toBeVisible({ timeout: 5000 })

    // Click Continue button with mouse (should work even though Quit is selected via keyboard)
    await page.getByRole('button', { name: 'Continue' }).click()

    // Verify pause menu closed and game resumed
    await expect(page.getByText('⏸ PAUSE ⏸')).not.toBeVisible({ timeout: 5000 })
    await expect(page).toHaveURL(/\/play/)
  })

  test('E2E-US1-005: Mouse click on Quit button quits game without keyboard navigation', async ({
    page,
  }) => {
    // Navigate to game
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    await page.waitForSelector('text=Jules', { state: 'visible' })
    await page.keyboard.press('Enter') // Select player
    await page.waitForURL(/\/select-game/, { timeout: 10000 })
    await page.keyboard.press('Enter') // Select Multiplications game
    await page.waitForURL(/\/home/, { timeout: 10000 })
    await expect(page.getByText(/Welcome/i)).toBeVisible()

    const startButton = page.getByRole('button', { name: /Start Game/i })
    await expect(startButton).toBeVisible()
    await startButton.click({ force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })

    // Wait for game to be fully interactive
    await expect(page.getByText('Score')).toBeVisible()
    await expect(page.locator('input[inputmode="numeric"]')).toBeVisible()

    // Open pause menu with ESC
    await page.keyboard.press('Escape')
    await expect(page.getByText('⏸ PAUSE ⏸')).toBeVisible({ timeout: 5000 })

    // IMPORTANT: Click Quit button directly with mouse WITHOUT using arrow keys
    // This is the bug - clicking Quit should quit, not resume
    const quitButton = page.getByRole('button', { name: /Quit/i })
    await quitButton.click()

    // Should navigate to home page
    await expect(page).toHaveURL(/\/home/, { timeout: 10000 })
    await expect(page.getByText(/Welcome Jules/i)).toBeVisible()
  })
})
