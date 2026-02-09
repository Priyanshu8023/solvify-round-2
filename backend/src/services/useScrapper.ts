import puppeteer, { Browser } from "puppeteer-core";

interface Scraper {
  url: string;
  prompt: string;
}

export async function useScrapper({ url, prompt }: Scraper): Promise<string> {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BAAS_WS_ENDPOINT!,
    });

    const page = await browser.newPage();

    // Standard bandwidth optimization
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "font", "media"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: "networkidle2" });

   
    const inputSelector = "#comment";
    await page.waitForSelector(inputSelector);
    
    
    await page.click(inputSelector);
    await page.type(inputSelector, prompt);
    await page.keyboard.press("Enter");

    const responseSelector = ".answer";
    
    await page.waitForFunction(
      (sel) => {
        const el = document.querySelector(sel);
        return el && el.textContent.trim().length > 0;
      },
      { timeout: 30_000 },
      responseSelector
    );

    
    const answer = await page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel);
      return elements[elements.length - 1]?.textContent?.trim() || "";
    }, responseSelector);

    return answer || "I'm sorry, I don't understand what you're trying to say. If you need help with something, please let me know.";

  } catch (error) {
    console.error("Scraper Error:", error);
    throw new Error("Failed to get response from the AI interface.");
  } finally {
    if (browser) await browser.disconnect();
  }
}