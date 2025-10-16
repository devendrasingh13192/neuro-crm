import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface AuthRequest extends Request {
    userId? : string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.header('Authorization')?.replace('Bearer ', '');
    if (!header) {
        return res.status(401).json({ message: 'No token, authorization denied'});
    }
    try{
        const decoded = jwt.verify(header, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;
        next();
    }catch (error: any) {
        return res.status(401).json({ message: 'Token is not valid', error: error.message });
    }
}