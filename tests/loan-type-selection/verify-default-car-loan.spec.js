const { test, expect } = require('../../fixtures/emiCalculator.fixture');

test('verify car loan default values', async ({ emiCalculatorPage }) => {
  const page = emiCalculatorPage;
  await page.getByRole('link', { name: 'Car Loan', exact: true }).click();

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
  console.log('Car Loan Amount value:', loanAmountValue);
  expect(loanAmountValue).toBe('4,00,000');

  const interestRateValue = await interestRateField.inputValue();
  console.log('Interest Rate value:', interestRateValue);
  expect(interestRateValue).toBe('8.5');

  const loanTenureValue = await loanTenureField.inputValue();
  console.log('Loan Tenure value:', loanTenureValue);
  expect(loanTenureValue).toBe('5');

  console.log('\n✓ All values match the expected defaults for Car Loan');
  console.log('✓ Car Loan test completed successfully!');
});
