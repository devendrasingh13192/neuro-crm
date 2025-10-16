import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable({
    providedIn : 'root'
})


export class AuthService {
    private http = inject(HttpClient);
    private userSignal = signal<any>(null);
    public user$ = this.userSignal.asReadonly();
    public isAuthenticated = computed(() => !!this.userSignal());
    constructor(){
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            this.userSignal.set(JSON.parse(user));
        }
    }

    register(credentials : RegisterRequest) : Observable<AuthResponse> {
        return this.http.post<AuthResponse>('http://localhost:5000/api/v1/auth/register', credentials).pipe(
            tap((response: AuthResponse) => {
                this.setAuthData(response);
            }
        )
        );
    }

    login(credentials : LoginRequest) : Observable<AuthResponse> {
        return this.http.post<AuthResponse>('http://localhost:5000/api/v1/auth/login', credentials).pipe(
            tap((response: AuthResponse) => {
                this.setAuthData(response);
            }
        )
        );;
    }

    setAuthData(response : AuthResponse) : void{
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.userSignal.set(response.user);
    }

    logout() : void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSignal.set(null);
    }

    getToken(): string | null {
    return localStorage.getItem('token');
  }

  
}