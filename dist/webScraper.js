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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdate = void 0;
const axios_1 = require("axios");
const cheerio = require("cheerio");
let lastNews = {
    imgSrc: '',
    title: '',
    description: '',
    src: 'https://example.com',
};
function getUpdate(targetUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        // Function to fetch HTML content from the target website
        const fetchWebsiteContent = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(targetUrl);
                return response.data;
            }
            catch (error) {
                console.error('Error fetching website content:', error);
                return null;
            }
        });
        const getNews = () => __awaiter(this, void 0, void 0, function* () {
            const fetchedData = yield fetchWebsiteContent();
            const $ = cheerio.load(fetchedData);
            const newsBlocks = $('[data-topics*="news"][data-topics*="anime"]');
            let newsObjArray = [];
            newsBlocks.each((index, element) => {
                const src = `${targetUrl}${$(element).find('.thumbnail > a ').attr('href')}`;
                const imgSrc = `${targetUrl}${$(element).find('.thumbnail').attr('data-src')}`;
                const title = $(element).find('.wrap h3 a').contents().map(function () {
                    return $(this).text();
                }).get().join('').trim();
                const description = $(element).find('.wrap .snippet').contents().map(function () {
                    return $(this).text();
                }).get().join('').trim();
                const newsObj = {
                    imgSrc,
                    title,
                    description,
                    src,
                };
                if (isUpdated(src, lastNews.src)) {
                    newsObjArray.push(newsObj);
                    lastNews.src = newsObjArray[0].src;
                }
                else {
                    return false;
                }
            });
            console.log(lastNews.src);
            console.log(newsObjArray);
            return newsObjArray;
        });
        // Function to compare current and previous content
        const isUpdated = (currentContent, previousContent) => {
            if (currentContent !== previousContent) {
                previousContent = currentContent;
                return true;
            }
            else {
                return false;
            }
        };
        return getNews();
    });
}
exports.getUpdate = getUpdate;
