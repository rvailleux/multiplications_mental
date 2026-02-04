import { test, expect, Page } from '@playwright/test'

/**
 * E2E Test Suite: iPad Responsive Design
 * Feature: 020-ipad-responsive-design
 * User Stories:
 *   US1 (P1 MVP): iPad Portrait Layout (768x1024)
 *   US2 (P2): iPad Landscape Layout (1024x768)
 *   US3 (P2): Touch Target Accessibility (44x44px minimum)
 *   US4 (P3): iPad Pro Support (1024x1366, 1366x1024)
 *
 * This test validates responsive design for iPad devices:
 * - No horizontal overflow on any screen
 * - All interactive elements meet 44x44px touch target requirement
 * - Content properly centered and readable
 * - Screenshots captured for visual verification
 */

// === VIEWPORT CONFIGURATIONS ===

const IPAD_PORTRAIT = { width: 768, height: 1024 }
const IPAD_LANDSCAPE = { width: 1024, height: 768 }
const IPAD_PRO_PORTRAIT = { width: 1024, height: 1366 }
const IPAD_PRO_LANDSCAPE = { width: 1366, height: 1024 }

// === HELPER FUNCTIONS ===

/**
 * T005: Helper function to detect horizontal overflow on the page
 * Returns true if the page content exceeds viewport width (has horizontal scrollbar)
 * @param page - Playwright page object
 * @returns Promise<boolean> - true if horizontal overflow exists
 */
async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth
  })
}

/**
 * T006: Helper function to measure touch target sizes for all interactive elements
 * Returns an array of elements that fail the 44x44px minimum requirement
 * @param page - Playwright page object
 * @returns Promise<Array> - Array of failing elements with their details
 */
async function getUndersizedTouchTargets(
  page: Page
): Promise<Array<{ selector: string; width: number; height: number; text: string }>> {
  const undersized: Array<{ selector: string; width: number; height: number; text: string }> = []

  // Query all interactive elements
  const selectors = ['button', 'a', 'input', '[role="button"]', '[tabindex="0"]']

  for (const selector of selectors) {
    const elements = page.locator(selector)
    const count = await elements.count()

    for (let i = 0; i < count; i++) {
      const element = elements.nth(i)
      const isVisible = await element.isVisible().catch(() => false)

      if (isVisible) {
        const box = await element.boundingBox()
        if (box && (box.width < 44 || box.height < 44)) {
          const text = (await element.textContent()) || ''
          undersized.push({
            selector: `${selector}[${i}]`,
            width: Math.round(box.width),
            height: Math.round(box.height),
            text: text.trim().substring(0, 30),
          })
        }
      }
    }
  }

  return undersized
}

/**
 * Helper to select a player and navigate to HomePage
 */
async function selectPlayerAndGoHome(page: Page): Promise<void> {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.waitForSelector('text=Jules', { timeout: 10000 })
  await page.click('text=Jules', { force: true })
  await page.waitForURL(/\/home/, { timeout: 10000 })
}

/**
 * Helper to ensure screenshot directory exists and take screenshot
 */
async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `test-results/ipad/${name}.png`, fullPage: true })
}

// === US1: iPad Portrait Layout Tests (P1 MVP) ===

test.describe('iPad Portrait (768x1024)', () => {
  test.use({ viewport: IPAD_PORTRAIT, hasTouch: true })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('E2E-US1-001: Complete game flow without horizontal overflow', async ({ page }) => {
    // Screen 1: Player Select Page
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '01-player-select-portrait')

    // Navigate to Home
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/home/, { timeout: 10000 })

    // Screen 2: Home Page
    await expect(page.getByText(/Welcome/i)).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '02-home-portrait')

    // Navigate to Play
    await page.click('text=Start Game', { force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })

    // Screen 3: Play Page
    await expect(page.getByText(/Temps/i)).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '03-play-portrait')

    // Submit an answer to trigger results (wait for timer or submit)
    const input = page.locator('input[type="number"]')
    await input.fill('42')
    await page.click('text=Valider', { force: true })

    // Take screenshot of play page with feedback
    await takeScreenshot(page, '04-play-feedback-portrait')
  })

  test('E2E-US1-002: Touch target validation on iPad portrait', async ({ page }) => {
    // Check Player Select Page touch targets
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    const playerSelectUndersized = await getUndersizedTouchTargets(page)

    // Navigate to Home Page
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/home/, { timeout: 10000 })

    // Check Home Page touch targets
    const homeUndersized = await getUndersizedTouchTargets(page)

    // Navigate to Play Page
    await page.click('text=Start Game', { force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })

    // Check Play Page touch targets
    await expect(page.getByText(/Temps/i)).toBeVisible()
    const playUndersized = await getUndersizedTouchTargets(page)

    // Log any undersized elements for debugging
    const allUndersized = [...playerSelectUndersized, ...homeUndersized, ...playUndersized]
    if (allUndersized.length > 0) {
      console.log('Undersized touch targets found:', JSON.stringify(allUndersized, null, 2))
    }

    // Assert all interactive elements meet 44x44px minimum
    expect(allUndersized).toHaveLength(0)
  })
})

// === US2: iPad Landscape Layout Tests (P2) ===

test.describe('iPad Landscape (1024x768)', () => {
  test.use({ viewport: IPAD_LANDSCAPE, hasTouch: true })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('E2E-US2-001: Complete game flow without horizontal overflow', async ({ page }) => {
    // Screen 1: Player Select Page
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '05-player-select-landscape')

    // Navigate to Home
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/home/, { timeout: 10000 })

    // Screen 2: Home Page
    await expect(page.getByText(/Welcome/i)).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '06-home-landscape')

    // Navigate to Play
    await page.click('text=Start Game', { force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })

    // Screen 3: Play Page
    await expect(page.getByText(/Temps/i)).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '07-play-landscape')
  })

  test('E2E-US2-002: Content centered with margins on landscape', async ({ page }) => {
    await selectPlayerAndGoHome(page)

    // Use page.evaluate to check the main content area dimensions
    // The game uses max-width: 600px containers that should be centered
    const contentDimensions = await page.evaluate(() => {
      // Find the main content wrapper (first direct child of body that contains game content)
      const body = document.body
      const appRoot = body.querySelector('#root') as HTMLElement
      if (!appRoot || !appRoot.firstElementChild) return null

      // Get the first significant container
      const mainContent = appRoot.firstElementChild as HTMLElement
      const rect = mainContent.getBoundingClientRect()

      return {
        width: rect.width,
        x: rect.x,
        viewportWidth: window.innerWidth,
      }
    })

    // Verify content is not full width and has centering
    if (contentDimensions) {
      // Main content should be centered (app uses max-width: 600px containers)
      // At 1024px viewport, we expect margins
      const rightEdge = contentDimensions.x + contentDimensions.width
      const rightMargin = contentDimensions.viewportWidth - rightEdge

      // Content should have some margin on both sides
      expect(contentDimensions.x).toBeGreaterThan(0)
      expect(rightMargin).toBeGreaterThan(0)
    }

    await takeScreenshot(page, '08-home-landscape-centered')
  })
})

// === US3: Touch Target Accessibility Tests (P2) ===

test.describe('Touch Target Audit', () => {
  test.use({ viewport: IPAD_PORTRAIT, hasTouch: true })

  test('E2E-US3-001: All screens meet 44x44px touch target minimum', async ({ page }) => {
    const allUndersized: Array<{
      screen: string
      selector: string
      width: number
      height: number
      text: string
    }> = []

    // Screen 1: Player Select
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    const playerSelectUndersized = await getUndersizedTouchTargets(page)
    playerSelectUndersized.forEach((el) => allUndersized.push({ screen: 'PlayerSelect', ...el }))

    // Screen 2: Home
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/home/, { timeout: 10000 })
    await expect(page.getByText(/Welcome/i)).toBeVisible()
    const homeUndersized = await getUndersizedTouchTargets(page)
    homeUndersized.forEach((el) => allUndersized.push({ screen: 'Home', ...el }))

    // Screen 3: Play
    await page.click('text=Start Game', { force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })
    await expect(page.getByText(/Temps/i)).toBeVisible()
    const playUndersized = await getUndersizedTouchTargets(page)
    playUndersized.forEach((el) => allUndersized.push({ screen: 'Play', ...el }))

    // Screen 4: Credits (via navigation)
    await page.goto('/')
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/home/, { timeout: 10000 })

    // Navigate to credits if the link exists
    const creditsLink = page.locator('text=Crédits')
    if ((await creditsLink.count()) > 0) {
      await creditsLink.click({ force: true })
      await page.waitForURL(/\/credits/, { timeout: 10000 })
      const creditsUndersized = await getUndersizedTouchTargets(page)
      creditsUndersized.forEach((el) => allUndersized.push({ screen: 'Credits', ...el }))
    }

    // Log all undersized elements
    if (allUndersized.length > 0) {
      console.log('\n=== UNDERSIZED TOUCH TARGETS ===')
      console.log(JSON.stringify(allUndersized, null, 2))
      console.log('================================\n')
    }

    // Fail test if any undersized elements found
    expect(
      allUndersized,
      `Found ${allUndersized.length} elements below 44x44px minimum`
    ).toHaveLength(0)
  })
})

// === US4: iPad Pro Support Tests (P3) ===

test.describe('iPad Pro Portrait (1024x1366)', () => {
  test.use({ viewport: IPAD_PRO_PORTRAIT, hasTouch: true })

  test('E2E-US4-001: Layout scales correctly on iPad Pro portrait', async ({ page }) => {
    // Screen 1: Player Select
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '09-player-select-ipad-pro-portrait')

    // Screen 2: Home
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/home/, { timeout: 10000 })
    await expect(page.getByText(/Welcome/i)).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '10-home-ipad-pro-portrait')

    // Screen 3: Play
    await page.click('text=Start Game', { force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })
    await expect(page.getByText(/Temps/i)).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '11-play-ipad-pro-portrait')
  })
})

test.describe('iPad Pro Landscape (1366x1024)', () => {
  test.use({ viewport: IPAD_PRO_LANDSCAPE, hasTouch: true })

  test('E2E-US4-002: Layout scales correctly on iPad Pro landscape', async ({ page }) => {
    // Screen 1: Player Select
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await expect(page.getByText('Choose Your Player')).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '12-player-select-ipad-pro-landscape')

    // Screen 2: Home
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/home/, { timeout: 10000 })
    await expect(page.getByText(/Welcome/i)).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '13-home-ipad-pro-landscape')

    // Screen 3: Play
    await page.click('text=Start Game', { force: true })
    await page.waitForURL(/\/play/, { timeout: 10000 })
    await expect(page.getByText(/Temps/i)).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
    await takeScreenshot(page, '14-play-ipad-pro-landscape')
  })
})
