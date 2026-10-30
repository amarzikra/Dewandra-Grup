import { useEffect, useRef, useState } from "react";
import { companyProfile, storeLogos } from "@/config/dewandra";

const STORES = [
  { id: "pupuk", name: "Rezeki Tani" },
  { id: "bangunan", name: "Central Jaya Bangunan" },
  { id: "atk", name: "Dewi Foto Copy" },
  { id: "listrik", name: "Gemilang Elektronik" },
  { id: "furniture", name: "Kasandra Furniture" },
];

const PRODUCTS = [
  {
    id: "pupuk-urea",
    storeId: "pupuk",
    name: "Pupuk Urea 50 kg",
    sku: "PUP-001",
    barcode: "899000100001",
    price: 285000,
    unit: "karung",
    stock: 42,
  },
  {
    id: "pupuk-npk",
    storeId: "pupuk",
    name: "Pupuk NPK 25 kg",
    sku: "PUP-002",
    barcode: "899000100002",
    price: 195000,
    unit: "karung",
    stock: 8,
  },
  {
    id: "bangunan-semen",
    storeId: "bangunan",
    name: "Semen Portland 50 kg",
    sku: "BGN-001",
    barcode: "899000200001",
    price: 68000,
    unit: "sak",
    stock: 120,
  },
  {
    id: "bangunan-cat",
    storeId: "bangunan",
    name: "Cat Tembok 5 kg",
    sku: "BGN-002",
    barcode: "899000200002",
    price: 145000,
    unit: "pail",
    stock: 14,
  },
  {
    id: "atk-kertas",
    storeId: "atk",
    name: "Kertas A4 80 gsm",
    sku: "ATK-001",
    barcode: "899000300001",
    price: 55000,
    unit: "rim",
    stock: 36,
  },
  {
    id: "atk-pulpen",
    storeId: "atk",
    name: "Pulpen Gel 0,5 mm",
    sku: "ATK-002",
    barcode: "899000300002",
    price: 3500,
    unit: "pcs",
    stock: 150,
  },
  {
    id: "listrik-lampu",
    storeId: "listrik",
    name: "Lampu LED 12 W",
    sku: "LSK-001",
    barcode: "899000400001",
    price: 32000,
    unit: "pcs",
    stock: 24,
  },
  {
    id: "listrik-kabel",
    storeId: "listrik",
    name: "Kabel NYM 2x1,5 mm",
    sku: "LSK-002",
    barcode: "899000400002",
    price: 12500,
    unit: "meter",
    stock: 80,
  },
  {
    id: "furniture-kursi",
    storeId: "furniture",
    name: "Kursi Kayu Jati",
    sku: "FUR-001",
    barcode: "899000500001",
    price: 850000,
    unit: "pcs",
    stock: 6,
  },
  {
    id: "furniture-meja",
    storeId: "furniture",
    name: "Meja Kerja 120 cm",
    sku: "FUR-002",
    barcode: "899000500002",
    price: 1250000,
    unit: "pcs",
    stock: 3,
  },
];

function formatPrice(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

function formatDateTime(date) {
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatInvoiceNumber(sequence) {
  return (
    "INV-" +
    new Date().getFullYear() +
    "-" +
    String(sequence).padStart(4, "0")
  );
}

export default function Page() {
  const [storeId, setStoreId] = useState("bangunan");
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [notice, setNotice] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [invoiceSeq, setInvoiceSeq] = useState(1);
  const receiptDialogRef = useRef(null);

  useEffect(() => {
    const dialog = receiptDialogRef.current;
    if (!dialog) return;
    if (receipt && !dialog.open) {
      dialog.showModal();
    }
  }, [receipt]);

  useEffect(() => {
    if (!receipt) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [receipt]);

  const selectedStore = STORES.find((store) => store.id === storeId) || STORES[0];
  const storeProducts = products.filter((product) => product.storeId === storeId);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = storeProducts.filter((product) => {
    if (!normalizedSearch) return true;
    return [product.name, product.sku, product.barcode]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  const cartLines = cart
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) return null;
      return {
        ...item,
        product,
        subtotal: product.price * item.qty,
      };
    })
    .filter(Boolean);

  const total = cartLines.reduce((sum, line) => sum + line.subtotal, 0);
  const itemCount = cartLines.reduce((sum, line) => sum + line.qty, 0);
  const paidAmount = Number(amountPaid) || 0;
  const change = paidAmount - total;
  const canSave = cartLines.length > 0 && (paymentMethod === "transfer" || paidAmount >= total);
  const saveReason =
    cartLines.length === 0
      ? "Tambahkan barang untuk menyimpan transaksi."
      : paymentMethod === "cash" && paidAmount < total
        ? "Uang diterima belum mencukupi."
        : "Stok akan berkurang setelah transaksi disimpan.";

  function addToCart(product) {
    if (product.stock <= 0) {
      setNotice("Stok " + product.name + " habis.");
      return;
    }
    const existing = cart.find((item) => item.productId === product.id);
    const currentQty = existing ? existing.qty : 0;
    if (currentQty >= product.stock) {
      setNotice("Jumlah " + product.name + " melebihi stok tersedia.");
      return;
    }
    setNotice("");
    if (existing) {
      setCart((previous) =>
        previous.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart((previous) => [...previous, { productId: product.id, qty: 1 }]);
    }
  }

  function addByBarcode(event) {
    event.preventDefault();
    const code = barcode.trim().toLowerCase();
    if (!code) {
      setNotice("Masukkan barcode atau SKU terlebih dahulu.");
      return;
    }
    const product = storeProducts.find(
      (candidate) =>
        candidate.barcode.toLowerCase() === code || candidate.sku.toLowerCase() === code
    );
    if (!product) {
      setNotice("Barcode tidak ditemukan di " + selectedStore.name + ".");
      return;
    }
    addToCart(product);
    setBarcode("");
  }

  function setQty(productId, nextQty) {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product) return;
    const qty = Math.max(0, Math.min(product.stock, Number(nextQty) || 0));
    if (qty === 0) {
      setCart((previous) => previous.filter((item) => item.productId !== productId));
      return;
    }
    setCart((previous) =>
      previous.map((item) =>
        item.productId === productId ? { ...item, qty } : item
      )
    );
  }

  function removeLine(productId) {
    setCart((previous) => previous.filter((item) => item.productId !== productId));
  }

  function confirmCancel() {
    setCart([]);
    setAmountPaid("");
    setPaymentMethod("cash");
    setCancelConfirm(false);
    setNotice("Transaksi dibatalkan; stok tidak berubah.");
  }

  function saveTransaction() {
    if (!canSave) return;
    const paid = paymentMethod === "transfer" ? total : paidAmount;
    const changeAmount = paymentMethod === "transfer" ? 0 : Math.max(0, paid - total);
    const now = new Date();
    const nextReceipt = {
      invoice: formatInvoiceNumber(invoiceSeq),
      dateTime: formatDateTime(now),
      store: selectedStore.name,
      cashier: "Pemilik",
      items: cartLines.map((line) => ({
        id: line.product.id,
        name: line.product.name,
        qty: line.qty,
        price: line.product.price,
        subtotal: line.subtotal,
        unit: line.product.unit,
      })),
      total,
      paymentMethod,
      paid,
      change: changeAmount,
    };

    setProducts((previous) =>
      previous.map((product) => {
        const line = cart.find((item) => item.productId === product.id);
        if (!line) return product;
        return { ...product, stock: Math.max(0, product.stock - line.qty) };
      })
    );
    setReceipt(nextReceipt);
    setInvoiceSeq((previous) => previous + 1);
    setCart([]);
    setAmountPaid("");
    setPaymentMethod("cash");
    setCancelConfirm(false);
    setNotice("");
  }

  function handleStoreChange(nextStoreId) {
    if (cart.length > 0) {
      setNotice("Toko diubah; keranjang dikosongkan.");
    }
    setStoreId(nextStoreId);
    setCart([]);
    setAmountPaid("");
    setPaymentMethod("cash");
    setCancelConfirm(false);
    setSearch("");
    setBarcode("");
  }

  return (
    <div className="kasir-root">
      <header className="kasir-header">
        <div className="kasir-header-copy">
          <p className="kasir-kicker">Ruang kasir</p>
          <h1 className="kasir-title">Kasir</h1>
          <p className="kasir-lede">Catat penjualan dan kurangi stok secara otomatis.</p>
        </div>
        <div className="kasir-header-actions">
          <div className="kasir-store-field">
            <label className="kasir-label" htmlFor="kasir-store">
              Toko kasir
            </label>
            <select
              id="kasir-store"
              className="kasir-select"
              value={storeId}
              onChange={(event) => handleStoreChange(event.target.value)}
            >
              {STORES.map((store) => (
                <option value={store.id} key={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
          <span className="kasir-chip">
            <iconify-icon icon="lucide:info" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
            Data contoh
          </span>
        </div>
      </header>

      <div className="kasir-grid">
        <section className="kasir-panel">
          <div className="kasir-panel-head">
            <div className="kasir-store-heading">
              <img
                className="kasir-store-logo"
                src={storeLogos[storeId]}
                alt=""
                decoding="async"
              />
              <div>
                <h2 className="kasir-panel-title">Barang</h2>
                <p className="kasir-lede">{selectedStore.name}</p>
              </div>
            </div>
            <span className="kasir-count">{filteredProducts.length} barang</span>
          </div>

          <form className="kasir-barcode" onSubmit={addByBarcode}>
            <div className="kasir-barcode-field">
              <label className="kasir-label" htmlFor="kasir-barcode">
                Pindai / ketik barcode
              </label>
              <input
                id="kasir-barcode"
                className="kasir-input"
                type="text"
                autoComplete="off"
                value={barcode}
                placeholder="Contoh: BGN-001"
                onChange={(event) => setBarcode(event.target.value)}
              />
            </div>
            <button type="submit" className="kasir-barcode-add">
              <iconify-icon icon="lucide:scan-line" aria-hidden="true" style={{ fontSize: "16px" }}></iconify-icon>
              Tambah
            </button>
            <p className="kasir-barcode-note">
              Simulasi barcode: masukkan SKU atau kode barang, lalu tekan Tambah.
            </p>
          </form>

          <div className="kasir-search">
            <label className="kasir-label" htmlFor="kasir-search">
              Cari barang
            </label>
            <div className="kasir-search-wrap" style={{ marginTop: "8px" }}>
              <iconify-icon
                className="kasir-search-icon"
                icon="lucide:search"
                aria-hidden="true"
                style={{ fontSize: "18px" }}
              ></iconify-icon>
              <input
                id="kasir-search"
                className="kasir-input kasir-search-input"
                type="search"
                value={search}
                placeholder="Nama barang atau SKU"
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="kasir-product-list">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const isLow = product.stock > 0 && product.stock <= 10;
                const isOut = product.stock === 0;
                return (
                  <div className="kasir-product-row" key={product.id}>
                    <div className="kasir-product-copy">
                      <span className="kasir-product-name">{product.name}</span>
                      <span className="kasir-product-meta">
                        {product.sku} ·{" "}
                        <span
                          className="kasir-stock"
                          data-tone={isOut ? "danger" : isLow ? "warning" : "neutral"}
                        >
                          {isOut ? "Habis" : "Stok " + product.stock}
                        </span>
                      </span>
                    </div>
                    <span className="kasir-price-cell">{formatPrice(product.price)}</span>
                    <button
                      type="button"
                      className="kasir-add"
                      disabled={isOut}
                      onClick={() => addToCart(product)}
                    >
                      <iconify-icon icon="lucide:plus" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      {isOut ? "Habis" : "Tambah"}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="kasir-empty">
                <iconify-icon
                  icon="lucide:search-x"
                  aria-hidden="true"
                  style={{ flex: "0 0 auto", fontSize: "24px" }}
                ></iconify-icon>
                <div className="kasir-empty-copy">
                  <h3 className="kasir-empty-title">Barang tidak ditemukan</h3>
                  <p className="kasir-empty-text">
                    Coba kata kunci lain atau ketik barcode barang.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="kasir-panel kasir-cart">
          <div className="kasir-panel-head">
            <h2 className="kasir-panel-title">Keranjang</h2>
            <div className="kasir-cart-head-actions">
              <span className="kasir-count">{itemCount} item</span>
              {cartLines.length > 0 ? (
                <button
                  type="button"
                  className="kasir-cancel-link"
                  onClick={() => setCancelConfirm(true)}
                >
                  Batalkan
                </button>
              ) : null}
            </div>
          </div>

          {cancelConfirm ? (
            <div className="kasir-cancel-confirm" role="status">
              <p className="kasir-cancel-text">
                Batalkan transaksi? Stok tidak akan berubah.
              </p>
              <div className="kasir-cancel-actions">
                <button type="button" className="kasir-cancel-danger" onClick={confirmCancel}>
                  Ya, batalkan
                </button>
                <button type="button" className="kasir-cancel-keep" onClick={() => setCancelConfirm(false)}>
                  Lanjutkan
                </button>
              </div>
            </div>
          ) : null}

          {cartLines.length === 0 ? (
            <div className="kasir-cart-empty">
              <iconify-icon
                icon="lucide:shopping-cart"
                aria-hidden="true"
                style={{ flex: "0 0 auto", fontSize: "26px", color: "var(--color-text-muted)" }}
              ></iconify-icon>
              <div className="kasir-cart-empty-copy">
                <h3 className="kasir-cart-empty-title">Keranjang masih kosong</h3>
                <p className="kasir-cart-empty-text">
                  Pilih barang dari daftar untuk memulai transaksi.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div>
                {cartLines.map((line) => (
                  <div className="kasir-cart-line" key={line.product.id}>
                    <div className="kasir-cart-copy">
                      <span className="kasir-cart-name">{line.product.name}</span>
                      <span className="kasir-cart-meta">
                        {formatPrice(line.product.price)} / {line.product.unit}
                      </span>
                    </div>
                    <span className="kasir-cart-subtotal">
                      {formatPrice(line.subtotal)}
                    </span>
                    <div className="kasir-cart-controls">
                      <button
                        type="button"
                        className="kasir-qty-button"
                        aria-label={"Kurangi jumlah " + line.product.name}
                        onClick={() => setQty(line.product.id, line.qty - 1)}
                      >
                        <iconify-icon icon="lucide:minus" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      </button>
                      <span className="kasir-qty" aria-live="polite">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        className="kasir-qty-button"
                        aria-label={"Tambah jumlah " + line.product.name}
                        disabled={line.qty >= line.product.stock}
                        onClick={() => setQty(line.product.id, line.qty + 1)}
                      >
                        <iconify-icon icon="lucide:plus" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      </button>
                      <button
                        type="button"
                        className="kasir-remove"
                        aria-label={"Hapus " + line.product.name}
                        onClick={() => removeLine(line.product.id)}
                      >
                        <iconify-icon icon="lucide:x" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="kasir-totals">
                <div className="kasir-total-row">
                  <span className="kasir-total-label">Total</span>
                  <span className="kasir-total-value">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="kasir-payment">
                <h3 className="kasir-payment-title">Pembayaran</h3>
                <div className="kasir-methods">
                  <button
                    type="button"
                    className="kasir-method"
                    aria-pressed={paymentMethod === "cash"}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    Tunai
                  </button>
                  <button
                    type="button"
                    className="kasir-method"
                    aria-pressed={paymentMethod === "transfer"}
                    onClick={() => setPaymentMethod("transfer")}
                  >
                    Transfer
                  </button>
                </div>

                {paymentMethod === "cash" ? (
                  <div className="kasir-cash">
                    <div className="kasir-amount-row">
                      <div className="kasir-amount-field">
                        <label className="kasir-label" htmlFor="kasir-amount">
                          Uang diterima
                        </label>
                        <input
                          id="kasir-amount"
                          className="kasir-input"
                          type="number"
                          inputMode="numeric"
                          min="0"
                          value={amountPaid}
                          placeholder="0"
                          onChange={(event) => setAmountPaid(event.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="kasir-exact"
                        onClick={() => setAmountPaid(String(total))}
                      >
                        Uang pas
                      </button>
                    </div>
                    <p
                      className="kasir-change"
                      data-tone={
                        paidAmount >= total && paidAmount > 0
                          ? "positive"
                          : paidAmount > 0 && paidAmount < total
                            ? "danger"
                            : "neutral"
                      }
                    >
                      {paidAmount === 0
                        ? "Masukkan uang diterima."
                        : paidAmount < total
                          ? "Kurang " + formatPrice(total - paidAmount) + "."
                          : "Kembalian " + formatPrice(change) + "."}
                    </p>
                  </div>
                ) : (
                  <div className="kasir-transfer-note">
                    <p>
                      Transfer dicatat sebesar total. Konfirmasi pembayaran dilakukan manual.
                    </p>
                    <ul className="kasir-transfer-banks">
                      {companyProfile.bankAccounts.map((account) => (
                        <li key={account.label}>
                          <strong>{account.label}</strong> {account.number}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  className="kasir-save"
                  disabled={!canSave}
                  onClick={saveTransaction}
                >
                  <iconify-icon icon="lucide:check" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
                  Simpan transaksi
                </button>
                <p className="kasir-save-note">{saveReason}</p>
              </div>
            </>
          )}
        </aside>
      </div>

      <p className="kasir-sample-note">
        <iconify-icon icon="lucide:info" aria-hidden="true" style={{ flex: "0 0 auto", fontSize: "14px" }}></iconify-icon>
        Data barang contoh. Stok pada halaman ini hanya berubah selama prototype dibuka dan
        tidak tersimpan permanen.
      </p>

      <div className="kasir-toast-region" role="status" aria-live="polite" aria-atomic="true">
        {notice ? (
          <div className="kasir-toast">
            <iconify-icon
              icon="lucide:info"
              aria-hidden="true"
              style={{ flex: "0 0 auto", fontSize: "18px", color: "var(--color-accent-text)" }}
            ></iconify-icon>
            <div className="kasir-toast-copy">
              <span className="kasir-toast-title">Pemberitahuan</span>
              <span className="kasir-toast-text">{notice}</span>
            </div>
            <button
              type="button"
              className="kasir-toast-close"
              aria-label="Tutup pemberitahuan"
              onClick={() => setNotice("")}
            >
              <iconify-icon icon="lucide:x" aria-hidden="true" style={{ fontSize: "16px" }}></iconify-icon>
            </button>
          </div>
        ) : null}
      </div>

      <dialog
        ref={receiptDialogRef}
        className="kasir-receipt-dialog"
        aria-labelledby="kasir-receipt-title"
        onClose={() => setReceipt(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        {receipt ? (
          <div className="kasir-receipt-inner">
            <div className="kasir-receipt-top">
              <div className="kasir-receipt-brand">
                <span className="kasir-receipt-mark" aria-hidden="true">
                  DG
                </span>
                <div>
                  <h2 className="kasir-receipt-title" id="kasir-receipt-title">
                    Dewandra Grup
                  </h2>
                  <p className="kasir-receipt-sub">
                    Struk penjualan · {companyProfile.phoneDisplay}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="kasir-receipt-close"
                aria-label="Tutup struk"
                onClick={() => receiptDialogRef.current?.close()}
              >
                <iconify-icon icon="lucide:x" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
              </button>
            </div>

            <dl className="kasir-receipt-meta">
              <dt>No. invoice</dt>
              <dd>{receipt.invoice}</dd>
              <dt>Tanggal</dt>
              <dd>{receipt.dateTime}</dd>
              <dt>Toko</dt>
              <dd>{receipt.store}</dd>
              <dt>Kasir</dt>
              <dd>{receipt.cashier}</dd>
            </dl>

            <div className="kasir-receipt-items">
              {receipt.items.map((item) => (
                <div className="kasir-receipt-item" key={item.id}>
                  <div className="kasir-receipt-item-copy">
                    <span className="kasir-receipt-item-name">{item.name}</span>
                    <span className="kasir-receipt-item-meta">
                      {item.qty} × {formatPrice(item.price)} / {item.unit}
                    </span>
                  </div>
                  <span className="kasir-receipt-item-subtotal">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="kasir-receipt-total">
              <span className="kasir-receipt-total-label">Total</span>
              <span className="kasir-receipt-total-value">{formatPrice(receipt.total)}</span>
            </div>

            <div className="kasir-receipt-pay">
              <div className="kasir-receipt-pay-row">
                <span>Metode</span>
                <strong>{receipt.paymentMethod === "cash" ? "Tunai" : "Transfer"}</strong>
              </div>
              <div className="kasir-receipt-pay-row">
                <span>Diterima</span>
                <strong>{formatPrice(receipt.paid)}</strong>
              </div>
              <div className="kasir-receipt-pay-row">
                <span>Kembalian</span>
                <strong>{formatPrice(receipt.change)}</strong>
              </div>
            </div>

            <p className="kasir-receipt-note">
              Struk contoh. Pencetakan struk belum terhubung pada prototype.
            </p>

            <div className="kasir-receipt-actions">
              <button
                type="button"
                className="kasir-receipt-primary"
                onClick={() => receiptDialogRef.current?.close()}
              >
                Transaksi baru
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
