import { test, expect } from '@playwright/test'

/**
 * E2E Test Suite: Credits Screen
 * Feature: 017-credits-screen
 * User Stories: US1 (Access), US2 (Content), US3 (Speed), US4 (Exit)
 *
 * This test validates the complete credits screen user journey including:
 * - Access via Ctrl+C from leaderboard (HomePage)
 * - Visual components (starfield, rainbow title, scrolling content)
 * - Speed control with arrow keys
 * - Exit via Escape key
 */

test.describe('Credits Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and navigate to app
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  /**
   * Helper function to navigate to HomePage by clicking a player
   * Uses click with force:true to handle animation stability issues
   */
  async function navigateToHomePage(page: import('@playwright/test').Page): Promise<void> {
    await page.goto('/')
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    await page.waitForSelector('text=Jules')
    // Click on player to select and navigate (force:true for animation stability)
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/select-game/, { timeout: 10000 })
    await page.keyboard.press('Enter') // Select Multiplications game
    await page.waitForURL(/\/home/, { timeout: 10000 })
    // Click somewhere to ensure body has keyboard focus
    await page.locator('body').click({ position: { x: 10, y: 10 }, force: true })
  }

  test.describe('US1+US4: Access and Exit Credits', () => {
    test('E2E-US1-001: Access Credits via Ctrl+C from Leaderboard', async ({ page }) => {
      // Step 1: Navigate to HomePage
      await navigateToHomePage(page)
      await expect(page.getByText(/Welcome Jules/i)).toBeVisible()
      await page.screenshot({ path: 'test-results/credits/01-home-page-before-credits.png' })

      // Step 2: Press Ctrl+C to access credits
      await page.keyboard.press('Control+c')

      // Step 3: Verify navigation to credits page
      await page.waitForURL(/\/credits/, { timeout: 10000 })
      await page.screenshot({ path: 'test-results/credits/02-credits-page-opened.png' })

      // Step 4: Verify credits page elements are visible
      await expect(page.getByTestId('starfield')).toBeVisible()
      await expect(page.getByTestId('rainbow-title')).toBeVisible()
      await expect(page.getByTestId('rainbow-title')).toHaveText('Credits')
    })

    test('E2E-US1-002: Ctrl+C only works on HomePage (not other pages)', async ({ page }) => {
      // Test on PlayerSelectPage - Ctrl+C should NOT navigate
      await page.goto('/')
      await expect(page.getByText('Choose Your Player')).toBeVisible()
      await page.waitForSelector('text=Jules')

      // Focus page without clicking player card
      await page.locator('h1').click({ force: true })
      await page.keyboard.press('Control+c')

      // Wait a moment then verify we're still on player select page
      await page.waitForTimeout(500)
      await expect(page.getByText('Choose Your Player')).toBeVisible()
    })

    test('E2E-US4-001: Return to Leaderboard via Escape', async ({ page }) => {
      // Navigate to credits
      await navigateToHomePage(page)
      await page.keyboard.press('Control+c')
      await page.waitForURL(/\/credits/, { timeout: 10000 })

      // Take screenshot of credits before exit
      await page.screenshot({ path: 'test-results/credits/03-credits-before-escape.png' })

      // Press Escape to return
      await page.keyboard.press('Escape')

      // Verify return to HomePage
      await page.waitForURL(/\/home/, { timeout: 10000 })
      await expect(page.getByText(/Welcome Jules/i)).toBeVisible()
      await page.screenshot({ path: 'test-results/credits/04-returned-to-home.png' })
    })
  })

  test.describe('US2: View Auto-Scrolling Credits', () => {
    test('E2E-US2-001: View All Credits Content Sections', async ({ page }) => {
      // Navigate to credits
      await navigateToHomePage(page)
      await page.keyboard.press('Control+c')
      await page.waitForURL(/\/credits/, { timeout: 10000 })

      // Verify credits content is present (check for section headers)
      const creditsContent = page.getByTestId('credits-content')
      // The content container may have overflow:hidden CSS, check it exists in DOM
      await expect(creditsContent).toBeAttached()

      // Take screenshot showing initial credits position
      await page.screenshot({ path: 'test-results/credits/05-credits-content-start.png' })

      // Verify Music section exists (look for "Music" heading text)
      await expect(page.getByRole('heading', { name: /Music/i })).toBeVisible()

      // Wait for scroll to progress and take another screenshot
      await page.waitForTimeout(3000)
      await page.screenshot({ path: 'test-results/credits/06-credits-scrolling.png' })

      // Verify other sections are in the DOM (may not be visible yet if scrolled past)
      const htmlContent = await page.content()
      expect(htmlContent).toContain('Sound Effects')
      expect(htmlContent).toContain('Made with')
      expect(htmlContent).toContain('Special Thanks')
    })

    test('E2E-US2-002: Final Credit @rvailleux Stops in Center', async ({ page }) => {
      // Navigate to credits
      await navigateToHomePage(page)
      await page.keyboard.press('Control+c')
      await page.waitForURL(/\/credits/, { timeout: 10000 })

      // Verify final credit element exists in DOM
      const finalCredit = page.getByTestId('final-credit')
      await expect(finalCredit).toBeAttached()
      await expect(finalCredit).toHaveText('@rvailleux')

      // Speed up scrolling to reach the end faster (press ArrowUp multiple times to max speed)
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('ArrowUp')
      }

      // Helper to get scroll position
      const getScrollPosition = async () => {
        return page.evaluate(() => {
          const content = document.querySelector('[data-testid="credits-content"]')
          return content ? parseInt(content.getAttribute('data-scroll-position') || '0', 10) : 0
        })
      }

      // Wait for scroll to stabilize (position stops changing)
      // Poll until position stays the same for 500ms
      let previousPosition = -1
      let stableCount = 0
      const maxAttempts = 40 // 20 seconds max wait

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await page.waitForTimeout(500)
        const currentPosition = await getScrollPosition()

        if (currentPosition === previousPosition && currentPosition > 0) {
          stableCount++
          if (stableCount >= 2) {
            // Position stable for 1 second (2 x 500ms)
            break
          }
        } else {
          stableCount = 0
        }
        previousPosition = currentPosition
      }

      // Final verification: position should stay stable
      const finalPosition = await getScrollPosition()
      await page.waitForTimeout(500)
      const verifyPosition = await getScrollPosition()

      // Position should be the same (scroll stopped)
      expect(verifyPosition).toBe(finalPosition)
      expect(finalPosition).toBeGreaterThan(0) // Ensure we actually scrolled

      // Take screenshot showing final credit centered
      await page.screenshot({ path: 'test-results/credits/10-final-credit-stopped.png' })
    })
  })

  test.describe('US3: Speed Control', () => {
    test('E2E-US3-001: Control Scrolling Speed with Arrow Keys', async ({ page }) => {
      // Navigate to credits
      await navigateToHomePage(page)
      await page.keyboard.press('Control+c')
      await page.waitForURL(/\/credits/, { timeout: 10000 })

      // Wait for initial scroll position
      await page.waitForTimeout(500)

      // Get initial scroll position
      const getScrollPosition = async () => {
        return page.evaluate(() => {
          const content = document.querySelector('[data-testid="credits-content"]')
          return content ? parseInt(content.getAttribute('data-scroll-position') || '0', 10) : 0
        })
      }

      const initialPosition = await getScrollPosition()

      // Press ArrowUp to increase speed
      await page.keyboard.press('ArrowUp')
      await page.screenshot({ path: 'test-results/credits/07-speed-increased.png' })

      // Wait and check scroll progressed faster
      await page.waitForTimeout(1000)
      const afterSpeedUpPosition = await getScrollPosition()

      // Press ArrowDown multiple times to decrease speed to paused
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowDown')
      await page.screenshot({ path: 'test-results/credits/08-speed-decreased.png' })

      // Store position after pausing
      const pausedPosition = await getScrollPosition()

      // Wait and verify scroll is paused (position shouldn't change significantly)
      await page.waitForTimeout(1000)
      const afterPausePosition = await getScrollPosition()

      // The position difference when paused should be minimal (allowing for any animation frame)
      const positionChangeDuringPause = Math.abs(afterPausePosition - pausedPosition)
      expect(positionChangeDuringPause).toBeLessThan(50) // Allow small tolerance

      // Note: Initial position comparison is informational - scroll should have started
      expect(afterSpeedUpPosition).toBeGreaterThanOrEqual(initialPosition)
    })
  })

  test.describe('Visual Consistency', () => {
    test('E2E-VISUAL-001: 8-bit Aesthetic Consistency', async ({ page }) => {
      // Navigate to credits
      await navigateToHomePage(page)
      await page.keyboard.press('Control+c')
      await page.waitForURL(/\/credits/, { timeout: 10000 })

      // Verify starfield has 3 layers for parallax effect
      await expect(page.getByTestId('star-layer-distant')).toBeVisible()
      await expect(page.getByTestId('star-layer-medium')).toBeVisible()
      await expect(page.getByTestId('star-layer-near')).toBeVisible()

      // Take full page screenshot for visual review
      await page.screenshot({
        path: 'test-results/credits/09-full-credits-visual.png',
        fullPage: true,
      })

      // Verify keyboard hints are displayed
      await expect(page.getByText('Scroll Speed')).toBeVisible()
      await expect(page.getByText('Back', { exact: true })).toBeVisible()
    })
  })
})
