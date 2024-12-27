# Twitter Trends Scraper

This project is a web scraper that logs into Twitter, extracts the top 5 trending topics, and stores them in a MongoDB database. It uses **Selenium WebDriver** for scraping and **ProxyMesh** to switch IP addresses dynamically.

---

## Demo

Watch the demo video to see the project in action:

click [here to watch the demo video](https://drive.google.com/file/d/1bSzeKSiwhvDrrVPMrbRv6CIu-uwy9qC-/preview)

## Features

- **Twitter Login**: Automatically logs into Twitter using provided credentials.
- **Trend Extraction**: Scrapes the top 5 trending topics from Twitter.
- **MongoDB Storage**: Stores the scraped data in a MongoDB database.
- **ProxyMesh Integration**: Routes requests through ProxyMesh to switch IP addresses.
- **Frontend Display**: Displays the scraped trends on a simple web page.

---

## Prerequisites

Before running the project, ensure you have the following installed:

1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
2. **MongoDB**: Install MongoDB locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
3. **ChromeDriver**: Ensure ChromeDriver is installed and matches your Chrome browser version. Download it from [here](https://sites.google.com/chromium.org/driver/).
4. **ProxyMesh Account**: Sign up for a ProxyMesh account at [proxymesh.com](https://proxymesh.com/).

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mohitvermax/twitter-scraper.git
cd twitter-scraper
```

### 2. Install the dependencies

```bash
npm install
```

### 3. Set Up Environment variables

```bash
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
PROXYMESH_USERNAME=your_proxymesh_username
PROXYMESH_PASSWORD=your_proxymesh_password
MONGODB_URI=your_mongodb_url
```

---

## Usage

### 1. Start the backend server

```bash
npm run start
```

### 2. Open the frontend

Open the index.html file in the public folder using a live server (e.g., VS Code's "Go Live" extension). The frontend will be available at http://localhost:5500 (or another port depending on your live server).
