const { TEACHER_STAGING } = Cypress.env();

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  // deletes auth token, effectively logging user out:
  indexedDB.deleteDatabase('localforage');
});

describe('creating a question', () => {
  it('can login', () => {
    cy.visit(TEACHER_STAGING);
    cy.loginTeacher();
  });
});
