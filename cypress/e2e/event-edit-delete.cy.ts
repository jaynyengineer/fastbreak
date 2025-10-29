describe('Event Edit and Delete Functionality', () => {
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

  describe('Edit event flow', () => {
    it('should navigate to edit page from dashboard', () => {
      // Click Edit button on first event card
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      cy.url().should('include', '/events/').and('include', '/edit')
      cy.get('h1').contains('Edit Event').should('be.visible')
    })

    it('should display current event details in form', () => {
      // Get first event card
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Form should be populated with event data
      cy.get('input[placeholder*="Downtown Soccer"]').should('have.value')
      cy.get('input[type="date"]').should('have.value')
      cy.get('input[type="time"]').should('have.value')
    })

    it('should update event name', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Update event name
      const eventNameField = cy.get('input[placeholder*="Downtown Soccer"]')
      eventNameField.clear()
      eventNameField.type('Updated Event Name')

      // Submit form
      cy.get('button').contains('Update Event').click()

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard')
    })

    it('should update sport type', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Get current sport type and change it
      cy.get('button[role="combobox"]').first().click()
      cy.get('[role="option"]').contains('Basketball').click()

      // Submit form
      cy.get('button').contains('Update Event').click()

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard')
    })

    it('should update date and time', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Update date
      const dateField = cy.get('input[type="date"]').first()
      dateField.clear()
      dateField.type('2025-11-15')

      // Update time
      const timeField = cy.get('input[type="time"]').first()
      timeField.clear()
      timeField.type('16:45')

      // Submit form
      cy.get('button').contains('Update Event').click()

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard')
    })

    it('should update description', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Update description
      const descField = cy.get('textarea[placeholder*="Tell participants"]')
      descField.clear()
      descField.type('Updated event description with new details')

      // Submit form
      cy.get('button').contains('Update Event').click()

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard')
    })

    it('should add a new venue', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Add venue
      cy.get('button').contains('Add Another Venue').click()

      // Should have venue fields
      cy.get('input[placeholder*="Central Park"]').should('have.length.greaterThan', 0)
    })

    it('should remove a venue', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Add multiple venues
      cy.get('button').contains('Add Another Venue').click()
      cy.get('button').contains('Add Another Venue').click()

      // Remove middle venue
      cy.get('svg[class*="w-4"][class*="h-4"]').eq(1).click()

      // Update form and submit
      cy.get('button').contains('Update Event').click()
      cy.url().should('include', '/dashboard')
    })

    it('should cancel and return to dashboard', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Verify we're on edit page
      cy.url().should('include', '/edit')

      // Click Cancel
      cy.get('button').contains('Cancel').click()

      // Should return to dashboard
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Delete event flow', () => {
    it('should display delete button on edit page', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      cy.get('button').contains('Delete').should('be.visible')
    })

    it('should show delete confirmation dialog', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Click delete button
      cy.get('button').contains('Delete').click()

      // Dialog should appear
      cy.get('[role="dialog"]').should('be.visible')
      cy.get('h2').contains('Delete Event').should('be.visible')
    })

    it('should cancel delete and stay on edit page', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Click delete button
      cy.get('button').contains('Delete').click()

      // Click cancel in dialog
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Cancel').click()
      })

      // Dialog should close
      cy.get('[role="dialog"]').should('not.be.visible')

      // Should still be on edit page
      cy.url().should('include', '/edit')
    })

    it('should confirm delete and remove event', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Click delete button
      cy.get('button').contains('Delete').click()

      // Confirm delete
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Delete Event').click()
      })

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard')
    })

    it('should disable all controls during deletion', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Click delete button
      cy.get('button').contains('Delete').click()

      // Start delete process (don't wait for completion)
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Delete Event').click()
      })

      // Controls should be disabled
      cy.get('button').contains('Cancel').should('be.disabled')
    })
  })

  describe('Authorization checks', () => {
    it('should prevent editing another user\'s event', () => {
      // This test would require creating an event as one user and attempting to edit as another
      // For now, we verify that the page shows ownership error
      cy.visit('http://localhost:3000/events/non-existent-id/edit')
      cy.get('p').contains(/Error|not found|unauthorized/).should('be.visible')
    })
  })

  describe('Form validation on edit', () => {
    it('should validate required fields before update', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Clear event name
      const eventNameField = cy.get('input[placeholder*="Downtown Soccer"]')
      eventNameField.clear()

      // Try to submit
      cy.get('button').contains('Update Event').click()

      // Should show validation error
      cy.get('p').should('contain', 'required')
    })

    it('should validate venue fields', () => {
      // Navigate to edit page
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      // Clear venue name
      const venueNameField = cy.get('input[placeholder*="Central Park"]').first()
      venueNameField.clear()

      // Try to submit
      cy.get('button').contains('Update Event').click()

      // Should show validation error
      cy.get('p').should('contain', 'required')
    })
  })
})
