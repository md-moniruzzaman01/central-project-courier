
import { AuthRoutes } from "@modules/auth/auth.routes";
import { ShipmentRoutes } from "@modules/shipment/shipment.routes";
import express from "express";
const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/shipment",
    route: ShipmentRoutes,
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
