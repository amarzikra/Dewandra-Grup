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

type FieldErrors = { email?: string; password?: string };

export function SignInForm() {
  const router = useRouter();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [pending, setPending] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const nextErrors: FieldErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Masukkan alamat email yang valid.";
    }
    if (!password.trim()) {
      nextErrors.password = "Kata sandi wajib diisi.";
    }
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.email) {
        emailRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
      return;
    }

    setPending(true);
    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });
      if (result.error) {
        setServerError("Email atau kata sandi belum cocok. Coba lagi.");
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
      <p className="masuk-kicker">Ruang pemilik</p>
      <h1 className="masuk-title">Masuk ke ruang pemilik.</h1>
      <p className="masuk-lede">
        Gunakan akun pemilik atau kasir yang diberikan oleh admin.
      </p>

      <form className="masuk-form" onSubmit={handleSubmit} noValidate aria-busy={pending}>
        <div className="masuk-field">
          <label className="masuk-label" htmlFor="masuk-email">
            Email
          </label>
          <input
            ref={emailRef}
            id="masuk-email"
            className="masuk-input"
            type="email"
            autoComplete="username"
            value={email}
            placeholder="nama@toko.test"
            disabled={pending}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "masuk-email-error" : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) {
                setErrors((previous) => ({ ...previous, email: undefined }));
              }
            }}
          />
          {errors.email ? (
            <p className="masuk-error" id="masuk-email-error">
              <TriangleAlert className="masuk-error-icon" size={14} aria-hidden="true" />
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="masuk-field">
          <label className="masuk-label" htmlFor="masuk-password">
            Kata sandi
          </label>
          <div className="masuk-password-wrap">
            <input
              ref={passwordRef}
              id="masuk-password"
              className="masuk-input masuk-password-input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              placeholder="Masukkan kata sandi"
              disabled={pending}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "masuk-password-error" : undefined}
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
            <p className="masuk-error" id="masuk-password-error">
              <TriangleAlert className="masuk-error-icon" size={14} aria-hidden="true" />
              {errors.password}
            </p>
          ) : null}
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
          {pending ? "Memproses…" : "Masuk"}
          {!pending ? <ArrowRight size={18} aria-hidden="true" /> : null}
        </button>

        <p className="masuk-note">
          Belum punya akun?{" "}
          <Link className="masuk-note-link" to="/sign-up">
            Daftar
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
