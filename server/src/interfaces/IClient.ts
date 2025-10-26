import { Document, ObjectId } from "mongoose";

export interface ICommunicationStyle{
    primary : 'autistic' | 'adhd' | 'typical' | 'mixed' | 'unknown';
    detailLevel : 'high' | 'medium' | 'low';
    responseTime : 'immediate' | 'hours' | 'days';
}

export interface IContactMethod{
    method : 'email' | 'phone' | 'text' | 'video' | 'in-person';
    effectiveness : number; // 1 to 10
}

export interface IMeetingPreferences{
    duration : number;
    agendaRequired : boolean;
    cameraOn : boolean;
    breakFrequency : number;
}

export interface INeuroProfile{
    communicationStyle : ICommunicationStyle;
    preferences : {
        contactMethods : IContactMethod[];
        meetingPreferences : IMeetingPreferences;
        communicationTips : string[];
    },
    stressTriggers : string[];
    strengths : string[];
}


export interface IClient extends Document{
    _id: ObjectId;
    name : string;
    company? : string;
    email? : string;
    phone? : string;
    assignedTo : ObjectId;
    neuroProfile : INeuroProfile;
    relationshipScore : number;
    lastInteraction : Date;
    status : 'active' | 'prospect' | 'inactive';
    notes? : string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateClientRequest{
    name : string;
    company? : string;
    email? : string;
    phone? : string;
    neuroProfile : Partial<INeuroProfile>;
}

export interface UpdateClientRequest {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  neuroProfile?: Partial<INeuroProfile>;
  relationshipScore?: number;
  status?: 'active' | 'prospect' | 'inactive';
  notes?: string;
}

export interface ClientResponse {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  assignedTo: string;
  neuroProfile: INeuroProfile;
  relationshipScore: number;
  lastInteraction?: Date;
  status: 'active' | 'prospect' | 'inactive';
  notes?: string;
  createdAt?: Date;
}


