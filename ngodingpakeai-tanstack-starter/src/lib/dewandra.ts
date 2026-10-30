import { createServerFn } from "@tanstack/react-start";
import {
  getCatalogData,
  getDashboardData,
} from "@/services/dewandra.service.server";

export const getCatalogFn = createServerFn({ method: "GET" }).handler(() =>
  getCatalogData(),
);

export const getDashboardFn = createServerFn({ method: "GET" }).handler(() =>
  getDashboardData(),
);
