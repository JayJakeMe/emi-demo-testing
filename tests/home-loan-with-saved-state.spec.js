const { test, expect } = require('../fixtures/emiCalculator.fixture');
const { calculateEMIDetails } = require('../helper/homeLoanEMICalculator');


const testCases = [
  {
    name: 'Mid-term average loan',
    loanAmount: 2500000,
    interestRate: 10,
    loanTermYears: 10
  },
  {
    name: 'Standard 15-year mortgage',
    loanAmount: 5000000,
    interestRate: 7.5,
    loanTermYears: 15
  },
  {
    name: 'Randomized loan',

    loanAmount: (Math.floor(Math.random() * 200) + 10) * 100000, 

    interestRate: Math.floor(Math.random() * 77) * 0.25 + 1, 

    loanTermYears: Math.floor(Math.random() * 58 + 2) / 2 
  }
];

test.describe('EMI Calculator Tests', () => {
  testCases.forEach(testCase => {
    test(`verify emi calculator for ${testCase.name}`, async ({ emiCalculatorPage }) => {
      const page = emiCalculatorPage;
      console.log(`\nRunning test case: ${testCase.name}`);
      console.log(`\nLoan parameters: ${testCase.loanAmount} at ${testCase.interestRate}% for ${testCase.loanTermYears} years\n`);


      await expect(page).toHaveTitle(/emi calculator/i);


      const chart = page.locator('#emipiechart .highcharts-container');
      await expect(chart).toBeVisible();


      console.log('Getting initial chart state...');
      const initialPathValue = await page.evaluate(() => {
        const path = document.querySelector('#emipiechart path[fill]');
        return path ? path.getAttribute('d') : null;
      });


      let pathCheckValue = '';
      if (initialPathValue) {
        const match = initialPathValue.match(/[0-9.]+/g);
        pathCheckValue = match ? match[0] : '';
      }
      console.log('Will wait for path to change from:', pathCheckValue);


      const loanAmount = testCase.loanAmount;
      const interestRate = testCase.interestRate;
      const loanTermYears = testCase.loanTermYears;
      

      const loanAmountInput = page.getByRole('textbox', { name: 'Home Loan Amount' });
      await expect(loanAmountInput).toBeVisible();

      await page.getByRole('textbox', { name: 'Home Loan Amount' }).fill(loanAmount.toString());
 
      await page.getByRole('textbox', { name: 'Interest Rate' }).fill(interestRate.toString());

      await page.getByRole('textbox', { name: 'Loan Tenure' }).fill(loanTermYears.toString());

      await page.getByRole('textbox', { name: 'Loan Tenure' }).press('Enter');
  

      console.log('Waiting for chart to update...');
      await page.waitForFunction((initialValue) => {
        const path = document.querySelector('#emipiechart path[fill]');
        if (!path) return false;
    
        const currentD = path.getAttribute('d');

        return currentD && currentD !== initialValue;
      }, { timeout: 10000 }, initialPathValue);
      
      console.log('Extracting values from chart...');
      
      const percentageTexts = await page.locator('#emipiechart .highcharts-data-labels tspan').allTextContents();
      console.log('Data labels percentages:', percentageTexts);


      const principalPercentage = parseFloat(percentageTexts[0]);
      const interestPercentage = parseFloat(percentageTexts[1]);

      console.log('\nFinal Chart Values:');
      console.log(`- Principal amount: ${principalPercentage}%`);
      console.log(`- Interest amount: ${interestPercentage}%`);
  
      const calculated = calculateEMIDetails(loanAmount, interestRate, loanTermYears);

      console.log('\nExpected Values (Calculated by emi_calc helper class):');
      console.log(`- Principal amount: ${calculated.principalPercentage}%`);
      console.log(`- Interest amount: ${calculated.interestPercentage}%`);


      expect(principalPercentage).toBe(calculated.principalPercentage);
      expect(interestPercentage).toBe(calculated.interestPercentage);


      console.log('\nValues matched successfully!');

    });
  });
});