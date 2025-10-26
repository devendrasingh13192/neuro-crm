export interface CommunicationStyle {
  primary: 'autistic' | 'adhd' | 'typical' | 'mixed' | 'unknown';
  detailLevel: 'high' | 'medium' | 'low';
  responseTime: 'immediate' | 'hours' | 'days';
}

export interface ContactMethod {
  method: 'email' | 'phone' | 'text' | 'video' | 'in-person';
  effectiveness: number;
}

export interface MeetingPreferences {
  duration: number;
  agendaRequired: boolean;
  cameraOn: boolean;
  breakFrequency: number;
}

export interface NeuroProfile {
  communicationStyle: CommunicationStyle;
  preferences: {
    contactMethods: ContactMethod[];
    meetingPreferences: MeetingPreferences;
    communicationTips: string[];
  };
  stressTriggers: string[];
  strengths: string[];
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  assignedTo: string;
  neuroProfile: NeuroProfile;
  relationshipScore: number;
  lastInteraction?: Date;
  status: 'active' | 'prospect' | 'inactive';
  notes?: string;
  createdAt?: Date;
}

export interface CreateClientRequest {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  neuroProfile: Partial<NeuroProfile>;
}

export interface UpdateClientRequest {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  neuroProfile?: Partial<NeuroProfile>;
  relationshipScore?: number;
  status?: 'active' | 'prospect' | 'inactive';
  notes?: string;
}