import { ElectronApplication, Page } from "playwright";
import { _electron as electron } from "playwright-core";
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

let window: Page,
  electronApp: ElectronApplication;

beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    args: [
      '.',
      `--user-data-dir=${__dirname.replace('src/main', '')}tests/data/small`
    ],
    env: {
      ...process.env
    },
  });

  const appPath = await electronApp.evaluate((({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getPath('userData')
  }));

  // Get the first window that the app opens, wait if necessary.
  window = await electronApp.firstWindow();

  // Wait for frame actually loaded.
  await window.waitForSelector('main');

  // Direct Electron console to Node terminal.
  window.on('console', console.log);
});

afterAll(async () => {
  await electronApp.close();
});

/*beforeEach(async () => {
    page = await browser.newPage();
});
afterEach(async () => {
    await page.close();
});*/

// @todo add new props: uvi, solar, wind
it('should start the app with a small set of data', async () => {
  expect(await window.title()).toBe('Weather Data Center');

  const image = await window.screenshot({ fullPage: true });
  expect(image).toMatchImageSnapshot({
    failureThreshold: 3.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  const mainText = window.locator('.main.bx--content h1');
  expect(await mainText.evaluate(node => node.textContent)).toBe('Overview');

  // Open right sidebar.
  await window.click('header.bx--header button[aria-label="Upload Data"]');

  // Expect 0 items to be imported.
  const numberImported = window.locator('header.bx--header .bx--header-panel .import-data');
  expect(await numberImported.evaluate(node => node.textContent)).toBe('145 records in DB');

  const imageSideBarOpen = await window.screenshot({ fullPage: true });
  expect(imageSideBarOpen).toMatchImageSnapshot({
    failureThreshold: 3.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });
});