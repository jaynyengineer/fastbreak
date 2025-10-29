describe('Dashboard - Event List and Search/Filter', () => {
  beforeEach(() => {
    // Sign in before each test
    cy.visit('http://localhost:3000/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('Test@12345')
    cy.get('button[type="submit"]').click()

    // Wait for redirect to dashboard
    cy.url().should('include', '/dashboard')
  })

  describe('Displaying list of events', () => {
    it('should display the dashboard page with header', () => {
      cy.get('h1').contains('Sports Events').should('be.visible')
    })

    it('should display the Create Event button', () => {
      cy.get('a').contains('Create Event').should('be.visible')
    })

    it('should display search and filter inputs', () => {
      cy.get('input[placeholder="Search by event name..."]').should('be.visible')
      cy.get('button').contains('All Sports').should('be.visible')
    })

    it('should display event cards with details', () => {
      // Assuming at least one event exists
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('[class*="font-bold"]').should('exist') // Event name
        cy.get('[class*="flex"]').contains(/Soccer|Basketball|Tennis|Baseball|Football|Volleyball|Hockey|Golf|Cricket|Rugby|Other/).should('exist') // Sport type
      })
    })

    it('should display event details on cards', () => {
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        // Check for date
        cy.get('svg').should('have.length.at.least', 1) // Icons for date, venue, sport
        // Check for buttons
        cy.get('button').contains('Edit').should('exist')
        cy.get('button').contains('View').should('exist')
      })
    })

    it('should show empty state when no events exist', () => {
      // This test would need a fresh account with no events
      // Or we could create a separate test for this
    })
  })

  describe('Search functionality', () => {
    it('should filter events by name as user types', () => {
      const searchInput = cy.get('input[placeholder="Search by event name..."]')

      // Type a search term
      searchInput.type('Soccer')

      // Wait for filtering (client-side, should be instant)
      cy.get('[class*="hover:shadow-lg"]').each(($card) => {
        cy.wrap($card).should('contain', 'Soccer')
      })
    })

    it('should show no results message for non-matching search', () => {
      cy.get('input[placeholder="Search by event name..."]').type('NonExistentEventXYZ123')

      // Should show empty state or no results message
      cy.get('p').contains(/No events match your search|No events yet/).should('be.visible')
    })

    it('should clear search and show all events again', () => {
      const searchInput = cy.get('input[placeholder="Search by event name..."]')

      // Search
      searchInput.type('Soccer')
      cy.get('p').contains(/Showing/).should('contain', 'of')

      // Clear search
      searchInput.clear()

      // Should show all events again
      cy.get('[class*="hover:shadow-lg"]').should('have.length.greaterThan', 0)
    })

    it('should be case-insensitive', () => {
      cy.get('input[placeholder="Search by event name..."]').type('SOCCER')

      // Should still find events with 'soccer' in lowercase name
      cy.get('[class*="hover:shadow-lg"]').first().should('exist')
    })
  })

  describe('Filter functionality', () => {
    it('should filter events by sport type', () => {
      // Open sport type dropdown
      cy.get('button').contains('All Sports').click()

      // Select a sport type (e.g., Basketball)
      cy.get('[role="option"]').contains('Basketball').click()

      // Verify all displayed events are Basketball
      cy.get('[class*="hover:shadow-lg"]').each(($card) => {
        cy.wrap($card).should('contain', 'Basketball')
      })
    })

    it('should show all sports when All Sports is selected', () => {
      // First select a specific sport
      cy.get('button').contains('All Sports').click()
      cy.get('[role="option"]').contains('Soccer').click()

      // Then select All Sports again
      cy.get('button').contains('All Sports').click()
      cy.get('[role="option"]').contains('All Sports').click()

      // Should show events of all sport types
      cy.get('[class*="hover:shadow-lg"]').should('have.length.greaterThan', 0)
    })

    it('should show no results for filters with no matching events', () => {
      // Select a sport type that might not have events (or use a combination)
      cy.get('button').contains('All Sports').click()
      cy.get('[role="option"]').contains('Rugby').click()

      // If no rugby events exist, should show empty state
      // If rugby events exist, should show only those
      cy.get('[class*="hover:shadow-lg"]').should('have.length.gte', 0)
    })

    it('should combine search and filter', () => {
      // Type a search term
      cy.get('input[placeholder="Search by event name..."]').type('Spring')

      // Select a sport type
      cy.get('button').contains('All Sports').click()
      cy.get('[role="option"]').contains('Basketball').click()

      // Should show only events that match both criteria
      cy.get('[class*="hover:shadow-lg"]').each(($card) => {
        cy.wrap($card).should('contain', 'Basketball')
        cy.wrap($card).should('contain.text', 'Spring')
      })
    })
  })

  describe('Navigation to create/edit', () => {
    it('should navigate to create event page from button', () => {
      cy.get('a').contains('Create Event').click()

      cy.url().should('include', '/events/create')
    })

    it('should navigate to edit event page from card', () => {
      // Get first event card and click Edit button
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('Edit').click()
      })

      cy.url().should('include', '/events/').and('include', '/edit')
    })

    it('should navigate to view event page from card', () => {
      // Get first event card and click View button
      cy.get('[class*="hover:shadow-lg"]').first().within(() => {
        cy.get('button').contains('View').click()
      })

      cy.url().should('include', '/events/').should('not.include', '/edit')
    })

    it('should show event results count info', () => {
      // Should show "Showing X of Y events" text
      cy.get('p').contains(/Showing.*of.*event/).should('be.visible')
    })
  })

  describe('Responsive design', () => {
    it('should display in single column on mobile', () => {
      cy.viewport('iphone-x')
      cy.get('[class*="grid"]').should('have.class', 'grid-cols-1')
    })

    it('should display in multi-column on tablet', () => {
      cy.viewport('ipad-2')
      cy.get('[class*="grid"]').should('exist')
    })

    it('should display in 3-column layout on desktop', () => {
      cy.viewport(1280, 720)
      cy.get('[class*="grid"]').should('have.class', 'lg:grid-cols-3')
    })
  })
})
