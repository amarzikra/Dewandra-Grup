import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  storeId: string;
  storeName: string;
  storeCategory: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  qty: number;
};

type CartInput = Omit<CartItem, "qty">;

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: CartInput, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "dewandra-cart-v1";
const EMPTY_CART: CartItem[] = [];
const CartContext = createContext<CartContextValue | null>(null);

let snapshot: CartItem[] | null = null;
const listeners = new Set<() => void>();

function isStoredItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "string" &&
    typeof item.storeId === "string" &&
    typeof item.storeName === "string" &&
    typeof item.storeCategory === "string" &&
    typeof item.name === "string" &&
    typeof item.unit === "string" &&
    typeof item.price === "number" &&
    typeof item.stock === "number" &&
    typeof item.qty === "number"
  );
}

function readStoredCart() {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_CART;
    return parsed
      .filter(isStoredItem)
      .map((item) => ({
        ...item,
        qty: Math.max(0, Math.min(item.qty, item.stock)),
      }))
      .filter((item) => item.qty > 0 && item.stock > 0);
  } catch {
    return EMPTY_CART;
  }
}

function getSnapshot() {
  if (snapshot === null) snapshot = readStoredCart();
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    snapshot = readStoredCart();
    for (const entry of listeners) entry();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next: CartItem[]) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A full or blocked localStorage should not break shopping.
  }
  for (const listener of listeners) listener();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const value = useMemo<CartContextValue>(() => {
    function add(item: CartInput, qty = 1) {
      if (item.stock <= 0) return;
      const existing = items.find(
        (entry) => entry.productId === item.productId,
      );
      if (existing) {
        commit(
          items.map((entry) =>
            entry.productId === item.productId
              ? {
                  ...entry,
                  ...item,
                  qty: Math.min(item.stock, entry.qty + qty),
                }
              : entry,
          ),
        );
        return;
      }
      commit([...items, { ...item, qty: Math.min(item.stock, qty) }]);
    }

    function setQty(productId: string, qty: number) {
      commit(
        items
          .map((entry) =>
            entry.productId === productId
              ? {
                  ...entry,
                  qty: Math.max(0, Math.min(qty, entry.stock)),
                }
              : entry,
          )
          .filter((entry) => entry.qty > 0),
      );
    }

    function remove(productId: string) {
      commit(items.filter((entry) => entry.productId !== productId));
    }

    function clear() {
      commit([]);
    }

    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    return { items, count, total, add, setQty, remove, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used inside a CartProvider.");
  return context;
}
