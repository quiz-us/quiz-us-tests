const { DUMMY_QR, STUDENT_STAGING } = Cypress.env();

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  // deletes auth token, effectively logging user out:
  indexedDB.deleteDatabase('localforage');
});

describe('login', () => {
  it('can log in using qr code', () => {
    cy.on('uncaught:exception', err => {
      console.log('Uncaught exception occured in qr code spec:', err.message);

      // return false to prevent the error from
      // failing this test
      return false;
    });
    cy.visit(STUDENT_STAGING);
    // it redirects to login:
    cy.location('pathname', { timeout: 10000 }).should('eq', '/login');

    cy.contains('Use QR Login').click();
    cy.get("input[name='qrTextInput'").type(DUMMY_QR);
    cy.get("button[type='submit']").click();
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
  });
});
