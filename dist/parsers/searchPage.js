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
exports.scrapeSearchResults = void 0;
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
const http_errors_1 = __importDefault(require("http-errors"));
const axios_2 = require("../utils/axios");
const scrapeSearchResults = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1) {
    var _a, _b;
    const res = {
        currentPage: page,
        totalPages: 0,
        results: [],
    };
    try {
        const content = yield axios_2.client.get(`/filter?keyword=${keyword}&page=${page}`);
        const $ = (0, cheerio_1.load)(content.data);
        let totalPages = 0;
        const pageLinks = $('ul.pagination > li.page-item > a');
        if (pageLinks.length > 0) {
            pageLinks.each((i, el) => {
                const pageNum = parseInt($(el).text());
                if (!isNaN(pageNum) && pageNum > totalPages) {
                    totalPages = pageNum;
                }
            });
        }
        if (totalPages === 0) {
            const totalMangasText = $('section.mt-5 > .head > span').text();
            const totalMangas = parseInt(totalMangasText.replace('mangas', '').trim());
            const resultsOnPage = $('div.original.card-lg > div.unit').length;
            if (!isNaN(totalMangas) && resultsOnPage > 0) {
                totalPages = Math.ceil(totalMangas / resultsOnPage);
            }
            else if (!isNaN(totalMangas) && totalMangas === 0) {
                totalPages = 0;
            }
            else {
                totalPages = 1;
            }
        }
        res.totalPages = totalPages;
        $('div.original.card-lg > div.unit').each((i, el) => {
            var _a, _b;
            const searchResult = {
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
                (_a = searchResult.chapters) === null || _a === void 0 ? void 0 : _a.push(chapter);
            });
            res.results.push(searchResult);
        });
        return res;
    }
    catch (err) {
        if (err instanceof axios_1.AxiosError) {
            throw (0, http_errors_1.default)(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || 500, ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.statusText) || 'Something went wrong');
        }
        throw http_errors_1.default.InternalServerError(err === null || err === void 0 ? void 0 : err.message);
    }
});
exports.scrapeSearchResults = scrapeSearchResults;
