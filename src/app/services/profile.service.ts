import { inject, Injectable, signal } from "@angular/core";
import { UpdateProfileRequest, UserProfile } from "../interfaces/profile";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { useAnimation } from "@angular/animations";

@Injectable({
    providedIn: 'root'
})

export class ProfileService {
    private http = inject(HttpClient);
    private profileSignal = signal<UserProfile | null>(null);
    public profile$ = this.profileSignal.asReadonly();
    public isLoading = signal(false);


    getProfile(): Observable<UserProfile> {
        this.isLoading.set(true);
        return this.http.get<UserProfile>('http://localhost:5000/api/v1/users/profile').pipe(
            tap((profile: UserProfile) => {
                this.profileSignal.set(profile);
                this.isLoading.set(false);
            })
        );
    }

    updateProfile(profileData: UpdateProfileRequest): Observable<UserProfile> {
        this.isLoading.set(true);
        return this.http.patch<UserProfile>('http://localhost:5000/api/v1/users/profile', profileData).pipe(
            tap((updatedProfile: UserProfile) => {
                this.profileSignal.set(updatedProfile);
                this.isLoading.set(false);
            })
        );
    }

    refershProfile() : void{
        this.getProfile().subscribe();
    }

}