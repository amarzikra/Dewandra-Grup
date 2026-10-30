import { createFileRoute } from "@tanstack/react-router";
import { readJson, withPublicApi } from "@/lib/api.server";
import { getOrderForCustomer } from "@/services/orders.service.server";
import { lookupOrderSchema } from "@/validators/orders";

export const Route = createFileRoute("/api/orders/lookup")({
  server: {
    handlers: {
      POST: ({ request }) =>
        withPublicApi(request, async () => {
          const input = lookupOrderSchema.parse(await readJson(request));
          const order = await getOrderForCustomer(input);
          return Response.json({ data: order });
        }),
    },
  },
});
