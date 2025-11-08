import { Courier, Prisma } from '@prisma/client';
// internal
import prisma from '@libs/prisma';

import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { courierSearchableFields } from './courier.constaints';
import { ICourierFilterRequest, ICourierInputEvent } from './courier.interface';

const insertIntoDB = async (data: ICourierInputEvent): Promise<Courier> => {
  return await prisma.$transaction(async (tx) => {
    const courier = await tx.courier.create({
      data: {
        senderId: data.senderId,
        receiverId: data.recipientId,
        hawb: data.hawb,
        referenceCode: data.referenceCode,
        totalWeight: data.totalWeight,
        totalDeclaredValue: data.totalDeclaredValue,
      },
    });

    for (const box of data.boxes) {
      const createdBox = await tx.box.create({
        data: {
          courierId: courier.id,
          length: box.boxLength,
          width: box.boxWidth,
          height: box.boxHeight,
          totalWeight: box.boxWeight,
          label: `BOX-${courier.id}-${Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase()}`,
        },
      });

      for (const product of box.products) {
        const createdProduct = await tx.product.create({
          data: {
            courierId: courier.id,
            name: product.name,
            description: product.description,
            declaredValue: product.declaredValue,
            weight: product.weight,
            quantity: product.quantity,
            hsCode: product.hsCode,
            sku: product.sku,
            totalValue: product.declaredValue * product.quantity,
          },
        });

        await tx.productBox.create({
          data: {
            productId: createdProduct.id,
            boxId: createdBox.id,
            quantity: product.quantity,
          },
        });
      }
    }

    const result = await tx.courier.findUnique({
      where: { id: courier.id },
      include: {
        boxes: true,
        products: true,
      },
    });

    return result!; // ✅ safe non-null assertion
  });
};


const getAllFromDB = async (
  filters: ICourierFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Courier[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.CourierWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: courierSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.CourierWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.courier.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });

  const total = await prisma.courier.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: number): Promise<Courier | null> => {
  const result = await prisma.courier.findUnique({
    where: { id },
  });
  return result;
};
const updateOneInDB = async (
  id: number,
  payload: Partial<Courier>,
): Promise<Courier> => {
  const result = await prisma.courier.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

export const CourierService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
};
