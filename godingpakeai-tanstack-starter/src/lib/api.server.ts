import { ZodError } from "zod";
import { auth } from "@/lib/auth.server";
import { ApiError } from "@/lib/api-error";
import { authBypassEnabled, demoSession } from "@/lib/dev-session";
import { env } from "@/lib/env.server";
import type { Permissions } from "@/lib/permissions";

export { ApiError } from "@/lib/api-error";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

function assertMutationOrigin(request: Request) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return;
  if (
    request.headers.get("origin") !== new URL(env.BETTER_AUTH_URL).origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new ApiError(
      403,
      "FORBIDDEN_ORIGIN",
      "Send this request from the app's configured origin.",
    );
}

// Shared HTTP concerns only. Domain rules and Drizzle queries live in services.
async function withApiResponse(handler: () => Promise<Response>) {
  let response: Response;
  try {
    response = await handler();
  } catch (error) {
    if (error instanceof ApiError) {
      response = Response.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    } else if (error instanceof ZodError) {
      response = Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Check the supplied fields.",
            details: error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
        },
        { status: 422 },
      );
    } else {
      // Do not return database errors, connection strings, or private values to clients.
      console.error(
        "Unexpected API failure:",
        error instanceof Error ? error.name : "UnknownError",
      );
      response = Response.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "Something went wrong. Try again.",
          },
        },
        { status: 500 },
      );
    }
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

async function readSession(request: Request): Promise<Session | null> {
  const session = await auth.api.getSession({
    headers: request.headers,
    query: { disableCookieCache: true },
  });
  if (session) return session;
  // Preview mode: the dev-only flag lets protected pages work without sign-in.
  // A production build sets import.meta.env.DEV to false, so this is never used.
  return authBypassEnabled ? demoSession : null;
}

export function withApiSession(
  request: Request,
  handler: (session: Session) => Promise<Response>,
) {
  return withApiResponse(async () => {
    const session = await readSession(request);
    if (!session)
      throw new ApiError(401, "UNAUTHORIZED", "Sign in to continue.");

    assertMutationOrigin(request);
    return handler(session);
  });
}

export function withPublicApi(
  request: Request,
  handler: () => Promise<Response>,
) {
  return withApiResponse(async () => {
    assertMutationOrigin(request);
    return handler();
  });
}

// Same contract as withApiSession, plus a role check before the handler runs.
// Endpoints that reach across accounts must use this, not a UI-only check.
export function withApiPermission(
  request: Request,
  permissions: Permissions,
  handler: (session: Session) => Promise<Response>,
) {
  return withApiSession(request, async (session) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: session.user.id, permissions },
    });
    if (!success)
      throw new ApiError(
        403,
        "FORBIDDEN",
        "Your account cannot perform this action.",
      );
    return handler(session);
  });
}

export async function readJson(request: Request): Promise<unknown> {
  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json")
    throw new ApiError(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      "Send an application/json body.",
    );
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Send valid JSON.");
  }
}
