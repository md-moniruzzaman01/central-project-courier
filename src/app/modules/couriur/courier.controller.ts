/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
// internal
import catchAsync from '@libs/catchAsync';
import sendResponse from '@libs/sendResponse';
import pick from '@libs/pick';
import { paginationFields } from '@constants/pagination';
//
import { CourierService } from './courier.service';
import { courierFilterableFields } from './courier.constaints';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { senderId, recipientId, hawb, referenceCode, thirdParty, boxes } = req.body;

  // ✅ Calculate totals
  const totalWeight = boxes.reduce((sum: number, box: any) => sum + box.boxWeight, 0);
  const totalDeclaredValue = boxes.reduce(
    (sum: number, box: any) =>
      sum +
      box.products.reduce(
        (pSum: number, product: any) => pSum + product.declaredValue * product.quantity,
        0
      ),
    0
  );

  // ✅ Prepare courier data
  const courierData = {
    senderId: Number(senderId),
    recipientId: Number(recipientId),
    hawb,
    referenceCode,
    thirdParty,
    totalWeight,
    totalDeclaredValue,
    boxes, // Pass boxes for nested creation
  };

  // ✅ Insert using service
  const result = await CourierService.insertIntoDB(courierData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Courier created successfully",
    data: result,
  });
});


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, courierFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await CourierService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'courier fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseId = parseInt(id);
  const result = await CourierService.getByIdFromDB(parseId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'courier fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseId = parseInt(id);
  const result = await CourierService.updateOneInDB(parseId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'courier update successfully',
    data: result,
  });
});
export const courierController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  //   deleteFromDB,
};
