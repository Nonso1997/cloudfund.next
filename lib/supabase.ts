import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

type LocalRow = Record<string, unknown>;

type LocalStore = {
  users: LocalRow[];
  packages: LocalRow[];
  transactions: LocalRow[];
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isSupabaseEnabled = Boolean(supabaseUrl && supabaseServiceRole);

const localDbPath = path.join(process.cwd(), 'local-db.json');
const initialLocalData: LocalStore = {
  users: [],
  packages: [
    { id: 1, name: 'Starter', amount: 100, monthly_return: 8, max_trade: 1, support_level: 'Basic', created_at: new Date().toISOString() },
    { id: 2, name: 'Standard', amount: 500, monthly_return: 12, max_trade: 3, support_level: 'Priority', created_at: new Date().toISOString() },
    { id: 3, name: 'Premium', amount: 1500, monthly_return: 18, max_trade: 5, support_level: 'Dedicated', created_at: new Date().toISOString() },
  ],
  transactions: [],
};

function loadLocalData(): LocalStore {
  if (!fs.existsSync(localDbPath)) {
    fs.writeFileSync(localDbPath, JSON.stringify(initialLocalData, null, 2), 'utf8');
  }
  const raw = fs.readFileSync(localDbPath, 'utf8');
  return JSON.parse(raw) as LocalStore;
}

function saveLocalData(data: LocalStore) {
  fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf8');
}

function applyFilters(rows: LocalRow[], filters: { column: string; value: unknown }[]) {
  return rows.filter((row) => filters.every((filter) => String(row[filter.column]) === String(filter.value)));
}

function sortRows(rows: LocalRow[], order?: { column: string; ascending?: boolean }) {
  if (!order) return rows;
  return [...rows].sort((a, b) => {
    const left = a[order.column];
    const right = b[order.column];
    if (left === right) return 0;
    if (left == null) return 1;
    if (right == null) return -1;
    if (typeof left === 'number' && typeof right === 'number') {
      return order.ascending ? left - right : right - left;
    }
    return order.ascending
      ? String(left).localeCompare(String(right))
      : String(right).localeCompare(String(left));
  });
}

function createLocalClient() {
  return {
    from(table: keyof LocalStore) {
      const state = {
        table,
        filters: [] as { column: string; value: unknown }[],
        ordering: undefined as { column: string; ascending?: boolean } | undefined,
      };

      const getRows = () => {
        const store = loadLocalData();
        const tableRows = [...store[table]];
        return sortRows(applyFilters(tableRows, state.filters), state.ordering);
      };

      return {
        select(_: string | string[] = '*') {
          return this;
        },
        eq(column: string, value: unknown) {
          state.filters.push({ column, value });
          return this;
        },
        order(column: string, options: { ascending: boolean }) {
          state.ordering = { column, ascending: options.ascending };
          return this;
        },
        single() {
          const rows = getRows();
          if (rows.length === 0) {
            return { data: null, error: { message: 'No rows found' } };
          }
          return { data: rows[0], error: null };
        },
        async insert(records: LocalRow[]) {
          const store = loadLocalData();
          const nextId = (store[table].reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) || 0) + 1;
          const inserted = records.map((record, index) => ({
            ...record,
            id: nextId + index,
            created_at: new Date().toISOString(),
          }));
          store[table].push(...inserted);
          saveLocalData(store);
          return { data: inserted, error: null };
        },
        async update(values: Record<string, unknown>) {
          const store = loadLocalData();
          let updated = false;
          store[table] = store[table].map((row) => {
            const matches = state.filters.every((filter) => String(row[filter.column]) === String(filter.value));
            if (!matches) return row;
            updated = true;
            return { ...row, ...values };
          });
          saveLocalData(store);
          return { data: updated ? store[table] : null, error: updated ? null : { message: 'No rows updated' } };
        },
      };
    },
  };
}

if (!isSupabaseEnabled && process.env.NODE_ENV !== 'development') {
  console.warn(
    '[database] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured. The app is not using a hosted database in this environment.'
  );
}

export const supabaseServer = isSupabaseEnabled
  ? createClient(supabaseUrl as string, supabaseServiceRole as string, {
      auth: {
        persistSession: false,
      },
    })
  : createLocalClient();
