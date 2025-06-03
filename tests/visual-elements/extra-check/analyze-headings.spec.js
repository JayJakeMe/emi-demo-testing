const { test, expect } = require('../../fixtures/emiCalculator.fixture');

async function getElementStyles(page, selector, index) {
  return page.evaluate(([sel, idx]) => {
    const element = document.querySelectorAll(sel)[idx];
    if (!element) return null;
    
    const styles = window.getComputedStyle(element);
    return {
      id: `heading-${idx + 1}`,
      tagName: element.tagName,
      text: element.textContent.trim(),
      styles: {
        'color': styles.color,
        'font-size': styles.fontSize,
        'font-family': styles.fontFamily,
        'font-weight': styles.fontWeight,
        'line-height': styles.lineHeight,
        'text-align': styles.textAlign,
        'margin': styles.margin,
        'padding': styles.padding,
        'display': styles.display,
        'position': styles.position
      },
      boundingBox: element.getBoundingClientRect().toJSON()
    };
  }, [selector, index]);
}

test('analyze all headings on page', async ({ emiCalculatorPage: page }) => {
  const selector = 'h1, h2, h3, h4, h5, h6';
  
  const headingCount = await page.$$eval(selector, elements => elements.length);
  console.log(`\n Found ${headingCount} heading(s) on the page`);
  
  for (let i = 0; i < headingCount; i++) {
    const headingInfo = await getElementStyles(page, selector, i);
    if (!headingInfo) {
      console.log(`\n Could not analyze heading #${i + 1}`);
      continue;
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(` ${headingInfo.tagName.toUpperCase()}: "${headingInfo.text}"`);
    console.log('='.repeat(80));
    
    console.log('\n Styles:');
    console.table(headingInfo.styles);
    
    console.log('\n Dimensions & Position:');
    console.table({
      'Width (px)': Math.round(headingInfo.boundingBox.width),
      'Height (px)': Math.round(headingInfo.boundingBox.height),
      'X (px)': Math.round(headingInfo.boundingBox.x),
      'Y (px)': Math.round(headingInfo.boundingBox.y)
    });
    
    try {
      const screenshotPath = `test-results/heading-${headingInfo.id}.png`;
      await page.locator(selector).nth(i).screenshot({ path: screenshotPath });
      console.log(` Screenshot saved to: ${screenshotPath}`);
    } catch (error) {
      console.error(' Could not take screenshot:', error.message);
    }
  }
});

test('display About Us heading parameters', async ({ emiCalculatorPage: page }) => {
  const aboutUsHeading = page.getByRole('heading', { name: 'About Us', exact: true });
  
  const headingInfo = await aboutUsHeading.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const styleObj = {};

    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      styleObj[prop] = styles.getPropertyValue(prop);
    }
    
    return {
      tagName: el.tagName,
      className: el.className,
      id: el.id || 'none',
      text: el.textContent.trim(),
      attributes: Array.from(el.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      })),
      boundingBox: {
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        top: rect.top
      },
      styles: styleObj,
      computedStyles: {
        color: styles.color,
        'font-size': styles.fontSize,
        'font-family': styles.fontFamily,
        'font-weight': styles.fontWeight,
        'line-height': styles.lineHeight,
        'text-align': styles.textAlign,
        'margin': styles.margin,
        'padding': styles.padding,
        'display': styles.display,
        'position': styles.position
      }
    };
  });
  
  console.log('\nAbout Us Heading Parameters:');
  console.log('='.repeat(80));
  console.log(`Tag Name: ${headingInfo.tagName}`);
  console.log(`Class: ${headingInfo.className || 'none'}`);
  console.log(`ID: ${headingInfo.id}`);
  console.log(`Text: "${headingInfo.text}"`);
  
  console.log('\nAttributes:');
  if (headingInfo.attributes.length > 0) {
    headingInfo.attributes.forEach(attr => {
      console.log(`- ${attr.name}: ${attr.value}`);
    });
  } else {
    console.log('No attributes found');
  }
  
  console.log('\nBounding Box:');
  console.table({
    'Width (px)': Math.round(headingInfo.boundingBox.width),
    'Height (px)': Math.round(headingInfo.boundingBox.height),
    'X (px)': Math.round(headingInfo.boundingBox.x),
    'Y (px)': Math.round(headingInfo.boundingBox.y),
    'Right (px)': Math.round(headingInfo.boundingBox.right),
    'Bottom (px)': Math.round(headingInfo.boundingBox.bottom)
  });
  
  console.log('\nComputed Styles:');
  console.table(headingInfo.computedStyles);
  
  await page.screenshot({ path: 'test-results/about-us-heading.png' });
  console.log('\nScreenshot saved as test-results/about-us-heading.png');
});

test('verify About Us heading properties', async ({ emiCalculatorPage: page }) => {
  const aboutUsHeading = page.getByRole('heading', { name: 'About Us', exact: true });
  
  await expect(aboutUsHeading).toBeVisible();
  await expect(aboutUsHeading).toHaveText('About Us');
  
  const tagName = await aboutUsHeading.evaluate(el => el.tagName);
  expect(tagName).toBe('H3');
  
  const box = await aboutUsHeading.boundingBox();
  expect(Math.round(box.width)).toBe(365);
  expect(Math.round(box.height)).toBe(30);
  
  await expect(aboutUsHeading).toHaveCSS('font-size', '24px');
  await expect(aboutUsHeading).toHaveCSS('font-family', /Lato/);
  await expect(aboutUsHeading).toHaveCSS('font-weight', '500');
  await expect(aboutUsHeading).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(aboutUsHeading).toHaveCSS('text-align', 'left');
  await expect(aboutUsHeading).toHaveCSS('display', 'block');
  await expect(aboutUsHeading).toHaveCSS('position', 'static');
  
  const className = await aboutUsHeading.getAttribute('class');
  const id = await aboutUsHeading.getAttribute('id');
  expect(className).toBeFalsy();
  expect(id).toBeFalsy();
  
  console.log('✅ Verified all properties of "About Us" heading');
});
