import { Request, Response } from "express";
import { IAuthResponse, ILoginRequest, IRegisterRequest } from "../interfaces/IAuth.js";
import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


export class AuthController {
    static async register(req: Request<{}, {}, IRegisterRequest>, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const newUser = new User({ email, password });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
            const response: IAuthResponse = {
                token,
                user: {
                    id: newUser._id!.toString(),
                    email: newUser.email,
                    role: newUser.role
                }
            };
            return res.status(201).json(response);

        } catch (error: any) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async login(req: Request<{}, {}, ILoginRequest>, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

            const response: IAuthResponse = {
                token,
                user: {
                    id: user._id!.toString(),
                    email: user.email,
                    role: user.role
                }
            };
            return res.status(200).json(response);

        } catch (error: any) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}