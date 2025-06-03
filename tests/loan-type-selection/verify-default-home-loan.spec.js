const { test, expect } = require('../../fixtures/emiCalculator.fixture');

test('verify home loan amount field visibility and value', async ({ emiCalculatorPage }) => {
  const page = emiCalculatorPage;

  await expect(page.getByRole('link', { name: 'Home Loan', exact: true })).toBeVisible();
  const loanAmountField = page.getByRole('textbox', { name: 'Home Loan Amount' });
  await expect(loanAmountField).toBeVisible();
  const interestRateField = page.getByRole('textbox', { name: 'Interest Rate' });
  await expect(interestRateField).toBeVisible();
  const loanTenureField = page.getByRole('textbox', { name: 'Loan Tenure' });
  await expect(loanTenureField).toBeVisible();

  await expect(page.getByText('₹', { exact: true })).toBeVisible();
  await expect(page.getByText('%', { exact: true })).toBeVisible();
  await expect(page.getByText('Yr', { exact: true })).toBeVisible();
  await expect(page.getByText('Mo', { exact: true })).toBeVisible();
  const loanAmountValue = await loanAmountField.inputValue();
  console.log('Home Loan Amount value:', loanAmountValue);
  expect(loanAmountValue).toBe('50,00,000');

  const interestRateValue = await interestRateField.inputValue();
  console.log('Interest Rate value:', interestRateValue);
  expect(interestRateValue).toBe('9');
  
  const loanTenureValue = await loanTenureField.inputValue();
  console.log('Loan Tenure value:', loanTenureValue);
  expect(loanTenureValue).toBe('20');
  
  console.log('\n✓ All values match the expected defaults for Home Loan');
  console.log('✓ Home Loan test completed successfully!');
});
