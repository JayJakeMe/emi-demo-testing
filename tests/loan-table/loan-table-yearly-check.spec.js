const { test, expect } = require('../../fixtures/emiCalculator.fixture');
const { calculateEMIDetails } = require('../../helper/homeLoanEMICalculator');

const testCases = [
  {
    name: 'Mid-term average loan',
    loanAmount: 750000,
    interestRate: 15,
    loanTermYears: 10,
    startMonth: 'Jul',
  },
];

const toNumber = (str) => Number(str.replace(/[^0-9.-]+/g, ''));
const toPercentage = (str) => parseFloat(str.replace('%', '').trim());

const logVerificationHeader = (yearText) => {
  console.log(`\n=== Verifying Year: ${yearText} ===`);
};

const logPaymentDetails = (principal, interest, totalPayment, balance, paidToDate) => {
  console.log('- Principal (A):', principal);
  console.log('- Interest (B):', interest);
  console.log('- Total Payment (A + B):', totalPayment);
  console.log('- Balance:', balance);
  console.log('- Loan Paid To Date:', `${paidToDate}%`);
};

const verifyBalance = (actual, expected, yearText) => {
  const difference = Math.abs(actual - expected);
  console.log('\n- Balance Verification:');
  console.log(`  - Expected Balance: ${expected}`);
  console.log(`  - Actual Balance:   ${actual}`);
  console.log(`  - Difference:       ${difference} (tolerance: ≤ 1)`);
  expect(difference).toBeLessThanOrEqual(1);
};

const verifyTotalPayment = (principal, interest, actualTotal) => {
  const expectedTotal = principal + interest;
  const difference = Math.abs(actualTotal - expectedTotal);
  console.log('\n- Total Payment Verification:');
  console.log(`  - Principal:      ${principal}`);
  console.log(`  - Interest:       ${interest}`);
  console.log(`  - Expected Total: ${expectedTotal}`);
  console.log(`  - Actual Total:   ${actualTotal}`);
  console.log(`  - Difference:     ${difference} (tolerance: ≤ 1)`);
  expect(difference).toBeLessThanOrEqual(1);
};

const verifyPaidToDate = (principalPaid, totalLoan, actualPercentage, expectedPercentage) => {
  const difference = Math.abs(actualPercentage - expectedPercentage);
  console.log('\n- Loan Paid To Date Verification:');
  console.log(`  - Principal Paid:   ${principalPaid}/${totalLoan}`);
  console.log(`  - Expected %:       ${expectedPercentage.toFixed(2)}%`);
  console.log(`  - Actual %:         ${actualPercentage}%`);
  console.log(`  - Difference:       ${difference.toFixed(2)}% (tolerance: ≤ 0.05%)`);
  expect(difference).toBeLessThanOrEqual(0.05);
};

test.describe('Yearly Verification Tests', () => {
  testCases.forEach(testCase => {
    test(`verify yearly payments for ${testCase.name}`, async ({ emiCalculatorPage }) => {
      const page = emiCalculatorPage;
      console.log(`\nRunning test case: ${testCase.name}`);
      console.log(`\nLoan parameters: ${testCase.loanAmount} at ${testCase.interestRate}% for ${testCase.loanTermYears} years\n`);

      await expect(page).toHaveTitle(/emi calculator/i);

      const { loanAmount, interestRate, loanTermYears, startMonth } = testCase;

      const loanAmountInput = page.getByRole('textbox', { name: 'Home Loan Amount' });
      await expect(loanAmountInput).toBeVisible();
      await loanAmountInput.fill(loanAmount.toString());
      
      await page.getByRole('textbox', { name: 'Interest Rate' }).fill(interestRate.toString());
      await page.getByRole('textbox', { name: 'Loan Tenure' }).fill(loanTermYears.toString());
      await page.getByRole('textbox', { name: 'Loan Tenure' }).press('Enter');

      await page.getByRole('textbox', { name: 'Schedule showing EMI payments' }).click();
      await page.waitForSelector('.datepicker-months');
      await page.locator('.datepicker-months .month', { hasText: startMonth }).first().click();

      await page.waitForSelector('#emipaymenttable');
      const mainTable = page.locator('#emipaymenttable > table').first();
      await expect(mainTable).toBeVisible();

      const allYearSections = await page.locator('.yearlypaymentdetails').all();
      let totalPrincipalPaid = 0;
      let previousBalance = loanAmount;

      console.log('\nVerifying All Yearly Payments:');

      for (const yearSection of allYearSections) {
        const yearText = await yearSection.locator('.paymentyear').textContent();
        const yearValues = await yearSection.locator('.currency').allTextContents();
        const paidToDateText = await yearSection.locator('.paidtodateyear').textContent();

        const principal = toNumber(yearValues[0]);
        const interest = toNumber(yearValues[1]);
        const totalPayment = toNumber(yearValues[2]);
        const actualBalance = toNumber(yearValues[3]);
        const expectedBalance = previousBalance - principal;

        totalPrincipalPaid += principal;
        const expectedPaidToDate = (totalPrincipalPaid / loanAmount) * 100;
        const actualPaidToDate = toPercentage(paidToDateText);

        logVerificationHeader(yearText);
        logPaymentDetails(principal, interest, totalPayment, actualBalance, actualPaidToDate);
        console.log('\nVerification Details:');

        verifyBalance(actualBalance, expectedBalance, yearText);
        verifyTotalPayment(principal, interest, totalPayment);
        verifyPaidToDate(totalPrincipalPaid, loanAmount, actualPaidToDate, expectedPaidToDate);

        console.log('\nVerifications passed');
        previousBalance = actualBalance;
      }

      if (allYearSections.length === loanTermYears) {
        expect(previousBalance).toBeLessThanOrEqual(1);
        console.log('\nLoan fully paid off as expected');
      }
    });
  });
});
