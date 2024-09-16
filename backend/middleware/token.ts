import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: string | object;
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
