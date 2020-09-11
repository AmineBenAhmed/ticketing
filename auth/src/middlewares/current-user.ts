import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify( //here we verifies if the token is valid or not
      req.session.jwt,//to verify the token we must provide the token and the secret key
      process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload; //the verify method returns the creeds of the user specificly the used data to create the jwt
  } catch (err) {

  }
  next();
}

