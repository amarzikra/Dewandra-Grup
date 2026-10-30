import { randomBytes } from "node:crypto";
import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db/index.server";
import {
  orderItems,
  orders,
  products,
  saleItems,
  sales,
  stockMovements,
  stores,
} from "@/db/schema";
import { ApiError } from "@/lib/api-error";
import { normalizePhone } from "@/lib/phone";
import type {
  AttachOrderProofInput,
  CreateOrderInput,
  LookupOrderInput,
  OrderProofInput,
  UpdateOrderInput,
} from "@/validators/orders";

const MAX_PROOF_BYTES = 2 * 1024 * 1024;
const MAX_ORDERS = 200;

type OrderStatus =
  | "pending"
  | "awaiting_confirmation"
  | "processing"
  | "ready"
  | "completed"
  | "cancelled";

type PaymentMethod = "cash" | "transfer" | "qris";

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string | null;
  notes: string | null;
  fulfillmentMethod: "pickup" | "delivery";
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: string;
  totalAmount: string;
  hasProof: boolean;
  paymentProofName: string | null;
  paymentProofMime: string | null;
  paymentProofSize: number | null;
  paymentProofUploadedAt: Date | null;
  createdAt: Date;
  paidAt: Date | null;
  readyAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
};

type OrderItemRow = {
  orderId: string;
  productId: string;
  storeId: string;
  storeName: string;
  productName: string;
  unit: string;
  qty: number;
  unitPrice: string;
  subtotal: string;
};

export type OrderItemView = {
  productId: string;
  storeId: string;
  storeName: string;
  productName: string;
  unit: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
};

export type OrderView = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string | null;
  notes: string | null;
  fulfillmentMethod: "pickup" | "delivery";
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  totalAmount: number;
  hasProof: boolean;
  paymentProofName: string | null;
  paymentProofMime: string | null;
  paymentProofSize: number | null;
  paymentProofUploadedAt: Date | null;
  createdAt: Date;
  paidAt: Date | null;
  readyAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  items: OrderItemView[];
};

const orderSelection = {
  id: orders.id,
  orderNumber: orders.orderNumber,
  customerName: orders.customerName,
  customerPhone: orders.customerPhone,
  customerAddress: orders.customerAddress,
  notes: orders.notes,
  fulfillmentMethod: orders.fulfillmentMethod,
  paymentMethod: orders.paymentMethod,
  status: orders.status,
  subtotal: orders.subtotal,
  totalAmount: orders.totalAmount,
  hasProof: sql<boolean>`${orders.paymentProofData} is not null`,
  paymentProofName: orders.paymentProofName,
  paymentProofMime: orders.paymentProofMime,
  paymentProofSize: orders.paymentProofSize,
  paymentProofUploadedAt: orders.paymentProofUploadedAt,
  createdAt: orders.createdAt,
  paidAt: orders.paidAt,
  readyAt: orders.readyAt,
  completedAt: orders.completedAt,
  cancelledAt: orders.cancelledAt,
  cancellationReason: orders.cancellationReason,
} as const;

const orderItemSelection = {
  orderId: orderItems.orderId,
  productId: orderItems.productId,
  storeId: orderItems.storeId,
  storeName: stores.name,
  productName: orderItems.productName,
  unit: orderItems.unit,
  qty: orderItems.qty,
  unitPrice: orderItems.unitPrice,
  subtotal: orderItems.subtotal,
} as const;

function orderCode() {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("-", "");
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `DG-${date}-${suffix}`;
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

function decodeProof(proof: OrderProofInput) {
  if (
    !/^[A-Za-z0-9+/]+={0,2}$/.test(proof.dataBase64) ||
    proof.dataBase64.length % 4 !== 0
  )
    throw new ApiError(
      422,
      "INVALID_PROOF",
      "Format bukti pembayaran tidak valid.",
    );
  const buffer = Buffer.from(proof.dataBase64, "base64");
  if (buffer.length === 0)
    throw new ApiError(422, "INVALID_PROOF", "Bukti pembayaran kosong.");
  if (buffer.length > MAX_PROOF_BYTES)
    throw new ApiError(
      422,
      "PROOF_TOO_LARGE",
      "Ukuran bukti pembayaran maksimal 2 MB.",
    );
  return buffer;
}

function toMoney(value: number) {
  return value.toFixed(2);
}

function mapOrder(row: OrderRow, items: OrderItemRow[]): OrderView {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerAddress: row.customerAddress,
    notes: row.notes,
    fulfillmentMethod: row.fulfillmentMethod,
    paymentMethod: row.paymentMethod,
    status: row.status,
    subtotal: Number(row.subtotal),
    totalAmount: Number(row.totalAmount),
    hasProof: row.hasProof,
    paymentProofName: row.paymentProofName,
    paymentProofMime: row.paymentProofMime,
    paymentProofSize: row.paymentProofSize,
    paymentProofUploadedAt: row.paymentProofUploadedAt,
    createdAt: row.createdAt,
    paidAt: row.paidAt,
    readyAt: row.readyAt,
    completedAt: row.completedAt,
    cancelledAt: row.cancelledAt,
    cancellationReason: row.cancellationReason,
    items: items.map((item) => ({
      productId: item.productId,
      storeId: item.storeId,
      storeName: item.storeName,
      productName: item.productName,
      unit: item.unit,
      qty: item.qty,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
    })),
  };
}

async function loadOrderItems(orderIds: string[]) {
  if (orderIds.length === 0) return [];
  return db
    .select(orderItemSelection)
    .from(orderItems)
    .innerJoin(stores, eq(orderItems.storeId, stores.id))
    .where(inArray(orderItems.orderId, orderIds))
    .orderBy(asc(stores.name), asc(orderItems.productName));
}

async function getOrderView(orderId: string) {
  const [row] = await db
    .select(orderSelection)
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!row)
    throw new ApiError(404, "ORDER_NOT_FOUND", "Pesanan tidak ditemukan.");
  const items = await loadOrderItems([orderId]);
  return mapOrder(row, items);
}

export async function createOrder(input: CreateOrderInput) {
  const proofBuffer = input.proof ? decodeProof(input.proof) : null;

  const quantityByProduct = new Map<string, number>();
  for (const item of input.items) {
    quantityByProduct.set(
      item.productId,
      (quantityByProduct.get(item.productId) ?? 0) + item.qty,
    );
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const orderNumber = orderCode();
    try {
      const orderId = await db.transaction(async (tx) => {
        const productRows = await tx
          .select({
            id: products.id,
            storeId: products.storeId,
            name: products.name,
            unit: products.unit,
            price: products.sellPrice,
            stock: products.stockCurrent,
          })
          .from(products)
          .where(
            and(
              inArray(products.id, [...quantityByProduct.keys()]),
              eq(products.isActive, true),
            ),
          );

        if (productRows.length !== quantityByProduct.size)
          throw new ApiError(
            422,
            "PRODUCT_UNAVAILABLE",
            "Salah satu barang di keranjang sudah tidak tersedia.",
          );

        const rows = productRows.map((product) => {
          const qty = quantityByProduct.get(product.id) ?? 0;
          if (qty > product.stock)
            throw new ApiError(
              422,
              "INSUFFICIENT_STOCK",
              `Stok ${product.name} tersisa ${product.stock} ${product.unit}.`,
            );
          const unitPrice = Number(product.price);
          return {
            storeId: product.storeId,
            productId: product.id,
            productName: product.name,
            unit: product.unit,
            qty,
            unitPrice: toMoney(unitPrice),
            subtotal: toMoney(unitPrice * qty),
          };
        });

        const subtotal = rows.reduce(
          (sum, item) => sum + Number(item.subtotal),
          0,
        );

        const [order] = await tx
          .insert(orders)
          .values({
            orderNumber,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerPhoneNormalized: normalizePhone(input.customerPhone),
            customerAddress:
              input.fulfillmentMethod === "delivery"
                ? input.customerAddress
                : null,
            notes: input.notes || null,
            fulfillmentMethod: input.fulfillmentMethod,
            paymentMethod: input.paymentMethod,
            status: input.proof ? "awaiting_confirmation" : "pending",
            subtotal: toMoney(subtotal),
            totalAmount: toMoney(subtotal),
            paymentProofData: input.proof?.dataBase64 ?? null,
            paymentProofMime: input.proof?.type ?? null,
            paymentProofName: input.proof?.name ?? null,
            paymentProofSize: proofBuffer?.length ?? null,
            paymentProofUploadedAt: input.proof ? new Date() : null,
          })
          .returning({ id: orders.id });

        await tx.insert(orderItems).values(
          rows.map((item) => ({
            orderId: order.id,
            ...item,
          })),
        );

        return order.id;
      });

      return getOrderView(orderId);
    } catch (error) {
      if (isUniqueViolation(error) && attempt < 2) continue;
      throw error;
    }
  }

  throw new ApiError(
    500,
    "ORDER_CREATE_FAILED",
    "Pesanan gagal dibuat. Coba lagi.",
  );
}

export async function listOrders() {
  const orderRows = await db
    .select(orderSelection)
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(MAX_ORDERS);
  const items = await loadOrderItems(orderRows.map((row) => row.id));
  const itemsByOrder = new Map<string, OrderItemRow[]>();
  for (const item of items) {
    const existing = itemsByOrder.get(item.orderId) ?? [];
    existing.push(item);
    itemsByOrder.set(item.orderId, existing);
  }
  return orderRows.map((row) => mapOrder(row, itemsByOrder.get(row.id) ?? []));
}

export async function getOrderForCustomer(input: LookupOrderInput) {
  const [row] = await db
    .select(orderSelection)
    .from(orders)
    .where(
      and(
        eq(orders.orderNumber, input.orderNumber),
        eq(orders.customerPhoneNormalized, normalizePhone(input.phone)),
      ),
    )
    .limit(1);
  if (!row)
    throw new ApiError(
      404,
      "ORDER_NOT_FOUND",
      "Pesanan tidak ditemukan. Periksa kode pesanan dan nomor WhatsApp.",
    );
  const items = await loadOrderItems([row.id]);
  return mapOrder(row, items);
}

export async function attachPaymentProof(input: AttachOrderProofInput) {
  const proofBuffer = decodeProof(input.proof);
  const normalizedPhone = normalizePhone(input.phone);

  const [order] = await db
    .select({ id: orders.id, status: orders.status })
    .from(orders)
    .where(
      and(
        eq(orders.orderNumber, input.orderNumber),
        eq(orders.customerPhoneNormalized, normalizedPhone),
      ),
    )
    .limit(1);
  if (!order)
    throw new ApiError(
      404,
      "ORDER_NOT_FOUND",
      "Pesanan tidak ditemukan. Periksa kode pesanan dan nomor WhatsApp.",
    );
  if (!["pending", "awaiting_confirmation"].includes(order.status))
    throw new ApiError(
      409,
      "ORDER_LOCKED",
      "Pesanan ini sudah diproses dan bukti tidak bisa diubah.",
    );

  const [updated] = await db
    .update(orders)
    .set({
      status: "awaiting_confirmation",
      paymentProofData: input.proof.dataBase64,
      paymentProofMime: input.proof.type,
      paymentProofName: input.proof.name,
      paymentProofSize: proofBuffer.length,
      paymentProofUploadedAt: new Date(),
    })
    .where(
      and(
        eq(orders.id, order.id),
        inArray(orders.status, ["pending", "awaiting_confirmation"]),
      ),
    )
    .returning({ id: orders.id });

  if (!updated)
    throw new ApiError(
      409,
      "ORDER_LOCKED",
      "Pesanan ini sudah diproses dan bukti tidak bisa diubah.",
    );

  return { orderNumber: input.orderNumber, status: "awaiting_confirmation" };
}

export async function getPaymentProof(orderId: string) {
  const [row] = await db
    .select({
      data: orders.paymentProofData,
      mime: orders.paymentProofMime,
      name: orders.paymentProofName,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!row?.data)
    throw new ApiError(
      404,
      "PROOF_NOT_FOUND",
      "Bukti pembayaran belum diunggah.",
    );
  return {
    data: Buffer.from(row.data, "base64"),
    mime: row.mime ?? "application/octet-stream",
    name: row.name ?? "bukti-pembayaran",
  };
}

export async function applyOrderAction(
  orderId: string,
  actorId: string | null,
  input: UpdateOrderInput,
) {
  await db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .for("update");
    if (!order)
      throw new ApiError(404, "ORDER_NOT_FOUND", "Pesanan tidak ditemukan.");

    if (input.action === "confirm-payment") {
      if (!["pending", "awaiting_confirmation"].includes(order.status))
        throw new ApiError(
          409,
          "INVALID_STATUS",
          "Pembayaran pesanan ini sudah dikonfirmasi atau dibatalkan.",
        );

      const items = await tx
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      if (items.length === 0)
        throw new ApiError(
          409,
          "EMPTY_ORDER",
          "Pesanan ini tidak memiliki barang.",
        );

      const lockedProducts = await tx
        .select({
          id: products.id,
          name: products.name,
          stockCurrent: products.stockCurrent,
        })
        .from(products)
        .where(inArray(products.id, items.map((item) => item.productId)))
        .for("update");
      const productsById = new Map(
        lockedProducts.map((product) => [product.id, product]),
      );

      for (const item of items) {
        const product = productsById.get(item.productId);
        if (!product)
          throw new ApiError(
            409,
            "PRODUCT_UNAVAILABLE",
            `Barang ${item.productName} sudah tidak tersedia.`,
          );
        if (product.stockCurrent < item.qty)
          throw new ApiError(
            409,
            "INSUFFICIENT_STOCK",
            `Stok ${product.name} tersisa ${product.stockCurrent}, tidak cukup untuk ${item.qty}.`,
          );
      }

      const groups = new Map<string, typeof items>();
      for (const item of items) {
        const group = groups.get(item.storeId) ?? [];
        group.push(item);
        groups.set(item.storeId, group);
      }

      let storeIndex = 0;
      for (const [storeId, group] of groups) {
        const groupTotal = group.reduce(
          (sum, item) => sum + Number(item.subtotal),
          0,
        );
        const invoiceNumber =
          groups.size === 1
            ? order.orderNumber
            : `${order.orderNumber}-${storeIndex + 1}`;

        const [sale] = await tx
          .insert(sales)
          .values({
            storeId,
            userId: actorId,
            orderId: order.id,
            invoiceNumber,
            totalAmount: toMoney(groupTotal),
            paymentMethod: order.paymentMethod,
            amountPaid: toMoney(groupTotal),
            changeAmount: "0",
            status: "paid",
            saleDate: new Date(),
          })
          .returning({ id: sales.id });

        await tx.insert(saleItems).values(
          group.map((item) => ({
            saleId: sale.id,
            productId: item.productId,
            qty: item.qty,
            sellPrice: item.unitPrice,
            subtotal: item.subtotal,
            productName: item.productName,
            unit: item.unit,
            notes: `Pesanan online ${order.orderNumber}`,
          })),
        );

        for (const item of group) {
          const [updatedProduct] = await tx
            .update(products)
            .set({
              stockCurrent: sql`${products.stockCurrent} - ${item.qty}`,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(products.id, item.productId),
                gte(products.stockCurrent, item.qty),
              ),
            )
            .returning({ stockCurrent: products.stockCurrent });

          if (!updatedProduct)
            throw new ApiError(
              409,
              "INSUFFICIENT_STOCK",
              `Stok ${item.productName} berubah dan tidak cukup lagi.`,
            );

          await tx.insert(stockMovements).values({
            storeId,
            productId: item.productId,
            type: "sale",
            referenceId: sale.id,
            qtyChange: -item.qty,
            stockAfter: updatedProduct.stockCurrent,
            userId: actorId,
            notes: `Pesanan ${order.orderNumber}`,
          });
        }

        storeIndex += 1;
      }

      await tx
        .update(orders)
        .set({ status: "processing", paidAt: new Date() })
        .where(eq(orders.id, order.id));
      return;
    }

    if (input.action === "mark-ready") {
      if (order.status !== "processing")
        throw new ApiError(
          409,
          "INVALID_STATUS",
          "Pesanan harus sudah dibayar sebelum ditandai siap.",
        );
      await tx
        .update(orders)
        .set({ status: "ready", readyAt: new Date() })
        .where(eq(orders.id, order.id));
      return;
    }

    if (input.action === "mark-completed") {
      if (order.status !== "ready")
        throw new ApiError(
          409,
          "INVALID_STATUS",
          "Pesanan harus siap sebelum diselesaikan.",
        );
      await tx
        .update(orders)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(orders.id, order.id));
      return;
    }

    if (order.status === "completed")
      throw new ApiError(
        409,
        "INVALID_STATUS",
        "Pesanan yang sudah selesai tidak bisa dibatalkan.",
      );
    if (order.status === "cancelled")
      throw new ApiError(
        409,
        "INVALID_STATUS",
        "Pesanan ini sudah dibatalkan.",
      );

    if (order.status === "processing" || order.status === "ready") {
      const saleRows = await tx
        .select({ id: sales.id, storeId: sales.storeId })
        .from(sales)
        .where(and(eq(sales.orderId, order.id), eq(sales.status, "paid")));
      const saleIds = saleRows.map((sale) => sale.id);
      if (saleIds.length > 0) {
        const soldItems = await tx
          .select()
          .from(saleItems)
          .where(inArray(saleItems.saleId, saleIds));
        const storeBySale = new Map(
          saleRows.map((sale) => [sale.id, sale.storeId]),
        );
        for (const item of soldItems) {
          const saleStoreId = storeBySale.get(item.saleId);
          if (!saleStoreId)
            throw new ApiError(
              409,
              "SALE_NOT_FOUND",
              "Transaksi penjualan pesanan ini tidak ditemukan.",
            );
          const [updatedProduct] = await tx
            .update(products)
            .set({
              stockCurrent: sql`${products.stockCurrent} + ${item.qty}`,
              updatedAt: new Date(),
            })
            .where(eq(products.id, item.productId))
            .returning({ stockCurrent: products.stockCurrent });

          if (!updatedProduct)
            throw new ApiError(
              409,
              "PRODUCT_UNAVAILABLE",
              `Barang ${item.productName} tidak ditemukan.`,
            );

          await tx.insert(stockMovements).values({
            storeId: saleStoreId,
            productId: item.productId,
            type: "adjustment",
            referenceId: order.id,
            qtyChange: item.qty,
            stockAfter: updatedProduct.stockCurrent,
            userId: actorId,
            notes: `Pembatalan pesanan ${order.orderNumber}`,
          });
        }
        await tx
          .update(sales)
          .set({ status: "cancelled" })
          .where(inArray(sales.id, saleIds));
      }
    }

    await tx
      .update(orders)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: input.reason || null,
      })
      .where(eq(orders.id, order.id));
  });

  return getOrderView(orderId);
}
