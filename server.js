const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config(); // Load .env configuration

(async () => {
  let browser;
  try {
    // Read URLs from file
    const urls = fs.readFileSync('urls.txt', 'utf8').split('\n').filter(url => url.trim() !== '');
    if (urls.length === 0) {
      console.log('No URLs found in the file.');
      return;
    }

    // Retrieve configuration from .env
    const executablePath = process.env.EXECUTABLE_PATH;
    const timeDelay = parseInt(process.env.TIME_DELAY, 10) || 5000;

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: false,
      executablePath: executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    while (true) {
      // Pick a random URL
      const randomIndex = Math.floor(Math.random() * urls.length);
      const randomUrl = urls[randomIndex];
      console.log(`[${new Date().toISOString()}] Opening: ${randomUrl}`);

      // Open the URL in a new page
      const page = await browser.newPage();
      try {
        await page.goto(randomUrl, { timeout: 10000 }); // Timeout after 10 seconds
      } catch (err) {
        console.error(`Failed to load ${randomUrl}: ${err.message}`);
      }

      // Wait for configured time delay
      await new Promise(resolve => setTimeout(resolve, timeDelay));

      // Close the page
      await page.close();
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) await browser.close();
  }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  if (browser) await browser.close();
  process.exit(0);
});
