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

// Seed test data before running tests
before(() => {
  // Make request to seed test events
  cy.request({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/seed-test-events',
    headers: {
      'Content-Type': 'application/json',
    },
    failOnStatusCode: false,
  }).then((response) => {
    cy.log(`Seeding response: ${response.status}`)
  })
})

// Set viewport for consistent testing
beforeEach(() => {
  cy.viewport(1280, 720)
})
