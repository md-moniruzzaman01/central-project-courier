import validateRequest from '@middlewares/validateRequest';
import express from 'express';
import { courierValidation } from './courier.validation';
import { courierController } from './courier.controller';
// internal

const router = express.Router();

router.post(
  '/',
  validateRequest(courierValidation.create),
  courierController.insertIntoDB,
);
router.post('/delivery-agent/create', courierController.insertIntoDB);
router.get('/', courierController.getAllFromDB);
router.get('/:id', courierController.getByIdFromDB);
router.patch(
  '/:id',
  validateRequest(courierValidation.update),
  courierController.updateOneInDB,
);
export const courierRoutes = router;
