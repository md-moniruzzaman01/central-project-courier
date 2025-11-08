import { Request, Response } from "express";
//internal
import catchAsync from "@libs/catchAsync";
import sendResponse from "@libs/sendResponse";
import pick from "@libs/pick";
import { paginationFields } from "@constants/pagination";
import { receiverService } from "./receiver.service";
import { receiverFilterableFields } from "./receiver.constaints";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await receiverService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "receiver created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, receiverFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await receiverService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "receiver fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await receiverService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "receiver update successfully",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseId = parseInt(id);
  const result = await receiverService.getByIdFromDB(parseId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "receiver fetched successfully",
    data: result,
  });
});

export const receiverController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  // updateIntoDB,
  // deleteFromDB,
};
