const faker = require('faker');

const { TEACHER_STAGING } = Cypress.env();

describe('creating a question', () => {
  const deckName = faker.random.uuid();
  const questionText = 'What is the symbol for helium?';
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    // deletes auth token, effectively logging user out:
    indexedDB.deleteDatabase('localforage');
    cy.visit(TEACHER_STAGING);
    cy.loginTeacher();
    cy.get("button[aria-label='menu']").click();
    cy.contains('Deck Creator').click({ force: true });
    cy.location('pathname').should('eq', '/decks/create');
    cy.get('input#name').type(deckName);
    cy.get('input#description').type('description');
    cy.get("button[type='submit']").click();
  });

  it('can create a free response question', () => {
    // select Free Response
    cy.contains('Multiple Choice').click();
    cy.get("li[data-value='Free Response']").click();

    // select Standard
    cy.get('#mui-component-select-standardId').click();
    cy.contains('8.5(C)').click();

    // fill out multiple tags
    cy.get("input[placeholder='Add one or more tag(s)']").type(
      'elements{enter}'
    );
    cy.get("input[placeholder='Add one or more tag(s)']").type(
      'Periodic Table{enter}'
    );

    // fill out question
    const questionEditor = cy.get("div[data-slate-editor='true']").first();
    questionEditor.click();
    questionEditor.type(questionText);
    // fill out question
    const answerEditor = cy.get("div[data-slate-editor='true']").last();
    answerEditor.click();
    answerEditor.type('The symbol for helium is He.');

    cy.get("button[type='submit']").click();
    cy.contains('No cards in this deck yet').should('not.exist');
  });

  it('adds the question to the deck', () => {
    cy.contains('New question was added to the deck!').should('exist');
    cy.reload();
    cy.contains(questionText).should('exist');
  });

  it('can rename the deck', () => {
    const updatedDeckName = faker.random.uuid();
    cy.get("button[aria-label='Edit Deck']").click();
    cy.get('input#name').clear();
    cy.get('input#name').type(updatedDeckName);
    cy.get('input#description').clear();
    cy.get('input#description').type('updated description');
    cy.get("button[type='submit'][form='deck-form']").click();
    cy.contains(updatedDeckName).should('exist');
  });

  it('can remove the question from the deck', () => {
    cy.get("button[aria-label='Remove From Current Deck']").click();
    cy.contains(questionText).should('not.exist');
    cy.reload();
    cy.contains(questionText).should('not.exist');
    cy.contains('No cards in this deck yet').should('exist');
  });

  it('can delete the deck', () => {
    cy.get("button[aria-label='Delete Deck']").click();
    cy.contains(
      'Are you sure you want to delete this deck? This cannot be undone.'
    ).should('exist');
    cy.contains('Ok').click();
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
  });
});
