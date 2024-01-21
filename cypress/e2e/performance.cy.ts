/// <reference types="cypress" />

describe('performance spec', () => {
    it('passes', () => {
        /**
         * Progress
         */
        cy.visit('/progress');
        cy.get('#gyms').select('Boulder Olymp');
    })
})