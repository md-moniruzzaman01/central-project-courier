import { courierRoutes } from '@modules/couriur/courier.routes';
import { receiverRoutes } from '@modules/receiver/receiver.routes';
import { senderRoutes } from '@modules/sender/sender.routes';
import express from 'express';
const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/couriers',
    route: courierRoutes,
  },
  {
    path: '/receivers',
    route: receiverRoutes,
  },
  {
    path: '/senders',
    route: senderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
