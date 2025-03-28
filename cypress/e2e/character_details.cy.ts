describe('Character details page', () => {
  describe('happy path', () => {
    beforeEach(() => {
      cy.fixture('character_details').then((details) => {
        cy.intercept('GET', 'https://dragonball-api.com/api/characters/1', {
          statusCode: 200,
          body: details,
        }).as('getCharacterDetail');
        cy.visit('/1');
      });
    });

    it('should render the character detail page', () => {
      cy.contains('Goku').should('exist');
      cy.contains('Goku description').should('exist');
      cy.get('img[alt="Goku"]').should('have.attr', 'src', 'goku.jpg');
      cy.contains('Transformations').should('exist');
      cy.contains('Goku SSJ').should('exist');
      cy.get('img[alt="Goku SSJ"]').should('have.attr', 'src', 'goku_ssj.webp');
      cy.contains('Goku SSJ2').should('exist');
      cy.get('img[alt="Goku SSJ2"]').should(
        'have.attr',
        'src',
        'goku_ssj2.webp',
      );
      cy.contains('Goku SSJ3').should('exist');
      cy.get('img[alt="Goku SSJ3"]').should(
        'have.attr',
        'src',
        'goku_ssj3.webp',
      );
    });

    it('should add and remove Goku from favorites', () => {
      cy.contains('Goku').should('exist');
      cy.contains('Goku description').should('exist');
      cy.get('img[alt="Goku"]').should('have.attr', 'src', 'goku.jpg');

      cy.get('button[aria-label="Add to favorites"]').click();
      cy.get('[data-testid="favorites-counter"]').should('contain', '1');

      cy.get('button[aria-label="Remove from favorites"]').click();
      cy.get('[data-testid="favorites-counter"]').should('contain', '0');
    });
  });

  describe('errors', () => {
    it('should display an error message if character not found', () => {
      cy.intercept('GET', 'https://dragonball-api.com/api/characters/999', {
        statusCode: 400,
        body: { message: 'Character not found', statusCode: 400 },
      }).as('getCharacterNotFound');

      cy.visit('/999');
      cy.wait('@getCharacterNotFound');
      cy.contains('Character not found').should('exist');
    });

    it('should display an error message if get character details fails after 3 retries', () => {
      cy.intercept('GET', 'https://dragonball-api.com/api/characters/1', {
        statusCode: 404,
        body: { message: 'Failed to fetch character details' },
      }).as('getCharacterDetails');
      cy.visit('/1');

      for (let i = 0; i < 3; i++) {
        cy.wait('@getCharacterDetails');
        cy.contains('Loading...').should('exist');
      }
      cy.wait('@getCharacterDetails');
      cy.contains('Failed to fetch character details').should('exist');
    });
  });
});
