import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { siteConfig } from "@/config/site";

type FieldErrors = { name?: string; email?: string; password?: string };

export function SignUpForm() {
  const router = useRouter();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [pending, setPending] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const nextErrors: FieldErrors = {};
    if (!name.trim()) {
      nextErrors.name = "Nama wajib diisi.";
    }
    if (!email.trim()) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Masukkan alamat email yang valid.";
    }
    if (!password) {
      nextErrors.password = "Kata sandi wajib diisi.";
    } else if (password.length < 8) {
      nextErrors.password = "Kata sandi minimal 8 karakter.";
    }
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name) {
        nameRef.current?.focus();
      } else if (nextErrors.email) {
        emailRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
      return;
    }

    setPending(true);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (result.error) {
        setServerError(
          result.error.message ||
            "Akun belum bisa dibuat. Periksa data lalu coba lagi.",
        );
        return;
      }
      await router.invalidate();
      await navigate({ to: siteConfig.homePath, replace: true });
    } catch {
      setServerError(
        "Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.",
      );
    } finally {
      setPending(false);
    }
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div className="masuk-root">
      <p className="masuk-kicker">Akun pertama</p>
      <h1 className="masuk-title">Buat akun pemilik.</h1>
      <p className="masuk-lede">
        Akun ini akan menjadi pemilik aplikasi dan dapat mengelola akses toko.
      </p>

      <form className="masuk-form" onSubmit={handleSubmit} noValidate aria-busy={pending}>
        <div className="masuk-field">
          <label className="masuk-label" htmlFor="daftar-name">
            Nama
          </label>
          <input
            ref={nameRef}
            id="daftar-name"
            className="masuk-input"
            type="text"
            autoComplete="name"
            value={name}
            placeholder="Nama Anda"
            disabled={pending}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "daftar-name-error" : undefined}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name) {
                setErrors((previous) => ({ ...previous, name: undefined }));
              }
            }}
          />
          {errors.name ? (
            <p className="masuk-error" id="daftar-name-error">
              <TriangleAlert className="masuk-error-icon" size={14} aria-hidden="true" />
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="masuk-field">
          <label className="masuk-label" htmlFor="daftar-email">
            Email
          </label>
          <input
            ref={emailRef}
            id="daftar-email"
            className="masuk-input"
            type="email"
            autoComplete="username"
            value={email}
            placeholder="nama@toko.test"
            disabled={pending}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "daftar-email-error" : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) {
                setErrors((previous) => ({ ...previous, email: undefined }));
              }
            }}
          />
          {errors.email ? (
            <p className="masuk-error" id="daftar-email-error">
              <TriangleAlert className="masuk-error-icon" size={14} aria-hidden="true" />
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="masuk-field">
          <label className="masuk-label" htmlFor="daftar-password">
            Kata sandi
          </label>
          <div className="masuk-password-wrap">
            <input
              ref={passwordRef}
              id="daftar-password"
              className="masuk-input masuk-password-input"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              placeholder="Minimal 8 karakter"
              disabled={pending}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "daftar-password-error" : "daftar-password-hint"}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) {
                  setErrors((previous) => ({ ...previous, password: undefined }));
                }
              }}
            />
            <button
              type="button"
              className="masuk-password-toggle"
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="masuk-error" id="daftar-password-error">
              <TriangleAlert className="masuk-error-icon" size={14} aria-hidden="true" />
              {errors.password}
            </p>
          ) : (
            <p className="masuk-form-status" id="daftar-password-hint">
              Gunakan minimal 8 karakter.
            </p>
          )}
        </div>

        <p className="masuk-form-status" role="status" aria-live="polite">
          {errorCount > 0
            ? "Periksa " + errorCount + " kolom yang perlu diperbaiki."
            : ""}
        </p>

        {serverError ? (
          <p className="auth-error" role="alert">
            {serverError}
          </p>
        ) : null}

        <button type="submit" className="masuk-submit" disabled={pending}>
          {pending ? (
            <LoaderCircle
              className="animate-spin motion-reduce:animate-none"
              size={18}
              aria-hidden="true"
            />
          ) : null}
          {pending ? "Membuat akun…" : "Buat akun"}
          {!pending ? <ArrowRight size={18} aria-hidden="true" /> : null}
        </button>

        <p className="masuk-note">
          Sudah punya akun?{" "}
          <Link className="masuk-note-link" to="/sign-in">
            Masuk
          </Link>
          . Butuh bantuan?{" "}
          <Link className="masuk-note-link" to="/profil-kontak">
            Hubungi admin
          </Link>
          .
        </p>
      </form>

      <p className="masuk-footnote">
        <ShieldCheck size={14} aria-hidden="true" />
        Akun Anda dilindungi sesi Better Auth.
      </p>
    </div>
  );
}
