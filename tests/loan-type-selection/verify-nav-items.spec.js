const { test, expect } = require('../../fixtures/emiCalculator.fixture');

test('verify navigation items', async ({ emiCalculatorPage }) => {
  const nav = emiCalculatorPage.locator('.loanproduct-nav');
  const items = nav.locator('li');
  const itemTexts = await items.allTextContents();
  console.log('\nNavigation items:', itemTexts);

  expect(itemTexts).toEqual(['Home Loan', 'Personal Loan', 'Car Loan']);

  async function verifyActiveTab(expectedText) {
    await expect(nav.locator('li.active')).toHaveText(expectedText);
    console.log(`✓ ${expectedText} is active`);
  }
  await verifyActiveTab('Home Loan');

  await nav.locator('li:has-text("Personal Loan")').click();
  await verifyActiveTab('Personal Loan');

  await nav.locator('li:has-text("Car Loan")').click();
  await verifyActiveTab('Car Loan');

  await nav.locator('li:has-text("Home Loan")').click();
  await verifyActiveTab('Home Loan');
});
