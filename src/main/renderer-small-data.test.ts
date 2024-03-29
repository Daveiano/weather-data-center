import { ElectronApplication, Page } from "playwright";
import { _electron as electron } from "playwright-core";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import fs from "fs";

expect.extend({ toMatchImageSnapshot });

let page: Page, electronApp: ElectronApplication;

const navigate = async (index: number) => {
  await page.click(".bx--header__menu-trigger.bx--header__menu-toggle");
  await page.click(
    `nav.bx--side-nav__navigation ul li:nth-child(${index}) button`
  );
  await page.click(
    `nav.bx--side-nav__navigation ul li:nth-child(${index}) ul li:nth-child(1) a`
  );
  await page.click(".bx--header__menu-trigger.bx--header__menu-toggle");
  await page.waitForSelector(
    "nav.bx--side-nav__navigation .bx--side-nav__submenu-title",
    { state: "hidden" }
  );
};

beforeAll(async () => {
  // Save a backup of the db, because we will remove all data during the test.
  await fs.copyFileSync(
    `${__dirname.replace("src/main", "")}tests/data/small/nedb/data`,
    `${__dirname.replace("src/main", "")}tests/data/small/nedb/data_backup`
  );

  // Launch Electron app.
  electronApp = await electron.launch({
    args: [
      ".",
      `--user-data-dir=${__dirname.replace("src/main", "")}tests/data/small`,
      "--window-size=1920,1000",
    ],
    env: {
      ...process.env,
    },
  });

  // Get the first window that the app opens, wait if necessary.
  page = await electronApp.firstWindow();

  // Wait for frame actually loaded.
  await page.waitForSelector("main");

  // Direct Electron console to Node terminal.
  page.on("console", console.log);
});

afterAll(async () => {
  await electronApp.close();

  // Restore the backup.
  await fs.rmSync(
    `${__dirname.replace("src/main", "")}tests/data/small/nedb/data`
  );
  await fs.renameSync(
    `${__dirname.replace("src/main", "")}tests/data/small/nedb/data_backup`,
    `${__dirname.replace("src/main", "")}tests/data/small/nedb/data`
  );
});

describe("Start the app with a small set of data", () => {
  afterEach(async () => {
    await page.click("header.bx--header a.bx--header__name");
    await page.reload();
  });

  test("Overview page", async () => {
    expect(await page.title()).toBe("Weather Data Center");

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 1,
      failureThresholdType: "percent",
      dumpDiffToConsole: true,
    });

    const mainText = page.locator(".main.bx--content h1");
    expect(await mainText.evaluate((node) => node.textContent)).toBe(
      "Overview"
    );
  });

  test("Temperature page", async () => {
    await navigate(2);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 1,
      failureThresholdType: "percent",
      dumpDiffToConsole: true,
    });

    const mainText = page.locator(".main.bx--content h1");
    expect(await mainText.evaluate((node) => node.textContent)).toBe(
      "Temperature"
    );
  });

  test("Precipitation page", async () => {
    await navigate(3);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 1,
      failureThresholdType: "percent",
      dumpDiffToConsole: true,
    });

    const mainText = page.locator(".main.bx--content h1");
    expect(await mainText.evaluate((node) => node.textContent)).toBe(
      "Precipitation"
    );
  });

  test("Pressure page", async () => {
    await navigate(4);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 1,
      failureThresholdType: "percent",
      dumpDiffToConsole: true,
    });

    const mainText = page.locator(".main.bx--content h1");
    expect(await mainText.evaluate((node) => node.textContent)).toBe(
      "Pressure"
    );
  });

  test("Wind page", async () => {
    await navigate(5);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 1,
      failureThresholdType: "percent",
      dumpDiffToConsole: true,
    });

    const mainText = page.locator(".main.bx--content h1");
    expect(await mainText.evaluate((node) => node.textContent)).toBe("Wind");
  });

  test("Solar page", async () => {
    await navigate(6);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 1,
      failureThresholdType: "percent",
      dumpDiffToConsole: true,
    });

    const mainText = page.locator(".main.bx--content h1");
    expect(await mainText.evaluate((node) => node.textContent)).toBe(
      "Solar & UVI"
    );
  });
});

it("should show the number of imported data", async () => {
  // Open right sidebar.
  await page.click('header.bx--header button[aria-label="Database / Import"]');

  const numberImported = page.locator(
    "header.bx--header .bx--header-panel .import-data > div"
  );
  expect(await numberImported.evaluate((node) => node.textContent)).toBe(
    "4162 records imported"
  );

  const imageSideBarOpen = await page.screenshot({ fullPage: true });
  expect(imageSideBarOpen).toMatchImageSnapshot({
    failureThreshold: 1,
    failureThresholdType: "percent",
    dumpDiffToConsole: true,
  });
});

// @todo Add test for "Delete all Button".
test("Clear DB Button", async () => {
  await page.locator("text=dangerClear DB").click();

  await page.waitForSelector(
    ".bx--header-panel .bx--modal.bx--modal-tall.bx--modal--danger h3",
    { state: "visible" }
  );

  const modalText = page.locator(
    ".bx--header-panel .bx--modal.bx--modal-tall.is-visible.bx--modal--danger h3.bx--modal-header__heading"
  );
  expect(await modalText.evaluate((node) => node.textContent)).toBe(
    "Are you sure? This will delete all records."
  );

  const imageConfirmation = await page.screenshot({ fullPage: true });
  expect(imageConfirmation).toMatchImageSnapshot({
    failureThreshold: 1,
    failureThresholdType: "percent",
    dumpDiffToConsole: true,
  });

  await page.click(
    ".bx--header-panel .bx--modal--danger button.bx--btn--danger"
  );

  const imageAfterDelete = await page.screenshot({ fullPage: true });
  expect(imageAfterDelete).toMatchImageSnapshot({
    failureThreshold: 1,
    failureThresholdType: "percent",
    dumpDiffToConsole: true,
  });
});
