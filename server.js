const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    // Read URLs from file
    const urls = fs.readFileSync('urls.txt', 'utf8').split('\n').filter(url => url.trim() !== '');
    if (urls.length === 0) {
      console.log('No URLs found in the file.');
      return;
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({ 
		headless: false ,
		executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	}); // Set headless to false for debugging

    while (true) {
      // Pick a random URL
      const randomIndex = Math.floor(Math.random() * urls.length);
      const randomUrl = urls[randomIndex];
      console.log(`Opening: ${randomUrl}`);

      // Open the URL in a new page
      const page = await browser.newPage();
      await page.goto(randomUrl);

      // Wait for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Close the page
      await page.close();
    }

    // Close the browser (This will never be reached due to the infinite loop)
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
