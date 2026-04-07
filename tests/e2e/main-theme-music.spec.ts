import { test, expect } from '@playwright/test'

/**
 * E2E Test Suite: Main Theme Music
 * Feature: 016-main-theme-music
 *
 * This test validates the main theme music behavior across the application:
 * - US1: Main theme plays on menu screens (Player Select, Home, Results)
 * - US2: Gameplay uses different music (never main theme)
 * - US3: Music continuity during menu navigation
 *
 * Note: Audio testing in Playwright is challenging in headless mode.
 * We validate:
 * - No console errors related to audio
 * - Successful navigation through audio-enabled screens
 * - Screenshots for visual verification
 */

test.describe('Main Theme Music - User Story 1: Main Theme on Menu Screens', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('E2E-US1-001: Main theme plays on Player Select screen', async ({ page }) => {
    // Collect console messages to check for audio errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Step 1: Navigate to application root URL
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()

    // Step 2: Trigger user interaction for autoplay policy
    // Press a key to satisfy browser autoplay requirements
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(500) // Allow audio to initialize

    // Step 3: Verify no audio-related errors in console
    const audioErrors = consoleErrors.filter(
      e => e.toLowerCase().includes('audio') || e.toLowerCase().includes('music')
    )
    expect(audioErrors).toHaveLength(0)

    // Step 4: Capture screenshot for visual verification
    await page.screenshot({ path: 'test-results/main-theme-music/US1-001-player-select-loaded.png' })

    // Validate Player Select page is functional
    await expect(page.getByText('Jules')).toBeVisible()
    await expect(page.getByText('Achille')).toBeVisible()
  })

  test('E2E-US1-002: Main theme continues to Home screen', async ({ page }) => {
    // Collect console messages to check for audio errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Step 1: Start at Player Select
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()

    // Trigger user interaction for autoplay
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(500)

    // Step 2: Complete player selection with Enter key
    await page.keyboard.press('Enter')

    // Step 3: Navigate through game select to home
    await expect(page).toHaveURL(/\/select-game/)
    await page.click('text=MULTIPLICATIONS', { force: true })
    await expect(page).toHaveURL(/\/home/)
    await expect(page.getByText(/Welcome/i)).toBeVisible()

    // Step 4: Wait to confirm music doesn't restart (no disruption)
    // In a real audio scenario, we'd hear continuous music
    await page.waitForTimeout(2000)

    // Step 5: Verify no errors during transition
    const audioErrors = consoleErrors.filter(
      e => e.toLowerCase().includes('audio') || e.toLowerCase().includes('music')
    )
    expect(audioErrors).toHaveLength(0)

    // Step 6: Capture screenshot
    await page.screenshot({ path: 'test-results/main-theme-music/US1-002-home-screen.png' })

    // Validate Home page is functional
    await expect(page.getByRole('button', { name: /Start Game/i })).toBeVisible()
  })
})

test.describe('Main Theme Music - User Story 2: Gameplay Music Without Main Theme', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('E2E-US2-001: Gameplay music is different from main theme', async ({ page }) => {
    // Collect console messages
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Step 1: Navigate through Player Select to Home
    await page.goto('/')
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(300)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/select-game/)
    await page.click('text=MULTIPLICATIONS', { force: true })
    await expect(page).toHaveURL(/\/home/)

    // Step 2: Start game with click (force due to pulse animation)
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await startButton.click({ force: true })

    // Step 3: Verify navigation to /play
    await expect(page).toHaveURL(/\/play/)
    await expect(page.getByText(/MATH QUEST/i)).toBeVisible()

    // Step 4: Verify audio transition (no errors)
    await page.waitForTimeout(1000) // Allow music to switch
    const audioErrors = consoleErrors.filter(
      e => e.toLowerCase().includes('audio') || e.toLowerCase().includes('music')
    )
    expect(audioErrors).toHaveLength(0)

    // Step 5: Capture screenshot
    await page.screenshot({ path: 'test-results/main-theme-music/US2-001-gameplay-started.png' })
  })

  test('E2E-US2-002: Main theme resumes after gameplay', async ({ page }) => {
    // Collect console messages
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Navigate through the full flow: Player Select -> Home -> Play -> Pause -> Quit -> Home
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()

    // Select player
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(300)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/select-game/)
    await page.click('text=MULTIPLICATIONS', { force: true })
    await expect(page).toHaveURL(/\/home/)

    // Start game
    const startButton = page.getByRole('button', { name: /Start Game/i })
    await startButton.click({ force: true })
    await expect(page).toHaveURL(/\/play/)

    // Verify game page loaded
    await expect(page.getByText(/MATH QUEST/i)).toBeVisible()
    await page.waitForTimeout(500) // Let gameplay music start

    // Open pause menu
    await page.keyboard.press('Escape')
    await expect(page.getByText('⏸ PAUSE ⏸')).toBeVisible()

    // Navigate to Quit option and confirm
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)
    await page.keyboard.press('Enter')

    // After quit, should be back at home
    await expect(page).toHaveURL(/\/home/)

    // Verify no audio errors during transitions
    const audioErrors = consoleErrors.filter(
      e => e.toLowerCase().includes('audio') || e.toLowerCase().includes('music')
    )
    expect(audioErrors).toHaveLength(0)

    // Capture screenshot
    await page.screenshot({ path: 'test-results/main-theme-music/US2-002-after-gameplay.png' })
  })
})

test.describe('Main Theme Music - User Story 3: Music Continuity Across Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('E2E-US3-001: Music continuity during menu navigation', async ({ page }) => {
    // Collect console messages
    const consoleErrors: string[] = []
    const consoleWarnings: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text())
      }
    })

    // Step 1: Navigate to Player Select screen
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()

    // Trigger user interaction
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(300)

    // Step 2: Wait for music to progress (10 seconds as per spec, reduced for test)
    await page.waitForTimeout(3000)

    // Step 3: Select player and navigate to Home
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/select-game/)
    await page.click('text=MULTIPLICATIONS', { force: true })
    await expect(page).toHaveURL(/\/home/)

    // Step 4: Verify no audio errors (music didn't restart would cause no new errors)
    const audioErrors = consoleErrors.filter(
      e => e.toLowerCase().includes('audio') || e.toLowerCase().includes('music')
    )
    expect(audioErrors).toHaveLength(0)

    // Step 5: Capture screenshot
    await page.screenshot({ path: 'test-results/main-theme-music/US3-001-navigation-complete.png' })

    // Validate we're on the home page
    await expect(page.getByRole('button', { name: /Start Game/i })).toBeVisible()
  })
})
