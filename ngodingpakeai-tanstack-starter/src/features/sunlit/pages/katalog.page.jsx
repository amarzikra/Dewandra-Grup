import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { storeLogos } from "@/config/dewandra";
import { useCart } from "@/features/sunlit/cart";
import { formatPrice } from "@/features/sunlit/format";

function getStatus(product) {
  if (product.stock === 0) {
    return { label: "Habis", tone: "danger", icon: "lucide:x-circle" };
  }
  if (product.stock <= product.minStock) {
    return {
      label: "Stok menipis",
      tone: "warning",
      icon: "lucide:triangle-alert",
    };
  }
  return { label: "Tersedia", tone: "positive", icon: "lucide:circle-check" };
}

function StatusChip({ product }) {
  const status = getStatus(product);
  return (
    <span className="catalog-status">
      <iconify-icon
        className="catalog-status-icon"
        data-tone={status.tone}
        icon={status.icon}
        aria-hidden="true"
        style={{ fontSize: "14px" }}
      ></iconify-icon>
      {status.label}
    </span>
  );
}

function StoreLogo({ category }) {
  const src = storeLogos[category];
  if (!src) return null;
  return (
    <img
      className="catalog-store-logo"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}

function ProductCard({ product, onOpen, onAdd, isOwner }) {
  return (
    <article className="catalog-card">
      <div className="catalog-card-top">
        <span className="catalog-store">
          <StoreLogo category={product.storeCategory} />
          {product.store}
        </span>
        <StatusChip product={product} />
      </div>
      <h3 className="catalog-card-name">{product.name}</h3>
      <p className="catalog-card-description">{product.description}</p>
      <p className="catalog-card-meta">
        {product.sku}
        {product.barcode ? ` · ${product.barcode}` : ""}
      </p>
      <div className="catalog-card-footer">
        <span className="catalog-price">
          {formatPrice(product.price)}
          <span className="catalog-unit"> / {product.unit}</span>
        </span>
        <div className="catalog-card-actions">
          {isOwner ? null : (
            <button
              type="button"
              className="catalog-add-button"
              disabled={product.stock === 0}
              onClick={() => onAdd(product)}
            >
              <iconify-icon
                icon="lucide:plus"
                aria-hidden="true"
                style={{ fontSize: "14px" }}
              ></iconify-icon>
              Tambah
            </button>
          )}
          <button
            type="button"
            className="catalog-detail-button"
            onClick={() => onOpen(product)}
          >
            Detail
            <iconify-icon
              icon="lucide:arrow-right"
              aria-hidden="true"
              style={{ fontSize: "14px" }}
            ></iconify-icon>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Page({ mode = "public", catalog }) {
  const [query, setQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [added, setAdded] = useState("");
  const dialogRef = useRef(null);
  const isOwner = mode === "owner";
  const cart = useCart();
  const stores = catalog?.stores ?? [];
  const products = catalog?.products ?? [];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) {
      dialog.showModal();
    }
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesStore =
      storeFilter === "all" || product.storeId === storeFilter;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [product.name, product.sku, product.barcode ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    return matchesStore && matchesQuery;
  });

  function resetFilters() {
    setQuery("");
    setStoreFilter("all");
  }

  function closeDialog() {
    setSelected(null);
  }

  function addProduct(product) {
    cart.add(
      {
        productId: product.id,
        storeId: product.storeId,
        storeName: product.store,
        storeCategory: product.storeCategory,
        name: product.name,
        unit: product.unit,
        price: product.price,
        stock: product.stock,
      },
      1,
    );
    setAdded(`${product.name} masuk keranjang.`);
    window.setTimeout(() => setAdded(""), 2500);
  }

  const selectedStatus = selected ? getStatus(selected) : null;

  return (
    <div className="catalog-root">
      <header className="catalog-header">
        <div className="catalog-header-copy">
          <p className="catalog-kicker">
            {isOwner ? "Katalog & stok" : "Katalog publik"}
          </p>
          <h1 className="catalog-title">
            {isOwner
              ? "Semua barang dari lima toko."
              : "Cari kebutuhan dari lima toko."}
          </h1>
          <p className="catalog-lede">
            {isOwner
              ? "Telusuri barang, saring per toko, dan cek status ketersediaan stok di satu layar."
              : "Tambahkan barang ke keranjang, lalu checkout. Stok dan harga mengikuti data toko."}
          </p>
        </div>
        <span className="catalog-sample-chip">
          <iconify-icon
            icon="lucide:database"
            aria-hidden="true"
            style={{ fontSize: "14px" }}
          ></iconify-icon>
          Stok terbaru
        </span>
      </header>

      <section className="catalog-filter-panel" aria-label="Filter katalog">
        <div className="catalog-filter-grid">
          <div className="catalog-field">
            <label className="catalog-label" htmlFor="catalog-search">
              Cari barang
            </label>
            <div className="catalog-search">
              <iconify-icon
                className="catalog-search-icon"
                icon="lucide:search"
                aria-hidden="true"
                style={{ fontSize: "18px" }}
              ></iconify-icon>
              <input
                id="catalog-search"
                className="catalog-input"
                type="search"
                value={query}
                placeholder="Nama barang, SKU, atau barcode"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="catalog-field">
            <label className="catalog-label" htmlFor="catalog-store">
              Toko
            </label>
            <select
              id="catalog-store"
              className="catalog-select"
              value={storeFilter}
              onChange={(event) => setStoreFilter(event.target.value)}
            >
              <option value="all">Semua toko</option>
              {stores.map((store) => (
                <option value={store.id} key={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p
          className="catalog-result"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Menampilkan{" "}
          <strong
            style={{ color: "var(--color-text)", fontWeight: "var(--weight-semibold)" }}
          >
            {filteredProducts.length}
          </strong>{" "}
          barang
          {storeFilter === "all"
            ? " dari semua toko"
            : " dari " + (stores.find((store) => store.id === storeFilter)?.name ?? "")}
          .
        </p>
      </section>

      {added && !isOwner ? (
        <p className="catalog-toast" role="status">
          <iconify-icon
            icon="lucide:shopping-basket"
            aria-hidden="true"
            style={{ fontSize: "16px" }}
          ></iconify-icon>
          {added}
        </p>
      ) : null}

      <div className="catalog-grid-wrap">
        <h2 className="catalog-sr-only">Daftar barang</h2>
        {filteredProducts.length > 0 ? (
          <div className="catalog-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                product={product}
                onOpen={setSelected}
                onAdd={addProduct}
                isOwner={isOwner}
                key={product.id}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty" role="status">
            <iconify-icon
              icon="lucide:search-x"
              aria-hidden="true"
              style={{
                flex: "0 0 auto",
                fontSize: "24px",
                color: "var(--color-text-muted)",
              }}
            ></iconify-icon>
            <div className="catalog-empty-copy">
              <h3 className="catalog-empty-title">Barang tidak ditemukan</h3>
              <p className="catalog-empty-text">
                Coba kata kunci lain atau pilih semua toko untuk melihat seluruh
                katalog.
              </p>
              <button type="button" className="catalog-reset" onClick={resetFilters}>
                Reset filter
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="catalog-sample-note">
        <iconify-icon
          icon="lucide:info"
          aria-hidden="true"
          style={{ flex: "0 0 auto", fontSize: "14px" }}
        ></iconify-icon>
        {isOwner
          ? "Data stok berasal dari database toko. Perubahan stok dicatat saat transaksi atau penyesuaian."
          : "Pesanan online diverifikasi admin. Stok dapat berubah sebelum pembayaran dikonfirmasi."}
      </p>

      {!isOwner && cart.count > 0 ? (
        <div className="catalog-cart-bar" role="region" aria-label="Keranjang">
          <div className="catalog-cart-copy">
            <span className="catalog-cart-count">{cart.count} barang</span>
            <strong>{formatPrice(cart.total)}</strong>
          </div>
          <Link className="catalog-cart-checkout" to="/checkout">
            Checkout
            <iconify-icon
              icon="lucide:arrow-right"
              aria-hidden="true"
              style={{ fontSize: "16px" }}
            ></iconify-icon>
          </Link>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        className="catalog-dialog"
        aria-labelledby="catalog-dialog-title"
        onClose={closeDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        {selected ? (
          <div className="catalog-dialog-inner">
            <div className="catalog-dialog-top">
              <span className="catalog-status">
                <iconify-icon
                  className="catalog-status-icon"
                  data-tone={selectedStatus.tone}
                  icon={selectedStatus.icon}
                  aria-hidden="true"
                  style={{ fontSize: "14px" }}
                ></iconify-icon>
                {selectedStatus.label}
              </span>
              <button
                type="button"
                className="catalog-dialog-close"
                aria-label="Tutup detail barang"
                onClick={() => dialogRef.current?.close()}
              >
                <iconify-icon
                  icon="lucide:x"
                  aria-hidden="true"
                  style={{ fontSize: "18px" }}
                ></iconify-icon>
              </button>
            </div>

            <p className="catalog-store">
              <StoreLogo category={selected.storeCategory} />
              {selected.store}
            </p>
            <h2 className="catalog-dialog-title" id="catalog-dialog-title">
              {selected.name}
            </h2>
            <p className="catalog-dialog-description">{selected.description}</p>
            <p className="catalog-dialog-price">
              {formatPrice(selected.price)}
              <span>/ {selected.unit}</span>
            </p>

            <dl className="catalog-dialog-meta">
              <dt>SKU</dt>
              <dd>{selected.sku}</dd>
              <dt>Barcode</dt>
              <dd>{selected.barcode || "-"}</dd>
              <dt>Satuan</dt>
              <dd>{selected.unit}</dd>
              <dt>Status stok</dt>
              <dd>{selectedStatus.label}</dd>
            </dl>

            <div className="catalog-dialog-actions">
              {isOwner ? (
                <Link className="catalog-dialog-primary" to="/stok">
                  Kelola stok
                  <iconify-icon
                    icon="lucide:arrow-right"
                    aria-hidden="true"
                    style={{ fontSize: "16px" }}
                  ></iconify-icon>
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    className="catalog-dialog-primary"
                    disabled={selected.stock === 0}
                    onClick={() => {
                      addProduct(selected);
                      dialogRef.current?.close();
                    }}
                  >
                    <iconify-icon
                      icon="lucide:shopping-basket"
                      aria-hidden="true"
                      style={{ fontSize: "16px" }}
                    ></iconify-icon>
                    Tambah ke keranjang
                  </button>
                  <Link
                    className="catalog-dialog-secondary"
                    to="/profil-kontak"
                  >
                    Tanya ketersediaan
                  </Link>
                </>
              )}
            </div>
            <p className="catalog-dialog-note">
              {isOwner
                ? "Stok nyata dikelola dari halaman Stok & pembelian."
                : "Harga dan stok mengikuti data toko. Admin akan mengonfirmasi pesananmu."}
            </p>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
