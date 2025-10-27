export interface Interaction {
  id?: string;
  client: string;
  user: string;
  type: 'email' | 'phone' | 'video' | 'in-person' | 'text';
  summary: string;
  duration: number;
  sentiment: number;
  effectiveness: number;
  clientEngagement: number;
  followUpRequired: boolean;
  preferredAspects: string[];
  improvementAreas: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateInteractionRequest {
  client: string;
  user: string;
  type: 'email' | 'phone' | 'video' | 'in-person' | 'text';
  summary: string;
  duration: number;
  sentiment: number;
  effectiveness: number;
  clientEngagement: number;
  followUpRequired: boolean;
  preferredAspects: string[];
  improvementAreas: string[];
}


export interface UpdateInteractionRequest {
  type?: 'email' | 'phone' | 'video' | 'in-person' | 'text';
  summary?: string;
  duration?: number;
  sentiment?: number;
  effectiveness?: number;
  clientEngagement?: number;
  followUpRequired?: boolean;
  preferredAspects?: string[];
  improvementAreas?: string[];
}
