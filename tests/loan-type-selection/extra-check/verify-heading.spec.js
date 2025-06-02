const { test, expect } = require('../fixtures/emiCalculator.fixture');

test('log heading styles', async ({ emiCalculatorPage }) => {
  const page = emiCalculatorPage;
  const heading = page.getByRole('heading', { 
    name: 'EMI Calculator for Home Loan, Car Loan & Personal Loan in India',
    exact: true 
  });
  
  await expect(heading).toBeVisible();
  
  // Get and log CSS properties
  const styles = await heading.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      color: styles.color,
      'font-size': styles.fontSize,
      'font-family': styles.fontFamily,
      'font-weight': styles.fontWeight,
      'text-align': styles.textAlign,
      'background-color': styles.backgroundColor,
      margin: styles.margin,
      padding: styles.padding
    };
  });
  
  console.log('📋 Heading Styles:');
  console.table(styles);
});


// const { test, expect } = require('../fixtures/emiCalculator.fixture');

// test('log heading raw styles', async ({ emiCalculatorPage }) => {
//   const page = emiCalculatorPage;
//   const heading = page.getByRole('heading', { 
//     name: 'EMI Calculator for Home Loan, Car Loan & Personal Loan in India',
//     exact: true 
//   });
  
//   await expect(heading).toBeVisible();
  
//   // Get and log raw style object
//   const rawStyles = await heading.evaluate((el) => {
//     // Get all style properties from the element
//     const computed = window.getComputedStyle(el);
//     const styleObj = {};
    
//     // Convert CSSStyleDeclaration to a plain object
//     for (let i = 0; i < computed.length; i++) {
//       const prop = computed[i];
//       styleObj[prop] = computed.getPropertyValue(prop);
//     }
    
//     return styleObj;
//   });
  
//   console.log('📋 Raw Style Object:');
//   console.log(JSON.stringify(rawStyles, null, 2));
  
//   // Also log the element's outerHTML for reference
//   const html = await heading.evaluate(el => el.outerHTML);
//   console.log('\n🔍 Element HTML:');
//   console.log(html);
// });

