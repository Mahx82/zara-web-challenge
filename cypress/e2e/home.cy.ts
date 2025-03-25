describe('Home', () => {
  describe('happy paths', () => {
    beforeEach(() => {
      cy.fixture('characters').then((characters) => {
        cy.intercept('GET', 'https://dragonball-api.com/api/characters*', {
          statusCode: 200,
          body: characters,
          delay: 1000,
        }).as('getCharacters');
      });

      cy.visit('/');
    });

    it('should render the home page with character cards', () => {
      cy.contains('Loading...').should('exist');
      cy.wait('@getCharacters');
      cy.get('[data-testid="character-card"]').should('have.length', 3);
      cy.contains('3 results').should('exist');
      cy.contains('Goku').should('exist');
      cy.get('img[alt="Goku"]').should('have.attr', 'src', 'goku.jpg');
      cy.contains('Vegeta').should('exist');
      cy.get('img[alt="Vegeta"]').should('have.attr', 'src', 'vegeta.jpg');
      cy.contains('Gohan').should('exist');
      cy.get('img[alt="Gohan"]').should('have.attr', 'src', 'gohan.jpg');
    });

    it('should search for a character', () => {
      cy.fixture('characters').then((characters) => {
        cy.intercept(
          'GET',
          'https://dragonball-api.com/api/characters?limit=50&name=goku',
          {
            statusCode: 200,
            body: [characters.items[0]],
            delay: 500,
          },
        ).as('searchCharacter');
      });

      cy.get('input[placeholder="Search a character..."]')
        .should('exist')
        .type('goku');
      cy.url().should('include', '/?name=goku');
      cy.wait('@searchCharacter');
      cy.contains('Goku').should('exist');
      cy.get('img[alt="Goku"]').should('have.attr', 'src', 'goku.jpg');
      cy.contains('Vegeta').should('not.exist');
    });

    it('should increase the favorites counter when a character is favorited', () => {
      indexedDB.deleteDatabase('FavoritesDB');

      cy.contains('Goku')
        .parent()
        .find('button[aria-label="Add to favorites"]')
        .click();
      cy.get('[data-testid="favorites-counter"]').should('contain', '1');
    });

    it('should navigate to Favorites view and search from favorited characters', () => {
      indexedDB.deleteDatabase('FavoritesDB');

      cy.contains('Goku')
        .parent()
        .find('button[aria-label="Add to favorites"]')
        .click();
      cy.contains('Gohan')
        .parent()
        .find('button[aria-label="Add to favorites"]')
        .click();

      cy.get('input[placeholder="Search a character..."]')
        .should('exist')
        .type('goku');
      cy.contains('Goku').should('exist');
      cy.get('img[alt="Goku"]').should('have.attr', 'src', 'goku.jpg');
      cy.contains('Vegeta').should('not.exist');
      cy.contains('Gohan').should('not.exist');

      cy.get('[data-testid="favorites-counter"]').click();
      cy.url().should('include', '/?name=goku&showFavorites=true');
      cy.contains('Favorites').should('exist');
      cy.contains('Goku').should('exist');
      cy.contains('Gohan').should('not.exist');
      cy.contains('Vegeta').should('not.exist');
    });

    it('should search characters and go to Favorites with the same search applied', () => {
      indexedDB.deleteDatabase('FavoritesDB');

      cy.contains('Goku')
        .parent()
        .find('button[aria-label="Add to favorites"]')
        .click();
      cy.contains('Gohan')
        .parent()
        .find('button[aria-label="Add to favorites"]')
        .click();
      cy.get('[data-testid="favorites-counter"]').should('contain', '2');
      cy.get('[data-testid="favorites-counter"]').click();
      cy.url().should('include', '/?showFavorites=true');
      cy.contains('Favorites').should('exist');
      cy.contains('Goku').should('exist');
      cy.contains('Gohan').should('exist');
      cy.contains('Vegeta').should('not.exist');
      cy.get('input[placeholder="Search a character..."]')
        .should('exist')
        .type('goku');

      cy.contains('Goku').should('exist');
      cy.get('img[alt="Goku"]').should('have.attr', 'src', 'goku.jpg');
      cy.contains('Vegeta').should('not.exist');
      cy.contains('Gohan').should('not.exist');
    });

    it('should navigate to the character detail page', () => {
      indexedDB.deleteDatabase('FavoritesDB');
      cy.fixture('characters').then((characters) => {
        cy.intercept('GET', 'https://dragonball-api.com/api/characters/1', {
          statusCode: 200,
          body: {
            ...characters.items[0],
            description: 'Goku description',
          },
        }).as('characterDetails');
      });

      cy.contains('Goku').click();
      cy.url().should('include', '/1');
    });
  });

  describe('error path', () => {
    it('should display an error message if get character fails after 3 retries', () => {
      cy.intercept('GET', 'https://dragonball-api.com/api/characters*', {
        statusCode: 404,
      }).as('getCharacters');
      cy.visit('/');

      for (let i = 0; i < 3; i++) {
        cy.wait('@getCharacters');
        cy.contains('Loading...').should('exist');
      }
      cy.wait('@getCharacters');
      cy.contains('An error ocurred. Please try again later.').should('exist');
    });
  });
});
