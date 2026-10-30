import { createFileRoute } from "@tanstack/react-router";
import { withApiSession } from "@/lib/api.server";
import { getPaymentProof } from "@/services/orders.service.server";
import { orderIdSchema } from "@/validators/orders";

function extensionFor(mime: string) {
  if (mime === "application/pdf") return "pdf";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export const Route = createFileRoute("/api/orders/$id/proof")({
  server: {
    handlers: {
      GET: ({ request, params }) =>
        withApiSession(request, async () => {
          const id = orderIdSchema.parse(params.id);
          const proof = await getPaymentProof(id);
          return new Response(new Uint8Array(proof.data), {
            headers: {
              "Content-Type": proof.mime,
              "Content-Disposition": `inline; filename="bukti-pembayaran.${extensionFor(proof.mime)}"`,
              "X-Content-Type-Options": "nosniff",
            },
          });
        }),
    },
  },
});
