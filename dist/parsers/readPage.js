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
exports.getChapters = getChapters;
exports.getChapterImages = getChapterImages;
exports.scrapeChaptersFromInfoPage = scrapeChaptersFromInfoPage;
const http_errors_1 = __importDefault(require("http-errors"));
const axios_1 = require("../utils/axios");
const axios_2 = require("axios");
const cheerio_1 = require("cheerio");
function getChapters(mangaId_1) {
    return __awaiter(this, arguments, void 0, function* (mangaId, language = "en") {
        var _a, _b;
        try {
            const response = yield axios_1.client.get(`/ajax/read/${mangaId.split(".")[1]}/chapter/${language.toLowerCase()}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            const responseJson = response.data;
            const $ = (0, cheerio_1.load)(responseJson.result.html);
            const chapters = [];
            $("li").each((_, li) => {
                var _a, _b;
                const a = $(li).find("a");
                const title = a.find('span:first-child').text().trim();
                const releaseDate = a.find('span:last-child').text().trim();
                chapters.push({
                    number: (_a = $(a).attr("data-number")) !== null && _a !== void 0 ? _a : "",
                    title: title,
                    chapterId: (_b = $(a).attr("data-id")) !== null && _b !== void 0 ? _b : "",
                    language: language,
                    releaseDate: releaseDate || null
                });
            });
            return chapters;
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError) {
                throw (0, http_errors_1.default)(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || 500, ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.statusText) || 'Something went wrong');
            }
            throw http_errors_1.default.InternalServerError(err === null || err === void 0 ? void 0 : err.message);
        }
    });
}
function getChapterImages(chapterId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const response = yield axios_1.client.get(`/ajax/read/chapter/${chapterId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            const responseJson = response.data;
            return responseJson.result.images.map((image) => image[0]);
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError) {
                throw (0, http_errors_1.default)(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || 500, ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.statusText) || 'Something went wrong');
            }
            throw http_errors_1.default.InternalServerError(err === null || err === void 0 ? void 0 : err.message);
        }
    });
}
function scrapeChaptersFromInfoPage(mangaSlug) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const content = yield axios_1.client.get(`/manga/${mangaSlug}`);
            const $ = (0, cheerio_1.load)(content.data);
            const chapters = [];
            $('ul.scroll-sm li.item').each((i, el) => {
                const chapter = {
                    url: $(el).find('a').attr('href') || null,
                    title: $(el).find('a').attr('title') || null,
                    chapter: $(el).find('a > span:first-child').text().trim() || null,
                    releaseDate: $(el).find('a > span:last-child').text().trim() || null,
                };
                chapters.push(chapter);
            });
            return chapters;
        }
        catch (err) {
            if (err instanceof axios_2.AxiosError) {
                throw (0, http_errors_1.default)(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || 500, ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.statusText) || 'Something went wrong');
            }
            throw http_errors_1.default.InternalServerError(err === null || err === void 0 ? void 0 : err.message);
        }
    });
}
