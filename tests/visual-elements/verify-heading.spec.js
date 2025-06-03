const { test, expect } = require('../../fixtures/emiCalculator.fixture');

const headingTestCases = [
  {
    name: 'EMI Calculator for Home Loan, Car Loan & Personal Loan in India',
    role: 'heading',
    level: 1,
    expectedStyles: {
      'font-size': '36px',
      'font-family': /Lato/
    }
  },
  {
    name: 'About Us',
    role: 'heading',
    level: 3,
    expectedStyles: {
      'font-size': '24px',
      'font-family': /Lato/
    }
  }
];

test.describe('Heading Verification Tests', () => {
  for (const testCase of headingTestCases) {
    test(`verify ${testCase.name} heading properties`, async ({ emiCalculatorPage: page }) => {
      const heading = page.getByRole(testCase.role, { name: testCase.name, exact: true });
      
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText(testCase.name);
      
      const tagName = await heading.evaluate(el => el.tagName);
      expect(tagName).toBe(`H${testCase.level}`);
      
      if (testCase.dimensions) {
        const box = await heading.boundingBox();
        expect(Math.round(box.width)).toBe(testCase.dimensions.width);
        expect(Math.round(box.height)).toBe(testCase.dimensions.height);
      }
      
      const cssProps = Object.keys(testCase.expectedStyles);
      const cssValues = {};
      
      for (const prop of cssProps) {
        const value = await heading.evaluate((el, p) => 
          window.getComputedStyle(el).getPropertyValue(p), prop);
        cssValues[prop] = value;
      }
      
      console.log(`\n${testCase.name} Heading CSS Values:`);
      console.table(cssValues);
      
      for (const [prop, expected] of Object.entries(testCase.expectedStyles)) {
        await expect(heading).toHaveCSS(prop, expected);
      }
      
      const className = await heading.getAttribute('class');
      const id = await heading.getAttribute('id');
      expect(className).toBeFalsy();
      expect(id).toBeFalsy();
      
      console.log(`Verified all properties of "${testCase.name}" heading`);
    });
  }
});
