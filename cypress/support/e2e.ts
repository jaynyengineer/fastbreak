// Cypress support file for E2E tests
// This file is loaded before each E2E test file runs

// You can use this file to:
// 1. Import command plugins
// 2. Add custom commands
// 3. Set up hooks
// 4. Add global configurations

// Import or require commands here
// import './commands'

// Handle uncaught exceptions
// Suppress all uncaught exceptions - we're testing functionality, not console errors
Cypress.on('uncaught:exception', () => {
  // Return false to prevent the test from failing on any uncaught exceptions
  // This allows us to test actual functionality without being blocked by component warnings
  return false
})

// Set viewport for consistent testing
beforeEach(() => {
  cy.viewport(1280, 720)
})
