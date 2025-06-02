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



      
      // // Verify the table headers
      // const tableHeaders = await page.locator('#emipaymenttable th').allTextContents();
      // console.log('Table Headers:', tableHeaders);
      
      // // Get all year elements and their data
      // const yearElements = await page.locator('[id^="year"]').all();
      // const years = [];
      
      // for (const yearElement of yearElements) {
      //   const yearId = await yearElement.getAttribute('id');
      //   const yearValue = await yearElement.textContent();
      //   if (yearId && yearId.startsWith('year') && yearId !== 'yearheader') {
      //     years.push(yearValue);
      //   }
      // }
      
      // console.log('All Years in Table:', years.join(', '));
      
      // // Verify the table contains the expected data
      // await expect(page.locator('#emipaymenttable')).toContainText('Principal');
      // await expect(page.locator('#emipaymenttable')).toContainText('Interest');
      // await expect(page.locator('#emipaymenttable')).toContainText('Total Payment');
      // await expect(page.locator('#emipaymenttable')).toContainText('Balance');
      
    });
  });
});
