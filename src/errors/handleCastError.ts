// import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error';
// mongoose.Error.CastError
const handleCastError = (error:any) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid Id',
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;