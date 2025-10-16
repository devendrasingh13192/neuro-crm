import { inject, Injectable, signal } from "@angular/core";
import { DashboardData } from "../interfaces/dashboard";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn : 'root'
})

export class DashboardService {
    private http = inject(HttpClient);
    private dashboardDataSignal = signal<DashboardData | null>(null);
    public dashboardData$ = this.dashboardDataSignal.asReadonly();
    public isLoading = signal(false);

    getDashboardData(): Observable<DashboardData>{
        this.isLoading.set(true);
        return this.http.get<DashboardData>('http://localhost:5000/api/v1/dashboard').pipe(
            // Simulate loading delay
            // delay(1000),
            // Tap into the response to update the signal
            tap((data: DashboardData) => {
                this.dashboardDataSignal.set(data);
                this.isLoading.set(false);
            })
        );
    } 

    refreshDashboard(): void {
    this.getDashboardData().subscribe();
  }
}