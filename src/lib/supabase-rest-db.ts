import crypto from 'crypto';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wsyskajeudzjffkihciz.supabase.co';

const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeXNrYWpldWR6amZma2loY2l6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDcwOTA1NCwiZXhwIjoyMTEwMjg1MDU0fQ.cHPfYHfccejVbB7XKkEs0gK6JUD3b2voPACXnr0uT5c';

const MODEL_TO_TABLE: Record<string, string> = {
  user: 'User',
  address: 'Address',
  category: 'Category',
  product: 'Product',
  productImage: 'ProductImage',
  productVariant: 'ProductVariant',
  cart: 'Cart',
  cartItem: 'CartItem',
  order: 'Order',
  orderItem: 'OrderItem',
  orderStatusHistory: 'OrderStatusHistory',
  payment: 'Payment',
  review: 'Review',
  coupon: 'Coupon',
  favorite: 'Favorite',
  banner: 'Banner',
  storeSetting: 'StoreSetting',
};

const TABLES_WITH_UPDATED_AT = new Set([
  'User',
  'Address',
  'Category',
  'Product',
  'Cart',
  'CartItem',
  'Order',
  'Payment',
  'Coupon',
  'Banner',
  'StoreSetting',
]);

const TABLES_WITH_CREATED_AT = new Set([
  'User',
  'Address',
  'Category',
  'Product',
  'ProductImage',
  'ProductVariant',
  'Cart',
  'CartItem',
  'Order',
  'OrderStatusHistory',
  'Payment',
  'Review',
  'Coupon',
  'Favorite',
  'Banner',
]);

const DATE_FIELDS = new Set([
  'createdAt',
  'updatedAt',
  'paidAt',
  'validFrom',
  'validUntil',
]);

function generateCuid(): string {
  return 'c' + Date.now().toString(36) + crypto.randomBytes(8).toString('hex');
}

function reviveDates<T>(row: T): T {
  if (!row || typeof row !== 'object') return row;
  const copy: Record<string, unknown> = { ...(row as Record<string, unknown>) };
  for (const key of Object.keys(copy)) {
    const val = copy[key];
    if (DATE_FIELDS.has(key) && typeof val === 'string') {
      copy[key] = new Date(val);
    }
  }
  return copy as T;
}

async function restFetch(
  tablePath: string,
  options: RequestInit & { prefer?: string } = {}
): Promise<Response> {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${tablePath}`;
  const headers: Record<string, string> = {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...(options.prefer ? { Prefer: options.prefer } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase REST error (${res.status}) on ${tablePath}: ${text}`);
  }

  return res;
}

function matchesWhere(row: Record<string, unknown>, where?: Record<string, unknown>): boolean {
  if (!where || Object.keys(where).length === 0) return true;

  for (const [key, cond] of Object.entries(where)) {
    if (cond === undefined) continue;

    if (key === 'OR' && Array.isArray(cond)) {
      const anyMatch = cond.some((sub) => matchesWhere(row, sub as Record<string, unknown>));
      if (!anyMatch) return false;
      continue;
    }

    if (key === 'AND' && Array.isArray(cond)) {
      const allMatch = cond.every((sub) => matchesWhere(row, sub as Record<string, unknown>));
      if (!allMatch) return false;
      continue;
    }

    // Compound unique key e.g. userId_productId: { userId, productId }
    if (
      key.includes('_') &&
      cond &&
      typeof cond === 'object' &&
      !Array.isArray(cond) &&
      !(cond instanceof Date)
    ) {
      const subObj = cond as Record<string, unknown>;
      const subKeys = Object.keys(subObj);
      if (subKeys.length > 0 && subKeys.every((k) => k in row)) {
        if (!matchesWhere(row, subObj)) return false;
        continue;
      }
    }

    const val = row[key];

    if (
      cond &&
      typeof cond === 'object' &&
      !Array.isArray(cond) &&
      !(cond instanceof Date)
    ) {
      const ops = cond as Record<string, unknown>;
      if ('in' in ops && Array.isArray(ops.in)) {
        if (!ops.in.includes(val)) return false;
      }
      if ('not' in ops) {
        if (val === ops.not) return false;
      }
      if ('contains' in ops && typeof ops.contains === 'string') {
        const strVal = String(val ?? '').toLowerCase();
        if (!strVal.includes(ops.contains.toLowerCase())) return false;
      }
      if ('gt' in ops && typeof ops.gt === 'number') {
        if (!(Number(val) > ops.gt)) return false;
      }
      if ('gte' in ops && typeof ops.gte === 'number') {
        if (!(Number(val) >= ops.gte)) return false;
      }
      if ('lt' in ops && typeof ops.lt === 'number') {
        if (!(Number(val) < ops.lt)) return false;
      }
      if ('lte' in ops && typeof ops.lte === 'number') {
        if (!(Number(val) <= ops.lte)) return false;
      }
    } else {
      if (val !== cond) return false;
    }
  }

  return true;
}

function sortRows<T extends Record<string, unknown>>(
  rows: T[],
  orderBy?: Record<string, 'asc' | 'desc'> | Record<string, 'asc' | 'desc'>[]
): T[] {
  if (!orderBy) return rows;
  const orderList = Array.isArray(orderBy) ? orderBy : [orderBy];
  if (orderList.length === 0) return rows;

  return [...rows].sort((a, b) => {
    for (const ord of orderList) {
      for (const [field, dir] of Object.entries(ord)) {
        const va = a[field];
        const vb = b[field];
        if (va === vb) continue;
        const cmp =
          va instanceof Date && vb instanceof Date
            ? va.getTime() - vb.getTime()
            : typeof va === 'number' && typeof vb === 'number'
            ? va - vb
            : String(va ?? '').localeCompare(String(vb ?? ''));
        return dir === 'desc' ? -cmp : cmp;
      }
    }
    return 0;
  });
}

function applySelect(
  row: Record<string, unknown>,
  select?: Record<string, boolean>
): Record<string, unknown> {
  if (!select) return row;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(select)) {
    if (v && k in row) out[k] = row[k];
  }
  return out;
}

async function fetchTableRows(tableName: string, queryParams = ''): Promise<Record<string, unknown>[]> {
  const qs = queryParams ? `?${queryParams}` : '?select=*';
  const res = await restFetch(`${tableName}${qs}`);
  const data = (await res.json()) as Record<string, unknown>[];
  return data.map((r) => reviveDates(r));
}

async function preprocessWhere(
  tableName: string,
  where?: Record<string, unknown>
): Promise<Record<string, unknown> | undefined> {
  if (!where) return undefined;
  const cloned: Record<string, unknown> = { ...where };

  // Product.where.category = { slug: '...' }
  if (tableName === 'Product' && cloned.category && typeof cloned.category === 'object') {
    const catCond = cloned.category as Record<string, unknown>;
    delete cloned.category;
    const cats = await fetchTableRows('Category');
    const matchedCat = cats.find((c) => matchesWhere(c, catCond));
    cloned.categoryId = matchedCat ? matchedCat.id : '__none__';
  }

  // Payment.where.OR with { order: { orderNumber: '...' } }
  if (tableName === 'Payment' && Array.isArray(cloned.OR)) {
    const newOr: Record<string, unknown>[] = [];
    for (const item of cloned.OR as Record<string, unknown>[]) {
      if (item.order && typeof item.order === 'object') {
        const orders = await fetchTableRows('Order');
        const matchedOrder = orders.find((o) =>
          matchesWhere(o, item.order as Record<string, unknown>)
        );
        if (matchedOrder) {
          newOr.push({ orderId: matchedOrder.id });
        }
      } else {
        newOr.push(item);
      }
    }
    cloned.OR = newOr;
  }

  return cloned;
}

async function populateIncludes(
  tableName: string,
  rows: Record<string, unknown>[],
  include?: Record<string, unknown>
): Promise<Record<string, unknown>[]> {
  if (!include || rows.length === 0) return rows;

  const result = rows.map((r) => ({ ...r }));

  if (tableName === 'Product') {
    if (include.images) {
      const allImages = await fetchTableRows('ProductImage');
      const imgOpts = typeof include.images === 'object' ? (include.images as Record<string, unknown>) : {};
      for (const row of result) {
        let imgs = allImages.filter((img) => img.productId === row.id);
        if (imgOpts.where) imgs = imgs.filter((i) => matchesWhere(i, imgOpts.where as Record<string, unknown>));
        imgs = sortRows(imgs, (imgOpts.orderBy as Record<string, 'asc' | 'desc'>) || { displayOrder: 'asc' });
        if (typeof imgOpts.take === 'number') imgs = imgs.slice(0, imgOpts.take);
        row.images = imgs;
      }
    }
    if (include.variants) {
      const allVariants = await fetchTableRows('ProductVariant');
      const varOpts = typeof include.variants === 'object' ? (include.variants as Record<string, unknown>) : {};
      for (const row of result) {
        let vars = allVariants.filter((v) => v.productId === row.id);
        if (varOpts.where) vars = vars.filter((v) => matchesWhere(v, varOpts.where as Record<string, unknown>));
        if (varOpts.orderBy) vars = sortRows(vars, varOpts.orderBy as Record<string, 'asc' | 'desc'>);
        row.variants = vars;
      }
    }
    if (include.category) {
      const allCategories = await fetchTableRows('Category');
      const catMap = new Map(allCategories.map((c) => [c.id, c]));
      for (const row of result) {
        row.category = catMap.get(row.categoryId) || null;
      }
    }
    if (include.reviews) {
      const allReviews = await fetchTableRows('Review');
      const revOpts = typeof include.reviews === 'object' ? (include.reviews as Record<string, unknown>) : {};
      for (const row of result) {
        let revs = allReviews.filter((r) => r.productId === row.id);
        if (revOpts.where) revs = revs.filter((r) => matchesWhere(r, revOpts.where as Record<string, unknown>));
        revs = sortRows(revs, (revOpts.orderBy as Record<string, 'asc' | 'desc'>) || { createdAt: 'desc' });
        row.reviews = revs;
      }
    }
  }

  if (tableName === 'Category') {
    if (include._count) {
      const allProducts = await fetchTableRows('Product');
      for (const row of result) {
        const count = allProducts.filter((p) => p.categoryId === row.id).length;
        row._count = { products: count };
      }
    }
    if (include.products) {
      const allProducts = await fetchTableRows('Product');
      for (const row of result) {
        row.products = allProducts.filter((p) => p.categoryId === row.id);
      }
    }
  }

  if (tableName === 'Order') {
    if (include.items) {
      const allItems = await fetchTableRows('OrderItem');
      for (const row of result) {
        row.items = allItems.filter((i) => i.orderId === row.id);
      }
    }
    if (include.statusHistory) {
      const allHistory = await fetchTableRows('OrderStatusHistory');
      const histOpts =
        typeof include.statusHistory === 'object'
          ? (include.statusHistory as Record<string, unknown>)
          : {};
      for (const row of result) {
        let hist = allHistory.filter((h) => h.orderId === row.id);
        hist = sortRows(hist, (histOpts.orderBy as Record<string, 'asc' | 'desc'>) || { createdAt: 'desc' });
        row.statusHistory = hist;
      }
    }
    if (include.payment) {
      const allPayments = await fetchTableRows('Payment');
      for (const row of result) {
        row.payment = allPayments.find((p) => p.orderId === row.id) || null;
      }
    }
    if (include.user) {
      const allUsers = await fetchTableRows('User');
      for (const row of result) {
        row.user = allUsers.find((u) => u.id === row.userId) || null;
      }
    }
  }

  if (tableName === 'Payment') {
    if (include.order) {
      const allOrders = await fetchTableRows('Order');
      for (const row of result) {
        row.order = allOrders.find((o) => o.id === row.orderId) || null;
      }
    }
  }

  if (tableName === 'User') {
    if (include.orders) {
      const allOrders = await fetchTableRows('Order');
      for (const row of result) {
        row.orders = allOrders.filter((o) => o.userId === row.id);
      }
    }
    if (include.addresses) {
      const allAddresses = await fetchTableRows('Address');
      for (const row of result) {
        row.addresses = allAddresses.filter((a) => a.userId === row.id);
      }
    }
  }

  if (tableName === 'Favorite') {
    if (include.product) {
      const allProducts = await fetchTableRows('Product');
      const allImages = await fetchTableRows('ProductImage');
      for (const row of result) {
        const prod = allProducts.find((p) => p.id === row.productId) || null;
        if (prod) {
          prod.images = sortRows(
            allImages.filter((img) => img.productId === prod.id),
            { displayOrder: 'asc' }
          );
        }
        row.product = prod;
      }
    }
  }

  return result;
}

export function createSupabaseRestModelDelegate(modelName: string) {
  const tableName = MODEL_TO_TABLE[modelName] || modelName;

  const delegate = {
    async findMany(args: {
      where?: Record<string, unknown>;
      orderBy?: Record<string, 'asc' | 'desc'>;
      include?: Record<string, unknown>;
      select?: Record<string, boolean>;
      take?: number;
      skip?: number;
    } = {}) {
      const effectiveWhere = await preprocessWhere(tableName, args.where);
      const allRows = await fetchTableRows(tableName);
      let filtered = allRows.filter((r) => matchesWhere(r, effectiveWhere));
      filtered = sortRows(filtered, args.orderBy);
      if (typeof args.skip === 'number') filtered = filtered.slice(args.skip);
      if (typeof args.take === 'number') filtered = filtered.slice(0, args.take);
      if (args.include) {
        filtered = await populateIncludes(tableName, filtered, args.include);
      }
      if (args.select) {
        filtered = filtered.map((r) => applySelect(r, args.select));
      }
      return filtered;
    },

    async findFirst(args: {
      where?: Record<string, unknown>;
      orderBy?: Record<string, 'asc' | 'desc'>;
      include?: Record<string, unknown>;
      select?: Record<string, boolean>;
    } = {}) {
      const rows = await delegate.findMany({ ...args, take: 1 });
      return rows[0] || null;
    },

    async findUnique(args: {
      where: Record<string, unknown>;
      include?: Record<string, unknown>;
      select?: Record<string, boolean>;
    }) {
      return delegate.findFirst(args);
    },

    async count(args: { where?: Record<string, unknown> } = {}) {
      const effectiveWhere = await preprocessWhere(tableName, args.where);
      const allRows = await fetchTableRows(tableName);
      return allRows.filter((r) => matchesWhere(r, effectiveWhere)).length;
    },

    async create(args: {
      data: Record<string, unknown>;
      include?: Record<string, unknown>;
      select?: Record<string, boolean>;
    }) {
      const nowIso = new Date().toISOString();
      const rawData = { ...args.data };

      // Extract nested relations (images, variants, items, statusHistory, payment)
      const nestedImages = rawData.images as { create?: Record<string, unknown>[] } | undefined;
      const nestedVariants = rawData.variants as { create?: Record<string, unknown>[] } | undefined;
      const nestedItems = rawData.items as { create?: Record<string, unknown>[] } | undefined;
      const nestedHistory = rawData.statusHistory as { create?: Record<string, unknown>[] } | undefined;
      const nestedPayment = rawData.payment as { create?: Record<string, unknown> } | undefined;

      delete rawData.images;
      delete rawData.variants;
      delete rawData.items;
      delete rawData.statusHistory;
      delete rawData.payment;

      if (!rawData.id) rawData.id = generateCuid();
      if (TABLES_WITH_CREATED_AT.has(tableName) && !rawData.createdAt) {
        rawData.createdAt = nowIso;
      }
      if (TABLES_WITH_UPDATED_AT.has(tableName) && !rawData.updatedAt) {
        rawData.updatedAt = nowIso;
      }

      const res = await restFetch(tableName, {
        method: 'POST',
        prefer: 'return=representation',
        body: JSON.stringify(rawData),
      });
      const insertedArr = (await res.json()) as Record<string, unknown>[];
      let created = reviveDates(insertedArr[0] || rawData);

      const parentId = String(created.id);

      if (tableName === 'Product') {
        if (nestedImages?.create && Array.isArray(nestedImages.create)) {
          const imgDelegate = createSupabaseRestModelDelegate('productImage');
          for (const img of nestedImages.create) {
            await imgDelegate.create({ data: { ...img, productId: parentId } });
          }
        }
        if (nestedVariants?.create && Array.isArray(nestedVariants.create)) {
          const varDelegate = createSupabaseRestModelDelegate('productVariant');
          for (const v of nestedVariants.create) {
            await varDelegate.create({ data: { ...v, productId: parentId } });
          }
        }
      }

      if (tableName === 'Order') {
        if (nestedItems?.create && Array.isArray(nestedItems.create)) {
          const itemDelegate = createSupabaseRestModelDelegate('orderItem');
          for (const it of nestedItems.create) {
            await itemDelegate.create({ data: { ...it, orderId: parentId } });
          }
        }
        if (nestedHistory?.create && Array.isArray(nestedHistory.create)) {
          const histDelegate = createSupabaseRestModelDelegate('orderStatusHistory');
          for (const h of nestedHistory.create) {
            await histDelegate.create({ data: { ...h, orderId: parentId } });
          }
        }
        if (nestedPayment?.create) {
          const payDelegate = createSupabaseRestModelDelegate('payment');
          await payDelegate.create({ data: { ...nestedPayment.create, orderId: parentId } });
        }
      }

      if (args.include) {
        const withIncludes = await populateIncludes(tableName, [created], args.include);
        created = withIncludes[0];
      }

      if (args.select) {
        created = applySelect(created, args.select);
      }

      return created;
    },

    async createMany(args: { data: Record<string, unknown>[] }) {
      let count = 0;
      for (const item of args.data) {
        await delegate.create({ data: item });
        count++;
      }
      return { count };
    },

    async update(args: {
      where: Record<string, unknown>;
      data: Record<string, unknown>;
      include?: Record<string, unknown>;
    }) {
      const existing = await delegate.findFirst({ where: args.where });
      if (!existing) {
        throw new Error(`Record to update not found in ${tableName}`);
      }

      const patch: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(args.data)) {
        if (v === undefined) continue;
        if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
          const op = v as { increment?: number; decrement?: number };
          if (typeof op.increment === 'number') {
            patch[k] = Number(existing[k] || 0) + op.increment;
            continue;
          }
          if (typeof op.decrement === 'number') {
            patch[k] = Number(existing[k] || 0) - op.decrement;
            continue;
          }
        }
        patch[k] = v instanceof Date ? v.toISOString() : v;
      }

      if (TABLES_WITH_UPDATED_AT.has(tableName)) {
        patch.updatedAt = new Date().toISOString();
      }

      const res = await restFetch(`${tableName}?id=eq.${encodeURIComponent(String(existing.id))}`, {
        method: 'PATCH',
        prefer: 'return=representation',
        body: JSON.stringify(patch),
      });
      const updatedArr = (await res.json()) as Record<string, unknown>[];
      let updated = reviveDates(updatedArr[0] || { ...existing, ...patch });

      if (args.include) {
        const withIncludes = await populateIncludes(tableName, [updated], args.include);
        updated = withIncludes[0];
      }

      return updated;
    },

    async updateMany(args: {
      where?: Record<string, unknown>;
      data: Record<string, unknown>;
    }) {
      const rows = await delegate.findMany({ where: args.where });
      let count = 0;
      for (const r of rows) {
        await delegate.update({ where: { id: r.id }, data: args.data });
        count++;
      }
      return { count };
    },

    async upsert(args: {
      where: Record<string, unknown>;
      update: Record<string, unknown>;
      create: Record<string, unknown>;
    }) {
      const existing = await delegate.findFirst({ where: args.where });
      if (existing) {
        return delegate.update({ where: { id: existing.id }, data: args.update });
      }
      return delegate.create({ data: args.create });
    },

    async delete(args: { where: Record<string, unknown> }) {
      const existing = await delegate.findFirst({ where: args.where });
      if (!existing) {
        throw new Error(`Record to delete not found in ${tableName}`);
      }
      await restFetch(`${tableName}?id=eq.${encodeURIComponent(String(existing.id))}`, {
        method: 'DELETE',
      });
      return existing;
    },

    async deleteMany(args: { where?: Record<string, unknown> } = {}) {
      const rows = await delegate.findMany({ where: args.where });
      for (const r of rows) {
        await restFetch(`${tableName}?id=eq.${encodeURIComponent(String(r.id))}`, {
          method: 'DELETE',
        });
      }
      return { count: rows.length };
    },
  };

  return delegate;
}

