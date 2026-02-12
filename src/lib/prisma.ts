import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const getPrisma = () => {
  // 이미 초기화된 경우 반환
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  // 빌드 단계에서의 정적 분석 시 DATABASE_URL이 없으면 프록시 반환
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  const hasDbUrl = !!process.env.DATABASE_URL;

  if (isBuildPhase && !hasDbUrl) {
    console.log('Skipping Prisma initialization during build phase (missing DATABASE_URL)');
    return new Proxy({} as any, {
      get: (_, prop) => {
        // common methods
        if (prop === 'then') return undefined;
        return () => Promise.resolve(null);
      }
    });
  }

  try {
    const client = new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
    return client;
  } catch (error) {
    if (isBuildPhase) {
      console.warn('Prisma initialization failed during build, returning mock client');
      return new Proxy({} as any, { get: () => () => Promise.resolve(null) });
    }
    throw error;
  }
};

export const prisma = getPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
