import path from "path";

describe("Legend-KYC", () => {
  const TIME_OUT = 6000;

  const cp = {
    selectPhone(num: number, value: string) {
      cy.get(".vti__dropdown").click();
      cy.get(".vti__dropdown-item").eq(num).click();
      cy.get("[data-kyc-tel-input] input").type(value);
    },
    selectRegion() {
      cy.wait("@region", { timeout: TIME_OUT * 10 });
      cy.get("[data-kyc-country]").click();
      cy.get(".v-list-item:nth-child(3)").click();
      cy.wait("@region");
      cy.get("[data-kyc-province]").click();
      cy.get(".v-list-item:nth-child(2)").click();

      cy.get("[data-kyc-city] input").type("nanjing");
      cy.get("[data-kyc-auto-address] input").type("liuhe");
      cy.get("[data-kyc-zip-code] input").type("211211");
    },
    selectFile(selector: string, fileName: string) {
      cy.intercept(`${Cypress.env("HOST_API")}/kyc/userfiles`).as("userfiles");
      cy.get(selector).selectFile(
        path.join(__dirname, `../../public/${fileName}.png`)
      );
      cy.wait("@userfiles");
    },
  };
  it("individual", () => {
    cy.visit(Cypress.env("HOST_APP"));
    cy.intercept(`${Cypress.env("HOST_APP")}/api/google-recaptcha/verify`).as(
      "recaptcha"
    );

    cy.intercept(`${Cypress.env("HOST_API")}/ex/authorize`).as("authorize");
    cy.intercept(`${Cypress.env("HOST_API")}/kyc/individual/pi`).as("individual.pi");
    cy.intercept(`${Cypress.env("HOST_API")}/kyc/region?*`).as("region");

    cy.intercept(`${Cypress.env("HOST_API")}/kyc/bank`).as("bank");
    cy.intercept(`${Cypress.env("HOST_API")}/kyc/individual/qa`).as("individual.qa");

    cy.wait("@recaptcha", { timeout: TIME_OUT * 10 });
    cy.get("[data-welcome-entry-checkbox]").click();
    cy.get("[data-welcome-entry-btn]:not(:disabled)").click();
    cy.get("[data-choose-type-individual]:not(:disabled)").click();
    cy.wait("@authorize", { timeout: TIME_OUT });
    cy.get("[data-individual-list-btn]:not(:disabled)").click();
    // page1

    cy.wait("@individual.pi");
    cp.selectRegion();
    cy.get("[data-individual-personal-info-account-email] input").type(
      `${Date.now()}@cypress.com`
    );
    cy.get("[data-individual-personal-info-first-name] input").type("wei");
    cy.get("[data-individual-personal-info-middle-name] input").type("qing");
    cy.get("[data-individual-personal-info-last-name] input").type("ting");
    cy.get("[data-individual-personal-info-birthday] input").type("2010-11-11");
    cp.selectPhone(1, "02581234567");
    cp.selectFile(
      "[data-individual-personal-info-file-list4-residence] input",
      "1"
    );
    cy.get("[data-kyc-form-step-nav-individual-submit]").click();
    cy.wait("@individual.pi");

    // page2
    cy.wait(`@bank`);
    cy.wait("@region", { timeout: TIME_OUT * 10 });
    cy.get(".kyc-individual-bankinginfo-account_name input").type("1");
    cy.get(".kyc-individual-bankinginfo-recipient_address input").type("2");
    cy.get(".kyc-individual-bankinginfo-bank_account_number input").type(
      "3"
    );
    cy.get(".kyc-individual-bankinginfo-bank_name input").type("4");
    cy.get(".kyc-individual-bankinginfo-bank_address input").type("5");
    cy.get(".kyc-individual-bankinginfo-bank_swift input").type("6");
    cy.get(".kyc-individual-bankinginfo-rounting_number input").type("7");
    cp.selectFile("[data-kyc-individual-bankinginfo-bank-account] input", "1");

    
    cy.get(".kyc-individual-bankinginfo-bank_country").click();
    cy.get(".v-list-item:nth-child(3)").click();

    cy.get("[data-kyc-form-step-nav-individual-submit]").click();
    cy.wait("@bank");

    //page3
    cy.wait(`@individual.qa`);
    cy.get("[data-individual-questionnaire-employmen_info] textarea").type("1");
    cy.get("[data-individual-questionnaire-srcincome] textarea").type("2");
    cy.get("[data-individual-questionnaire-srcnetwealth] textarea").type("3");
    cy.get("[data-individual-questionnaire-additional-info] textarea").type("4");
    cy.get("[data-kyc-form-step-nav-individual-submit]").click();
    cy.wait(`@individual.qa`);

    // end
  });
});
