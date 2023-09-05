/// <reference types="cypress" />
describe('index spec', () => {
  it('passes', () => {
    cy.visit('/');
    // Login
    cy.get('#goto-login').click();
    cy.get('#email-field').type('kreutzermaik123@web.de');
    cy.get('#password-field').type('Eutermaik99');
    cy.get('#login button').click();
  })
})