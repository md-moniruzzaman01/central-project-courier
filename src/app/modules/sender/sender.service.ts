import { Prisma, Sender } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import prisma from '@libs/prisma';
import { senderSearchableFields } from './sender.constaints';
import { IReceiverFilterRequest, SenderInput } from './sender.interface';
const insertIntoDB = async (data: SenderInput): Promise<Sender> => {

 const { address, ...senderData } = data;

  const result = await prisma.sender.create({
    data: {
      ...senderData,
      address: address ? { create: address } : undefined, 
    },
    include: {
      address: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: IReceiverFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Sender[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: senderSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditons: Prisma.SenderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.sender.findMany({
    skip,
    take: limit,
    where: whereConditons,
  });
  const total = await prisma.sender.count({
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
  payload: Partial<Sender>,
): Promise<Sender> => {
  const result = await prisma.sender.update({
    where: {
      id: parseInt(id),
    },
    data: payload,
  });
  return result;
};

const getByIdFromDB = async (id: number): Promise<Sender | null> => {
  const result = await prisma.sender.findUnique({
    where: {
      id,
    },
    include: { couriers: true },
  });
  return result;
};

export const SenderService = {
  insertIntoDB,
  getByIdFromDB,
  getAllFromDB,
  updateOneInDB,
};
