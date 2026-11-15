import { PrismaClient } from '@prisma/client';
import { createSupabaseRestModelDelegate } from './supabase-rest-db';

const DEFAULT_SUPABASE_DB_URL =
  'postgresql://duraes_admin:DuraesMoveis2026DbPass@db.wsyskajeudzjffkihciz.supabase.co:5432/postgres';

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && (envUrl.startsWith('postgresql://') || envUrl.startsWith('postgres://'))) {
    return envUrl;
  }
  return DEFAULT_SUPABASE_DB_URL;
}

const resolvedDbUrl = getDatabaseUrl();
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
  process.env.DATABASE_URL = resolvedDbUrl;
}

const MODEL_NAMES = new Set([
  'user',
  'address',
  'category',
  'product',
  'productImage',
  'productVariant',
  'cart',
  'cartItem',
  'order',
  'orderItem',
  'orderStatusHistory',
  'payment',
  'review',
  'coupon',
  'favorite',
  'banner',
  'storeSetting',
]);

// Na Vercel (ambiente IPv4-only), o host direto db.<ref>.supabase.co resolve apenas em IPv6.
// Nesses casos (ou caso ocorra erro de rede TCP), utilizamos automaticamente a API oficial
// PostgREST HTTPS (IPv4/IPv6) conectada ao mesmo banco PostgreSQL do Supabase.
let preferRestOverIpv6 = Boolean(
  process.env.VERCEL && resolvedDbUrl.includes('db.wsyskajeudzjffkihciz.supabase.co')
);

function isConnectionError(err: unknown): boolean {
  if (!err) return false;
  const msg = String((err as Error)?.message || err);
  const name = String((err as Error)?.name || '');
  return (
    name.includes('PrismaClientInitializationError') ||
    msg.includes("Can't reach database server") ||
    msg.includes('ENOTFOUND') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('ENETUNREACH') ||
    msg.includes('EHOSTUNREACH')
  );
}

function createHybridPrismaClient(rawClient: PrismaClient): PrismaClient {
  const restDelegates = new Map<string, ReturnType<typeof createSupabaseRestModelDelegate>>();

  function getRestDelegate(modelName: string) {
    let d = restDelegates.get(modelName);
    if (!d) {
      d = createSupabaseRestModelDelegate(modelName);
      restDelegates.set(modelName, d);
    }
    return d;
  }

  const proxy = new Proxy(rawClient, {
    get(target, prop, receiver) {
      if (prop === '$transaction') {
        return async (arg: unknown) => {
          if (preferRestOverIpv6) {
            if (typeof arg === 'function') {
              return (arg as (tx: unknown) => Promise<unknown>)(proxy);
            }
            if (Array.isArray(arg)) {
              return Promise.all(arg);
            }
          }
          try {
            if (typeof arg === 'function') {
              return await target.$transaction(arg as (tx: PrismaClient) => Promise<unknown>);
            }
            if (Array.isArray(arg)) {
              return await target.$transaction(arg as never);
            }
          } catch (err) {
            if (isConnectionError(err)) {
              preferRestOverIpv6 = true;
              if (typeof arg === 'function') {
                return (arg as (tx: unknown) => Promise<unknown>)(proxy);
              }
              if (Array.isArray(arg)) {
                return Promise.all(arg);
              }
            }
            throw err;
          }
        };
      }

      if (typeof prop === 'string' && MODEL_NAMES.has(prop)) {
        const origModel = Reflect.get(target, prop, receiver) as Record<string, (...a: unknown[]) => Promise<unknown>>;
        const restModel = getRestDelegate(prop) as unknown as Record<string, (...a: unknown[]) => Promise<unknown>>;

        return new Proxy(origModel, {
          get(mTarget, mProp) {
            if (typeof mProp === 'string' && mProp in restModel) {
              return async (...args: unknown[]) => {
                if (preferRestOverIpv6) {
                  return restModel[mProp](...args);
                }
                try {
                  return await mTarget[mProp](...args);
                } catch (err) {
                  if (isConnectionError(err)) {
                    preferRestOverIpv6 = true;
                    return restModel[mProp](...args);
                  }
                  throw err;
                }
              };
            }
            return Reflect.get(mTarget, mProp);
          },
        });
      }

      const val = Reflect.get(target, prop, receiver);
      return typeof val === 'function' ? val.bind(target) : val;
    },
  });

  return proxy;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const rawPrismaClient =
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedDbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

export const prisma = globalForPrisma.prisma ?? createHybridPrismaClient(rawPrismaClient);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
