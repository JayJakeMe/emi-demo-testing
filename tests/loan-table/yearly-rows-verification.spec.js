const { test, expect } = require('../../fixtures/emiCalculator.fixture');

const testCases = [
  {
    name: '5-year loan',
    loanAmount: 750000,
    interestRate: 11,
    loanTermYears: 5,
    startMonth: 'Jul',
  },
];

test.describe('Yearly Rows Verification Tests', () => {
  testCases.forEach(testCase => {
    test(`verify yearly rows for ${testCase.name} (${testCase.loanTermYears} years)`, async ({ emiCalculatorPage }) => {
      const page = emiCalculatorPage;
      console.log(`\nTest: ${testCase.name} (${testCase.loanAmount} @ ${testCase.interestRate}%, ${testCase.loanTermYears}y)`);

      await expect(page).toHaveTitle(/emi calculator/i);

      await page.getByRole('textbox', { name: 'Home Loan Amount' }).fill(testCase.loanAmount.toString());
      await page.getByRole('textbox', { name: 'Interest Rate' }).fill(testCase.interestRate.toString());
      await page.getByRole('textbox', { name: 'Loan Tenure' }).fill(testCase.loanTermYears.toString());
      await page.getByRole('textbox', { name: 'Loan Tenure' }).press('Enter');

      await page.getByRole('textbox', { name: 'Schedule showing EMI payments' }).click();
      await page.waitForSelector('.datepicker-months');
      await page.locator('.datepicker-months .month', { hasText: testCase.startMonth }).first().click();
  
      await page.waitForSelector('#emipaymenttable');
      
      const expectedHeaders = [
        'Year',
        'Principal\n(A)',
        'Interest\n(B)',
        'Total Payment\n(A + B)',
        'Balance',
        'Loan Paid To Date'
      ];

      const headerCells = page.locator('#emipaymenttable > table th:not(.d-sm-none)');
      
      for (let i = 0; i < expectedHeaders.length; i++) {
        const headerText = await headerCells.nth(i).innerText();
        expect(headerText).toContain(expectedHeaders[i]);
      }
      
      const yearlyRows = page.locator('.yearlypaymentdetails');
      await expect(yearlyRows).not.toHaveCount(0);
      
      const yearlyRowsCount = await yearlyRows.count();
      console.log(`\nFound ${yearlyRowsCount} years in the payment schedule`);
      
      const startMonthNum = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(testCase.startMonth);
      const hasPartialFirstYear = startMonthNum > 0;
      if (hasPartialFirstYear) {
        console.log(`Note: Includes a partial first year (starting in ${testCase.startMonth})`);
      }
      const expectedMinYears = testCase.loanTermYears;
      const expectedMaxYears = hasPartialFirstYear ? testCase.loanTermYears + 1 : testCase.loanTermYears;

      expect(yearlyRowsCount).toBeGreaterThanOrEqual(expectedMinYears);
      expect(yearlyRowsCount).toBeLessThanOrEqual(expectedMaxYears);

      const toggleElements = page.locator('.paymentyear.toggle');
      const toggleCount = await toggleElements.count();
      console.log(`\nFound ${toggleCount} toggle elements in the table`);

      expect(toggleCount).toBe(yearlyRowsCount);

    });
  });
});
