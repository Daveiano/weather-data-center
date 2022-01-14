import type { ElectronApplication, Page } from "playwright";
import { _electron as electron } from "playwright-core";
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import fs from "fs";

expect.extend({ toMatchImageSnapshot });

let page: Page,
  electronApp: ElectronApplication;

beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    args: [
      '.',
      `--user-data-dir=${__dirname.replace('src/main', '')}tests/data/empty`,
      '--window-size=1920,1000'
    ],
    env: {
      ...process.env
    },
  });

  // Get the first window that the app opens, wait if necessary.
  page = await electronApp.firstWindow();

  // Wait for frame actually loaded.
  await page.waitForSelector('main');

  // Direct Electron console to Node terminal.
  page.on('console', console.log);
});

afterAll(async () => {
  await electronApp.close();
  await fs.truncateSync(`${__dirname.replace('src/main', '')}tests/data/empty/nedb/data`, 0);
});

describe('empty', () => {
  beforeEach(async () => {
    await fs.truncateSync(`${__dirname.replace('src/main', '')}tests/data/empty/nedb/data`, 0);
    await page.click('header.bx--header a.bx--header__name');
    await page.reload();
  });
  it('should start the app on an empty state', async () => {
    expect(await page.title()).toBe('Weather Data Center');

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold:3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    const mainText = page.locator('.main.bx--content h1');
    expect(await mainText.evaluate(node => node.textContent.replace(/(\r\n|\n|\r)/gm, ""))).toBe('No data found');

    // Open right sidebar.
    await page.click('header.bx--header button[aria-label="Upload Data"]');

    // Expect 0 items to be imported.
    const numberImported = page.locator('header.bx--header .bx--header-panel .import-data');
    expect(await numberImported.evaluate(node => node.textContent)).toBe('');

    const imageSideBarOpen = await page.screenshot({ fullPage: true });
    expect(imageSideBarOpen).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });
  });
  it('should import new data', async () => {
    await page.click('header.bx--header button[aria-label="Upload Data"]');

    const imageBeforeImport = await page.screenshot({ fullPage: true });
    expect(imageBeforeImport).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    // @see https://github.com/microsoft/playwright/issues/8278
    /*page.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles(`${__dirname.replace('src/main', '')}tests/data/upload-data-start-16-08-21-30-09-21-1196-records.csv`);
    })*/

    await electronApp.evaluate(
      ({dialog}, filePaths) => {
        return dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths });
      },
      [`${__dirname.replace('src/main', '')}tests/data/upload-data-16-08-21-30-09-21-1196-records.csv`]
    );

    await page.click('button#import');

    await page.waitForSelector('data-testid=main-loading', { state: 'hidden' });

    const imageAfterImportLoading = await page.screenshot({ fullPage: true });
    expect(imageAfterImportLoading).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    const numberImported = page.locator('header.bx--header .bx--header-panel .import-data');
    expect(await numberImported.evaluate(node => node.textContent)).toBe('1196 records in DB');
  });
});

/**
 * This test must run in the suite. 'should import new data' must run before.
 */
it('should not import duplicates', async () => {
  const numberImported = page.locator('header.bx--header .bx--header-panel .import-data');
  expect(await numberImported.evaluate(node => node.textContent)).toBe('1196 records in DB');

  const imageBeforeImport = await page.screenshot({ fullPage: true });
  expect(imageBeforeImport).toMatchImageSnapshot({
    failureThreshold: 3.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  await electronApp.evaluate(
    ({dialog}, filePaths) => {
      return dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths });
    },
    [`${__dirname.replace('src/main', '')}tests/data/upload-data-16-08-21-30-09-21-1196-records.csv`]
  );

  await page.click('button#import');

  await page.waitForSelector('data-testid=main-loading', { state: 'hidden' });

  const imageAfterImportLoading = await page.screenshot({ fullPage: true });
  expect(imageAfterImportLoading).toMatchImageSnapshot({
    failureThreshold: 3.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  const numberImportedAfterSecondImport = page.locator('header.bx--header .bx--header-panel .import-data');
  expect(await numberImportedAfterSecondImport.evaluate(node => node.textContent)).toBe('1196 records in DB');

  const duplicateItems = page.locator('header.bx--header .bx--header-panel .import-action .bx--inline-notification__subtitle');
  expect(await duplicateItems.evaluate(node => node.textContent)).toBe('1196 items were duplicate and are not imported.');
});

/**
 * This test must run in the suite. 'should import new data' must run before.
 */
it('should import new data when data still exists', async () => {
  const numberImported = page.locator('header.bx--header .bx--header-panel .import-data');
  expect(await numberImported.evaluate(node => node.textContent)).toBe('1196 records in DB');

  const imageBeforeImport = await page.screenshot({ fullPage: true });
  expect(imageBeforeImport).toMatchImageSnapshot({
    failureThreshold: 3.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  await electronApp.evaluate(
    ({dialog}, filePaths) => {
      return dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths });
    },
    [`${__dirname.replace('src/main', '')}tests/data/upload-data-01-10-21-15-10-21-1197-records.CSV`]
  );

  await page.click('button#import');

  await page.waitForSelector('data-testid=main-loading', { state: 'hidden' });

  const imageAfterImportLoading = await page.screenshot({ fullPage: true });
  expect(imageAfterImportLoading).toMatchImageSnapshot({
    failureThreshold: 3.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  const numberImportedAfterSecondImport = page.locator('header.bx--header .bx--header-panel .import-data');
  expect(await numberImportedAfterSecondImport.evaluate(node => node.textContent)).toBe('2393 records in DB');
});