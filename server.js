require('dotenv').config();
const express = require('express');
const { Builder, By, until } = require('selenium-webdriver');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

const PROXYMESH_USERNAME = process.env.PROXYMESH_USERNAME;
const PROXYMESH_PASSWORD = process.env.PROXYMESH_PASSWORD;

// MongoDB configuration
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'twitter_trends';

const proxyHosts = [
    `http://${PROXYMESH_USERNAME}:${PROXYMESH_PASSWORD}@us-wa.proxymesh.com:31280`,
    `http://${PROXYMESH_USERNAME}:${PROXYMESH_PASSWORD}@us-fl.proxymesh.com:31280`,
    `http://${PROXYMESH_USERNAME}:${PROXYMESH_PASSWORD}@us-ca.proxymesh.com:31280`
];
async function getRandomProxy() {
    return proxyHosts[Math.floor(Math.random() * proxyHosts.length)];
}

async function scrapeTrendingTopics() {
    // Set up Chrome options without proxy
    const proxy = await getRandomProxy();
    const options = new chrome.Options()
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--start-maximized') // Makes the browser window full-size
        .setProxy({
            proxyType: 'manual',
            httpProxy: proxy,
            sslProxy: proxy,
        });

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log('Starting scraping process...');
        
        console.log('Navigating to Twitter...');
        await driver.get('https://twitter.com/login');
        await driver.sleep(3000); 
        
        console.log('Looking for username field...');
        const usernameField = await driver.wait(
            until.elementLocated(By.css('input[autocomplete="username"]')),
            10000
        );
        console.log('Found username field, entering username...');
        await usernameField.sendKeys(process.env.TWITTER_USERNAME);
        await driver.sleep(1000);

        console.log('Looking for Next button...');
        console.log('Clicking Next...');
        await await driver.findElement(By.xpath("//span[text()='Next']")).click();
        await driver.sleep(2000);

        console.log('Looking for password field...');
        const passwordField = await driver.wait(
            until.elementLocated(By.css('input[name="password"]')),
            10000
        );
        console.log('Entering password...');
        await passwordField.sendKeys(process.env.TWITTER_PASSWORD);
        await driver.sleep(1000);

        console.log('Looking for Login button...');
        console.log('Clicking Login...');
        await driver.findElement(By.xpath("//span[text()='Log in']")).click();
        await driver.sleep(5000); 

        console.log('Waiting for trends section...');
        await driver.wait(
            until.elementLocated(By.css('[data-testid="trend"]')),
            20000
        );
        await driver.sleep(2000);

        console.log('Getting trends...');
        const trends = await driver.findElements(By.css('[data-testid="trend"]'));
        const trendNames = [];
        
        for (let i = 0; i < 5 && i < trends.length; i++) {
            const trendText = await trends[i].getText();
            console.log(`Found trend ${i + 1}: ${trendText}`);
            trendNames.push(trendText);
        }

        return {
            id: uuidv4(),
            nameoftrend1: trendNames[0] || '',
            nameoftrend2: trendNames[1] || '',
            nameoftrend3: trendNames[2] || '',
            nameoftrend4: trendNames[3] || '',
            nameoftrend5: trendNames[4] || '',
            datetime: new Date(),
            ip_address: proxy
        };

    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        console.log('Closing browser...');
        await driver.quit();
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/scrape', async (req, res) => {
    try {
        console.log('Scrape endpoint hit');
        const trends = await scrapeTrendingTopics();
        console.log('Scraping successful:', trends);
        
        // Store in MongoDB
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        await db.collection('trends').insertOne(trends);
        
        res.json(trends);
        client.close();
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});