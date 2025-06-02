const { test, expect } = require('../fixtures/emiCalculator.fixture');
const { calculateEMIDetails } = require('../helper/homeLoanEMICalculator');

// Test cases array
const testCases = [
  {
    name: 'Mid-term average loan',
    loanAmount: 2500000,
    interestRate: 10,
    loanTermYears: 4
  },
  // {
  //   name: 'Standard 15-year mortgage',
  //   loanAmount: 5000000,
  //   interestRate: 7.5,
  //   loanTermYears: 15
  // },
  // {
  //   name: 'Randomized loan',
  //   // Randomize loan amount between 1,000,000 and 20,000,000 with 100,000 increments
  //   loanAmount: (Math.floor(Math.random() * 200) + 10) * 100000, 
  //   // Randomize interest rate between 1% and 20% with 0.25% increments
  //   interestRate: Math.floor(Math.random() * 77) * 0.25 + 1, 
  //   // Randomize loan term between 1 and 30 years with 0.5 increments
  //   loanTermYears: Math.floor(Math.random() * 58 + 2) / 2 
  // }
];

test.describe('EMI Calculator Tests', () => {
  testCases.forEach(testCase => {
    test(`verify emi calculator for ${testCase.name}`, async ({ emiCalculatorPage }) => {
      const page = emiCalculatorPage;
      console.log(`\nRunning test case: ${testCase.name}`);
      console.log(`\nLoan parameters: ${testCase.loanAmount} at ${testCase.interestRate}% for ${testCase.loanTermYears} years\n`);

      // Verify we're on the right page
      await expect(page).toHaveTitle(/emi calculator/i);

      // Use test case parameters
      const loanAmount = testCase.loanAmount;
      const interestRate = testCase.interestRate;
      const loanTermYears = testCase.loanTermYears;
      
      // Fill in the loan parameters
      const loanAmountInput = page.getByRole('textbox', { name: 'Home Loan Amount' });
      await expect(loanAmountInput).toBeVisible();

      await page.getByRole('textbox', { name: 'Home Loan Amount' }).fill(loanAmount.toString());
 
      await page.getByRole('textbox', { name: 'Interest Rate' }).fill(interestRate.toString());

      await page.getByRole('textbox', { name: 'Loan Tenure' }).fill(loanTermYears.toString());

      await page.getByRole('textbox', { name: 'Loan Tenure' }).press('Enter');


      await page.getByRole('textbox', { name: 'Schedule showing EMI payments' }).click();
      await page.locator('span').filter({ hasText: 'Nov' }).click();

      
      // Wait for the payment schedule to load
      await page.waitForSelector('#emipaymenttable');
      
      // Get the main payment table (first table in #emipaymenttable)
      const mainTable = page.locator('#emipaymenttable > table').first();
      await expect(mainTable).toBeVisible();
    
      // Get first year row data
      const firstYearRow = page.locator('.yearlypaymentdetails').first();
      const firstYear = await firstYearRow.locator('.paymentyear').textContent();
      const yearValues = await firstYearRow.locator('.currency').allTextContents();
      const yearPaidToDate = await firstYearRow.locator('.paidtodateyear').textContent();
      
      console.log('First Year Row:');
      console.log('Year:', firstYear);
      console.log('Principal (A):', yearValues[0]);
      console.log('Interest (B):', yearValues[1]);
      console.log('Total Payment (A + B):', yearValues[2]);
      console.log('Balance:', yearValues[3]);
      console.log('Loan Paid To Date:', yearPaidToDate);
      
      // Get first month row data
      const firstMonthRow = page.locator('.monthlypaymentdetails').first().locator('tr').first();
      const month = await firstMonthRow.locator('.paymentmonthyear').textContent();
      const monthValues = await firstMonthRow.locator('.currency').allTextContents();
      const monthPaidToDate = await firstMonthRow.locator('.paidtodatemonthyear').textContent();
      
      console.log('\nFirst Month Row:');
      console.log('Month:', month);
      console.log('Principal (A):', monthValues[0]);
      console.log('Interest (B):', monthValues[1]);
      console.log('Total Payment (A + B):', monthValues[2]);
      console.log('Balance:', monthValues[3]);
      console.log('Loan Paid To Date:', monthPaidToDate);
    

    });
  });
});
