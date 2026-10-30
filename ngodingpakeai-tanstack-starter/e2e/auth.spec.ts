import { expect, test } from "@playwright/test";

test("anonymous visitors cannot access the protected app", async ({
  page,
  request,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(
    page.getByRole("heading", { name: "Masuk ke ruang pemilik." }),
  ).toBeVisible();
  // The root is a public landing page now.
  await page.goto("/");
  await expect(page).toHaveURL("http://localhost:3101/");
  await expect(
    page.getByRole("heading", { name: "Satu grup, lima kebutuhan harian." }),
  ).toBeVisible();
  const session = await request.get("/api/auth/get-session");
  expect(await session.json()).toBeNull();
});

test("signup, persisted session, signout, rejected password, and signin work", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const email = `builder-${Date.now()}@example.com`;
  const password = "A-long-test-password-123!";
  await page.goto("/sign-up");
  await page.getByLabel("Nama", { exact: true }).fill("Ada Builder");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Buat akun", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Ringkasan lima toko" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Keluar", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("button", { name: "Keluar", exact: true }),
  ).toBeVisible();
  // Signed-in visitors still see the public landing page at the root.
  await page.goto("/");
  await expect(page).toHaveURL("http://localhost:3101/");
  await expect(
    page.getByRole("heading", { name: "Satu grup, lima kebutuhan harian." }),
  ).toBeVisible();
  const cookies = await context.cookies();
  expect(
    cookies.some(
      (cookie) => cookie.name.includes("session_token") && cookie.httpOnly,
    ),
  ).toBe(true);
  await page.goto("/sign-in");
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Kata sandi", { exact: true }).fill("incorrect-password");
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Email atau kata sandi belum cocok",
  );
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  expect(errors).toEqual([]);
});

test("auth rejects cross-origin requests and invalid signup data", async ({
  request,
}) => {
  const crossOrigin = await request.post("/api/auth/sign-up/email", {
    headers: { Origin: "https://untrusted.example" },
    data: {
      name: "Test",
      email: "cross-origin@example.com",
      password: "Test-password-123",
    },
  });
  expect(crossOrigin.status()).toBe(403);
  const invalid = await request.post("/api/auth/sign-up/email", {
    headers: { Origin: "http://localhost:3101" },
    data: { name: "Test", email: "not-an-email", password: "short" },
  });
  expect(invalid.status()).toBeGreaterThanOrEqual(400);
  expect(invalid.status()).toBeLessThan(500);
});

test("auth pages fit a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/sign-in");
  await expect(
    page.getByRole("heading", { name: "Masuk ke ruang pemilik." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Daftar", exact: true }).click();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
