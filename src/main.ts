// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, Dataset } from 'crawlee';

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    requestHandler: async ({ request, page, enqueueLinks, log }) => {

        if (request.label === 'DETAIL') {

        const title = await page.title();
        log.info(`Title of ${request.loadedUrl} is '${title}'`);

        let productName;
        let originPrice;
        let salePrice;
        let brand;
        if (request.loadedUrl?.includes('pack-ski-fixations')) {
            brand = await page.locator('span.title > a').textContent();

         productName = await page.locator('h1.title').textContent();

         originPrice = await page.locator('p.advice-price__price').first().textContent();

         salePrice = await page.locator('p.advice-price__price').first().getAttribute('data-price-data');
        }

        // Save results as JSON to ./storage/datasets/default
        await Dataset.pushData({ title, url: request.loadedUrl, brand, productName, originPrice, salePrice });
    } else {
        // Extract links from the current page
        // and add them to the crawling queue.
        await enqueueLinks({            
            selector: '.product-hover > a',
            label: 'DETAIL',
        });

    

        await enqueueLinks({            
            selector: '.bottom-pagination > a',
            label: 'LIST',
        });
    }
}
    // Uncomment this option to see the browser window.
    // headless: false,
});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://www.glisshop.com/ski/pack-ski-fix/homme/']);
