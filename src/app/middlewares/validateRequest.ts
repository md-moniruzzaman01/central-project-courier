import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      next();
    } catch (error: any) {
      next(error);
    }
  };

export default validateRequest;
