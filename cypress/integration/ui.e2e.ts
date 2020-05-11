const validateMenuItem = () => {
  cy.location("pathname").then((pathname) => {
    cy.get('[aria-current="page"]').should("have.attr", "href", pathname);
  });
};

describe("UI tests", () => {
  it("should correctly set active class to menu items", () => {
    cy.visit("/");
    validateMenuItem();

    // visit bnb page
    cy.get('[href="/bnb"]').click();
    validateMenuItem();

    // visit favorites page
    cy.get('[href="/favorites"]').click();
    validateMenuItem();
  });

  it("should save favorites", () => {
    cy.visit("/");

    cy.get('[data-test-id="pair-ADAUSDT"]').within(() => {
      // add pair ADAUSDT to favorites
      cy.get('[data-test-id="add-favorite"]').click();
      cy.get('[data-test-id="add-favorite"]').should(
        "have.attr",
        "data-test-selected",
        "true",
      );

      cy.get('[data-test-id="add-favorite"]').click();
      cy.get('[data-test-id="add-favorite"]').should(
        "have.attr",
        "data-test-selected",
        "false",
      );
    });

    cy.get('[data-test-id="pair-AEETH"]').within(() => {
      // add pair ADAUSDT to favorites
      cy.get('[data-test-id="add-favorite"]').click();
    });

    cy.get('[data-test-id="pair-AIONUSDT"]').within(() => {
      // add pair ADAUSDT to favorites
      cy.get('[data-test-id="add-favorite"]').click();
    });

    // visit favorites page
    cy.get('[href="/favorites"]').click();

    // check if pairs are available on favorites page
    cy.get('[data-test-id="pair-AEETH"]').should("exist");
    cy.get('[data-test-id="pair-AIONUSDT"]').should("exist");

    cy.reload();

    // check if pairs are available on favorites page after refresh
    cy.get('[data-test-id="pair-AEETH"]').should("exist");
    cy.get('[data-test-id="pair-AIONUSDT"]').should("exist");
  });

  it.only("search should work", () => {
    cy.visit("/");

    // with default settings pair ADAUSDT should exist
    cy.get('[data-test-id="pair-ADAUSDT"]').should("exist");

    cy.get('[name="search"]').type("aion");

    // ADAUSDT pair should be removed while AIONUSDT remains
    cy.get('[data-test-id="pair-ADAUSDT"]').should("not.exist");
    cy.get('[data-test-id="pair-AIONUSDT"]').should("exist");
  });
});
