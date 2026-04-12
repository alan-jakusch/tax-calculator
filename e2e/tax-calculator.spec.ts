import { expect, test } from '@playwright/test'
import { fetchExpectedTaxDisplay } from './helpers/expected-tax'

test.describe('Tax calculator', () => {
  test('shows total tax and effective rate from API for 2021', async ({ page }) => {
    const income = 50_000
    const expected = await fetchExpectedTaxDisplay(income, 2021)

    await page.goto('/')
    await page.getByLabel('Annual Income').fill(String(income))
    await page.getByLabel('Tax Year').selectOption('2021')
    await page.getByRole('button', { name: 'Calculate Tax' }).click()

    await expect(page.getByTestId('tax-result-skeleton')).toBeHidden({ timeout: 20_000 })
    await expect(page.getByRole('heading', { name: 'Bracket Breakdown' })).toBeVisible()

    await expect(page.getByText(expected.totalTaxLabel, { exact: true }).first()).toBeVisible()
    await expect(page.getByText(expected.effectiveRateLabel, { exact: true })).toBeVisible()
  })

  test('zero income shows $0 total and 0% effective rate', async ({ page }) => {
    const expected = await fetchExpectedTaxDisplay(0, 2019)

    await page.goto('/')
    await page.getByLabel('Annual Income').fill('0')
    await page.getByLabel('Tax Year').selectOption('2019')
    await page.getByRole('button', { name: 'Calculate Tax' }).click()

    await expect(page.getByTestId('tax-result-skeleton')).toBeHidden({ timeout: 30_000 })
    await expect(page.getByText(expected.totalTaxLabel, { exact: true }).first()).toBeVisible()
    await expect(page.getByText(expected.effectiveRateLabel, { exact: true })).toBeVisible()
  })

  test('shows validation error for empty income', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Annual Income').fill('')
    await page.getByLabel('Tax Year').selectOption('2020')
    await page.getByRole('button', { name: 'Calculate Tax' }).click()

    await expect(page.getByRole('alert')).toContainText('Income must be a number')
  })
})

test.describe('2022 tax year (API may fail intermittently)', () => {
  test.describe.configure({ retries: 2 })

  test('eventually shows tax results aligned with API', async ({ page }) => {
    const income = 10_000
    await page.goto('/')
    await page.getByLabel('Annual Income').fill(String(income))
    await page.getByLabel('Tax Year').selectOption('2022')
    await page.getByRole('button', { name: 'Calculate Tax' }).click()

    await expect(async () => {
      const errorTitle = page.getByText('Unable to load tax data')
      if (await errorTitle.isVisible()) {
        await page.getByRole('button', { name: 'Try again' }).click()
      }
      await expect(page.getByText('Total Tax')).toBeVisible()
      await expect(page.getByTestId('tax-result-skeleton')).toBeHidden()
    }).toPass({ timeout: 60_000 })

    const expected = await fetchExpectedTaxDisplay(income, 2022, {
      maxAttempts: 15,
      retryMs: 400,
    })
    await expect(page.getByText(expected.totalTaxLabel, { exact: true }).first()).toBeVisible()
    await expect(page.getByText(expected.effectiveRateLabel, { exact: true })).toBeVisible()
  })
})
