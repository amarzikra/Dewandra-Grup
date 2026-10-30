import { createFileRoute } from "@tanstack/react-router";
import { readJson, withApiSession } from "@/lib/api.server";
import { applyOrderAction } from "@/services/orders.service.server";
import { orderIdSchema, updateOrderSchema } from "@/validators/orders";

export const Route = createFileRoute("/api/orders/$id")({
  server: {
    handlers: {
      PATCH: ({ request, params }) =>
        withApiSession(request, async (session) => {
          const id = orderIdSchema.parse(params.id);
          const input = updateOrderSchema.parse(await readJson(request));
          // The dev preview session is not a stored user. Sales can keep a null
          // cashier while previewing; a real signed-in owner is recorded.
          const actorId =
            session.user.id === "dev-bypass-user" ? null : session.user.id;
          const order = await applyOrderAction(id, actorId, input);
          return Response.json({ data: order });
        }),
    },
  },
});
