import { prisma } from "./client.ts";

const DEMO_EMAIL = "alice@example.org";
const DEMO_PASSWORD = "Passw0rd!";

const FAVORITES = [603, 27205, 155];
const WATCHED = [603, 27205, 155, 680, 13];
const RATINGS: Record<number, number> = { 603: 5, 27205: 4, 680: 5, 13: 3 };

async function upsertContract(tmdbId: number) {
  return prisma.contract.upsert({ where: { tmdbId }, update: {}, create: { tmdbId } });
}

async function main() {
  const password = await Bun.password.hash(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { password },
    create: { email: DEMO_EMAIL, password },
  });

  await prisma.$transaction([
    prisma.favorite.deleteMany({ where: { userId: user.id } }),
    prisma.watched.deleteMany({ where: { userId: user.id } }),
    prisma.rating.deleteMany({ where: { userId: user.id } }),
    prisma.refreshToken.deleteMany({ where: { userId: user.id } }),
  ]);

  const tmdbIds = new Set([...FAVORITES, ...WATCHED, ...Object.keys(RATINGS).map(Number)]);
  const contracts = new Map<number, string>();
  for (const tmdbId of tmdbIds) {
    contracts.set(tmdbId, (await upsertContract(tmdbId)).id);
  }
  const contractId = (tmdbId: number) => contracts.get(tmdbId)!;

  await prisma.favorite.createMany({
    data: FAVORITES.map((tmdbId) => ({ userId: user.id, contractId: contractId(tmdbId) })),
  });
  await prisma.watched.createMany({
    data: WATCHED.map((tmdbId) => ({ userId: user.id, contractId: contractId(tmdbId) })),
  });
  await prisma.rating.createMany({
    data: Object.entries(RATINGS).map(([tmdbId, rating]) => ({
      userId: user.id,
      contractId: contractId(Number(tmdbId)),
      rating,
    })),
  });

  console.log(
    `Seeded ${DEMO_EMAIL} with ${FAVORITES.length} favorites, ${WATCHED.length} watched, ${Object.keys(RATINGS).length} ratings.`,
  );
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
