/// <reference types="cypress" />

describe('performance spec', () => {
    it('passes', () => {
        /**
         * Progress
         */
        cy.visit('/progress');
        cy.wait(10000);
        cy.get('#gyms').select('Boulder Olymp');
    })
})