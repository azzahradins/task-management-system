import type { NextFunction, Request, Response } from "express";
import z from "zod";

interface RequestSchemas {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

function validate<T extends RequestSchemas>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    var errors: string | undefined = undefined;
    
    if (schema.body) {
      const result = schema.body.safeParse(req.body);
      if (!result.success) {
        errors = result.error.issues[0]?.message
      } else {
        req.body = result.data;
      }
    }

    if (schema.params && !errors) {
      const result = schema.params.safeParse(req.params);
      if (!result.success) {
        errors = result.error.issues[0]?.message
      }
    }

    if (errors) {
      return res.status(400).json({ message: "Bad Request", error: errors });
    }

    return next();
  };
}

export { validate };