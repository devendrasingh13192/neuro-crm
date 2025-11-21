import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule,RouterLink, MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent {
   private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  clientService = inject(ClientService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadClients();
  }


  loadClients(): void {
    this.clientService.getClients().pipe(takeUntil(this.destroy$)).subscribe({
      error: (error) => {
        this.snackBar.open('Failed to load clients', 'Close', { duration: 3000 });
      }
    });
  }

  deleteClient(clientId: string): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(clientId).subscribe({
        next: () => {
          this.snackBar.open('Client deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete client', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getNeuroTypeIcon(neuroType: string): string {
    const icons: { [key: string]: string } = {
      autistic: '🧩',
      adhd: '⚡',
      typical: '💼',
      mixed: '🌈',
      unknown: '❓'
    };
    return icons[neuroType] || '❓';
  }

  getNeuroTypeClass(neuroType: string): string {
    return `neuro-${neuroType}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}


