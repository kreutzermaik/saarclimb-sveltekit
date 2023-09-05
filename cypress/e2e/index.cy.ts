/// <reference types="cypress" />

describe('index spec', () => {
  it('passes', () => {
    cy.visit('/');
    // Login
    cy.get('#goto-login').click();
    cy.get('#email-field').type('cypress@user.com');
    cy.get('#password-field').type('test123');
    cy.get('#login button').click();
  })
})