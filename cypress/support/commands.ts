/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

import { selectors } from '../support/selectors';

// ***********************************************
// This example commands.ts shows you how to
// Create various custom commands and overwrite
// Existing commands.
//
// For more comprehensive examples of custom
// Commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// Declare global {
//   Namespace Cypress {
//     Interface Chainable {
//       Login(email: string, password: string): Chainable<void>
//       Drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       Dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       Visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      addCardToFavorites(name: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('addCardToFavorites', (name) => {
  cy.contains(name).parent().find(selectors.addToFavoritesButton).click();
});
