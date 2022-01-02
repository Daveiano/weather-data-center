import { ElectronApplication, Page } from "playwright";
import { _electron as electron } from "playwright-core";
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

let page: Page,
  electronApp: ElectronApplication;

const navigate = async(index: number) => {
  await page.click('.bx--header__menu-trigger');
  await page.click(`nav.bx--side-nav__navigation ul li:nth-child(${index}) button`);
  await page.click(`nav.bx--side-nav__navigation ul li:nth-child(${index}) ul li:nth-child(1) a`);
  await page.click('.bx--header__menu-trigger');
};

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
  page = await electronApp.firstWindow();

  // Wait for frame actually loaded.
  await page.waitForSelector('main');

  // Direct Electron console to Node terminal.
  page.on('console', console.log);
});

afterAll(async () => {
  await electronApp.close();
});

describe('Start the app with a small set of data', () => {
  afterEach(async () => {
    await page.click('header.bx--header a.bx--header__name');
    await page.reload();
  });

  test('Overview page', async () => {
    expect(await page.title()).toBe('Weather Data Center');

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    const mainText = page.locator('.main.bx--content h1');
    expect(await mainText.evaluate(node => node.textContent)).toBe('Overview');
  });

  test('Temperature page', async () => {
    await navigate(2);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    const mainText = page.locator('.main.bx--content h1');
    expect(await mainText.evaluate(node => node.textContent)).toBe('Temperature');
  });

  test('Precipitation page', async () => {
    await navigate(3);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    const mainText = page.locator('.main.bx--content h1');
    expect(await mainText.evaluate(node => node.textContent)).toBe('Precipitation');
  });

  test('Pressure page', async () => {
    await navigate(4);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    const mainText = page.locator('.main.bx--content h1');
    expect(await mainText.evaluate(node => node.textContent)).toBe('Pressure');
  });

  test('Wind page', async () => {
    await navigate(5);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    const mainText = page.locator('.main.bx--content h1');
    expect(await mainText.evaluate(node => node.textContent)).toBe('Wind');
  });

  test('Solar page', async () => {
    await navigate(6);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      failureThreshold: 3.5,
      failureThresholdType: 'percent',
      dumpDiffToConsole: true
    });

    const mainText = page.locator('.main.bx--content h1');
    expect(await mainText.evaluate(node => node.textContent)).toBe('Solar & UVI');
  });
});

it('should show the number of imported data', async () => {
  // Open right sidebar.
  await page.click('header.bx--header button[aria-label="Upload Data"]');

  const numberImported = page.locator('header.bx--header .bx--header-panel .import-data');
  expect(await numberImported.evaluate(node => node.textContent)).toBe('4162 records in DB');

  const imageSideBarOpen = await page.screenshot({ fullPage: true });
  expect(imageSideBarOpen).toMatchImageSnapshot({
    failureThreshold: 3.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });
});

/* @see https://github.com/microsoft/playwright/issues/5013 */
/*it('should import new data', async () => {
  await page.click('header.bx--header button[aria-label="Upload Data"]');

  console.log('0');

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('button#import')
  ]);

  console.log('1');

  await fileChooser.setFiles(`${__dirname.replace('src/main', '')}tests/data/upload-data-start-16-08-21-30-09-21-1196-records.csv`);
});*/
