"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const axios_1 = require("../utils/axios");
const axios_2 = require("axios");
const cheerio_1 = require("cheerio");
function scrapedMangaGenre(genreName_1) {
    return __awaiter(this, arguments, void 0, function* (genreName, page = 1) {
        var _a, _b;
        const res = {
            mangaCategory: [],
            currentChapters: [],
            totalEntities: '',
            genreName,
            currentPage: page,
            hasNextPage: false,
            totalPages: 1
        };
        try {
            // puppeteer.use(StealthPlugin());
            // const browser = await puppeteer.launch({
            //     headless: true,
            //     args: [' --no-sandbox', '--disable-setuid-sandbox', '--dns-prefetch-disable'],
            //     ignoreDefaultArgs: ['--disable-extensions']
            // });
            // const page = await browser.newPage();
            // await page.setJavaScriptEnabled(true);
            // await page.setUserAgent(
            //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            // );
            // await page.setDefaultNavigationTimeout(20000);
            // await page.goto(SRC_HOME_URL, { waitUntil: 'networkidle2' });
            // const content = await page.content();
            // await browser.close();
            const content = yield axios_1.client.get(`/genre/${genreName}?page=${page}`);
            const $ = (0, cheerio_1.load)(content.data);
            const totalMangaText = $('section.mt-5 > .head > span').text().trim();
            res.totalEntities = totalMangaText;
            const totalMangaMatch = totalMangaText.match(/(\d{1,3}(,\d{3})*)/);
            const totalManga = totalMangaMatch ? parseInt(totalMangaMatch[0].replace(/,/g, '')) : 0;
            const mangaOnPage = $('div.original.card-lg > div.unit').length;
            let totalPages = 1;
            if (totalManga > 0 && mangaOnPage > 0) {
                totalPages = Math.ceil(totalManga / mangaOnPage);
            }
            else if ($('div.original.card-lg > div.unit').length > 0) {
                totalPages = 1;
            }
            res.totalPages = totalPages;
            res.hasNextPage = page < totalPages;
            $('div.original.card-lg > div.unit').each((i, el) => {
                var _a, _b;
                const manga = {
                    id: ((_a = $(el).find('a.poster').attr('href')) === null || _a === void 0 ? void 0 : _a.replace('/manga/', '')) || null,
                    title: $(el).find('div.info > a').text().trim() || null,
                    poster: ((_b = $(el).find('a.poster > div > img').attr('src')) === null || _b === void 0 ? void 0 : _b.trim()) || null,
                    type: $(el).find('div.info > div > span.type').text().trim() || null,
                    chapters: [],
                };
                $(el).find('ul.content[data-name="chap"] > li').each((i, chapEl) => {
                    var _a;
                    const chapter = {
                        url: $(chapEl).find('a').attr('href') || null,
                        title: $(chapEl).find('a').attr('title') || null,
                        chapter: $(chapEl).find('a > span:first-child').text().trim() || null,
                        releaseDate: $(chapEl).find('a > span:last-child').text().trim() || null,
                    };
                    (_a = manga.chapters) === null || _a === void 0 ? void 0 : _a.push(chapter);
                });
                res.mangaCategory.push(manga);
            });
            return res;
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError) {
                throw (0, http_errors_1.default)(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || 500, ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.statusText) || 'Something went wrong');
            }
            throw http_errors_1.default.InternalServerError(err === null || err === void 0 ? void 0 : err.message);
        }
        // or handle the error in a different way
    });
}
exports.default = scrapedMangaGenre;
