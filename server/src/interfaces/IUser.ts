import { Document, ObjectId } from 'mongoose';

export interface ICommunicationStylePref {
    primary: 'direct' | 'diplomatic' | 'detailed' | 'big_picture';
    preferredChannels: ('email' | 'phone' | 'text' | 'video' | 'in-person')[];
    workingHours: { start: string; end: string; timezone: string };
    sensoryPreferences: {
        videoCalls: boolean;
        backgroundNoise: boolean;
        breakFrequency: number;
    }
}

export interface IUser extends Document {
    _id: ObjectId;
    name? : string;
    email: string;
    password: string;
    role: 'admin' | 'sales' | 'manager';
    communicationStyle? : ICommunicationStylePref
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

