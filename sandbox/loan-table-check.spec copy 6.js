const { test, expect } = require('../fixtures/emiCalculator.fixture');
const { calculateEMIDetails } = require('../helper/homeLoanEMICalculator');

// Test cases array
const testCases = [
  {
    name: 'Mid-term average loan',
    loanAmount: 750000,
    interestRate: 11,
    loanTermYears: 4,
    startMonth: 'Dec',
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
      // Wait for the datepicker to be visible
      await page.waitForSelector('.datepicker-months');
      // Select the month from the datepicker
      await page.locator('.datepicker-months .month', { hasText: testCase.startMonth }).first().click();

      
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

      // Get all months in the first year
      const firstYearMonths = page.locator('.monthlypaymentdetails').first().locator('tr');
      const monthCount = await firstYearMonths.count();
      
      // Process all months in the first year
      let previousBalance = testCase.loanAmount;
      let totalPrincipalPaid = 0;
      
      console.log('\nVerifying Monthly Balances and Loan Paid To Date:');
      
      for (let i = 0; i < monthCount; i++) {
        const monthRow = firstYearMonths.nth(i);
        const monthName = await monthRow.locator('.paymentmonthyear').textContent();
        const monthValues = await monthRow.locator('.currency').allTextContents();
        const paidToDateText = await monthRow.locator('.paidtodatemonthyear').textContent();
        
        const toNumber = (str) => Number(str.replace(/[^0-9.-]+/g,""));
        const toPercentage = (str) => parseFloat(str.replace('%', '').trim());
        
        const principal = toNumber(monthValues[0]);
        const actualBalance = toNumber(monthValues[3]);
        const expectedBalance = previousBalance - principal;
        
        // Calculate expected percentage
        totalPrincipalPaid += principal;
        const expectedPaidToDate = (totalPrincipalPaid / testCase.loanAmount) * 100;
        const actualPaidToDate = toPercentage(paidToDateText);
        
        console.log(`\nVerifying ${monthName} (Month ${i + 1}):`);
        console.log('- Balance:');
        console.log(`  - Previous Balance: ${previousBalance}`);
        console.log(`  - Principal: ${principal}`);
        console.log(`  - Expected Balance: ${expectedBalance}`);
        console.log(`  - Actual Balance: ${actualBalance}`);
        
        console.log('- Loan Paid To Date:');
        console.log(`  - Expected: ${expectedPaidToDate.toFixed(2)}%`);
        console.log(`  - Actual: ${actualPaidToDate}%`);
        
        // Verify balance
        expect(Math.abs(actualBalance - expectedBalance)).toBeLessThanOrEqual(1), 
          `Balance verification failed for ${monthName}`;
          
        // Verify Loan Paid To Date (allow 0.05% difference for rounding)
        expect(Math.abs(actualPaidToDate - expectedPaidToDate)).toBeLessThanOrEqual(0.05),
          `Loan Paid To Date percentage verification failed for ${monthName}. Expected ~${expectedPaidToDate.toFixed(2)}%, got ${actualPaidToDate}%`;
        
        previousBalance = actualBalance;
      }
      
      console.log('\nMonthly Details for', firstYear, ':');
      
      for (let i = 0; i < monthCount; i++) {
        const monthRow = firstYearMonths.nth(i);
        const month = await monthRow.locator('.paymentmonthyear').textContent();
        const monthValues = await monthRow.locator('.currency').allTextContents();
        const monthPaidToDate = await monthRow.locator('.paidtodatemonthyear').textContent();
        
        console.log('\nMonth:', month);
        console.log('Principal (A):', monthValues[0]);
        console.log('Interest (B):', monthValues[1]);
        console.log('Total Payment (A + B):', monthValues[2]);
        console.log('Balance:', monthValues[3]);
        console.log('Loan Paid To Date:', monthPaidToDate);

        // Convert currency strings to numbers for comparison
        const toNumber = (str) => Number(str.replace(/[^0-9.-]+/g,""));
        const principal = toNumber(monthValues[0]);
        const interest = toNumber(monthValues[1]);
        const total = toNumber(monthValues[2]);
        
        // Verify that principal + interest equals total payment (allowing for 1 unit rounding difference)
        const sum = principal + interest;
        expect(Math.abs(sum - total)).toBeLessThanOrEqual(1);
      }
    });
  });
});
