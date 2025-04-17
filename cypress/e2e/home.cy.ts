import { selectors } from '../support/selectors';

const characters = {
  goku: {
    name: 'Goku',
    img: 'goku.jpg',
  },
  vegeta: {
    name: 'Vegeta',
    img: 'vegeta.jpg',
  },
  gohan: {
    name: 'Gohan',
    img: 'gohan.jpg',
  },
};

const homeSelectors = {
  searchInput: 'input[placeholder="Search a character..."]',
  loader: '[aria-label="Loading characters"]',
};

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
      cy.get(homeSelectors.loader).should('exist');
      cy.wait('@getCharacters');
      cy.get('[data-testid="character-card"]').should('have.length', 3);
      cy.contains('3 results').should('exist');
      Object.values(characters).forEach(({ name, img }) => {
        cy.contains(name).should('exist');
        cy.get(`img[alt="${name}"]`).should('have.attr', 'src', img);
      });
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

      cy.get(homeSelectors.searchInput).as('input-search');
      cy.get('@input-search').type('goku');
      cy.url().should('include', '/?name=goku');
      cy.wait('@searchCharacter');
      cy.contains(characters.goku.name).should('exist');
      cy.get(`img[alt="${characters.goku.name}"]`).should(
        'have.attr',
        'src',
        characters.goku.img,
      );
      cy.contains(characters.vegeta.name).should('not.exist');
    });

    it('should increase the favorites counter when a character is favorited', () => {
      indexedDB.deleteDatabase('FavoritesDB');

      cy.contains(characters.goku.name)
        .parent()
        .find(selectors.addToFavoritesButton)
        .click();
      cy.get(selectors.favoritesCounter).should('contain', '1');
    });

    it('should navigate to Favorites view and search from favorited characters', () => {
      indexedDB.deleteDatabase('FavoritesDB');
      cy.addCardToFavorites(characters.goku.name);
      cy.addCardToFavorites(characters.gohan.name);

      cy.get(homeSelectors.searchInput).should('exist').type('goku');
      cy.contains(characters.goku.name).should('exist');
      cy.get(`img[alt="${characters.goku.name}"]`).should(
        'have.attr',
        'src',
        characters.goku.img,
      );
      cy.contains(characters.vegeta.name).should('not.exist');
      cy.contains(characters.gohan.name).should('not.exist');

      cy.get(selectors.favoritesCounter).click();
      cy.url().should('include', '/?name=goku&showFavorites=true');
      cy.contains('Favorites').should('exist');
      cy.contains(characters.goku.name).should('exist');
      cy.contains(characters.gohan.name).should('not.exist');
      cy.contains(characters.vegeta.name).should('not.exist');
    });

    it('should search characters and go to Favorites with the same search applied', () => {
      indexedDB.deleteDatabase('FavoritesDB');

      cy.addCardToFavorites(characters.goku.name);
      cy.addCardToFavorites(characters.gohan.name);
      const getFavoritesCounter = cy.get(selectors.favoritesCounter);
      getFavoritesCounter.should('contain', '2');
      getFavoritesCounter.click();

      cy.url().should('include', '/?showFavorites=true');
      cy.contains('Favorites').should('exist');
      cy.contains(characters.goku.name).should('exist');
      cy.contains(characters.gohan.name).should('exist');
      cy.contains(characters.vegeta.name).should('not.exist');
      cy.get(homeSelectors.searchInput).should('exist').type('goku');

      cy.contains(characters.goku.name).should('exist');
      cy.get(`img[alt="${characters.goku.name}"]`).should(
        'have.attr',
        'src',
        characters.goku.img,
      );
      cy.contains(characters.vegeta.name).should('not.exist');
      cy.contains(characters.gohan.name).should('not.exist');
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

      cy.contains(characters.goku.name).click();
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
        cy.get(homeSelectors.loader).should('exist');
      }
      cy.wait('@getCharacters');
      cy.contains('An error occurred. Please try again later.').should('exist');
    });
  });
});
