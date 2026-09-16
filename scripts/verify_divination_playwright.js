const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const divPath = 'file://' + path.resolve(__dirname, '../divination.html');
  console.log('Navigating to:', divPath);
  await page.goto(divPath);
  await page.waitForTimeout(1000);

  // 1. Tarot Celtic Cross
  console.log('Testing Tarot Celtic Cross...');
  await page.selectOption('#spread_select', 'celtic_cross');
  await page.waitForTimeout(500);
  await page.click('#btn_draw_all');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve(__dirname, '../test_tarot_celtic.png'), fullPage: true });
  console.log('Saved test_tarot_celtic.png');

  // 2. Ziwei Three Decks
  console.log('Testing Ziwei Three Decks...');
  await page.click('#tab_ziwei');
  await page.waitForTimeout(500);
  await page.selectOption('#spread_select', 'three_decks');
  await page.waitForTimeout(500);
  await page.click('#btn_draw_all');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve(__dirname, '../test_ziwei_three_decks.png'), fullPage: true });
  console.log('Saved test_ziwei_three_decks.png');

  // 3. Lenormand 9-box
  console.log('Testing Lenormand Nine Box...');
  await page.click('#tab_lenormand');
  await page.waitForTimeout(500);
  await page.selectOption('#spread_select', 'nine_box');
  await page.waitForTimeout(500);
  await page.click('#btn_draw_all');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve(__dirname, '../test_lenormand_nine_box.png'), fullPage: true });
  console.log('Saved test_lenormand_nine_box.png');

  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors found:', consoleErrors);
  }

  await browser.close();
  console.log('Playwright divination verification completed successfully!');
})();
