import { prisma } from "database";

export default async function Home() {
  const userCount = await prisma.user.count();
  return (
    <main style={{ padding: "2rem" }}>
      <p>Users in database: {userCount}</p>
    </main>
  );
}