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
        cy.get(selector).selectFile(
          path.join(__dirname, `../../public/${fileName}.png`)
        );
        cy.wait("@userfiles");
      },
    };
    it("institution", () => {
        cy.visit(Cypress.env("HOST_APP"));
        // API
        cy.intercept(`${Cypress.env("HOST_APP")}/api/google-recaptcha/verify`).as(
          "recaptcha"
        );
        cy.intercept(`${Cypress.env("HOST_API")}/ex/authorize`).as("authorize");
        cy.intercept(`${Cypress.env("HOST_API")}/kyc/region?*`).as("region");
        cy.intercept(`${Cypress.env("HOST_API")}/kyc/userfiles`).as("userfiles");
        cy.intercept(`${Cypress.env("HOST_API")}/kyc/institution/gi`).as("institution.pi");
        cy.intercept(`${Cypress.env("HOST_API")}/kyc/institution/doc`).as("institution.doc");
        cy.intercept(`${Cypress.env("HOST_API")}/kyc/bank`).as("bank");
        cy.intercept(`${Cypress.env("HOST_API")}/kyc/institution/qa`).as("institution.qa");
        cy.intercept(`${Cypress.env("HOST_API")}/kyc/institution/rep`).as("institution.rep");
        cy.intercept(`${Cypress.env("HOST_API")}/kyc/institution/bo`).as("institution.bo");
        cy.intercept(`${Cypress.env("HOST_API")}/kyc/submit`).as("submit");

        //Prepare
        cy.wait("@recaptcha", { timeout: TIME_OUT * 10 });
        cy.get("[data-welcome-entry-checkbox]").click();
        cy.get("[data-welcome-entry-btn]:not(:disabled)").click();
        cy.get("[data-choose-type-institution]:not(:disabled)").click();
        cy.wait("@authorize", { timeout: TIME_OUT });
        cy.get("[data-institution-list-btn]:not(:disabled)").click();

        // page1
        cy.wait("@institution.pi");

        cp.selectRegion();
        cy.get("[data-institution-general-info-account-email] input").type(`${Date.now()}@cypress.com`);
        cy.get("[data-institution-general-info-telegram] input").type('@cypress');
        cy.get("[data-institution-general-info-entity-legal-name] input").type('wei');
        cy.get("[data-institution-general-info-legal-entity-identifier] input").type('qingting');
        cy.get("[data-institution-general-info-date-of-formation] input").type("2010-11-11");
        cy.get("[data-institution-general-info-website] input").type("www.stellapay.com");
        cp.selectPhone(1,"02581234567")

        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.pi");

        // page2
        cy.wait("@institution.doc");
        
        cp.selectFile("[data-institution-filelist4incorporation] input","1");
        cp.selectFile("[data-institution-filelist4agreement] input","2");
        cp.selectFile("[data-institution-filelist4organizational] input","3");
        cp.selectFile("[data-institution-filelist4address] input","4");
        cp.selectFile("[data-institution-filelist4policy] input","5");

        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.doc");

        //page3
        cy.wait("@bank")
        cy.wait("@region", { timeout: TIME_OUT * 10 });

        cy.get(".kyc-institution-bankinginfo-account_name input").type("1");
        cy.get(".kyc-institution-bankinginfo-recipient_address input").type("2");
        cy.get(".kyc-institution-bankinginfo-bank_account_number input").type("3");
        cy.get(".kyc-institution-bankinginfo-bank_name input").type("4");
        cy.get(".kyc-institution-bankinginfo-bank_address input").type("5");
        cy.get(".kyc-institution-bankinginfo-bank_swift input").type("6");
        cy.get(".kyc-institution-bankinginfo-rounting_number input").type("7");
        cp.selectFile("[data-kyc-institution-bankinginfo-bankAccount] input","1")

        cy.get(".kyc-institution-bankinginfo-bank_country").click();
        cy.get(".v-list-item:nth-child(3)").click();

        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@bank");

        // page4
        cy.wait("@institution.qa");
        cy.get("[data-institution-questionnaire-purpose] textarea").type("1")
        cy.get("[data-institution-questionnaire-business] textarea").type("2")
        cy.get("[data-institution-questionnaire-sourcefunds] textarea").type("3")
        cy.get("[data-institution-questionnaire-additionalinfo] textarea").type("4")

        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.qa");

        // page5
        cy.wait("@institution.rep");

        cp.selectRegion()
        cy.get("[data-institution-representives-firstname] input").type("1");
        cy.get("[data-institution-representives-middlename] input").type("2");
        cy.get("[data-institution-representives-lastname] input").type("3");
        cy.get("[data-institution-representives-title] input").type("4");
        cy.get("[data-institution-representives-email] input").type("5@qq.com");
        cy.get("[data-institution-representives-birthday] input").type("2011-11-11");
        cp.selectPhone(4,"63091000")
        cy.get("[data-institution-representives-passport] input").type("6");
        
        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.rep");

        // page6
        cy.wait("@institution.bo");
        
        cp.selectRegion()
        cy.get("[data-institution-beneficialowners-firstname] input").type("1");
        cy.get("[data-institution-beneficialowners-middlename] input").type("2");
        cy.get("[data-institution-beneficialowners-lastname] input").type("3");
        cy.get("[data-institution-beneficialowners-title] input").type("4");

        cy.get("[data-institution-beneficialowners-birthday] input").type("1900-11-11");
        cp.selectPhone(0,"4199712405")
        cy.get("[data-institution-beneficialowners-passport] input").type("5");
        cp.selectFile("[data-institution-beneficialowners-identity] input","passport")
        cp.selectFile("[data-institution-beneficialowners-selfie] input","2")
        cp.selectFile("[data-institution-beneficialowners-residence] input","3")


        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.bo");

        // end
        cy.get("[data-kyc-form-step-nav-institution-cancel2]").click();
        cy.get(".data-kyc-step-0").click();

        cy.wait("@institution.pi");
        cy.wait(2000)
        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.pi");

        cy.wait("@institution.doc");
        cy.wait(2000)
        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.doc");

        cy.wait("@bank");
        cy.wait(2000)
        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@bank");

        cy.wait("@institution.qa");
        cy.wait(2000)
        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.qa");

        cy.wait("@institution.rep");
        cy.wait(2000)
        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.rep");

        cy.wait("@institution.bo");
        cy.wait(2000)
        cy.get("[data-kyc-form-step-nav-institution-submit]").click();
        cy.wait("@institution.bo");


        cy.get("[data-kyc-form-step-nav-institution-submit2]").click();
        cy.wait('@submit')
    })
})