import { prisma } from "../index";

async function main() {
  await prisma.user.upsert({
    where: { email: "rashel@kaeru.local" },
    update: {},
    create: { email: "rashel@kaeru.local", name: "Rashel H." },
  });
  console.log("Seeded demo user");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());