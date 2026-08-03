import prisma from "@/lib/prisma";
import mockData from "../mock.json";

async function main() {
  for (const item of mockData) {
    await prisma.topicSearch.create({
      data: {
        id: item.id,
        topic: item.topic.toLowerCase(),
      },
    });
  }
}

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
