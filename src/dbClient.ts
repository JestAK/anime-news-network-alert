import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

type NewsObj = {
    title: string,
    imageSrc: string,
    description: string,
    originalSrc: string,
}


export async function addNews (newsObj: NewsObj, messageId: string){
    try{
        console.log("Adding News to DB")
        await prisma.$connect()

        const news = await prisma.news.create({
            data: {
                title: newsObj.title,
                imageSrc: newsObj.imageSrc,
                description: newsObj.description,
                originalSrc: newsObj.originalSrc,
                date: new Date(),
                messageId: messageId
            }
        })

        await prisma.$disconnect()

        console.log("News has been added")
        return news
    }
    catch(error){
      console.log(error)
        return false
    }
}

export async function setStatus(status: boolean, messageId: string){
    try{
        console.log(`Updating news with ${messageId} to status ${status}`)
        await prisma.$connect()
        const news = await prisma.news.update({
            // @ts-ignore
            where: {
                messageId: messageId
            },
            data: {
                approved: status
            }
        })

        await prisma.$disconnect()

        return news
    }
    catch(error){
        console.log(error)
        return false
    }
}

export async function getDateRangeList(startDate: Date, endDate: Date){
    try {
        await prisma.$connect()

        const newsList: any[] = []

        const dataList = await prisma.news.findMany({
            where: {
                date: {
                    lte: new Date(endDate),
                    gte: new Date(startDate),
                },
                approved: true
            }
        })

        await prisma.$disconnect()

        dataList.forEach((item) => {
            newsList.push({
                title: item.title,
                description: `${item.description}\n\n Щотижневі новини з ${new Date(startDate).toLocaleDateString('en-GB')} до ${new Date(endDate).toLocaleDateString('en-GB')}`,
                imgSrc: item.imageSrc,
                src: item.originalSrc
            })
        })

        return newsList
    }
    catch (error){
        console.log(error)
        return []
    }
}