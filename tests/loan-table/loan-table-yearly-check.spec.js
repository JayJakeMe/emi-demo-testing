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

test.describe('Yearly Verification Tests', () => {
  testCases.forEach(testCase => {
    test(`verify yearly payments for ${testCase.name}`, async ({ emiCalculatorPage }) => {
      const page = emiCalculatorPage;
      console.log(`\nRunning test case: ${testCase.name}`);
      console.log(`\nLoan parameters: ${testCase.loanAmount} at ${testCase.interestRate}% for ${testCase.loanTermYears} years\n`);


      await expect(page).toHaveTitle(/emi calculator/i);


      const loanAmount = testCase.loanAmount;
      const interestRate = testCase.interestRate;
      const loanTermYears = testCase.loanTermYears;
      

      const loanAmountInput = page.getByRole('textbox', { name: 'Home Loan Amount' });
      await expect(loanAmountInput).toBeVisible();

      await page.getByRole('textbox', { name: 'Home Loan Amount' }).fill(loanAmount.toString());
      await page.getByRole('textbox', { name: 'Interest Rate' }).fill(interestRate.toString());
      await page.getByRole('textbox', { name: 'Loan Tenure' }).fill(loanTermYears.toString());
      await page.getByRole('textbox', { name: 'Loan Tenure' }).press('Enter');


      await page.getByRole('textbox', { name: 'Schedule showing EMI payments' }).click();
      await page.waitForSelector('.datepicker-months');
      await page.locator('.datepicker-months .month', { hasText: testCase.startMonth }).first().click();
      

      await page.waitForSelector('#emipaymenttable');
      

      const mainTable = page.locator('#emipaymenttable > table').first();
      await expect(mainTable).toBeVisible();
      

      const allYearSections = await page.locator('.yearlypaymentdetails').all();
      let totalPrincipalPaid = 0;
      let previousBalance = testCase.loanAmount;
      
      console.log('\nVerifying All Yearly Payments:');
      
      for (let yearIndex = 0; yearIndex < allYearSections.length; yearIndex++) {
        const yearSection = allYearSections[yearIndex];
        const yearText = await yearSection.locator('.paymentyear').textContent();
        

        const yearValues = await yearSection.locator('.currency').allTextContents();
        const paidToDateText = await yearSection.locator('.paidtodateyear').textContent();
        
        const toNumber = (str) => Number(str.replace(/[^0-9.-]+/g,""));
        const toPercentage = (str) => parseFloat(str.replace('%', '').trim());
        
        const principal = toNumber(yearValues[0]);
        const interest = toNumber(yearValues[1]);
        const totalPayment = toNumber(yearValues[2]);
        const actualBalance = toNumber(yearValues[3]);
        const expectedBalance = previousBalance - principal;
        

        totalPrincipalPaid += principal;
        const expectedPaidToDate = (totalPrincipalPaid / testCase.loanAmount) * 100;
        const actualPaidToDate = toPercentage(paidToDateText);
        
        console.log(`\n=== Verifying Year: ${yearText} ===`);
        console.log('- Principal (A):', principal);
        console.log('- Interest (B):', interest);
        console.log('- Total Payment (A + B):', totalPayment);
        console.log('- Balance:', actualBalance);
        console.log('- Loan Paid To Date:', `${actualPaidToDate}%`);
        

        console.log('\nVerification Details:');
        

        const balanceDifference = Math.abs(actualBalance - expectedBalance);
        console.log('- Balance Verification:');
        console.log(`  - Expected Balance: ${expectedBalance}`);
        console.log(`  - Actual Balance:   ${actualBalance}`);
        console.log(`  - Difference:       ${balanceDifference} (tolerance: ≤ 1)`);
        expect(balanceDifference).toBeLessThanOrEqual(1),
          `Balance verification failed for ${yearText}. Expected ~${expectedBalance}, got ${actualBalance}`;
        

        const expectedTotal = principal + interest;
        const totalDifference = Math.abs(totalPayment - expectedTotal);
        console.log('\n- Total Payment Verification:');
        console.log(`  - Principal:      ${principal}`);
        console.log(`  - Interest:       ${interest}`);
        console.log(`  - Expected Total: ${expectedTotal}`);
        console.log(`  - Actual Total:   ${totalPayment}`);
        console.log(`  - Difference:     ${totalDifference} (tolerance: ≤ 1)`);
        expect(totalDifference).toBeLessThanOrEqual(1),
          `Total payment verification failed for ${yearText}. Expected ${expectedTotal}, got ${totalPayment}`;
        

        const paidToDateDifference = Math.abs(actualPaidToDate - expectedPaidToDate);
        console.log('\n- Loan Paid To Date Verification:');
        console.log(`  - Principal Paid:   ${totalPrincipalPaid}/${testCase.loanAmount}`);
        console.log(`  - Expected %:       ${expectedPaidToDate.toFixed(2)}%`);
        console.log(`  - Actual %:         ${actualPaidToDate}%`);
        console.log(`  - Difference:       ${paidToDateDifference.toFixed(2)}% (tolerance: ≤ 0.05%)`);
        expect(paidToDateDifference).toBeLessThanOrEqual(0.05),
          `Loan Paid To Date percentage verification failed for ${yearText}. Expected ~${expectedPaidToDate.toFixed(2)}%, got ${actualPaidToDate}%`;
        
        console.log('\nVerifications passed');

        previousBalance = actualBalance;
      }
      
      if (allYearSections.length === testCase.loanTermYears) {
        expect(previousBalance).toBeLessThanOrEqual(1);
        console.log('\nLoan fully paid off as expected');
      }
    });
  });
});
