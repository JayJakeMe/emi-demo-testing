# Apollo Task - EMI Calculator Test Automation

This project contains automated tests for an EMI (Equated Monthly Installment) Calculator web application, along with API testing examples. The tests are implemented using Playwright, a modern end-to-end testing framework.

## Features

### 1. Home Loan EMI Calculator Tests
- Tests for home loan EMI calculations with various loan parameters
- Supports different loan amounts, interest rates, and loan tenures
- Validates EMI, total interest, and total payment calculations
- Includes randomized test cases for broader test coverage

### 2. Personal Loan EMI Chart Tests
- Validates the EMI bar chart visualization
- Tests tooltip values for different loan scenarios
- Supports testing with both direct input and sliders
- Verifies principal and interest components in the payment schedule

### 3. API Tests
- Example API tests for Reqres.in mock API
- Validates user data endpoints
- Demonstrates API testing best practices with Playwright

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js) or yarn
- Playwright (will be installed as a dev dependency)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/kubliza/apollo_task.git
   cd apollo_task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test files
```bash
# Run home loan calculator tests
npx playwright test tests/home-loan-with-saved-state.spec.js

# Run personal loan chart tests
npx playwright test tests/emichart-read-bars.spec.js

# Run personal loan chart tests with sliders
npx playwright test tests/emichart-read-bars-with-sliders.spec.js

# Run API tests
npx playwright test tests/api/verify-users-api.spec.js
```

### Run in UI mode (Playwright Test UI)
```bash
npx playwright test --ui
```

### Run in headed mode (to see the browser)
```bash
npx playwright test --headed
```

## Test Structure

- `tests/` - Contains all test files
  - `home-loan-with-saved-state.spec.js` - Tests for home loan EMI calculations
  - `emichart-read-bars.spec.js` - Tests for personal loan EMI chart visualization
  - `emichart-read-bars-with-sliders.spec.js` - Tests for personal loan chart with slider interactions
  - `api/verify-users-api.spec.js` - API test - users response verification
- `fixtures/` - Contains test fixtures, test data, and browser state files:
  - `emiCalculator.fixture.js` - Playwright test fixture for EMI Calculator tests:
    - Handles browser context setup and teardown
    - Manages cookie consent dialogs
    - Persists browser state between test runs for faster execution
    - Supports multiple browsers (Chromium, Firefox) with separate state files
  
  - `users-response.json` - Mock API response data for user-related API tests:
    - Contains sample user data for Reqres.in API testing
    - Used for verifying API response structures and data validation
    
  - `state-chromium.json` - Persistent browser state for Chromium:
    - chromium state with consent handled (consent button is clicked)

  - `state-firefox.json` - Persistent browser state for Firefox:
    - firefox state with consent handled (consent button is clicked)

- `helper/` - Contains helper functions and utilities:
  - `homeLoanEMICalculator.js` - A helper class for home loan EMI calculations - use for test results verification
    - `calculateEMI(principal, rate, tenure)` - Calculates EMI using standard formula
    - `calculateTotalInterest(emi, principal, tenure)` - Calculates total interest paid
    - `calculateEMIDetails(principal, annualRate, years)` - Returns comprehensive loan details

  - `personalLoanCalculatorHelper.js` - A helper class for personal loan payment calculations - use for test results verification:
    - `calculateLoanPayments(amount, rate, years, startYear, startMonth)` - Calculates payment schedule
    - Handles both numeric and named months (e.g., 'Jan', 'February')
    - Returns detailed payment breakdown including principal, interest, and remaining balance

  - `sliderHelper.js` - A helper class for interacting with slider UI elements:
    - `setSliderValue(page, selector, value, fieldName, min, max)` - Sets slider value with visual feedback
    - Handles slider drag interactions
    - Includes validation of the set value


## Test Cases

### Loan Type Selection Tests

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC01 | Verify default loan type | 1. Launch the application | Home Loan should be selected by default |
| TC02 | Select Personal Loan | 1. Click "Personal Loan" option | Loan type changes to Personal Loan |
| TC03 | Select Car Loan | 1. Click "Car Loan" option | Loan type changes to Car Loan |
| TC04 | Switch from Personal to Car Loan | 1. Select Personal Loan<br>2. Click "Car Loan" | Loan type updates to Car Loan |
| TC05 | Switch from Car to Home Loan | 1. Select Car Loan<br>2. Click "Home Loan" | Loan type updates to Home Loan |
| TC06 | Verify all loan types | 1. Check all loan type options | All loan types should be selectable |
| TC07 | Visual feedback on selection | 1. Select any loan type | Visual feedback (highlight/active state) appears |
| TC08 | Persistence after refresh | 1. Select a loan type<br>2. Refresh the page | Selected loan type persists |
| TC09 | Mobile responsiveness | 1. Test on mobile view | Loan type selector is usable and responsive |
| TC10 | Accessibility | 1. Test with keyboard navigation | All loan types are accessible via keyboard |


### Loan Amount Tests

#### Loan Amount Slider Tests

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC11 | Verify default loan amount | 1. Launch the application | Loan amount should default to the minimum (e.g., ₹0) |
| TC12 | Adjust to maximum loan amount | 1. Slide to maximum amount | Loan amount should reflect the maximum value |
| TC13 | Adjust to minimum loan amount | 1. Slide to minimum amount | Loan amount should reflect the minimum value |
| TC14 | Check incremental adjustments | 1. Slide slowly | Loan amount should change in defined increments |
| TC15 | Validate amount update | 1. Slide to ₹30,00,000 | Monthly EMI, total interest, and total payment should update accordingly |
| TC16 | Verify input field sync | 1. Slide to ₹50,00,000 | Input field should display the same loan amount as slider |
| TC17 | Enforce maximum limit | 1. Slide beyond maximum | Slider should not allow values greater than the preset maximum |

### Interest Rate Tests

#### Interest Rate Slider Tests

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC21 | Verify default interest rate | 1. Launch the application | Interest rate should default to a standard value (e.g., 10%) |
| TC22 | Adjust to maximum interest rate | 1. Slide to maximum rate | Interest rate should reflect the maximum allowed value |
| TC23 | Adjust to minimum interest rate | 1. Slide to minimum rate | Interest rate should reflect the minimum allowed value |
| TC24 | Check rate increment precision | 1. Adjust slider in small increments | Rate should change in precise decimal steps (e.g., 0.1%) |
| TC25 | Validate EMI updates with rate change | 1. Change interest rate | EMI, total interest, and total payment should recalculate accordingly |
| TC26 | Verify input field sync | 1. Manually enter an interest rate | Slider should update to match the entered rate |
| TC27 | Boundary value testing | 1. Enter rates at boundaries (min/max) | System should handle min/max rate values correctly |

### Loan Tenure Tests

#### Loan Tenure Slider Tests

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC31 | Verify default tenure | 1. Launch the application | Tenure should default to a standard value (e.g., 5 years) |
| TC32 | Adjust to maximum tenure | 1. Slide to maximum years | Tenure should reflect the maximum allowed value (e.g., 30 years) |
| TC33 | Adjust to minimum tenure | 1. Slide to minimum years | Tenure should reflect the minimum allowed value (e.g., 1 year) |
| TC34 | Check year/month toggle | 1. Switch between years and months | Tenure should convert correctly between years and months |
| TC35 | Validate EMI updates with tenure change | 1. Change loan tenure | EMI, total interest, and total payment should recalculate accordingly |
| TC36 | Verify input field sync | 1. Manually enter a tenure value | Slider should update to match the entered value |
| TC37 | Boundary value testing | 1. Enter tenure at boundaries (min/max) | System should handle min/max tenure values correctly |



