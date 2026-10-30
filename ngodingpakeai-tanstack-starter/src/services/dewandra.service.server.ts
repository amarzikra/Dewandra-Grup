import { asc, eq } from "drizzle-orm";
import { db } from "@/db/index.server";
import {
  contactMessages,
  products,
  purchases,
  sales,
  stores,
} from "@/db/schema";
import type { CreateContactInput } from "@/validators/dewandra";

const CATEGORY_LABELS: Record<string, string> = {
  pupuk: "Pupuk & pertanian",
  bangunan: "Material bangunan",
  atk: "Alat tulis kantor",
  listrik: "Peralatan listrik",
  furniture: "Mebel & interior",
};

const CATEGORY_ICONS: Record<string, string> = {
  pupuk: "lucide:sprout",
  bangunan: "lucide:hammer",
  atk: "lucide:pencil",
  listrik: "lucide:plug",
  furniture: "lucide:sofa",
};

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    return {
      key: monthKey(date),
      short: date.toLocaleDateString("id-ID", { month: "short" }),
      long: date.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      }),
      year: date.getFullYear(),
    };
  });
}

export async function getCatalogData() {
  const storeRows = await db
    .select({
      id: stores.id,
      name: stores.name,
      slug: stores.slug,
      category: stores.category,
    })
    .from(stores)
    .where(eq(stores.isActive, true))
    .orderBy(asc(stores.name));
  const productRows = await db
    .select({
      id: products.id,
      storeId: products.storeId,
      store: stores.name,
      storeSlug: stores.slug,
      storeCategory: stores.category,
      name: products.name,
      sku: products.sku,
      barcode: products.barcode,
      price: products.sellPrice,
      unit: products.unit,
      stock: products.stockCurrent,
      minStock: products.stockMin,
      description: products.description,
    })
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .where(eq(products.isActive, true))
    .orderBy(asc(stores.name), asc(products.name));

  return {
    stores: storeRows.map((store) => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      category: store.category,
    })),
    products: productRows.map((product) => ({
      ...product,
      price: Number(product.price),
      description: product.description || "",
    })),
  };
}

export async function getDashboardData() {
  const [storeRows, productRows, saleRows, purchaseRows] = await Promise.all([
    db.select().from(stores).where(eq(stores.isActive, true)),
    db.select().from(products).where(eq(products.isActive, true)),
    db.select().from(sales),
    db.select().from(purchases),
  ]);

  const months = buildMonths();
  const storeData = storeRows.map((store) => {
    const storeProducts = productRows.filter(
      (product) => product.storeId === store.id,
    );
    const storeSales = saleRows.filter(
      (sale) => sale.storeId === store.id && sale.status === "paid",
    );
    const storePurchases = purchaseRows.filter(
      (purchase) => purchase.storeId === store.id,
    );
    const inventory = storeProducts.reduce(
      (sum, product) =>
        sum + product.stockCurrent * Number(product.buyPrice),
      0,
    );
    const lowStock = storeProducts.filter(
      (product) => product.stockCurrent <= product.stockMin,
    ).length;
    const salesByMonth = months.map((month) =>
      storeSales
        .filter((sale) => monthKey(sale.saleDate) === month.key)
        .reduce((sum, sale) => sum + Number(sale.totalAmount), 0) / 1_000_000,
    );
    const purchasesByMonth = months.map((month) =>
      storePurchases
        .filter((purchase) => monthKey(purchase.purchaseDate) === month.key)
        .reduce((sum, purchase) => sum + Number(purchase.totalAmount), 0) /
      1_000_000,
    );
    const transactionsByMonth = months.map(
      (month) =>
        saleRows.filter(
          (sale) =>
            sale.storeId === store.id &&
            monthKey(sale.saleDate) === month.key,
        ).length +
        purchaseRows.filter(
          (purchase) =>
            purchase.storeId === store.id &&
            monthKey(purchase.purchaseDate) === month.key,
        ).length,
    );

    return {
      id: store.id,
      name: store.name,
      category: CATEGORY_LABELS[store.category] ?? store.category,
      icon: CATEGORY_ICONS[store.category] ?? "lucide:store",
      sales: salesByMonth,
      purchases: purchasesByMonth,
      transactions: transactionsByMonth,
      inventory,
      lowStock,
    };
  });

  const currentMonth = months[5];
  const previousMonth = months[4];
  return {
    months: months.map((month) => month.short),
    periods: [
      {
        value: "current",
        label: `Bulan ini · ${currentMonth.short} ${currentMonth.year}`,
        short: currentMonth.long,
        monthIndex: 5,
      },
      {
        value: "previous",
        label: `Bulan lalu · ${previousMonth.short} ${previousMonth.year}`,
        short: previousMonth.long,
        monthIndex: 4,
      },
    ],
    stores: storeData,
  };
}

export async function createContactMessage(input: CreateContactInput) {
  const [row] = await db
    .insert(contactMessages)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    })
    .returning({ id: contactMessages.id });
  return row;
}
