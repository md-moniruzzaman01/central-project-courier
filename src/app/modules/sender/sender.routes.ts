import express from 'express';
//
import validateRequest from '@middlewares/validateRequest';

import { senderValidation } from './sender.validation';
import { senderController } from './sender.controller';


const router = express.Router();

router.post(
  '/',
  validateRequest(senderValidation.create),
  senderController.insertIntoDB,
);
router.get('/', senderController.getAllFromDB);
router.get('/:id', senderController.getByIdFromDB);
router.patch('/:id', senderController.updateOneInDB);

export const senderRoutes = router;
