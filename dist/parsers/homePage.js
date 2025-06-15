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
function scrapeHomePage() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const res = {
            releasingManga: [],
            mostViewedManga: {
                day: [],
                week: [],
                month: []
            },
            recentlyUpdatedManga: [],
            newReleaseManga: []
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
            const content = yield axios_1.client.get('/home');
            const $ = (0, cheerio_1.load)(content.data);
            const releasingManga = '#top-trending .container .swiper .swiper-wrapper .swiper-slide';
            const mostViewedMangaDay = '#most-viewed .tab-content[data-name="day"] .swiper-slide.unit';
            const mostViewedMangaWeek = '#most-viewed .tab-content[data-name="week"] .swiper-slide.unit';
            const mostViewedMangaMonth = '#most-viewed .tab-content[data-name="month"] .swiper-slide.unit';
            const recentlyUpdatedManga = '.tab-content[data-name="all"] .unit';
            const newReleaseManga = ' .swiper-container .swiper.completed  .card-md .swiper-slide.unit';
            $(releasingManga).each((i, el) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                res.releasingManga.push({
                    id: ((_a = $(el).find('.info .above a')) === null || _a === void 0 ? void 0 : _a.attr('href')) || null,
                    status: ((_c = (_b = $(el).find('.info .above span')) === null || _b === void 0 ? void 0 : _b.text()) === null || _c === void 0 ? void 0 : _c.trim()) || null,
                    name: ((_e = (_d = $(el).find('.info .above a')) === null || _d === void 0 ? void 0 : _d.text()) === null || _e === void 0 ? void 0 : _e.trim()) || null, // Extracting the text instead of assigning the Cheerio object
                    description: ((_g = (_f = $(el).find('.info .below span')) === null || _f === void 0 ? void 0 : _f.text()) === null || _g === void 0 ? void 0 : _g.trim()) || null,
                    currentChapter: ((_j = (_h = $(el).find('.info .below p')) === null || _h === void 0 ? void 0 : _h.text()) === null || _j === void 0 ? void 0 : _j.trim()) || null,
                    genres: ((_k = $(el)
                        .find('.info .below div a')) === null || _k === void 0 ? void 0 : _k.map((i, el) => $(el).text().trim()).get()) || null,
                    poster: ((_m = (_l = $(el).find('.swiper-inner a div img')) === null || _l === void 0 ? void 0 : _l.attr('src')) === null || _m === void 0 ? void 0 : _m.trim()) || null
                });
            });
            $(mostViewedMangaDay).each((i, el) => {
                var _a, _b, _c, _d, _e, _f, _g;
                res.mostViewedManga.day.push({
                    id: ((_a = $(el).find('.swiper-slide    a')) === null || _a === void 0 ? void 0 : _a.attr('href')) || null,
                    name: ((_c = (_b = $(el).find('.swiper-slide    a span')) === null || _b === void 0 ? void 0 : _b.text()) === null || _c === void 0 ? void 0 : _c.trim()) || null,
                    rank: ((_e = (_d = $(el).find('.swiper-slide    a b')) === null || _d === void 0 ? void 0 : _d.text()) === null || _e === void 0 ? void 0 : _e.trim()) || null,
                    poster: ((_g = (_f = $(el).find('.swiper-slide    a .poster img')) === null || _f === void 0 ? void 0 : _f.attr('src')) === null || _g === void 0 ? void 0 : _g.trim()) || null
                });
            });
            $(mostViewedMangaWeek).each((i, el) => {
                var _a, _b, _c, _d, _e, _f, _g;
                res.mostViewedManga.week.push({
                    id: ((_a = $(el).find('.swiper-slide    a')) === null || _a === void 0 ? void 0 : _a.attr('href')) || null,
                    name: ((_c = (_b = $(el).find('.swiper-slide    a span')) === null || _b === void 0 ? void 0 : _b.text()) === null || _c === void 0 ? void 0 : _c.trim()) || null,
                    rank: ((_e = (_d = $(el).find('.swiper-slide    a b')) === null || _d === void 0 ? void 0 : _d.text()) === null || _e === void 0 ? void 0 : _e.trim()) || null,
                    poster: ((_g = (_f = $(el).find('.swiper-slide    a .poster img')) === null || _f === void 0 ? void 0 : _f.attr('src')) === null || _g === void 0 ? void 0 : _g.trim()) || null
                });
            });
            $(mostViewedMangaMonth).each((i, el) => {
                var _a, _b, _c, _d, _e, _f, _g;
                res.mostViewedManga.month.push({
                    id: ((_a = $(el).find('.swiper-slide  a')) === null || _a === void 0 ? void 0 : _a.attr('href')) || null,
                    name: ((_c = (_b = $(el).find('.swiper-slide a span')) === null || _b === void 0 ? void 0 : _b.text()) === null || _c === void 0 ? void 0 : _c.trim()) || null,
                    rank: ((_e = (_d = $(el).find('.swiper-slide  a b')) === null || _d === void 0 ? void 0 : _d.text()) === null || _e === void 0 ? void 0 : _e.trim()) || null,
                    poster: ((_g = (_f = $(el).find('.swiper-slide  a .poster img')) === null || _f === void 0 ? void 0 : _f.attr('src')) === null || _g === void 0 ? void 0 : _g.trim()) || null
                });
            });
            $(recentlyUpdatedManga).each((i, el) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                res.recentlyUpdatedManga.push({
                    id: ((_a = $(el).find('.inner  a')) === null || _a === void 0 ? void 0 : _a.attr('href')) || null,
                    name: ((_c = (_b = $(el).find('.swiper-slide a span')) === null || _b === void 0 ? void 0 : _b.text()) === null || _c === void 0 ? void 0 : _c.trim()) || null,
                    poster: ((_e = (_d = $(el).find('.inner  a img')) === null || _d === void 0 ? void 0 : _d.attr('src')) === null || _e === void 0 ? void 0 : _e.trim()) || null,
                    type: ((_g = (_f = $(el).find('.inner .info div .type  ')) === null || _f === void 0 ? void 0 : _f.text()) === null || _g === void 0 ? void 0 : _g.trim()) || null,
                    latestChapters: ((_h = $(el)
                        .find('.info .content[data-name="chap"] li')) === null || _h === void 0 ? void 0 : _h.map((i, el) => ({
                        chapterName: $(el).find('span').first().text().trim(),
                        releaseTime: $(el).find('span').last().text().trim()
                    })).get()) || null
                });
            });
            $(newReleaseManga).each((i, el) => {
                var _a, _b, _c, _d, _e;
                res.newReleaseManga.push({
                    id: ((_a = $(el).find('a')) === null || _a === void 0 ? void 0 : _a.attr('href')) || null,
                    name: ((_c = (_b = $(el).find('a span')) === null || _b === void 0 ? void 0 : _b.text()) === null || _c === void 0 ? void 0 : _c.trim()) || null,
                    poster: ((_e = (_d = $(el).find('a .poster img')) === null || _d === void 0 ? void 0 : _d.attr('src')) === null || _e === void 0 ? void 0 : _e.trim()) || null
                });
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
exports.default = scrapeHomePage;
