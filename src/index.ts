import path from "path";
import puppeteer, { Page } from "puppeteer";

const waitForTimeout = (milliseconds: number) => {
  return new Promise((r) => setTimeout(r, milliseconds));
};
const clickElement = async (page: Page, selector: string) => {
  const element = await page.waitForSelector(selector);
  element.click();
};
const entryInputDate = async (page: Page, selector: string) => {
  await page.focus(selector);
  await page.keyboard.type("2019");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.type("1219");
};
const entryInputFile = async (page: Page, selector: string, text: string) => {
  await waitForTimeout(1000);
  const uploadPic = await page.waitForSelector(selector);
  if (uploadPic) {
    await uploadPic.uploadFile(path.join(__dirname, `./public/${text}.png`));
  }
};
const entryInputTelephone = async (
  page: Page,
  values: [number, string] = [2, "13705141270"]
) => {
  await page.waitForSelector(".vti__dropdown");
  await clickElement(page, ".vti__dropdown");
  await waitForTimeout(1000);
  await page.waitForSelector(`.vti__dropdown-item:nth-child(${values[0]})`);
  await clickElement(page, `.vti__dropdown-item:nth-child(${values[0]})`);
  await page.focus("[data-kyc-tel-input] input");
  await page.type("[data-kyc-tel-input] input", values[1]);
};
const entryRegionComponent = async (page: Page) => {
  await page.waitForSelector("[data-kyc-country]");
  await clickElement(page, "[data-kyc-country]");
  await waitForTimeout(1000);
  await page.waitForSelector(".v-list-item:nth-child(3)");
  await clickElement(page, ".v-list-item:nth-child(3)");

  await waitForTimeout(5000);

  await clickElement(page, "[data-kyc-province]");
  await waitForTimeout(2000);
  await clickElement(page, ".v-list-item:nth-child(2)");

  await page.type("[data-kyc-city] input", "nanjing");
  await page.type("[data-kyc-auto-address] input", "liuhe");
  await page.type("[data-kyc-zip-code] input", "211211");
};

puppeteer
  .launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    ignoreDefaultArgs: ["--enable-automation"],
    timeout: 60000,
  })
  .then(async (browser) => {
    //创建一个Page实例
    const page = await browser.newPage();
    //打开百度首页
    await page.goto("http://localhost:3000/en/demo", {
      timeout: 600000,
    });

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('[data-test] input'),
      // some button that triggers file selection
    ]);
    await fileChooser.accept([path.join(__dirname, `./public/1.png`)]);

    // await prepare(page);
    // await page1(page);
    // await page2(page);
    // await page3(page);
    // await page4(page);
    // await page5(page);
    // await page6(page);
    // await end(page);

    // //截图并在根目录保存
    // await page.screenshot({
    //   path: "institution.png",
    //   fullPage: true,
    // });
    // //关闭Chromium
    // await browser.close();
  });

async function prepare(page: Page) {
  await waitForTimeout(30000);

  await clickElement(page, "[data-welcome-entry-checkbox]");

  await clickElement(page, "[data-welcome-entry-btn]:not(:disabled)");

  await clickElement(page, "[data-choose-type-institution]:not(:disabled)");

  await clickElement(page, "[data-institution-list-btn]:not(:disabled)");
}

async function page1(page: Page) {
  await waitForTimeout(6000);
  await page.waitForSelector("[data-institution-general-info-account-email]");
  await page.type(
    "[data-institution-general-info-account-email] input",
    `${Date.now()}@puppteer.com`
  );
  await page.type(
    "[data-institution-general-info-telegram] input",
    "@puppteer"
  );
  await page.type(
    "[data-institution-general-info-entity-legal-name] input",
    "wei"
  );
  await page.type(
    "[data-institution-general-info-legal-entity-identifier] input",
    "qingting"
  );

  await entryRegionComponent(page);
  await entryInputDate(
    page,
    "[data-institution-general-info-date-of-formation] input"
  );

  await page.type("[data-institution-general-info-website] input", "baidu.com");

  await entryInputTelephone(page, [2, "02581234567"]);

  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");
}

async function page2(page: Page) {
  await waitForTimeout(6000);
  await entryInputFile(
    page,
    "[data-institution-filelist4incorporation] input",
    "1"
  );
  await entryInputFile(page, "[data-institution-filelist4agreement] input", "2");
  await entryInputFile(
    page,
    "[data-institution-filelist4organizational] input",
    "3"
  );
  await entryInputFile(page, "[data-institution-filelist4address] input", "4");
  await entryInputFile(page, "[data-institution-filelist4policy] input", "5");
  // data-institution-select
  await waitForTimeout(1000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");
}

async function page3(page: Page) {
  await waitForTimeout(8000);
  await page.waitForSelector(".kyc-institution-bankinginfo-account_name");
  await page.type(".kyc-institution-bankinginfo-account_name input", "1");
  await page.type(".kyc-institution-bankinginfo-recipient_address input", "2");
  await page.type(
    ".kyc-institution-bankinginfo-bank_account_number input",
    "3"
  );
  await page.type(".kyc-institution-bankinginfo-bank_name input", "4");
  await page.type(".kyc-institution-bankinginfo-bank_address input", "5");
  await page.type(".kyc-institution-bankinginfo-bank_swift input", "6");
  await page.type(".kyc-institution-bankinginfo-rounting_number input", "7");
  await entryInputFile(
    page,
    "[data-kyc-institution-bankinginfo-bankAccount] input",
    "1"
  );
  await waitForTimeout(2000);
  await clickElement(page, ".kyc-institution-bankinginfo-bank_country");
  await waitForTimeout(1000);
  await clickElement(page, ".v-list-item:nth-child(3)");
  await waitForTimeout(1000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");
}

async function page4(page: Page) {
  await waitForTimeout(8000);
  // data-institution-questionnaire-is_sanctioned
  // data-institution-questionnaire-is_officer
  // data-institution-questionnaire-related_officer
  await page.type("[data-institution-questionnaire-purpose] textarea", "1");
  await page.type("[data-institution-questionnaire-business] textarea", "2");
  await page.type("[data-institution-questionnaire-sourcefunds] textarea", "3");
  await page.type(
    "[data-institution-questionnaire-additionalinfo] textarea",
    "4"
  );
  await waitForTimeout(1000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");
}

async function page5(page: Page) {
  await waitForTimeout(8000);
  await page.type("[data-institution-representives-firstname] input", "1");
  await page.type("[data-institution-representives-middlename] input", "2");
  await page.type("[data-institution-representives-lastname] input", "3");
  await page.type("[data-institution-representives-title] input", "4");
  await page.type("[data-institution-representives-email] input", "5@qq.com");
  await entryRegionComponent(page);
  await waitForTimeout(1000);
  await entryInputDate(page, "[data-institution-representives-birthday] input");
  await waitForTimeout(1000);
  await entryInputTelephone(page, [5, "63091000"]);
  await page.type("[data-institution-representives-passport] input", "6");

  await waitForTimeout(1000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");

  // data-institution-representives-firstname
  // data-institution-representives-middlename
  // data-institution-representives-lastname
  // data-institution-representives-title
  // data-institution-representives-email
  // data-institution-representives-birthday
  // data-institution-representives-passport
}

async function page6(page: Page) {
  await waitForTimeout(8000);
  await page.type("[data-institution-beneficialowners-firstname] input", "1");
  await page.type("[data-institution-beneficialowners-middlename] input", "2");
  await page.type("[data-institution-beneficialowners-lastname] input", "3");
  await page.type("[data-institution-beneficialowners-title] input", "4");
  await entryRegionComponent(page);
  await entryInputDate(
    page,
    "[data-institution-beneficialowners-birthday] input"
  );
  await entryInputTelephone(page, [1, "4199712405"]); // 美国电话
  await page.type("[data-institution-beneficialowners-passport] input", "5");

  await entryInputFile(
    page,
    "[data-institution-beneficialowners-residence] input",
    1
  );
  await entryInputFile(
    page,
    "[data-institution-beneficialowners-identity] input",
    "passport"
  );

  await entryInputFile(
    page,
    "[data-institution-beneficialowners-selfie] input",
    2
  );
  await entryInputFile(
    page,
    "[data-institution-beneficialowners-residence] input",
    3
  );
  await waitForTimeout(12000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");

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
  // await clickElement(page, "[data-kyc-form-step-nav-institution-submit2]");
  // await waitForTimeout(8000);

  await waitForTimeout(3000);
  await page.waitForSelector("[data-kyc-form-step-nav-institution-cancel2]");
  //
  await clickElement(page, "[data-kyc-form-step-nav-institution-cancel2]");
  await waitForTimeout(3000);
  await clickElement(page, ".data-kyc-step-0");
  // page1
  await waitForTimeout(10000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");
  // page2
  await waitForTimeout(10000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");
  // page3
  await waitForTimeout(10000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");
  // page4
  await waitForTimeout(10000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");
  // page5
  await waitForTimeout(10000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");
  // page6
  await waitForTimeout(10000);
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit]");

  await waitForTimeout(3000);
  await page.waitForSelector("[data-kyc-form-step-nav-institution-submit2]");
  await clickElement(page, "[data-kyc-form-step-nav-institution-submit2]");
  await waitForTimeout(8000);
}
