import type { ElectronApplication, Page } from "playwright";
import { _electron as electron } from "playwright-core";
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import fs from "fs";

expect.extend({ toMatchImageSnapshot });

jest.setTimeout(25000);

let page: Page,
  electronApp: ElectronApplication;

const navigate = async (index: number) => {
  await page.click('.bx--header__menu-trigger.bx--header__menu-toggle');
  await page.click(`nav.bx--side-nav__navigation ul li:nth-child(${index}) a`);
  await page.click('.bx--header__menu-trigger.bx--header__menu-toggle');
  await page.waitForSelector('nav.bx--side-nav__navigation .bx--side-nav__submenu-title', {state: 'hidden'});
};

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
    await electronApp.close();
    await fs.truncateSync(`${__dirname.replace('src/main', '')}tests/data/empty/nedb/data`, 0);

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
    await page.click('header.bx--header button[aria-label="Database / Import"]');

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

  it('should import data with custom settings', async () => {
    await page.click('header.bx--header button[aria-label="Database / Import"]');

    await page.click('button#edit-import');

    const imageSettingsModal = await page.screenshot({ fullPage: true });
    expect(imageSettingsModal).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    // Set custom units.
    await page.fill('#unit_pressure', 'bar');
    await page.fill('#unit_solar', 'custom solar');
    await page.fill('#unit_wind', 'mp/h');
    await page.fill('#unit_humidity', '%%');
    await page.fill('#unit_temperature', 'CC');
    await page.fill('#unit_rain', 'l');
    await page.fill('#unit_wind_direction', 'degrees');

    // Set custom date header and format.
    await page.fill('#header_time', 'Zeit');
    await page.fill('#import_date_format', 'YYYY/M/D k:m');

    // Set custom headers.
    await page.fill('#header_pressure', 'Luftdruck');
    await page.fill('#header_solar', 'Sonneneinstrahlung(w/m2)');
    await page.fill('#header_uvi', 'UVI');
    await page.fill('#header_temperature', 'Temperatur Außen');
    await page.fill('#header_felt_temperature', 'Gefühlte Temperatur(℃)');
    await page.fill('#header_dew_point', 'Taupunkt(℃)');
    await page.fill('#header_rain', 'Regen/Tag');
    await page.fill('#header_humidity', 'Luftfeuchtigkeit');
    await page.fill('#header_wind', 'Wind(km/h)');
    await page.fill('#header_gust', 'Böe(km/h)');
    await page.fill('#header_wind_direction', 'Windrichtung(°)');

    // Save.
    await page.click('.bx--modal button.bx--btn--primary');
    await page.waitForSelector('data-testid=modal-loading', { state: 'hidden' });

    const imageSettingsModalSaved = await page.screenshot({ fullPage: true });
    expect(imageSettingsModalSaved).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    // Close modal and import data.
    await page.click('.bx--modal button.bx--modal-close');

    await electronApp.evaluate(
      ({dialog}, filePaths) => {
        return dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths });
      },
      [`${__dirname.replace('src/main', '')}tests/data/upload-data-04-03-21-14-03-21-145-records.CSV`]
    );

    await page.click('button#import');

    await page.waitForSelector('data-testid=main-loading', { state: 'hidden' });

    const imageAfterImportLoading = await page.screenshot({ fullPage: true });
    expect(imageAfterImportLoading).toMatchImageSnapshot({
      failureThreshold: 1.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    const numberImported = page.locator('header.bx--header .bx--header-panel .import-data');
    expect(await numberImported.evaluate(node => node.textContent)).toBe('145 records imported');

    // Close sidebar.
    await page.click('header.bx--header button[aria-label="Database / Import"]');

    const imageCustomHeaders = await page.screenshot({ fullPage: true });
    expect(imageCustomHeaders).toMatchImageSnapshot({
      failureThreshold: 1.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    // Test values (headers) and units.
    const temperature_stat = page.locator('.tiles .stats .stat-tile:nth-child(1) .value');
    expect(await temperature_stat.evaluate(node => node.textContent)).toBe('10.3 CC');

    const wind_stat = page.locator('.tiles .stats .stat-tile:nth-child(3) .value');
    expect(await wind_stat.evaluate(node => node.textContent)).toBe('33.1 mp/h');

    const rain_stat = page.locator('.tiles .stats .stat-tile:nth-child(4) .value');
    expect(await rain_stat.evaluate(node => node.textContent)).toBe('5.4 l');

    const pressure_stat = page.locator('.tiles .stats .stat-tile:nth-child(5) .value');
    expect(await pressure_stat.evaluate(node => node.textContent)).toBe('1000.6 bar');
  });

  it('should import new data', async () => {
    await page.click('header.bx--header button[aria-label="Database / Import"]');

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
    expect(await numberImported.evaluate(node => node.textContent)).toBe('1196 records imported');
  });
});

/**
 * This test must run in the suite. 'should import new data' must run before.
 */
it('should not import duplicates', async () => {
  const numberImported = page.locator('header.bx--header .bx--header-panel .import-data');
  expect(await numberImported.evaluate(node => node.textContent)).toBe('1196 records imported');

  const imageBeforeImport = await page.screenshot({ fullPage: true });
  expect(imageBeforeImport).toMatchImageSnapshot({
    // @todo Try to decrease the failureThreshold on all image snapshots.
    failureThreshold: 1,
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
  expect(await numberImportedAfterSecondImport.evaluate(node => node.textContent)).toBe('1196 records imported');

  const duplicateItems = page.locator('header.bx--header .bx--header-panel .import-action .bx--inline-notification__subtitle');
  expect(await duplicateItems.evaluate(node => node.textContent)).toBe('1196 items were duplicate and are not imported.');
});

/**
 * This test must run in the suite. 'should import new data' must run before.
 */
it('should import new data when data still exists', async () => {
  const numberImported = page.locator('header.bx--header .bx--header-panel .import-data');
  expect(await numberImported.evaluate(node => node.textContent)).toBe('1196 records imported');

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
  expect(await numberImportedAfterSecondImport.evaluate(node => node.textContent)).toBe('2393 records imported');
});

/**
 * This test must run in the suite. 'should import new data' must run before.
 */
it('should delete single records', async () => {
  await page.click('header.bx--header button[aria-label="Database / Import"]');
  await navigate(7);

  const imageBeforeDelete = await page.screenshot({ fullPage: true });
  expect(imageBeforeDelete).toMatchImageSnapshot({
    failureThreshold: 1.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  const tableRows = page.locator('.bx--data-table-container .bx--pagination .bx--pagination__items-count');
  // @todo Should be 2393?
  expect(await tableRows.evaluate(node => node.textContent)).toBe('1–100 of 2368 items');

  // Check 5 single records.
  await page.check('.bx--data-table-content tbody label[aria-label="Select row"] >> nth=0');
  await page.check('.bx--data-table-content tbody label[aria-label="Select row"] >> nth=2');
  await page.check('.bx--data-table-content tbody label[aria-label="Select row"] >> nth=3');
  await page.check('.bx--data-table-content tbody label[aria-label="Select row"] >> nth=4');
  await page.check('.bx--data-table-content tbody label[aria-label="Select row"] >> nth=5');

  await page.click('.bx--batch-actions.bx--batch-actions--active div.bx--action-list button:nth-child(1)');
  await page.waitForSelector('.bx--modal.bx--modal-tall.bx--modal--danger h3', {state: 'visible'});

  const modalText = page.locator('.bx--modal.bx--modal-tall.is-visible.bx--modal--danger h3.bx--modal-header__heading');
  expect(await modalText.evaluate(node => node.textContent)).toBe('Are you sure? This will delete 5 record(s).');

  const imageConfirmation = await page.screenshot({ fullPage: true });
  expect(imageConfirmation).toMatchImageSnapshot({
    failureThreshold: 1.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  await page.locator('text=dangerDelete').click();

  const imageAfterDelete = await page.screenshot({ fullPage: true });
  expect(imageAfterDelete).toMatchImageSnapshot({
    failureThreshold: 1.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  expect(await tableRows.evaluate(node => node.textContent)).toBe('1–100 of 2363 items');
});

/**
 * This test must run in the suite. 'should delete single records' must run before.
 */
it('should delete all records', async () => {
  const imageBeforeDelete = await page.screenshot({ fullPage: true });
  expect(imageBeforeDelete).toMatchImageSnapshot({
    failureThreshold: 1.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  const tableRows = page.locator('.bx--data-table-container .bx--pagination .bx--pagination__items-count');
  expect(await tableRows.evaluate(node => node.textContent)).toBe('1–100 of 2363 items');

  // Check all records.
  await page.check('.bx--data-table-content thead label[aria-label="Select all rows"]');

  await page.click('.bx--batch-actions.bx--batch-actions--active div.bx--action-list button:nth-child(1)');
  await page.waitForSelector('.bx--modal.bx--modal-tall.bx--modal--danger h3', {state: 'visible'});

  const modalText = page.locator('.bx--modal.bx--modal-tall.is-visible.bx--modal--danger h3.bx--modal-header__heading');
  expect(await modalText.evaluate(node => node.textContent)).toBe('Are you sure? This will delete 2363 record(s).');

  const imageConfirmation = await page.screenshot({ fullPage: true });
  expect(imageConfirmation).toMatchImageSnapshot({
    failureThreshold: 1.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  await page.locator('text=dangerDelete').click();

  const imageAfterDelete = await page.screenshot({ fullPage: true });
  expect(imageAfterDelete).toMatchImageSnapshot({
    failureThreshold: 1.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });
});