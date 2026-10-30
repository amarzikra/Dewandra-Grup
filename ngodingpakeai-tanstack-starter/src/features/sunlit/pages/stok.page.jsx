import { useEffect, useRef, useState } from "react";
import { storeLogos } from "@/config/dewandra";

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
    store: "Rezeki Tani",
    name: "Pupuk Urea 50 kg",
    sku: "PUP-001",
    unit: "karung",
    stock: 42,
    minStock: 10,
    buyPrice: 245000,
    sellPrice: 285000,
  },
  {
    id: "pupuk-npk",
    storeId: "pupuk",
    store: "Rezeki Tani",
    name: "Pupuk NPK 25 kg",
    sku: "PUP-002",
    unit: "karung",
    stock: 8,
    minStock: 10,
    buyPrice: 170000,
    sellPrice: 195000,
  },
  {
    id: "bangunan-semen",
    storeId: "bangunan",
    store: "Central Jaya Bangunan",
    name: "Semen Portland 50 kg",
    sku: "BGN-001",
    unit: "sak",
    stock: 120,
    minStock: 20,
    buyPrice: 58000,
    sellPrice: 68000,
  },
  {
    id: "bangunan-cat",
    storeId: "bangunan",
    store: "Central Jaya Bangunan",
    name: "Cat Tembok 5 kg",
    sku: "BGN-002",
    unit: "pail",
    stock: 14,
    minStock: 5,
    buyPrice: 120000,
    sellPrice: 145000,
  },
  {
    id: "atk-kertas",
    storeId: "atk",
    store: "Dewi Foto Copy",
    name: "Kertas A4 80 gsm",
    sku: "ATK-001",
    unit: "rim",
    stock: 36,
    minStock: 10,
    buyPrice: 44000,
    sellPrice: 55000,
  },
  {
    id: "atk-pulpen",
    storeId: "atk",
    store: "Dewi Foto Copy",
    name: "Pulpen Gel 0,5 mm",
    sku: "ATK-002",
    unit: "pcs",
    stock: 150,
    minStock: 30,
    buyPrice: 3000,
    sellPrice: 3500,
  },
  {
    id: "listrik-lampu",
    storeId: "listrik",
    store: "Gemilang Elektronik",
    name: "Lampu LED 12 W",
    sku: "LSK-001",
    unit: "pcs",
    stock: 24,
    minStock: 10,
    buyPrice: 25000,
    sellPrice: 32000,
  },
  {
    id: "listrik-kabel",
    storeId: "listrik",
    store: "Gemilang Elektronik",
    name: "Kabel NYM 2x1,5 mm",
    sku: "LSK-002",
    unit: "meter",
    stock: 80,
    minStock: 20,
    buyPrice: 10000,
    sellPrice: 12500,
  },
  {
    id: "furniture-kursi",
    storeId: "furniture",
    store: "Kasandra Furniture",
    name: "Kursi Kayu Jati",
    sku: "FUR-001",
    unit: "pcs",
    stock: 6,
    minStock: 2,
    buyPrice: 650000,
    sellPrice: 850000,
  },
  {
    id: "furniture-meja",
    storeId: "furniture",
    store: "Kasandra Furniture",
    name: "Meja Kerja 120 cm",
    sku: "FUR-002",
    unit: "pcs",
    stock: 3,
    minStock: 2,
    buyPrice: 1000000,
    sellPrice: 1250000,
  },
];

const SUPPLIERS = [
  {
    id: "sup-tani",
    storeId: "pupuk",
    store: "Rezeki Tani",
    name: "CV Tani Makmur",
    phone: "0812-0000-0011",
    address: "Jl. Tani Raya No. 8 (contoh)",
    active: true,
  },
  {
    id: "sup-material",
    storeId: "bangunan",
    store: "Central Jaya Bangunan",
    name: "CV Sumber Material",
    phone: "0812-0000-0012",
    address: "Jl. Material No. 21 (contoh)",
    active: true,
  },
  {
    id: "sup-kertas",
    storeId: "atk",
    store: "Dewi Foto Copy",
    name: "PT Kertas Nusantara",
    phone: "0812-0000-0013",
    address: "Jl. Kantor No. 5 (contoh)",
    active: true,
  },
  {
    id: "sup-terang",
    storeId: "listrik",
    store: "Gemilang Elektronik",
    name: "CV Terang Abadi",
    phone: "0812-0000-0014",
    address: "Jl. Listrik No. 17 (contoh)",
    active: true,
  },
  {
    id: "sup-kayu",
    storeId: "furniture",
    store: "Kasandra Furniture",
    name: "CV Kayu Jati",
    phone: "0812-0000-0015",
    address: "Jl. Mebel No. 3 (contoh)",
    active: false,
  },
  {
    id: "sup-mebel",
    storeId: "furniture",
    store: "Kasandra Furniture",
    name: "CV Mebel Sejahtera",
    phone: "0812-0000-0016",
    address: "Jl. Interior No. 9 (contoh)",
    active: true,
  },
];

const PURCHASES = [
  {
    id: "purchase-319",
    invoice: "PO-2026-0319",
    storeId: "bangunan",
    store: "Central Jaya Bangunan",
    supplier: "CV Sumber Material",
    date: "2026-10-25",
    dateLabel: "25 Okt 2026",
    total: 3400000,
    paymentMethod: "transfer",
    items: 1,
    status: "received",
  },
  {
    id: "purchase-318",
    invoice: "PO-2026-0318",
    storeId: "atk",
    store: "Dewi Foto Copy",
    supplier: "PT Kertas Nusantara",
    date: "2026-10-22",
    dateLabel: "22 Okt 2026",
    total: 1030000,
    paymentMethod: "cash",
    items: 2,
    status: "received",
  },
  {
    id: "purchase-317",
    invoice: "PO-2026-0317",
    storeId: "listrik",
    store: "Gemilang Elektronik",
    supplier: "CV Terang Abadi",
    date: "2026-10-18",
    dateLabel: "18 Okt 2026",
    total: 1960000,
    paymentMethod: "transfer",
    items: 2,
    status: "received",
  },
  {
    id: "purchase-316",
    invoice: "PO-2026-0316",
    storeId: "pupuk",
    store: "Rezeki Tani",
    supplier: "CV Tani Makmur",
    date: "2026-10-12",
    dateLabel: "12 Okt 2026",
    total: 2800000,
    paymentMethod: "cash",
    items: 1,
    status: "received",
  },
];

const VIEW_OPTIONS = [
  { value: "stok", label: "Stok" },
  { value: "pembelian", label: "Pembelian" },
  { value: "pemasok", label: "Pemasok" },
];

function formatPrice(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

function firstSupplierFor(storeId) {
  return (
    SUPPLIERS.find(
      (supplier) => supplier.storeId === storeId && supplier.active
    )?.id || ""
  );
}

function firstProductFor(storeId, products) {
  return products.find((product) => product.storeId === storeId)?.id || "";
}

function stockStatus(product) {
  if (product.stock === 0) {
    return { label: "Habis", tone: "danger", icon: "lucide:x-circle" };
  }
  if (product.stock <= product.minStock) {
    return { label: "Menipis", tone: "warning", icon: "lucide:triangle-alert" };
  }
  return { label: "Aman", tone: "positive", icon: "lucide:circle-check" };
}

export default function Page() {
  const [view, setView] = useState("stok");
  const [storeFilter, setStoreFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(PRODUCTS);
  const [purchases, setPurchases] = useState(PURCHASES);
  const [notice, setNotice] = useState("");
  const [adjustProduct, setAdjustProduct] = useState(null);
  const [adjustNewStock, setAdjustNewStock] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseStore, setPurchaseStore] = useState("bangunan");
  const [purchaseSupplier, setPurchaseSupplier] = useState("");
  const [purchaseProduct, setPurchaseProduct] = useState("");
  const [purchaseQty, setPurchaseQty] = useState("1");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseMethod, setPurchaseMethod] = useState("cash");
  const [purchaseSeq, setPurchaseSeq] = useState(320);
  const adjustRef = useRef(null);
  const purchaseRef = useRef(null);

  useEffect(() => {
    if (adjustProduct && adjustRef.current && !adjustRef.current.open) {
      adjustRef.current.showModal();
    }
  }, [adjustProduct]);

  useEffect(() => {
    if (purchaseOpen && purchaseRef.current && !purchaseRef.current.open) {
      purchaseRef.current.showModal();
    }
  }, [purchaseOpen]);

  useEffect(() => {
    if (!adjustProduct && !purchaseOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [adjustProduct, purchaseOpen]);

  const storeProducts = products.filter(
    (product) => storeFilter === "all" || product.storeId === storeFilter
  );
  const normalizedSearch = search.trim().toLowerCase();
  const filteredStock = storeProducts.filter((product) => {
    if (!normalizedSearch) return true;
    return [product.name, product.sku].join(" ").toLowerCase().includes(normalizedSearch);
  });
  const storePurchases = purchases.filter(
    (purchase) => storeFilter === "all" || purchase.storeId === storeFilter
  );
  const storeSuppliers = SUPPLIERS.filter(
    (supplier) => storeFilter === "all" || supplier.storeId === storeFilter
  );
  const inventoryValue = storeProducts.reduce(
    (sum, product) => sum + product.stock * product.buyPrice,
    0
  );
  const lowStockCount = storeProducts.filter(
    (product) => product.stock <= product.minStock
  ).length;
  const monthKey = "2026-10";
  const monthlyPurchaseTotal = storePurchases
    .filter((purchase) => purchase.date.startsWith(monthKey))
    .reduce((sum, purchase) => sum + purchase.total, 0);
  const activeSupplierCount = storeSuppliers.filter(
    (supplier) => supplier.active
  ).length;

  const purchaseProductOptions = products.filter(
    (product) => product.storeId === purchaseStore
  );
  const purchaseSupplierOptions = SUPPLIERS.filter(
    (supplier) => supplier.storeId === purchaseStore && supplier.active
  );
  const selectedPurchaseSupplier = SUPPLIERS.find(
    (supplier) => supplier.id === purchaseSupplier
  );
  const selectedPurchaseProduct = products.find(
    (product) => product.id === purchaseProduct
  );
  const purchaseQtyNumber = Number(purchaseQty);
  const purchasePriceNumber = Number(purchasePrice);
  const purchaseTotal = purchaseQtyNumber * purchasePriceNumber;
  const purchaseValid =
    Boolean(purchaseStore) &&
    Boolean(selectedPurchaseSupplier) &&
    Boolean(selectedPurchaseProduct) &&
    purchaseQtyNumber > 0 &&
    purchasePriceNumber > 0;

  function openAdjust(product) {
    setAdjustProduct(product);
    setAdjustNewStock(String(product.stock));
    setAdjustNote("");
  }

  function saveAdjust(event) {
    event.preventDefault();
    if (!adjustProduct) return;
    const nextStock = Number(adjustNewStock);
    if (!Number.isFinite(nextStock) || nextStock < 0) return;
    const oldStock = adjustProduct.stock;
    setProducts((previous) =>
      previous.map((product) =>
        product.id === adjustProduct.id ? { ...product, stock: nextStock } : product
      )
    );
    setNotice(
      "Stok " +
        adjustProduct.name +
        " disesuaikan dari " +
        oldStock +
        " menjadi " +
        nextStock +
        "." +
        (adjustNote.trim() ? " Catatan: " + adjustNote.trim() + "." : "")
    );
    adjustRef.current?.close();
  }

  function openPurchase() {
    const initialStore = storeFilter === "all" ? "bangunan" : storeFilter;
    const initialProduct = firstProductFor(initialStore, products);
    const product = products.find((candidate) => candidate.id === initialProduct);
    setPurchaseStore(initialStore);
    setPurchaseSupplier(firstSupplierFor(initialStore));
    setPurchaseProduct(initialProduct);
    setPurchasePrice(product ? String(product.buyPrice) : "");
    setPurchaseQty("1");
    setPurchaseMethod("cash");
    setPurchaseOpen(true);
  }

  function handlePurchaseStoreChange(nextStoreId) {
    const nextProduct = firstProductFor(nextStoreId, products);
    const product = products.find((candidate) => candidate.id === nextProduct);
    setPurchaseStore(nextStoreId);
    setPurchaseSupplier(firstSupplierFor(nextStoreId));
    setPurchaseProduct(nextProduct);
    setPurchasePrice(product ? String(product.buyPrice) : "");
  }

  function handlePurchaseProductChange(nextProductId) {
    const product = products.find((candidate) => candidate.id === nextProductId);
    setPurchaseProduct(nextProductId);
    setPurchasePrice(product ? String(product.buyPrice) : "");
  }

  function savePurchase(event) {
    event.preventDefault();
    if (!purchaseValid || !selectedPurchaseProduct || !selectedPurchaseSupplier) return;
    const store = STORES.find((candidate) => candidate.id === purchaseStore);
    if (!store) return;
    const now = new Date();
    const dateIso = now.toISOString().slice(0, 10);
    const dateLabel = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const invoice = "PO-2026-" + String(purchaseSeq).padStart(4, "0");
    const newPurchase = {
      id: "purchase-" + purchaseSeq,
      invoice,
      storeId: purchaseStore,
      store: store.name,
      supplier: selectedPurchaseSupplier.name,
      date: dateIso,
      dateLabel,
      total: purchaseTotal,
      paymentMethod: purchaseMethod,
      items: 1,
      status: "received",
    };

    setPurchases((previous) => [newPurchase, ...previous]);
    setProducts((previous) =>
      previous.map((product) =>
        product.id === selectedPurchaseProduct.id
          ? {
              ...product,
              stock: product.stock + purchaseQtyNumber,
              buyPrice: purchasePriceNumber,
            }
          : product
      )
    );
    setPurchaseSeq((previous) => previous + 1);
    setNotice(
      "Pembelian " +
        invoice +
        " disimpan; stok " +
        selectedPurchaseProduct.name +
        " bertambah " +
        purchaseQtyNumber +
        "."
    );
    purchaseRef.current?.close();
  }

  function resetSearch() {
    setSearch("");
  }

  return (
    <div className="stok-root">
      <header className="stok-header">
        <div className="stok-header-copy">
          <p className="stok-kicker">Operasional</p>
          <h1 className="stok-title">Stok & pembelian.</h1>
          <p className="stok-lede">
            Pantau persediaan, catat barang masuk, dan jaga stok tetap akurat.
          </p>
        </div>
        <div className="stok-header-actions">
          <span className="stok-chip">
            <iconify-icon icon="lucide:info" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
            Data contoh
          </span>
          <button type="button" className="stok-primary" onClick={openPurchase}>
            <iconify-icon icon="lucide:plus" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
            Catat pembelian
          </button>
        </div>
      </header>

      <section className="stok-summary" aria-label="Ringkasan stok">
        <div className="stok-summary-grid">
          <div>
            <p className="stok-metric-label">Nilai stok</p>
            <p className="stok-metric-value">{formatPrice(inventoryValue)}</p>
            <p className="stok-metric-sub">Harga beli × stok saat ini</p>
          </div>
          <div>
            <p className="stok-metric-label">Barang menipis</p>
            <p className="stok-metric-value">{lowStockCount}</p>
            <p className="stok-metric-sub">Pada atau di bawah minimum</p>
          </div>
          <div>
            <p className="stok-metric-label">Pembelian bulan ini</p>
            <p className="stok-metric-value">{formatPrice(monthlyPurchaseTotal)}</p>
            <p className="stok-metric-sub">Oktober 2026</p>
          </div>
          <div>
            <p className="stok-metric-label">Pemasok aktif</p>
            <p className="stok-metric-value">{activeSupplierCount}</p>
            <p className="stok-metric-sub">Dari {storeSuppliers.length} pemasok</p>
          </div>
        </div>
      </section>

      <section className="stok-toolbar" aria-label="Filter stok">
        <div className="stok-segment" role="group" aria-label="Tampilan stok dan pembelian">
          {VIEW_OPTIONS.map((option) => (
            <button
              type="button"
              className="stok-segment-button"
              key={option.value}
              aria-pressed={view === option.value}
              onClick={() => setView(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="stok-field stok-field-store">
          <label className="stok-label" htmlFor="stok-store">
            Toko
          </label>
          <select
            id="stok-store"
            className="stok-select"
            value={storeFilter}
            onChange={(event) => setStoreFilter(event.target.value)}
          >
            <option value="all">Semua toko</option>
            {STORES.map((store) => (
              <option value={store.id} key={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {view === "stok" ? (
          <div className="stok-field stok-field-search">
            <label className="stok-label" htmlFor="stok-search">
              Cari barang
            </label>
            <div className="stok-search-wrap">
              <iconify-icon
                className="stok-search-icon"
                icon="lucide:search"
                aria-hidden="true"
                style={{ fontSize: "18px" }}
              ></iconify-icon>
              <input
                id="stok-search"
                className="stok-input stok-input-search"
                type="search"
                value={search}
                placeholder="Nama barang atau SKU"
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        ) : null}
      </section>

      {view === "stok" ? (
        <section className="stok-card">
          <div className="stok-panel-head">
            <div>
              <h2 className="stok-panel-title">Persediaan barang</h2>
              <p className="stok-panel-sub">Stok saat ini, batas minimum, dan harga beli.</p>
            </div>
            <span className="stok-count">{filteredStock.length} barang</span>
          </div>

          {filteredStock.length > 0 ? (
            <>
              <div className="stok-table-scroll">
                <table className="stok-table">
                  <caption className="stok-sr-only">
                    Daftar persediaan barang per toko
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Barang</th>
                      <th scope="col">Toko</th>
                      <th scope="col" style={{ textAlign: "right" }}>
                        Stok
                      </th>
                      <th scope="col" style={{ textAlign: "right" }}>
                        Minimum
                      </th>
                      <th scope="col">Status</th>
                      <th scope="col" style={{ textAlign: "right" }}>
                        Harga beli
                      </th>
                      <th scope="col">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStock.map((product) => {
                      const status = stockStatus(product);
                      return (
                        <tr key={product.id}>
                          <td>
                            <span className="stok-product-name">{product.name}</span>
                            <span className="stok-product-meta"> · {product.sku}</span>
                          </td>
                          <td>
                            <span className="store-cell">
                              <img
                                className="store-cell-logo"
                                src={storeLogos[product.storeId]}
                                alt=""
                                loading="lazy"
                                decoding="async"
                              />
                              {product.store}
                            </span>
                          </td>
                          <td className="stok-number">{product.stock}</td>
                          <td className="stok-number">{product.minStock}</td>
                          <td>
                            <span className="stok-status">
                              <iconify-icon
                                className="stok-status-icon"
                                data-tone={status.tone}
                                icon={status.icon}
                                aria-hidden="true"
                                style={{ fontSize: "14px" }}
                              ></iconify-icon>
                              {status.label}
                            </span>
                          </td>
                          <td className="stok-number">{formatPrice(product.buyPrice)}</td>
                          <td>
                            <button
                              type="button"
                              className="stok-adjust"
                              onClick={() => openAdjust(product)}
                            >
                              Sesuaikan
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="stok-table-hint">Geser tabel untuk melihat semua kolom.</p>
            </>
          ) : (
            <div className="stok-empty" role="status">
              <iconify-icon
                icon="lucide:search-x"
                aria-hidden="true"
                style={{ flex: "0 0 auto", fontSize: "24px" }}
              ></iconify-icon>
              <div className="stok-empty-copy">
                <h3 className="stok-empty-title">Barang tidak ditemukan</h3>
                <p className="stok-empty-text">
                  Coba kata kunci lain atau reset pencarian.
                </p>
                <button type="button" className="stok-reset" onClick={resetSearch}>
                  Reset pencarian
                </button>
              </div>
            </div>
          )}
        </section>
      ) : view === "pembelian" ? (
        <section className="stok-card">
          <div className="stok-panel-head">
            <div>
              <h2 className="stok-panel-title">Pembelian terbaru</h2>
              <p className="stok-panel-sub">
                Barang masuk dari pemasok. Pembelian baru menambah stok otomatis.
              </p>
            </div>
            <span className="stok-count">{storePurchases.length} pembelian</span>
          </div>

          {storePurchases.length > 0 ? (
            <>
              <div className="stok-table-scroll">
                <table className="stok-table">
                  <caption className="stok-sr-only">Daftar pembelian terbaru</caption>
                  <thead>
                    <tr>
                      <th scope="col">Invoice</th>
                      <th scope="col">Tanggal</th>
                      <th scope="col">Toko</th>
                      <th scope="col">Pemasok</th>
                      <th scope="col">Metode</th>
                      <th scope="col" style={{ textAlign: "right" }}>
                        Barang
                      </th>
                      <th scope="col" style={{ textAlign: "right" }}>
                        Total
                      </th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storePurchases.map((purchase) => (
                      <tr key={purchase.id}>
                        <td>
                          <span className="stok-product-name">{purchase.invoice}</span>
                        </td>
                        <td>{purchase.dateLabel}</td>
                        <td>
                          <span className="store-cell">
                            <img
                              className="store-cell-logo"
                              src={storeLogos[purchase.storeId]}
                              alt=""
                              loading="lazy"
                              decoding="async"
                            />
                            {purchase.store}
                          </span>
                        </td>
                        <td>{purchase.supplier}</td>
                        <td>{purchase.paymentMethod === "cash" ? "Tunai" : "Transfer"}</td>
                        <td className="stok-number">{purchase.items}</td>
                        <td className="stok-number">{formatPrice(purchase.total)}</td>
                        <td>
                          <span className="stok-status">
                            <iconify-icon
                              className="stok-status-icon"
                              data-tone="positive"
                              icon="lucide:circle-check"
                              aria-hidden="true"
                              style={{ fontSize: "14px" }}
                            ></iconify-icon>
                            Diterima
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="stok-table-hint">Geser tabel untuk melihat semua kolom.</p>
            </>
          ) : (
            <div className="stok-empty" role="status">
              <iconify-icon
                icon="lucide:package"
                aria-hidden="true"
                style={{ flex: "0 0 auto", fontSize: "24px" }}
              ></iconify-icon>
              <div className="stok-empty-copy">
                <h3 className="stok-empty-title">Belum ada pembelian</h3>
                <p className="stok-empty-text">
                  Catat pembelian pertama untuk toko ini lewat tombol Catat pembelian.
                </p>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="stok-card">
          <div className="stok-panel-head">
            <div>
              <h2 className="stok-panel-title">Pemasok</h2>
              <p className="stok-panel-sub">Daftar pemasok yang terhubung dengan toko.</p>
            </div>
            <span className="stok-count">{storeSuppliers.length} pemasok</span>
          </div>

          {storeSuppliers.length > 0 ? (
            <>
              <div className="stok-table-scroll">
                <table className="stok-table">
                  <caption className="stok-sr-only">Daftar pemasok</caption>
                  <thead>
                    <tr>
                      <th scope="col">Nama</th>
                      <th scope="col">Toko</th>
                      <th scope="col">Telepon</th>
                      <th scope="col">Alamat</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeSuppliers.map((supplier) => (
                      <tr key={supplier.id}>
                        <td>
                          <span className="stok-product-name">{supplier.name}</span>
                        </td>
                        <td>
                          <span className="store-cell">
                            <img
                              className="store-cell-logo"
                              src={storeLogos[supplier.storeId]}
                              alt=""
                              loading="lazy"
                              decoding="async"
                            />
                            {supplier.store}
                          </span>
                        </td>
                        <td>{supplier.phone}</td>
                        <td>{supplier.address}</td>
                        <td>
                          <span className="stok-status">
                            <iconify-icon
                              className="stok-status-icon"
                              data-tone={supplier.active ? "positive" : "danger"}
                              icon={supplier.active ? "lucide:circle-check" : "lucide:x-circle"}
                              aria-hidden="true"
                              style={{ fontSize: "14px" }}
                            ></iconify-icon>
                            {supplier.active ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="stok-table-hint">Geser tabel untuk melihat semua kolom.</p>
            </>
          ) : (
            <div className="stok-empty" role="status">
              <iconify-icon
                icon="lucide:truck"
                aria-hidden="true"
                style={{ flex: "0 0 auto", fontSize: "24px" }}
              ></iconify-icon>
              <div className="stok-empty-copy">
                <h3 className="stok-empty-title">Belum ada pemasok</h3>
                <p className="stok-empty-text">
                  Pilih toko lain untuk melihat daftar pemasok.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      <p className="stok-sample-note">
        <iconify-icon icon="lucide:info" aria-hidden="true" style={{ flex: "0 0 auto", fontSize: "14px" }}></iconify-icon>
        Data barang, pemasok, dan pembelian adalah contoh. Perubahan stok hanya tersimpan selama
        prototype dibuka dan tidak terhubung ke database.
      </p>

      <div className="stok-toast-region" role="status" aria-live="polite" aria-atomic="true">
        {notice ? (
          <div className="stok-toast">
            <iconify-icon
              icon="lucide:info"
              aria-hidden="true"
              style={{ flex: "0 0 auto", fontSize: "18px", color: "var(--color-accent-text)" }}
            ></iconify-icon>
            <div className="stok-toast-copy">
              <span className="stok-toast-title">Pemberitahuan</span>
              <span className="stok-toast-text">{notice}</span>
            </div>
            <button
              type="button"
              className="stok-toast-close"
              aria-label="Tutup pemberitahuan"
              onClick={() => setNotice("")}
            >
              <iconify-icon icon="lucide:x" aria-hidden="true" style={{ fontSize: "16px" }}></iconify-icon>
            </button>
          </div>
        ) : null}
      </div>

      <dialog
        ref={adjustRef}
        className="stok-dialog"
        aria-labelledby="adjust-title"
        onClose={() => setAdjustProduct(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        {adjustProduct ? (
          <div className="stok-dialog-inner">
            <div className="stok-dialog-top">
              <div>
                <h2 className="stok-dialog-title" id="adjust-title">
                  Sesuaikan stok
                </h2>
                <p className="stok-dialog-sub">
                  {adjustProduct.name} · {adjustProduct.store}
                </p>
              </div>
              <button
                type="button"
                className="stok-dialog-close"
                aria-label="Tutup penyesuaian stok"
                onClick={() => adjustRef.current?.close()}
              >
                <iconify-icon icon="lucide:x" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
              </button>
            </div>

            <form className="stok-form" onSubmit={saveAdjust}>
              <p className="stok-dialog-info">
                Stok saat ini <strong>{adjustProduct.stock}</strong> {adjustProduct.unit} ·
                Minimum <strong>{adjustProduct.minStock}</strong>
              </p>
              <div className="stok-form-field">
                <label className="stok-form-label" htmlFor="adjust-stock">
                  Stok fisik baru
                </label>
                <input
                  id="adjust-stock"
                  className="stok-form-input"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={adjustNewStock}
                  onChange={(event) => setAdjustNewStock(event.target.value)}
                />
              </div>
              <div className="stok-form-field">
                <label className="stok-form-label" htmlFor="adjust-note">
                  Catatan (opsional)
                </label>
                <textarea
                  id="adjust-note"
                  className="stok-form-textarea"
                  value={adjustNote}
                  onChange={(event) => setAdjustNote(event.target.value)}
                ></textarea>
              </div>
              <div className="stok-dialog-actions">
                <button
                  type="submit"
                  className="stok-dialog-primary"
                  disabled={adjustNewStock === "" || Number(adjustNewStock) < 0}
                >
                  Simpan penyesuaian
                </button>
                <button
                  type="button"
                  className="stok-dialog-secondary"
                  onClick={() => adjustRef.current?.close()}
                >
                  Batal
                </button>
              </div>
              <p className="stok-dialog-note">
                {adjustNewStock === "" || Number(adjustNewStock) < 0
                  ? "Masukkan jumlah stok fisik 0 atau lebih."
                  : "Prototype: penyesuaian hanya mengubah stok di halaman ini."}
              </p>
            </form>
          </div>
        ) : null}
      </dialog>

      <dialog
        ref={purchaseRef}
        className="stok-dialog"
        aria-labelledby="purchase-title"
        onClose={() => setPurchaseOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        {purchaseOpen ? (
          <div className="stok-dialog-inner">
            <div className="stok-dialog-top">
              <div>
                <h2 className="stok-dialog-title" id="purchase-title">
                  Catat pembelian
                </h2>
                <p className="stok-dialog-sub">Barang masuk dari pemasok.</p>
              </div>
              <button
                type="button"
                className="stok-dialog-close"
                aria-label="Tutup form pembelian"
                onClick={() => purchaseRef.current?.close()}
              >
                <iconify-icon icon="lucide:x" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
              </button>
            </div>

            <form className="stok-form" onSubmit={savePurchase}>
              <div className="stok-form-row">
                <div className="stok-form-field">
                  <label className="stok-form-label" htmlFor="purchase-store">
                    Toko
                  </label>
                  <select
                    id="purchase-store"
                    className="stok-form-select"
                    value={purchaseStore}
                    onChange={(event) => handlePurchaseStoreChange(event.target.value)}
                  >
                    {STORES.map((store) => (
                      <option value={store.id} key={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="stok-form-field">
                  <label className="stok-form-label" htmlFor="purchase-supplier">
                    Pemasok
                  </label>
                  <select
                    id="purchase-supplier"
                    className="stok-form-select"
                    value={purchaseSupplier}
                    onChange={(event) => setPurchaseSupplier(event.target.value)}
                  >
                    <option value="">Pilih pemasok</option>
                    {purchaseSupplierOptions.map((supplier) => (
                      <option value={supplier.id} key={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="stok-form-field">
                <label className="stok-form-label" htmlFor="purchase-product">
                  Barang
                </label>
                <select
                  id="purchase-product"
                  className="stok-form-select"
                  value={purchaseProduct}
                  onChange={(event) => handlePurchaseProductChange(event.target.value)}
                >
                  <option value="">Pilih barang</option>
                  {purchaseProductOptions.map((product) => (
                    <option value={product.id} key={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="stok-form-row">
                <div className="stok-form-field">
                  <label className="stok-form-label" htmlFor="purchase-qty">
                    Jumlah
                  </label>
                  <input
                    id="purchase-qty"
                    className="stok-form-input"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={purchaseQty}
                    onChange={(event) => setPurchaseQty(event.target.value)}
                  />
                </div>
                <div className="stok-form-field">
                  <label className="stok-form-label" htmlFor="purchase-price">
                    Harga beli per unit
                  </label>
                  <input
                    id="purchase-price"
                    className="stok-form-input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={purchasePrice}
                    onChange={(event) => setPurchasePrice(event.target.value)}
                  />
                </div>
              </div>

              <div className="stok-form-field">
                <label className="stok-form-label" htmlFor="purchase-method">
                  Metode bayar
                </label>
                <select
                  id="purchase-method"
                  className="stok-form-select"
                  value={purchaseMethod}
                  onChange={(event) => setPurchaseMethod(event.target.value)}
                >
                  <option value="cash">Tunai</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>

              <div className="stok-dialog-total">
                <span className="stok-dialog-total-label">Total pembelian</span>
                <span className="stok-dialog-total-value">
                  {formatPrice(purchaseTotal > 0 ? purchaseTotal : 0)}
                </span>
              </div>

              <div className="stok-dialog-actions">
                <button type="submit" className="stok-dialog-primary" disabled={!purchaseValid}>
                  Simpan pembelian
                </button>
                <button
                  type="button"
                  className="stok-dialog-secondary"
                  onClick={() => purchaseRef.current?.close()}
                >
                  Batal
                </button>
              </div>
              <p className="stok-dialog-note">
                {purchaseValid
                  ? "Prototype: satu barang per catatan. Pembelian baru menambah stok dan tampil di daftar pembelian."
                  : "Lengkapi pemasok, barang, jumlah, dan harga untuk menyimpan."}
              </p>
            </form>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
