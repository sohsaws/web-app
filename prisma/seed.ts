import mockData from "../mock.json";
import prisma from "@/lib/prisma"

async function Seed() {
    for (const item of mockData) {
        await prisma.topicSearch.create({
            data: {
                id: String(item.id),
                topic: item.topic,
            }
        })
    }
    console.log({mockData});
}

Seed()
    .then(async () => prisma.$disconnect())
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1);
    })
