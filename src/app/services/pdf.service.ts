
import { Warning } from '../errors';
import puppeteer from 'puppeteer';


export class PdfService {

  generatePdf = async (html: string): Promise<Buffer> => {
    try {

      const browser = await puppeteer.launch({
        executablePath: process.env.CHROME_BIN,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ],
        headless: true,
        timeout: 60000
      });

      const page = await browser.newPage();

      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({ format: 'A4' });
      await browser.close();

      return Buffer.from(pdfBuffer);
    } catch (error) {
      throw new Warning("Error generating PDF", 500);
    }
  }
}
