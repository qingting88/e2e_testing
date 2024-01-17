import path from "path";
import { Page } from "puppeteer";

const HOST_API = process.env.HOST_API;

export const waitForTimeout = (milliseconds: number) => {
  return new Promise((r) => setTimeout(r, milliseconds));
};
export const waitForElementClick = async (page: Page, selector: string) => {
  console.group("waitForElementClick");
  console.log(selector);
  const element = await page.waitForSelector(selector);
  await element?.click();
  console.groupEnd();
};
export const waitForInputDate = async (page: Page, selector: string) => {
  console.group("waitForInputDate");
  console.log(selector);
  await page.waitForSelector(selector);
  await page.focus(selector);
  await page.keyboard.type("2019");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.type("1219");
  console.groupEnd();
};
export const waitForInputFile = async (
  page: Page,
  selector: string,
  text: string
) => {
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click(selector),
  ]);
  await fileChooser.accept([path.join(__dirname, `../public/${text}.png`)]);
  await waitForResponse(page, [`${HOST_API}/kyc/userfiles`]);
  await waitForTimeout(1000);
};
export const waitForChoisePhone = async (
  page: Page,
  values: [number, string] = [2, "13705141270"]
) => {
  console.group("waitForChoisePhone");
  console.log(values);
  await waitForElementClick(page, ".vti__dropdown");
  await waitForElementClick(
    page,
    `.vti__dropdown-item:nth-child(${values[0]})`
  );
  await page.focus("[data-kyc-tel-input] input");
  await page.type("[data-kyc-tel-input] input", values[1]);
  console.groupEnd();
};

export const waitForInputText = async (
  page: Page,
  selector: string,
  value: string
) => {
  console.group("waitForInputText");
  console.log(value);
  await page.waitForSelector(selector);
  await page.type(selector, value, { delay: 50 });
  console.groupEnd();
};

export const waitForChooseRegion = async (page: Page) => {
  console.group("waitForChooseRegion");
  console.log("Region");
  await waitForElementClick(page, "[data-kyc-country]");
  await waitForElementClick(page, ".v-list-item:nth-child(3)");
  await waitForResponse(page, [`${HOST_API}/kyc/region`]);
  await waitForElementClick(page, "[data-kyc-province]");
  await waitForElementClick(page, ".v-list-item:nth-child(2)");

  await waitForInputText(page, "[data-kyc-city] input", "nanjing");
  await waitForInputText(page, "[data-kyc-auto-address] input", "liuhe");
  await waitForInputText(page, "[data-kyc-zip-code] input", "211211");
  console.groupEnd();
};

export const waitForResponse = async (page: Page, urls: string[]) => {
  console.group("waitForResponse");
  console.log(urls);
  const resp = await page.waitForResponse((response) => {
    const abc = response.url().includes(urls[0]) && response.status() === 200;
    console.log("response.url()", response.url(), abc);
    return abc;
  });
  console.log("network idle", resp.ok());
  await waitForTimeout(600);
  console.groupEnd();
};
