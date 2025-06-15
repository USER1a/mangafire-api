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
function scrapeMangaInfo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const res = {
            mangaInfo: {
                title: null,
                altTitles: null,
                poster: null,
                status: null,
                type: null,
                description: null,
                author: null,
                published: null,
                genres: [],
                rating: null,
                chapters: [],
            },
            relatedManga: [],
            similarManga: [],
        };
        try {
            const content = yield axios_1.client.get(`/manga/${id}`);
            const $ = (0, cheerio_1.load)(content.data);
            const mangaInfo = {
                title: $('h1[itemprop="name"]').text().trim(),
                altTitles: $('h1[itemprop="name"]').siblings('h6').text().trim(),
                poster: ((_b = (_a = $('.poster img')) === null || _a === void 0 ? void 0 : _a.attr('src')) === null || _b === void 0 ? void 0 : _b.trim()) || null,
                status: $('.info > p').first().text().trim(),
                type: $('.min-info a').first().text().trim(),
                description: $('.description').text().replace('Read more +', '').trim(),
                author: $('.meta div:contains("Author:") a').text().trim(),
                published: $('.meta div:contains("Published:")').text().replace('Published:', '').trim(),
                genres: $('.meta div:contains("Genres:") a').map((i, el) => $(el).text().trim()).get(),
                rating: $('.rating-box .live-score').text().trim(),
            };
            // Scraping Similar Manga (Trending)
            $('section.side-manga.default-style div.original.card-sm.body a.unit').each((i, el) => {
                var _a, _b;
                const manga = {
                    id: ((_a = $(el).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/').pop()) || null,
                    name: $(el).find('.info h6').text().trim() || null,
                    poster: ((_b = $(el).find('.poster img').attr('src')) === null || _b === void 0 ? void 0 : _b.trim()) || null,
                };
                res.similarManga.push(manga);
            });
            // NOTE: The provided HTML does not contain a "Related Manga" section.
            // The "Trending" section is being used for "Similar Manga".
            res.mangaInfo = mangaInfo;
            return res;
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError) {
                throw (0, http_errors_1.default)(((_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.status) || 500, ((_d = err === null || err === void 0 ? void 0 : err.response) === null || _d === void 0 ? void 0 : _d.statusText) || 'Something went wrong');
            }
            throw http_errors_1.default.InternalServerError(err === null || err === void 0 ? void 0 : err.message);
        }
    });
}
exports.default = scrapeMangaInfo;
