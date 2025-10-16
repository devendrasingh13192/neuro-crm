import { ObjectId } from "mongoose";

export interface IInteraction extends Document{
    _id : ObjectId;
    client : ObjectId;
    user : ObjectId
    type : 'email' | 'phone' | 'video' | 'in-person' | 'text';
    summary : string;
    duration : number; // in minutes
    sentiment : number; // -1 to 1
    effectiveness : number; // 1 to 5
    clientEngagement : number; // 1 to 5
    followUpRequired : boolean;
    preferredAspects : string[];
    improvementAreas : string[];
    createdAt?: Date;
    updatedAt?: Date;
}