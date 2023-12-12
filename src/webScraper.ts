import axios from 'axios';
import * as cheerio from 'cheerio';


let lastNews = {
    imgSrc: '',
    title: '',
    description: '',
    src: 'https://example.com',
}

export async function getUpdate(targetUrl: string){

// Function to fetch HTML content from the target website
    const fetchWebsiteContent = async () => {
        try {
            const response = await axios.get(targetUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching website content:', error);
            return null;
        }
    };

    const getNews = async () => {
        const fetchedData = await fetchWebsiteContent()
        const $ = cheerio.load(fetchedData)
        const newsBlocks = $('[data-topics*="news"][data-topics*="anime"]')
        let newsObjArray:any[] = []

        newsBlocks.each((index, element) => {
            const src = `${targetUrl}${$(element).find('.thumbnail > a ').attr('href')}`
            const imgSrc = `${targetUrl}${$(element).find('.thumbnail').attr('data-src')}`
            const title = $(element).find('.wrap h3 a').contents().map(function() {
                return $(this).text();
            }).get().join('').trim()
            const description = $(element).find('.wrap .snippet').contents().map(function() {
                return $(this).text();
            }).get().join('').trim()

            const newsObj = {
                imgSrc,
                title,
                description,
                src,
            }

            if (isUpdated(src, lastNews.src)){
                newsObjArray.push(newsObj)
                lastNews.src = newsObjArray[0].src
            }
            else {
                return false
            }
        })

        console.log(lastNews.src)
        console.log(newsObjArray)
        return newsObjArray
    }

// Function to compare current and previous content
    const isUpdated = (currentContent:string, previousContent:string) => {

        if (currentContent !== previousContent) {
            previousContent = currentContent;
            return true;
        } else {
            return false;
        }
    };

    return getNews()
}