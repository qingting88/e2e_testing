import puppeteer, { Page } from "puppeteer";
import {
  waitForResponse,
  waitForElementClick,
  waitForInputDate,
  waitForInputFile,
  waitForChoisePhone,
  waitForInputText,
  waitForChooseRegion,
  waitForTimeout
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
      waitUntil: "networkidle0",
    });
    console.log("page.goto");

    await prepare(page);
    // await page.waitForNetworkIdle();
    await page1(page);
    await page2(page);
    await page3(page);
    await page4(page);
    await page5(page);
    await page6(page);
    await end(page);

    //截图并在根目录保存
    await page.screenshot({
      path: "institution.png",
      fullPage: true,
    });
    //关闭Chromium
    await browser.close();
  });

async function prepare(page: Page) {
  await waitForResponse(page, [`${HOST_APP}/api/google-recaptcha/verify`]);
  await page.waitForNetworkIdle();
  await waitForElementClick(page, "[data-welcome-entry-checkbox]");
  await waitForElementClick(page, "[data-welcome-entry-btn]:not(:disabled)");
  await waitForElementClick(
    page,
    "[data-choose-type-institution]:not(:disabled)"
  );
  await waitForResponse(page, [`${HOST_API}/ex/authorize`]);
  await waitForElementClick(page, "[data-institution-list-btn]:not(:disabled)");
  // await page.waitForNetworkIdle();
}

async function page1(page: Page) {
  await waitForResponse(page, [
    // `${HOST_API}/kyc/institution/gi`,
    `${HOST_API}/kyc/region`,
  ]);
  await waitForInputText(
    page,
    "[data-institution-general-info-account-email] input",
    `${Date.now()}@puppteer.com`
  );
  await waitForInputText(
    page,
    "[data-institution-general-info-telegram] input",
    "@puppteer"
  );
  await waitForInputText(
    page,
    "[data-institution-general-info-entity-legal-name] input",
    "wei"
  );
  await waitForInputText(
    page,
    "[data-institution-general-info-legal-entity-identifier] input",
    "qingting"
  );

  await waitForChooseRegion(page);
  await waitForInputDate(
    page,
    "[data-institution-general-info-date-of-formation] input"
  );

  await waitForInputText(
    page,
    "[data-institution-general-info-website] input",
    "baidu.com"
  );

  await waitForChoisePhone(page, [2, "02581234567"]);

  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  await waitForResponse(page, [`${HOST_API}/kyc/institution/gi`]);
}

async function page2(page: Page) {
  await waitForResponse(page, [`${HOST_API}/kyc/institution/doc`]);
  await waitForInputFile(
    page,
    "[data-institution-filelist4incorporation] input",
    "1"
  );
  await waitForInputFile(
    page,
    "[data-institution-filelist4agreement] input",
    "2"
  );
  await waitForInputFile(
    page,
    "[data-institution-filelist4organizational] input",
    "3"
  );
  await waitForInputFile(
    page,
    "[data-institution-filelist4address] input",
    "4"
  );
  await waitForInputFile(page, "[data-institution-filelist4policy] input", "5");
  // data-institution-select
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  await waitForResponse(page, [`${HOST_API}/kyc/institution/doc`]);
}

async function page3(page: Page) {
  await waitForResponse(page, [`${HOST_API}/kyc/bank`]);
  await waitForResponse(page, [
    // `${HOST_API}/kyc/institution/gi`,
    `${HOST_API}/kyc/region`,
  ]);
  await waitForInputText(
    page,
    ".kyc-institution-bankinginfo-account_name input",
    "1"
  );
  await waitForInputText(
    page,
    ".kyc-institution-bankinginfo-recipient_address input",
    "2"
  );
  await waitForInputText(
    page,
    ".kyc-institution-bankinginfo-bank_account_number input",
    "3"
  );
  await waitForInputText(
    page,
    ".kyc-institution-bankinginfo-bank_name input",
    "4"
  );
  await waitForInputText(
    page,
    ".kyc-institution-bankinginfo-bank_address input",
    "5"
  );
  await waitForInputText(
    page,
    ".kyc-institution-bankinginfo-bank_swift input",
    "6"
  );
  await waitForInputText(
    page,
    ".kyc-institution-bankinginfo-rounting_number input",
    "7"
  );
  await waitForInputFile(
    page,
    "[data-kyc-institution-bankinginfo-bankAccount] input",
    "1"
  );
  await waitForElementClick(page, ".kyc-institution-bankinginfo-bank_country");
  await waitForElementClick(page, ".v-list-item:nth-child(3)");
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  await waitForResponse(page, [`${HOST_API}/kyc/bank`]);
}

async function page4(page: Page) {
  await waitForResponse(page, [`${HOST_API}/kyc/institution/qa`]);
  // data-institution-questionnaire-is_sanctioned
  // data-institution-questionnaire-is_officer
  // data-institution-questionnaire-related_officer
  await waitForInputText(
    page,
    "[data-institution-questionnaire-purpose] textarea",
    "1"
  );
  await waitForInputText(
    page,
    "[data-institution-questionnaire-business] textarea",
    "2"
  );
  await waitForInputText(
    page,
    "[data-institution-questionnaire-sourcefunds] textarea",
    "3"
  );
  await waitForInputText(
    page,
    "[data-institution-questionnaire-additionalinfo] textarea",
    "4"
  );
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  await waitForResponse(page, [`${HOST_API}/kyc/institution/qa`]);
}

async function page5(page: Page) {
  await waitForResponse(page, [`${HOST_API}/kyc/institution/rep`]);
  await waitForInputText(
    page,
    "[data-institution-representives-firstname] input",
    "1"
  );
  await waitForInputText(
    page,
    "[data-institution-representives-middlename] input",
    "2"
  );
  await waitForInputText(
    page,
    "[data-institution-representives-lastname] input",
    "3"
  );
  await waitForInputText(
    page,
    "[data-institution-representives-title] input",
    "4"
  );
  await waitForInputText(
    page,
    "[data-institution-representives-email] input",
    "5@qq.com"
  );
  await waitForChooseRegion(page);
  await waitForInputDate(
    page,
    "[data-institution-representives-birthday] input"
  );
  await waitForChoisePhone(page, [5, "63091000"]);
  await waitForInputText(
    page,
    "[data-institution-representives-passport] input",
    "6"
  );
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  await waitForResponse(page, [`${HOST_API}/kyc/institution/rep`]);

  // data-institution-representives-firstname
  // data-institution-representives-middlename
  // data-institution-representives-lastname
  // data-institution-representives-title
  // data-institution-representives-email
  // data-institution-representives-birthday
  // data-institution-representives-passport
}

async function page6(page: Page) {
  await waitForResponse(page, [`${HOST_API}/kyc/institution/bo`]);
  await waitForInputText(
    page,
    "[data-institution-beneficialowners-firstname] input",
    "1"
  );
  await waitForInputText(
    page,
    "[data-institution-beneficialowners-middlename] input",
    "2"
  );
  await waitForInputText(
    page,
    "[data-institution-beneficialowners-lastname] input",
    "3"
  );
  await waitForInputText(
    page,
    "[data-institution-beneficialowners-title] input",
    "4"
  );
  await waitForChooseRegion(page);
  await waitForInputDate(
    page,
    "[data-institution-beneficialowners-birthday] input"
  );
  await waitForChoisePhone(page, [1, "4199712405"]); // 美国电话
  await waitForInputText(
    page,
    "[data-institution-beneficialowners-passport] input",
    "5"
  );

  // await waitForInputFile(
  //   page,
  //   "[data-institution-beneficialowners-residence] input",
  //   "1"
  // );
  await waitForInputFile(
    page,
    "[data-institution-beneficialowners-identity] input",
    "passport"
  );

  await waitForInputFile(
    page,
    "[data-institution-beneficialowners-selfie] input",
    "2"
  );
  await waitForInputFile(
    page,
    "[data-institution-beneficialowners-residence] input",
    "3"
  );
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  await waitForResponse(page, [`${HOST_API}/kyc/institution/bo`]);

  // data-institution-beneficialowners-residence
  // data-institution-beneficialowners-passport
  // data-institution-beneficialowners-frontdriverlicense
  // data-institution-beneficialowners-backdriverlicense
  // data-institution-beneficialowners-selfie
  // data-institution-beneficialowners-residence
}

async function end(page: Page) {
  // await waitForTimeout(3000);
  // await page.waitForSelector("[data-kyc-form-step-nav-institution-submit2]")
  // await waitForElementClick(page, "[data-kyc-form-step-nav-institution-submit2]");
  // await waitForTimeout(8000);

  await waitForTimeout(3000);
  await page.waitForSelector("[data-kyc-form-step-nav-institution-cancel2]");
  //
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-cancel2]"
  );
  await waitForTimeout(3000);
  await waitForElementClick(page, ".data-kyc-step-0");
  // page1
  await waitForTimeout(10000);
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  // page2
  await waitForTimeout(10000);
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  // page3
  await waitForTimeout(10000);
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  // page4
  await waitForTimeout(10000);
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  // page5
  await waitForTimeout(10000);
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );
  // page6
  await waitForTimeout(10000);
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit]"
  );

  await waitForTimeout(3000);
  await page.waitForSelector("[data-kyc-form-step-nav-institution-submit2]");
  await waitForElementClick(
    page,
    "[data-kyc-form-step-nav-institution-submit2]"
  );
  await waitForTimeout(8000);
}