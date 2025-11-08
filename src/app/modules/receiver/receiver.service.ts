import { Prisma, Receiver } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import { IPartnerFilterRequest, SenderInput } from './receiver.interface';
import prisma from '@libs/prisma';
import { receiverSearchableFields } from './receiver.constaints';

const insertIntoDB = async (data: SenderInput): Promise<Receiver> => {
  const { address, ...receiverData } = data;
  const result = await prisma.receiver.create({
    data: {
      ...receiverData,
      address: address ? { create: address } : undefined,
    },
    include: {
      address: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: IPartnerFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Receiver[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: receiverSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditons: Prisma.ReceiverWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.receiver.findMany({
    skip,
    take: limit,
    where: whereConditons,
  });
  const total = await prisma.receiver.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Receiver>,
): Promise<Receiver> => {
  const result = await prisma.receiver.update({
    where: {
      id: parseInt(id),
    },
    data: payload,
  });
  return result;
};

const getByIdFromDB = async (id: number): Promise<Receiver | null> => {
  const result = await prisma.receiver.findUnique({
    where: {
      id,
    },
    include: { couriers: true },
  });
  return result;
};

export const receiverService = {
  insertIntoDB,
  getByIdFromDB,
  getAllFromDB,
  updateOneInDB,
};
