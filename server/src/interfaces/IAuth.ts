export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    name? : string;
    email: string;
    password: string;
    role?: string;
    communicationStyle? : any;
}

export interface IAuthResponse {
    token: string;
    user: {
        id: string;
        name?: string;
        email: string;
        role: string;
        communicationStyle? : any;
    };
}