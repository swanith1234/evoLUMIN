import { run } from "../geminiAiApi.js"; // Import the run function from your gemini service
import { catchAsyncError } from "../middllewares/catchAsyncError.js";
import puppeteer from "puppeteer";
import gplay from "google-play-scraper";
import AppRecommendation from "../models/appRecommendationModel.js"; // Import the Mongoose model
import { renderToStaticMarkup } from "react-dom/server";

const cache = new Map();

export const digitalTool = async (req, res) => {
  console.log(req.params);
  const { name, language } = req.params;

  console.log(name, language);
  let prompt = `Imagine yourself as a farm and crop assistant for a farmer
   Please recommend the best app that solves the following problem faced by a farmer:
  
  Problem: "${name}"
    Please provide detailed, step-by-step instructions on how to use the  app:
    The response should be written in the ${language} language.
    
  

    Include the following steps in the instructions:
    1. How to download or open the website/app.
    2. How to sign up or log in (if applicable).
    3. How to navigate through the main menu or dashboard.
    4. How to access key features or functionalities.
    5. How to troubleshoot common issues (if applicable).

    Ensure the instructions are beginner-friendly and explain each step clearly.

    Additionally, provide the following fields in JSON format:
    1. "name": The name of the app.
    2. "description": A detailed description of the app's functionality in the ${language} language.
    3. "steps": An array of step-by-step instructions starting from downloading or opening the app to accessing its features.
    4. "rating": The rating of the app (if available).
    5. "link": The link to the app in the Play Store.
 The response should be in strict JSON format with  fields {name,description,steps,rating,link} 
   If no rating is available, set "rating" to "N/A". The link provided must lead to the Google Play Store.
   the name of the app should  be in english language`;

  let geminiResponse = await run(prompt);

  // Fetch media (screenshots, videos) from Play Store
  let appLink;
  try {
    const apps = await gplay.search({
      term: `${geminiResponse.name}`, // Replace with the app name you're looking for
      num: 1,
    });
    if (apps.length > 0) {
      appLink = apps[0].url; // Get the app URL
    } else {
      console.log("No apps found.");
      return;
    }
  } catch (err) {
    console.log("Error fetching app link:", err);
    return; // Stop execution if the app link couldn't be retrieved
  }
  const media = await fetchPlayStoreMedia(appLink, geminiResponse.name);

  // Insert the new app details into the database
  const newApp = {
    name: geminiResponse.name,
    description: geminiResponse.description,
    instructions: geminiResponse.steps,
    rating: geminiResponse.rating,
    link: appLink,
    screenshots: media.screenshots,
    videos: media.videos,
    youtube: media.youtubeVideo,
  };

  // Compare the new app with existing apps in the database
  // const bestApp = await compareWithExistingApps(newApp);
  // console.log(bestApp);
  console.log(newApp);
  return res.status(200).json(newApp);
};

// Function to fetch Play Store media
// Function to fetch Play Store media and YouTube video
export const fetchPlayStoreMedia = async (appLink, appName) => {
  const browser = await puppeteer.launch({
    headless: false, // Keep headless mode off for debugging
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();

  // Set a human-like user-agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  let mediaData = {
    screenshots: [],
    videos: [],
    youtubeVideo: null,
    featuresText: null, // Field to store features text
  };

  try {
    // Visit Play Store app link
    await page.goto(appLink, { waitUntil: "networkidle2" });

    // Log that the page has been successfully loaded
    console.log("Page loaded successfully");

    // Wait for the images to appear (increase timeout if necessary)
    await page.waitForSelector("img.T75of.B5GQxf", {
      visible: true,
      timeout: 60000,
    });

    console.log("Images are visible, starting extraction");

    // Extract images and videos
    mediaData = await page.evaluate(() => {
      try {
        const allImages = document.querySelectorAll("c-wiz img");
        const specificImages = Array.from(allImages)
          .slice(5, 13) // Select images from index 5 to 12
          .map((img) => img.src);

        const videoIframe = document.querySelector("video");
        let videoLink = null;

        if (videoIframe) {
          videoLink = videoIframe.src;
        }

        return {
          screenshots: specificImages,
          videos: videoLink ? [videoLink] : [],
        };
      } catch (err) {
        console.error("Error during page evaluation:", err);
        return { screenshots: [], videos: [] };
      }
    });

    // Replace the modal interaction logic with fetching text using the .fysCi selector
    // Wait for the button with the aria-label to be available and click it
    await page.waitForSelector(
      'button[aria-label="See more information on About this app"]',
      { visible: true }
    );
    await page.click(
      'button[aria-label="See more information on About this app"]'
    );

    console.log("Button clicked, waiting for modal to open...");
    console.log("Extracting features text...");

    // Wait for the element containing the features text
    await page.waitForSelector(".fysCi", {
      visible: true,
      timeout: 60000,
    });

    // Extract the inner text from the desired element
    const featuresText = await page.evaluate(() => {
      const element = document.querySelector(".fysCi");
      return element ? element.innerText : "";
    });

    console.log("Text Content Extracted:", featuresText);

    mediaData.featuresText = featuresText;

    // Now, search YouTube for a video explaining the app features
    const youtubeVideoLink = await fetchYouTubeVideo(appName); // Assuming this is defined elsewhere
    mediaData.youtubeVideo = youtubeVideoLink;

    return mediaData;
  } catch (error) {
    console.error("Error fetching media from Play Store:", error);
    return mediaData;
  } finally {
    await browser.close();
  }
};

// Function to fetch a YouTube video explaining the app
const fetchYouTubeVideo = async (appName) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" });

    console.log("Typing in YouTube search...");
    const searchSelector = 'input[name="search_query"]';
    await page.waitForSelector(searchSelector, { timeout: 10000 });
    await page.type(searchSelector, `${appName} app features`, { delay: 100 });
    await page.keyboard.press("Enter");

    console.log("Waiting for search results...");
    await page.waitForSelector("#video-title", { timeout: 30000 });

    console.log("Extracting YouTube video link...");
    const videoLink = await page.evaluate(() => {
      const videos = document.querySelectorAll("#video-title");
      if (videos.length > 0) {
        return `https://www.youtube.com${videos[0].getAttribute("href")}`;
      }
      return null;
    });

    console.log("YouTube video link:", videoLink);
    return videoLink;
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return null;
  } finally {
    await page.close();
    await browser.close();
  }
};

// Function to compare new app with existing ones in the database
export const compareWithExistingApps = async (newApp) => {
  // Fetch the best existing app from the database (assuming only one best app exists)
  const bestExistingApp = await AppRecommendation.findOne({});

  // If no app exists in the DB, save the new app as the best app
  if (!bestExistingApp) {
    const savedApp = new AppRecommendation(newApp);
    await savedApp.save();
    return savedApp;
  }

  // Function to compare apps by rating or other custom rules
  const compareApps = (app1, app2) => {
    const rating1 = app1.rating !== "N/A" ? parseFloat(app1.rating) : 0;
    const rating2 = app2.rating !== "N/A" ? parseFloat(app2.rating) : 0;
    return rating1 - rating2;
  };

  // Compare the new app with the existing one
  const comparisonResult = compareApps(newApp, bestExistingApp);

  if (comparisonResult > 0) {
    // If the new app is better, update the best existing app
    const updatedApp = await AppRecommendation.findOneAndUpdate(
      { _id: bestExistingApp._id }, // Update the best existing app by ID
      newApp, // Replace with the new app data
      { new: true } // Return the updated document
    );
    return updatedApp;
  } else {
    // Return the best existing app (no update)
    return bestExistingApp;
  }
};
