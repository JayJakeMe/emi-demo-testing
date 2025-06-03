const { test, expect } = require('../../fixtures/emiCalculator.fixture');

test('verify personal loan default values', async ({ emiCalculatorPage }) => {
  const page = emiCalculatorPage;
  await page.getByRole('link', { name: 'Personal Loan' }).click();

  const loanAmountField = page.getByRole('textbox', { name: 'Loan Amount' });
  await expect(loanAmountField).toBeVisible();

  const interestRateField = page.getByRole('textbox', { name: 'Interest Rate' });
  await expect(interestRateField).toBeVisible();
  const loanTenureField = page.getByRole('textbox', { name: 'Loan Tenure' });
  await expect(loanTenureField).toBeVisible();
  
  await expect(page.getByText('₹', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('%', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Yr', { exact: true })).toBeVisible();
  await expect(page.getByText('Mo', { exact: true })).toBeVisible();

  const loanAmountValue = await loanAmountField.inputValue();
  console.log('Personal Loan Amount value:', loanAmountValue);
  expect(loanAmountValue).toBe('7,50,000');

  const interestRateValue = await interestRateField.inputValue();
  console.log('Interest Rate value:', interestRateValue);
  expect(interestRateValue).toBe('11');

  const loanTenureValue = await loanTenureField.inputValue();
  console.log('Loan Tenure value:', loanTenureValue);
  expect(loanTenureValue).toBe('3');

  console.log('\n✓ All values match the expected defaults for Personal Loan');
  console.log('✓ Personal Loan test completed successfully!');
});
