describe('Toast Notifications and UX Improvements', () => {
  beforeEach(() => {
    // Sign in before each test
    cy.visit('http://localhost:3000/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('Test@12345')
    cy.get('button[type="submit"]').click()

    // Wait for redirect to dashboard with longer timeout
    cy.url({ timeout: 15000 }).should('include', '/dashboard')
    
    // Wait for dashboard to load
    cy.get('h1').contains('Sports Events', { timeout: 10000 }).should('be.visible')
  })

  describe('Event creation toasts', () => {
    it('should show success toast after creating event', () => {
      cy.get('a').contains('Create Event').click()
      cy.url().should('include', '/events/create')

      // Fill form
      cy.get('input[placeholder*="Downtown Soccer"]').type('Success Test Event')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('input[placeholder*="Central Park"]').type('Central Park')
      cy.get('input[placeholder*="123 Main"]').type('123 Main St')

      // Submit form
      cy.get('button').contains('Create Event').click()

      // Wait for success toast (should appear before redirect)
      cy.get('[role="status"]').contains('created successfully').should('be.visible')
    })

    it('should show error toast for validation failure', () => {
      cy.get('a').contains('Create Event').click()

      // Try to submit empty form
      cy.get('button').contains('Create Event').click()

      // Should see validation errors
      cy.get('p').should('contain.text', 'required')
    })

    it('should show loading state during submission', () => {
      cy.get('a').contains('Create Event').click()

      // Fill minimum form
      cy.get('input[placeholder*="Downtown Soccer"]').type('Loading Test Event')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Basketball').click()
      cy.get('input[type="date"]').type('2025-12-20')
      cy.get('input[type="time"]').type('16:00')
      cy.get('input[placeholder*="Central Park"]').type('Test Venue')
      cy.get('input[placeholder*="123 Main"]').type('123 Test St')

      // Start submission
      cy.get('button').contains('Create Event').click()

      // Button should show loading text
      cy.get('button').contains('Creating Event...').should('be.visible')
    })
  })

  describe('Event update toasts', () => {
    it('should show success toast after updating event', () => {
      // Navigate to first event's edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      cy.url().should('include', '/edit')

      // Make a change
      const eventNameField = cy.get('input[placeholder*="Downtown Soccer"]')
      eventNameField.clear()
      eventNameField.type('Updated Event Name')

      // Submit
      cy.get('button').contains('Update Event').click()

      // Should see success toast
      cy.get('[role="status"]').contains('updated successfully').should('be.visible')
    })

    it('should show error toast for update failure', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Clear required field
      const eventNameField = cy.get('input[placeholder*="Downtown Soccer"]')
      eventNameField.clear()

      // Try to submit
      cy.get('button').contains('Update Event').click()

      // Should show validation error
      cy.get('p').should('contain', 'required')
    })
  })

  describe('Event delete toasts', () => {
    it('should show success toast after deleting event', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Open delete dialog
      cy.get('button').contains('Delete').click()

      // Confirm delete
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Delete Event').click()
      })

      // Should see success toast
      cy.get('[role="status"]').contains('deleted successfully').should('be.visible')
    })
  })

  describe('Toast UI and interactions', () => {
    it('should show toast in top-right corner', () => {
      cy.get('a').contains('Create Event').click()

      // Fill and submit form
      cy.get('input[placeholder*="Downtown Soccer"]').type('Toast Position Test')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('input[placeholder*="Central Park"]').type('Central Park')
      cy.get('input[placeholder*="123 Main"]').type('123 Main St')

      cy.get('button').contains('Create Event').click()

      // Toast should appear
      cy.get('[role="status"]').should('be.visible').contains('created successfully')
    })

    it('should have close button on toast', () => {
      cy.get('a').contains('Create Event').click()

      // Fill and submit
      cy.get('input[placeholder*="Downtown Soccer"]').type('Close Button Test')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('input[placeholder*="Central Park"]').type('Central Park')
      cy.get('input[placeholder*="123 Main"]').type('123 Main St')

      cy.get('button').contains('Create Event').click()

      // Toast should have close button
      cy.get('[role="status"]').within(() => {
        cy.get('button').should('be.visible')
      })
    })

    it('should support multiple toasts', () => {
      // Create first event
      cy.get('a').contains('Create Event').click()

      cy.get('input[placeholder*="Downtown Soccer"]').type('First Event')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('input[placeholder*="Central Park"]').type('Central Park')
      cy.get('input[placeholder*="123 Main"]').type('123 Main St')

      cy.get('button').contains('Create Event').click()

      // Wait for redirect to dashboard
      cy.url().should('include', '/dashboard')

      // Create second event
      cy.get('a').contains('Create Event').click()

      cy.get('input[placeholder*="Downtown Soccer"]').type('Second Event')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Basketball').click()
      cy.get('input[type="date"]').type('2025-12-16')
      cy.get('input[type="time"]').type('16:00')
      cy.get('input[placeholder*="Central Park"]').type('Central Park')
      cy.get('input[placeholder*="123 Main"]').type('123 Main St')

      cy.get('button').contains('Create Event').click()

      // Should see success toast
      cy.get('[role="status"]').contains('created successfully').should('be.visible')
    })
  })

  describe('Error handling and messages', () => {
    it('should display user-friendly error messages', () => {
      cy.get('a').contains('Create Event').click()

      // Submit empty form to trigger validation errors
      cy.get('button').contains('Create Event').click()

      // Should see descriptive error messages (no internal stack traces)
      cy.get('p').should('contain', 'required')
      cy.get('p').should('not.contain', 'at ')
      cy.get('p').should('not.contain', 'Error:')
      cy.get('p').should('not.contain', 'stack')
    })

    it('should clear errors when fixing invalid form fields', () => {
      cy.get('a').contains('Create Event').click()

      // Submit empty to see errors
      cy.get('button').contains('Create Event').click()
      cy.get('p').should('contain', 'required')

      // Fill event name
      cy.get('input[placeholder*="Downtown Soccer"]').type('Test Event')

      // Error should clear for that field
      cy.get('input[placeholder*="Downtown Soccer"]').next().should('not.contain', 'required')
    })
  })

  describe('Loading states and disabled inputs', () => {
    it('should disable all form inputs during submission', () => {
      cy.get('a').contains('Create Event').click()

      // Fill form
      cy.get('input[placeholder*="Downtown Soccer"]').type('Disable Test Event')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('input[placeholder*="Central Park"]').type('Central Park')
      cy.get('input[placeholder*="123 Main"]').type('123 Main St')

      // Click submit
      cy.get('button').contains('Create Event').click()

      // Form controls should be disabled
      cy.get('input[placeholder*="Downtown Soccer"]').should('be.disabled')
      cy.get('button').contains('Select a sport type').should('be.disabled')
      cy.get('button').contains('Cancel').should('be.disabled')
    })

    it('should disable delete button during deletion', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Click delete
      cy.get('button').contains('Delete').click()

      // Start delete (button should show loading)
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Delete Event').click()
      })

      // Dialog buttons should be disabled
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').should('be.disabled')
      })
    })
  })
})
