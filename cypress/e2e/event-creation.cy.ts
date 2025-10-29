describe('Event Creation Form', () => {
  beforeEach(() => {
    // Sign in before each test
    cy.visit('http://localhost:3000/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('Test@12345')
    cy.get('button[type="submit"]').click()

    // Wait for redirect to dashboard with longer timeout
    cy.url({ timeout: 15000 }).should('include', '/dashboard')
    
    // Wait for dashboard to load and button to appear
    cy.get('a').contains('Create Event', { timeout: 10000 }).should('be.visible')

    // Navigate to create event page
    cy.get('a').contains('Create Event').click()
    cy.url({ timeout: 10000 }).should('include', '/events/create')
  })

  describe('Form rendering and navigation', () => {
    it('should display the create event form', () => {
      cy.get('h1').contains('Create New Event').should('be.visible')
      cy.get('input[placeholder*="Downtown Soccer"]').should('be.visible')
    })

    it('should display all required form sections', () => {
      cy.get('h2').contains('Event Details').should('be.visible')
      cy.get('h2').contains('Venues').should('be.visible')
    })

    it('should have Cancel button that returns to dashboard', () => {
      cy.get('button').contains('Cancel').click()
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Event name field', () => {
    it('should validate empty event name', () => {
      cy.get('button').contains('Create Event').click()
      cy.get('p').should('contain', 'String must contain at least 1 character')
    })

    it('should accept valid event name', () => {
      cy.get('input[placeholder*="Downtown Soccer"]').type('Summer Soccer League')
      cy.get('input[placeholder*="Downtown Soccer"]').should('have.value', 'Summer Soccer League')
    })
  })

  describe('Sport type field', () => {
    it('should display all sport type options', () => {
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').should('have.length.at.least', 10)
      cy.get('[role="option"]').contains('Soccer').should('be.visible')
      cy.get('[role="option"]').contains('Basketball').should('be.visible')
      cy.get('[role="option"]').contains('Tennis').should('be.visible')
    })

    it('should validate sport type is required', () => {
      cy.get('input[placeholder*="Downtown Soccer"]').type('Summer Soccer League')
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('button').contains('Create Event').click()
      cy.get('p').should('contain', 'Invalid enum value')
    })

    it('should allow selecting a sport type', () => {
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('button').contains('Soccer').should('exist')
    })
  })

  describe('Date and time fields', () => {
    it('should validate required date', () => {
      cy.get('input[placeholder*="Downtown Soccer"]').type('Summer Soccer League')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="time"]').type('14:30')
      cy.get('button').contains('Create Event').click()
      cy.get('p').should('contain', 'String must contain at least 1 character')
    })

    it('should validate required time', () => {
      cy.get('input[placeholder*="Downtown Soccer"]').type('Summer Soccer League')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('button').contains('Create Event').click()
      cy.get('p').should('contain', 'String must contain at least 1 character')
    })

    it('should accept valid date and time', () => {
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('input[type="date"]').should('have.value', '2025-12-15')
      cy.get('input[type="time"]').should('have.value', '14:30')
    })
  })

  describe('Description field', () => {
    it('should accept optional description', () => {
      cy.get('textarea[placeholder*="Tell participants"]').type('This is a fun summer soccer tournament')
      cy.get('textarea[placeholder*="Tell participants"]').should(
        'have.value',
        'This is a fun summer soccer tournament'
      )
    })

    it('should allow empty description', () => {
      cy.get('input[placeholder*="Downtown Soccer"]').type('Summer Soccer League')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      // Description is empty - should be fine
      cy.get('[placeholder*="Central Park"]').should('be.visible')
    })
  })

  describe('Venues section', () => {
    it('should display initial venue fields', () => {
      cy.get('input[placeholder*="Central Park"]').should('be.visible')
      cy.get('input[placeholder*="123 Main"]').should('be.visible')
      cy.get('input[placeholder="100"]').should('be.visible')
    })

    it('should validate venue name is required', () => {
      cy.get('input[placeholder*="Downtown Soccer"]').type('Summer Soccer League')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('input[placeholder*="123 Main"]').type('123 Main St, City')
      cy.get('input[placeholder="100"]').clear().type('500')
      cy.get('button').contains('Create Event').click()
      cy.get('p').should('contain', 'String must contain at least 1 character')
    })

    it('should validate venue address is required', () => {
      cy.get('input[placeholder*="Downtown Soccer"]').type('Summer Soccer League')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('input[placeholder*="Central Park"]').type('Central Park')
      cy.get('input[placeholder="100"]').clear().type('500')
      cy.get('button').contains('Create Event').click()
      cy.get('p').should('contain', 'String must contain at least 1 character')
    })

    it('should allow adding multiple venues', () => {
      cy.get('button').contains('Add Another Venue').click()
      cy.get('input[placeholder*="Central Park"]').should('have.length', 2)
    })

    it('should allow removing venues', () => {
      cy.get('button').contains('Add Another Venue').click()
      cy.get('button').contains('Add Another Venue').click()
      cy.get('input[placeholder*="Central Park"]').should('have.length', 3)

      // Remove second venue
      cy.get('svg[class*="w-4"][class*="h-4"]').eq(1).click()
      cy.get('input[placeholder*="Central Park"]').should('have.length', 2)
    })

    it('should enforce max 10 venues', () => {
      // Add venues until we reach 10
      for (let i = 0; i < 9; i++) {
        cy.get('button').contains('Add Another Venue').click()
      }

      // Should show max venue message
      cy.get('p').contains('Maximum 10 venues reached').should('be.visible')
      cy.get('button').contains('Add Another Venue').should('not.exist')
    })
  })

  describe('Complete event creation flow', () => {
    it('should create an event with valid data', () => {
      // Fill event details
      cy.get('input[placeholder*="Downtown Soccer"]').type('Summer Soccer Tournament')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('textarea[placeholder*="Tell participants"]').type('Annual summer tournament')

      // Fill venue details
      cy.get('input[placeholder*="Central Park"]').type('Central Park Soccer Field')
      cy.get('input[placeholder*="123 Main"]').type('123 Central Park Ave, New York, NY 10001')
      cy.get('input[placeholder="100"]').clear().type('500')

      // Submit form
      cy.get('button').contains('Create Event').click()

      // Should redirect to dashboard after successful creation
      cy.url().should('include', '/dashboard')
    })

    it('should create an event with multiple venues', () => {
      // Fill event details
      cy.get('input[placeholder*="Downtown Soccer"]').type('Basketball League')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Basketball').click()
      cy.get('input[type="date"]').type('2025-11-20')
      cy.get('input[type="time"]').type('18:00')

      // Fill first venue
      cy.get('input[placeholder*="Central Park"]').first().type('Downtown Court')
      cy.get('input[placeholder*="123 Main"]').first().type('100 Court St, Downtown')
      cy.get('input[placeholder="100"]').first().clear().type('300')

      // Add second venue
      cy.get('button').contains('Add Another Venue').click()
      cy.get('input[placeholder*="Central Park"]').eq(1).type('Uptown Court')
      cy.get('input[placeholder*="123 Main"]').eq(1).type('200 Court Ave, Uptown')
      cy.get('input[placeholder="100"]').eq(1).clear().type('250')

      // Submit form
      cy.get('button').contains('Create Event').click()

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Form validation and error handling', () => {
    it('should show all validation errors when submitting empty form', () => {
      cy.get('button').contains('Create Event').click()

      // Should show multiple error messages
      cy.get('p[class*="text-red"]').should('have.length.greaterThan', 1)
    })

    it('should disable form during submission', () => {
      cy.get('input[placeholder*="Downtown Soccer"]').type('Summer Soccer League')
      cy.get('button').contains('Select a sport type').click()
      cy.get('[role="option"]').contains('Soccer').click()
      cy.get('input[type="date"]').type('2025-12-15')
      cy.get('input[type="time"]').type('14:30')
      cy.get('input[placeholder*="Central Park"]').type('Central Park')
      cy.get('input[placeholder*="123 Main"]').type('123 Main St')

      // All fields should be disabled during submission
      cy.get('button').contains('Create Event').click()
      cy.get('input[placeholder*="Downtown Soccer"]').should('be.disabled')
      cy.get('button').contains('Cancel').should('be.disabled')
    })
  })
})
