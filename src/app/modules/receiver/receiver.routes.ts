import express from 'express';
//
import validateRequest from '@middlewares/validateRequest';
import { receiverController } from './receiver.controller';
import { receiverValidation } from './receiver.validation';



const router = express.Router();

router.post(
  '/',
  validateRequest(receiverValidation.create),
  receiverController.insertIntoDB,
);
router.get('/', receiverController.getAllFromDB);
router.get('/:id', receiverController.getByIdFromDB);
router.patch('/:id', receiverController.updateOneInDB);

export const receiverRoutes = router;
