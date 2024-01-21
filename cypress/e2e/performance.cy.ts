/// <reference types="cypress" />

describe('performance spec', () => {
    it('passes', () => {
        /**
         * Progress
         */
        cy.visit('/progress');
        // Select Gym "Boulder Olymp"
        cy.get('#gyms').select('Boulder Olymp');

        for (let i: number = 0; i < 5; i++) {
            cy.get('#button-plus-' + i).click();
        }


        // Select Gym "Rocklands"
        cy.get('#gyms').select('Rocklands');

        for (let i: number = 0; i < 5; i++) {
            cy.get('#button-plus-' + i).click();
        }
    })
})