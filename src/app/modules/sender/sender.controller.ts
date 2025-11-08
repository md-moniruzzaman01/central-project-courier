import { Request, Response } from "express";
//internal
import catchAsync from "@libs/catchAsync";
import sendResponse from "@libs/sendResponse";
import pick from "@libs/pick";
import { paginationFields } from "@constants/pagination";
import { senderFilterableFields } from "./sender.constaints";
import { SenderService } from "./sender.service";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SenderService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "sender created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, senderFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await SenderService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "sender fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SenderService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "sender update successfully",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseId = parseInt(id);
  const result = await SenderService.getByIdFromDB(parseId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "sender fetched successfully",
    data: result,
  });
});

export const senderController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  // updateIntoDB,
  // deleteFromDB,
};
