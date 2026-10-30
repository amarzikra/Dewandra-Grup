export const companyProfile = {
  name: "Dewandra Grup",
  tagline: "Satu grup, lima kebutuhan harian.",
  description:
    "Dewandra Grup adalah bisnis yang bergerak di bidang pupuk, alat bangunan, alat tulis sekolah, alat elektronik, dan furnitur.",
  founded: "18 Juni 2025",
  phoneDisplay: "0821-4285-8094",
  phoneHref: "tel:+6282142858094",
  whatsappNumber: "6282142858094",
  whatsappUrl: "https://wa.me/6282142858094",
  openingHours: "07.50-17.00",
  mapsUrl:
    "https://www.google.com/maps/search/Dewi%20Fotocopy/@-2.066020965576172,102.22567749023438,17z?hl=en",
  bankAccounts: [
    { label: "BRI", number: "027501076350509" },
    { label: "Mandiri", number: "1100010998042" },
    { label: "BNI", number: "0445367350" },
    { label: "DANA", number: "082142858094" },
    { label: "ShopeePay", number: "082142858094" },
  ],
} as const;

export const storeLogos: Record<string, string> = {
  pupuk: "/stores/rezeki-tani.jpg",
  bangunan: "/stores/central-jaya-bangunan.jpg",
  atk: "/stores/dewi-foto-copy.jpg",
  listrik: "/stores/gemilang-elektronik.jpg",
  furniture: "/stores/kasandra-furniture.jpg",
};
