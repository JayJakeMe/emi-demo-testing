// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // Set output directory for test results
  outputDir: 'test-results/',
  
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: {
      mode: 'on', // Record video for all tests
      size: { width: 1280, height: 720 }, // Set video resolution
    },
    screenshot: 'on', // Also capture screenshots
  },

  /* Configure projects */
  projects: [
    // Browser tests - will run on both Chromium and Firefox
    {
      name: 'chromium',
      testMatch: '**/*.spec.js',  // Matches all test files
      testIgnore: [
        '**/api/*.spec.js',  // Exclude API tests
        '**/extra-check/**',  // Exclude extra-check directory
      ],
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        headless: true,  // Set to true for CI
        screenshot: 'on',
      },
    },
    // {
    //   name: 'firefox',
    //   testMatch: '**/*.spec.js',  // Matches all test files
    //   testIgnore: [
    //     '**/api/*.spec.js',  // Exclude API tests
    //     '**/extra-check/**',  // Exclude extra-check directory
    //   ],
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 },
    //     headless: true,  // Set to true for CI
    //     screenshot: 'on',
    //   },
    // },
    // API tests - will run without browser
    // {
    //   name: 'api',
    //   testMatch: '**/api/*.spec.js',  // Only matches API test files
    //   use: {
    //     baseURL: 'https://reqres.in/api',
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

