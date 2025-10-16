import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { UserProfile, UpdateProfileRequest } from '../interfaces/IProfile.js';
import { IUser } from '../interfaces/IUser.js';
import { HydratedDocument } from 'mongoose';

interface AuthRequest extends Request{
    userId? : string;
}

export class ProfileController{
    static async getProfile(req : AuthRequest, res : Response) : Promise<Response>{
        try {
            const user = await User.findById(req.userId).select('-password') as HydratedDocument<IUser>;
            if(!user){
                return res.status(400).json({ message: 'User not found' });
            }
            const profile : UserProfile = {
                id : user._id!.toString(),
                name : user.name,
                email : user.email,
                role : user.role,
                communicationStyle : user.communicationStyle,
                createdAt : user.createdAt,
                updatedAt : user.updatedAt
            }
            return res.status(200).json(profile);
        } catch (error : any) {
            return res.status(500).json({ message: 'Error fetching profile' });
        }
    }

    static async updateProfile(req : AuthRequest, res : Response) : Promise<Response>{
        try {
            const profileData : UpdateProfileRequest = req.body;
            const user = await User.findById(req.userId);
            if(!user){
                return res.status(404).json({ message: 'User not found' });
            }
            user.communicationStyle = {
                ...user.communicationStyle,
                ...profileData.communicationStyle
            }
            await user.save();
            const updatedProfile : UserProfile = {
                id : user._id!.toString(),
                name : user.name,
                email : user.email,
                role : user.role,
                communicationStyle : user.communicationStyle,
                createdAt : user.createdAt,
                updatedAt : user.updatedAt
            }
            return res.status(200).json(updatedProfile);
        } catch (error : any) {
            return res.status(500).json({ message: 'Error updating profile' });
        }
    }
}