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
  page.on('requestfailed', req => {
    console.log('REQUEST FAILED:', req.url(), req.failure() ? req.failure().errorText : '');
  });

  const baziPath = 'file://' + path.resolve(__dirname, '../bazi.html');
  console.log('Navigating to:', baziPath);
  await page.goto(baziPath);
  await page.waitForTimeout(1000);

  // Take screenshot of initial classic view
  await page.screenshot({ path: path.resolve(__dirname, '../test_bazi_dapan.png'), fullPage: true });
  console.log('Saved test_bazi_dapan.png');

  // Test switching to relation tab
  await page.click('#tab_btn_relation');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.resolve(__dirname, '../test_bazi_relation.png'), fullPage: true });
  console.log('Saved test_bazi_relation.png');

  // Test switching to shensha tab
  await page.click('#tab_btn_shensha');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.resolve(__dirname, '../test_bazi_shensha.png'), fullPage: true });
  console.log('Saved test_bazi_shensha.png');

  // Switch back to dapan and click first char
  await page.click('#tab_btn_dapan');
  await page.waitForTimeout(300);

  // Test opening right-side Shensha drawer
  console.log('Testing right-side Shensha drawer...');
  await page.click('#tab_btn_shensha');
  await page.waitForTimeout(300);
  const firstShenshaBtn = await page.$('#view_shensha_panel button');
  if (firstShenshaBtn) {
    await firstShenshaBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.resolve(__dirname, '../test_bazi_shensha_drawer.png'), fullPage: false });
    console.log('Saved test_bazi_shensha_drawer.png');
    // Test closing drawer
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors found:', consoleErrors);
  }

  await browser.close();
  console.log('Playwright bazi verification completed successfully!');
})();
