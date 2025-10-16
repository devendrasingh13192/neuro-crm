export interface UserProfile{
    id : string;
    name? : string;
    email : string;
    role : string;
    communicationStyle? : {
        primary : 'direct' | 'diplomatic' | 'detailed' | 'big_picture';
        preferredChannels: ('email' | 'phone' | 'text' | 'video' | 'in-person')[];
        workingHours: { start: string; end: string; timezone: string };
        sensoryPreferences: {
        videoCalls: boolean;
        backgroundNoise: boolean;
        breakFrequency: number;
    };
    };
    createdAt? : Date;
    updatedAt? : Date;
}

export interface UpdateProfileRequest {
  name : string;
  communicationStyle: {
    primary: 'direct' | 'diplomatic' | 'detailed' | 'big_picture';
    preferredChannels: ('email' | 'phone' | 'text' | 'video' | 'in-person')[];
    workingHours: {
      start: string;
      end: string;
      timezone: string;
    };
    sensoryPreferences: {
      videoCalls: boolean;
      backgroundNoise: boolean;
      breakFrequency: number;
    };
  };
}
