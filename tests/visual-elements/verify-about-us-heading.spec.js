const { test, expect } = require('../../fixtures/emiCalculator.fixture');

test('verify About Us heading properties', async ({ emiCalculatorPage: page }) => {
  const aboutUsHeading = page.getByRole('heading', { name: 'About Us', exact: true });
  
  await expect(aboutUsHeading).toBeVisible();
  await expect(aboutUsHeading).toHaveText('About Us');
  
  const tagName = await aboutUsHeading.evaluate(el => el.tagName);
  expect(tagName).toBe('H3');
  
  const box = await aboutUsHeading.boundingBox();
  expect(Math.round(box.width)).toBe(365);
  expect(Math.round(box.height)).toBe(30);
  
  const cssProps = ['font-size', 'font-family', 'font-weight', 'color', 'text-align', 'display', 'position'];
  const cssValues = {};
  
  for (const prop of cssProps) {
    const value = await aboutUsHeading.evaluate((el, p) => 
      window.getComputedStyle(el).getPropertyValue(p), prop);
    cssValues[prop] = value;
  }
  
  console.log('\nAbout Us Heading CSS Values:');
  console.table(cssValues);
  
  await expect(aboutUsHeading).toHaveCSS('font-size', '24px');
  await expect(aboutUsHeading).toHaveCSS('font-family', /Lato/);
  
  const className = await aboutUsHeading.getAttribute('class');
  const id = await aboutUsHeading.getAttribute('id');
  expect(className).toBeFalsy();
  expect(id).toBeFalsy();
  
  console.log('✅ Verified all properties of "About Us" heading');
});
