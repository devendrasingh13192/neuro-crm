import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../interfaces/client';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTabsModule

  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export class ClientDetailComponent {

  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  clientService = inject(ClientService);

  client = signal< Client| null>(null);
  isLoading = signal(true);
  clientId = this.route.snapshot.paramMap.get('id');

  ngOnInit() : void{
    this.loadClient();
  }

  private loadClient() : void {
    if(this.clientId){
      this.clientService.getClientById(this.clientId).subscribe({
        next : (client) => {
          this.client.set(client);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.snackbar.open('Failed to load client', 'Close', { duration: 3000 });
          this.isLoading.set(false);
        }
      })
    }else{
      this.isLoading.set(false);
    }
  }

  deleteClient(clientId : string) : void {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      this.clientService.deleteClient(clientId).subscribe({
        next: () => {
          this.snackbar.open('Client deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          this.snackbar.open('Failed to delete client', 'Close', { duration: 3000 });
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

  getContactMethodIcon(method: string): string {
    const icons: { [key: string]: string } = {
      email: '📧',
      phone : '📞',
      text : 'text',
      video: '🎥',
      'in-person': '👥'
    };
    return icons[method] || '📱';
  }

  getContactMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      phone : 'Phone Call',
      text : 'text',
      video: 'Video Call',
      'in-person': 'In-Person'
    };
    return labels[method] || method;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getDetailLevelClass(detailLevel: string): string {
    return `detail-${detailLevel}`;
  }

  getCommunicationTips(client: Client): string[] {
    const tips: string[] = [];
    const { primary, detailLevel, responseTime } = client.neuroProfile.communicationStyle;

    // Neurotype-specific tips
    switch (primary) {
      case 'autistic':
        tips.push('Use clear, literal language - avoid sarcasm and metaphors');
        tips.push('Provide detailed agendas before meetings');
        tips.push('Allow processing time for responses');
        tips.push('Be consistent with communication patterns');
        break;
      case 'adhd':
        tips.push('Keep communications concise and engaging');
        tips.push('Use visual aids and summaries');
        tips.push('Schedule shorter, more frequent check-ins');
        tips.push('Provide clear deadlines and reminders');
        break;
      case 'typical':
        tips.push('Balance detail with big-picture overview');
        tips.push('Mix communication methods based on context');
        tips.push('Maintain regular but flexible contact schedule');
        break;
      case 'mixed':
        tips.push('Offer multiple communication options');
        tips.push('Check in regularly about preferred methods');
        tips.push('Be adaptable to changing preferences');
        break;
      default:
        tips.push('Observe communication patterns and adjust accordingly');
    }

    // Detail level tips
    if (detailLevel === 'high') {
      tips.push('Provide comprehensive documentation and data');
    } else if (detailLevel === 'low') {
      tips.push('Focus on key takeaways and executive summaries');
    }

    // Response time tips
    if (responseTime === 'immediate') {
      tips.push('Be prepared for quick responses and follow-ups');
    } else if (responseTime === 'days') {
      tips.push('Allow adequate time for considered responses');
    }

    return tips;
  }
}


