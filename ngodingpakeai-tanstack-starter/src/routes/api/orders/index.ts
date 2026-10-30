import { createFileRoute } from "@tanstack/react-router";
import {
  readJson,
  withApiSession,
  withPublicApi,
} from "@/lib/api.server";
import { createOrder, listOrders } from "@/services/orders.service.server";
import { createOrderSchema } from "@/validators/orders";

export const Route = createFileRoute("/api/orders/")({
  server: {
    handlers: {
      GET: ({ request }) =>
        withApiSession(request, async () => {
          const data = await listOrders();
          return Response.json({ data });
        }),
      POST: ({ request }) =>
        withPublicApi(request, async () => {
          const input = createOrderSchema.parse(await readJson(request));
          const order = await createOrder(input);
          return Response.json({ data: order }, { status: 201 });
        }),
    },
  },
});
