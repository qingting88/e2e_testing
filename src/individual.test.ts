import puppeteer, { Page } from "puppeteer";
import {
  waitForResponse,
  waitForElementClick,
  waitForInputDate,
  waitForInputFile,
  waitForChoisePhone,
  waitForInputText,
  waitForChooseRegion,
  waitForTimeout,
} from "./utils";

const HOST_APP = process.env.HOST_APP;
const HOST_API = process.env.HOST_API;

puppeteer
  .launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    ignoreDefaultArgs: ["--enable-automation"],
    timeout: 0,
  })
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.setDefaultTimeout(120000);
    await page.goto(`${HOST_APP}/kyc`, {
      waitUntil: "networkidle2",
    });
    console.log("page.goto");

    await prepare(page);
    await page.waitForNetworkIdle();
    await page1(page);
    await page2(page);
    await page3(page);

    // //截图并在根目录保存
    // await page.screenshot({
    //   path: "individual.png",
    //   fullPage: true,
    // });
    // //关闭Chromium
    // await browser.close();
  });

async function prepare(page: Page) {
  console.log(1);
  await waitForResponse(page, [`${HOST_APP}/api/google-recaptcha/verify`]);
  console.log(2);
  await page.waitForNetworkIdle();
  console.log(3);
  await waitForElementClick(page, "[data-welcome-entry-checkbox]");
  console.log(4);
  await waitForElementClick(page, "[data-welcome-entry-btn]:not(:disabled)");
  console.log(5);
  await waitForElementClick(
    page,
    "[data-choose-type-individual]:not(:disabled)"
  );
  console.log(6);
  await waitForResponse(page, [`${HOST_API}/ex/authorize`]);
  console.log(7);
  await waitForElementClick(page, "[data-individual-list-btn]:not(:disabled)");
//   await page.waitForNetworkIdle();
}

async function page1(page: Page) {
  await waitForResponse(page, [
    // `${HOST_API}/kyc/institution/gi`,
    `${HOST_API}/kyc/region`,
  ]);
  await waitForInputText(
    page,
    "[data-individual-personal-info-account-email] input",
    `${Date.now()}@puppteer.com`
  );
  await waitForInputText(
    page,
    "[data-individual-personal-info-first-name] input",
    "wei"
  );
  await waitForInputText(
    page,
    "[data-individual-personal-info-middle-name] input",
    "qing"
  );
  await waitForInputText(
    page,
    "[data-individual-personal-info-last-name] input",
    "qing"
  );
  await waitForInputDate(
    page,
    "[data-individual-personal-info-birthday] input"
  );

  await waitForChoisePhone(page, [2, "02581234567"]);

  await waitForChooseRegion(page);
  await waitForInputFile(
    page,
    "[data-individual-personal-info-file-list4-residence] input",
    "1"
  );

  await waitForElementClick(page, "[data-kyc-form-step-nav-individual-submit]");
  await waitForResponse(page, [`${HOST_API}/kyc/individual/pi`]);
}

async function page2(page: Page) {
  await waitForResponse(page, [`${HOST_API}/kyc/bank`]);
  await waitForResponse(page, [
    // `${HOST_API}/kyc/institution/gi`,
    `${HOST_API}/kyc/region`,
  ]);
  await waitForInputText(
    page,
    ".kyc-individual-bankinginfo-account_name input",
    "1"
  );
  await waitForInputText(
    page,
    ".kyc-individual-bankinginfo-recipient_address input",
    "2"
  );
  await waitForInputText(
    page,
    ".kyc-individual-bankinginfo-bank_account_number input",
    "3"
  );
  await waitForInputText(
    page,
    ".kyc-individual-bankinginfo-bank_name input",
    "4"
  );
  await waitForInputText(
    page,
    ".kyc-individual-bankinginfo-bank_address input",
    "5"
  );
  await waitForInputText(
    page,
    ".kyc-individual-bankinginfo-bank_swift input",
    "6"
  );
  await waitForInputText(
    page,
    ".kyc-individual-bankinginfo-rounting_number input",
    "7"
  );
  await waitForInputFile(
    page,
    "[data-kyc-individual-bankinginfo-bank-account] input",
    "1"
  );
  await waitForElementClick(page, ".kyc-individual-bankinginfo-bank_country");
  await waitForElementClick(page, ".v-list-item:nth-child(3)");
  await waitForElementClick(page, "[data-kyc-form-step-nav-individual-submit]");
  await waitForResponse(page, [`${HOST_API}/kyc/bank`]);
}

async function page3(page: Page) {
  await waitForResponse(page, [`${HOST_API}/kyc/individual/qa`]);
  // data-institution-questionnaire-is_sanctioned
  // data-institution-questionnaire-is_officer
  // data-institution-questionnaire-related_officer
  await waitForInputText(
    page,
    "[data-individual-questionnaire-employmen_info] textarea",
    "1"
  );
  await waitForInputText(
    page,
    "[data-individual-questionnaire-srcincome] textarea",
    "2"
  );
  await waitForInputText(
    page,
    "[data-individual-questionnaire-srcnetwealth] textarea",
    "3"
  );
  await waitForInputText(
    page,
    "[data-individual-questionnaire-additional-info] textarea",
    "4"
  );
  await waitForElementClick(page, "[data-kyc-form-step-nav-individual-submit]");
  await waitForResponse(page, [`${HOST_API}/kyc/individual/qa`]);
}
