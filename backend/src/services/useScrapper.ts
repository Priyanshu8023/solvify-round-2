import puppeteer, { Browser, BrowserContext, HTTPRequest, Page } from "puppeteer";

interface Scraper {
  url: string;
  prompt: string;
  userId: string;
}

let globalBrowser: Browser | null = null;
let browserLaunchPromise: Promise<Browser> | null = null;

async function getLocalBrowser() {
  if (globalBrowser) return globalBrowser;

  if (!browserLaunchPromise) {
    browserLaunchPromise = (async () => {
      console.log("Launching local fallback browser...");
      globalBrowser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      });
      return globalBrowser;
    })();
  }

  return browserLaunchPromise;
}

export async function useScrapper({ url, prompt, userId }: Scraper): Promise<string> {
  let isBrowserless = false;
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    console.log(`Starting scrapper for user ${userId}...`);

    if (process.env.BAAS_WS_ENDPOINT) {
      try {
        const wsUrl = new URL(process.env.BAAS_WS_ENDPOINT);
        // Browserless session persistence & keepalive (e.g. 5 minutes)
        wsUrl.searchParams.set("sessionId", userId);
        wsUrl.searchParams.set("keepalive", "300000");

        console.log(`Connecting to remote browserless session for ${userId}...`);
        browser = await puppeteer.connect({
          browserWSEndpoint: wsUrl.toString(),
        });
        isBrowserless = true;
      } catch (err) {
        console.warn("Failed to connect to remote browser, falling back to local browser...", err);
      }
    }

    if (!isBrowserless) {
      browser = await getLocalBrowser();
      // Isolate context locally so parallel users don't share Gandalf sessions
      context = await browser.createBrowserContext();
      page = await context.newPage();
    } else {
      // Browserless completely isolates sessions by sessionId. 
      // We explicitly MUST use the default context here so Gandalf's level progression persists between runs.
      page = await browser!.newPage();
    }

    // Standard bandwidth optimization
    await page.setRequestInterception(true);
    page.on("request", (req: HTTPRequest) => {
      if (["image", "font", "media", "stylesheet"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`Setting up Gandalf session for ${url}...`);
    // Extract the level slug from the target URL (e.g., 'do-not-tell' or 'baseline')
    const urlObj = new URL(url);
    const slug = urlObj.pathname.replace('/', '') || 'baseline';

    // First go to root to initialize the domain context for LocalStorage
    await page.goto("https://gandalf.lakera.ai/", { waitUntil: "domcontentloaded", timeout: 30000 });

    // Inject level progression into LocalStorage so Gandalf doesn't block direct access
    await page.evaluate((levelSlug) => {
      localStorage.setItem("last_normal_level", levelSlug);
      localStorage.setItem("last_level", levelSlug);
      localStorage.setItem("default_max_level", "8"); // Max unlock
    }, slug);

    console.log(`Navigating to validated URL: ${url}`);
    // 'domcontentloaded' prevents hanging on infinite websockets/tracking scripts
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const inputSelector = "#comment";
    console.log(`Waiting for input selector: ${inputSelector}`);
    await page.waitForSelector(inputSelector, { timeout: 10000 });

    console.log("Typing prompt...");
    await page.click(inputSelector);
    await page.type(inputSelector, prompt);
    await page.keyboard.press("Enter");

    const responseSelector = ".answer";
    console.log(`Waiting for response selector: ${responseSelector}`);

    // Wait for either the answer or an error message indicating the prompt failed
    await page.waitForFunction(
      (sel: string) => {
        const el = document.querySelector(sel);
        const errorEl = document.querySelector('.text-red-500'); // Gandalf error messages are often red
        if (errorEl && errorEl.textContent?.includes("cannot be the same")) return true;
        return el && el.textContent.trim().length > 0;
      },
      { timeout: 30000 },
      responseSelector
    );

    const answer = await page.evaluate((sel: string) => {
      const errorEl = document.querySelector('.text-red-500');
      if (errorEl && errorEl.textContent?.includes("cannot be the same")) {
        return "Error: " + errorEl.textContent.trim();
      }
      const elements = document.querySelectorAll(sel);
      return elements[elements.length - 1]?.textContent?.trim() || "";
    }, responseSelector);

    console.log(`Got answer for ${userId}:`, answer.substring(0, 50) + "...");
    return answer || "I'm sorry, I don't understand what you're trying to say.";

  } catch (error) {
    console.error(`Scraper Error for ${userId}:`, error);
    throw new Error("Failed to get response from the AI interface.");
  } finally {
    if (page) await page.close().catch(() => { });

    if (isBrowserless && browser) {
      // Detach without killing the browser to keep the session alive
      await browser.disconnect();
    } else if (context) {
      // Hard close context on local fallback
      await context.close().catch(() => { });
    }
  }
}