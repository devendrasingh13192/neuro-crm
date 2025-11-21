import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InteractionService } from '../../services/interaction.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-interaction-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './interaction-list.component.html',
  styleUrl: './interaction-list.component.css'
})
export class InteractionListComponent {
  interactionService = inject(InteractionService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  displayedColumns: string[] = ['type', 'summary', 'duration', 'sentiment', 'actions'];

  
  clientId = this.route.snapshot.params['clientId'];

  ngOnInit(): void {
    this.loadInteractions();
  }

  loadInteractions(): void {
    if (this.clientId) {
      this.interactionService.getInteractionsByClient(this.clientId).pipe(takeUntil(this.destroy$)).subscribe({
        error: () => {
          this.snackBar.open('Failed to load clients', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getInteractionIcon(type: string): string {
    const icons: Record<string, string> = {
      'email': 'email',
      'phone': 'phone',
      'video': 'videocam',
      'in-person': 'person',
      'text': 'message'
    };
    return icons[type] || 'chat';
  }

  getSentimentIcon(sentiment: number): string {
    if (sentiment > 0.3) return 'sentiment_very_satisfied';
    if (sentiment > -0.3) return 'sentiment_neutral';
    return 'sentiment_very_dissatisfied';
  }

  getSentimentColor(sentiment: number): string {
    if (sentiment > 0.3) return 'primary';
    if (sentiment > -0.3) return 'accent';
    return 'warn';
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  deleteInteraction(interactionId: string): void {
    if (confirm('Delete this interaction?')) {
      this.interactionService.deleteInteraction(interactionId).subscribe({
        error: () => {
          this.snackBar.open('Failed to delete interaction', 'Close', { duration: 3000 });
        }
      });
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
