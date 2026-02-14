import mockData from "../mock.json";
import prisma from "@/lib/prisma";


async function main() {
    for (const item of mockData) {
        await prisma.topicSearch.create({
            data: {
                id: item.id,
                topic: item.topic,
            }
        })
    }
}

main()
    .then(() => {prisma.$disconnect()
})
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
