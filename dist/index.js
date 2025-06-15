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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const homePage_1 = __importDefault(require("./parsers/homePage"));
const infoPage_1 = __importDefault(require("./parsers/infoPage"));
const searchPage_1 = require("./parsers/searchPage");
const categoryPage_1 = __importDefault(require("./parsers/categoryPage"));
const manga_1 = require("./types/manga");
const genrePage_1 = __importDefault(require("./parsers/genrePage"));
const readPage_1 = require("./parsers/readPage");
const latestPage_1 = __importDefault(require("./parsers/latestPage"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('MangaFire API is running!');
});
app.get('/api/home', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, homePage_1.default)();
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}));
app.get('/api/search/:keyword', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyword = req.params.keyword;
        const page = req.query.page ? Number(req.query.page) : 1;
        const data = yield (0, searchPage_1.scrapeSearchResults)(keyword, page);
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
app.get('/api/category/:category', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = req.params.category;
        const page = req.query.page ? Number(req.query.page) : 1;
        const validCategories = ['manga', 'one-shot', 'doujinshi', 'novel', 'manhwa', 'manhua'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        const data = yield (0, categoryPage_1.default)(category, page);
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
app.get('/api/genre/:genre', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genre = req.params.genre;
        const page = req.query.page ? Number(req.query.page) : 1;
        if (!manga_1.MANGA_GENRES.includes(genre)) {
            return res.status(400).json({ error: 'Invalid genre' });
        }
        const data = yield (0, genrePage_1.default)(genre, page);
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
app.get('/api/manga/:id/chapters/:lng', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, lng } = req.params;
        const chaptersResult = yield (0, readPage_1.getChapters)(id, lng);
        const scrapedChaptersResult = yield (0, readPage_1.scrapeChaptersFromInfoPage)(id);
        if (!Array.isArray(chaptersResult)) {
            return next(chaptersResult);
        }
        if (!Array.isArray(scrapedChaptersResult)) {
            return next(scrapedChaptersResult);
        }
        const chapters = chaptersResult;
        const scrapedChapters = scrapedChaptersResult;
        const data = chapters.map((chapter, index) => {
            const scrapedChapter = scrapedChapters[index];
            return Object.assign(Object.assign({}, chapter), { title: (scrapedChapter === null || scrapedChapter === void 0 ? void 0 : scrapedChapter.title) || chapter.title, releaseDate: (scrapedChapter === null || scrapedChapter === void 0 ? void 0 : scrapedChapter.releaseDate) || chapter.releaseDate });
        });
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
app.get('/api/chapter/:chapterId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapterId = req.params.chapterId;
        const data = yield (0, readPage_1.getChapterImages)(chapterId);
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
app.get('/api/manga/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = yield (0, infoPage_1.default)(id);
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
// Error handling middleware
app.get('/api/:pageType', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageType } = req.params;
        const page = req.query.page || '1';
        if (pageType !== 'updated' && pageType !== 'newest' && pageType !== 'added') {
            throw (0, http_errors_1.default)(400, 'Invalid page type');
        }
        const data = yield (0, latestPage_1.default)(pageType, Number(page));
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
// Image proxy endpoint to handle CORS issues
app.get('/proxy-image', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = req.query;
        if (!url || typeof url !== 'string') {
            throw (0, http_errors_1.default)(400, 'Image URL is required');
        }
        // Fetch the image with proper headers
        const response = yield axios_1.default.get(url, {
            responseType: 'stream',
            headers: {
                'Referer': 'https://mangafire.to/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        // Set appropriate headers
        res.set({
            'Content-Type': response.headers['content-type'] || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            'Access-Control-Allow-Origin': '*',
        });
        // Pipe the image data
        response.data.pipe(res);
    }
    catch (err) {
        next(err);
    }
}));
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status || 500,
        },
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
