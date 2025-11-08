import { Request, Response } from "express";
// internal
import catchAsync from "@libs/catchAsync";
import sendResponse from "@libs/sendResponse";
import pick from "@libs/pick";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { shipmentCosts, shipmentCharges, ...shipmentData } = req.body;

  // Call service to insert into DB
  const result = await ShipmentListService.insertIntoDB(finalShipmentData);

  // Send response
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Shipment created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, shipmentListFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await ShipmentListService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "shipment fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseId = parseInt(id);
  const result = await ShipmentListService.getByIdFromDB(parseId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "shipment fetched successfully",
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ShipmentListService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "shipment update successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ShipmentListService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "shipment deleted successfully",
    data: result,
  });
});

export const ShipmentController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteFromDB,
};
