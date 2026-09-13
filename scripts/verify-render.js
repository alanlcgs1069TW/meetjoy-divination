const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const baseDir = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '/gene-keys') reqPath = '/gene-keys.html';
  const filePath = path.join(baseDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = ext === '.html' ? 'text/html' : ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found: ' + reqPath);
  }
});

server.listen(8999, async () => {
  console.log('Server started on 8999');
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    await page.goto('http://localhost:8999/gene-keys.html');
    await page.waitForTimeout(1000);

    const tabs = [
      { id: 'wholeness', name: 'render_wholeness.png' },
      { id: 'activation', name: 'render_activation.png' },
      { id: 'venus', name: 'render_venus.png' },
      { id: 'pearl', name: 'render_pearl.png' }
    ];

    for (const t of tabs) {
      const tabEl = await page.$(`.subseq-tab[data-subseq="${t.id}"]`);
      if (tabEl) {
        await tabEl.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(baseDir, 'logs', t.name), fullPage: true });
        console.log(`Saved ${t.name}`);
      }
    }

    await browser.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
    console.log('Server closed');
  }
});
