import { createFileRoute } from "@tanstack/react-router";
import { readJson, withPublicApi } from "@/lib/api.server";
import { attachPaymentProof } from "@/services/orders.service.server";
import { attachOrderProofSchema } from "@/validators/orders";

export const Route = createFileRoute("/api/orders/proof")({
  server: {
    handlers: {
      POST: ({ request }) =>
        withPublicApi(request, async () => {
          const input = attachOrderProofSchema.parse(await readJson(request));
          const result = await attachPaymentProof(input);
          return Response.json({ data: result });
        }),
    },
  },
});
