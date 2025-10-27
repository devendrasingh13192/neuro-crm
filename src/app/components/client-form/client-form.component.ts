import { CommonModule, ɵnormalizeQueryParams } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client, CreateClientRequest, UpdateClientRequest } from '../../interfaces/client';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent {
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  clientService = inject(ClientService);

  clientForm!: FormGroup;
  isEditMode = signal(false);
  currentClientId = signal<string | null>(null);

  contactMethods = [
    { value: 'email', label: '📧 Email' },
    { value: 'phone', label: '📞 Phone Call' },
    { value: 'text', label: 'text' },
    { value: 'video', label: '🎥 Video Call' },
    { value: 'in-person', label: '👥 In-Person' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.clientForm = new FormGroup({
      name: new FormControl('', Validators.required),
      company: new FormControl(''),
      email: new FormControl('', Validators.email),
      phone: new FormControl(''),
      status: new FormControl('prospect'),
      relationshipScore: new FormControl(50, [Validators.min(0), Validators.max(100)]),

      // Neuro Profile
      primary: new FormControl('unknown'),
      detailLevel: new FormControl('medium'),
      responseTime: new FormControl('hours'),

      // Meeting Preferences
      meetingDuration: new FormControl(30),
      breakFrequency: new FormControl(45),
      agendaRequired: new FormControl(true),
      cameraOn: new FormControl(true),
      // Contact Methods (as FormArray)
      contactMethods: new FormArray([]),

      // Stress & Strengths
      stressTriggers: new FormControl(''),
      strengths: new FormControl(''),

      // Notes
      notes: new FormControl('')
    })
  }

  private checkEditMode(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId && this.route.snapshot.url.some(segment => segment.path === 'edit')) {
      this.isEditMode.set(true);
      this.currentClientId.set(clientId);
      this.loadClientData(clientId);
    }
  }


  private loadClientData(clientId: string): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (client) => {
        this.populateForm(client);
      },
      error: (error) => {
        this.snackbar.open('Failed to load client data', 'Close', { duration: 3000 });
        this.router.navigate(['/clients']);
      }
    });
  }

  private populateForm(client : Client) : void{
    this.clientForm.patchValue({
      name: client.name,
      company: client.company || '',
      email: client.email || '',
      phone: client.phone || '',
      status: client.status,
      relationshipScore: client.relationshipScore,
      primary: client.neuroProfile.communicationStyle.primary,
      detailLevel: client.neuroProfile.communicationStyle.detailLevel,
      responseTime: client.neuroProfile.communicationStyle.responseTime,
      meetingDuration: client.neuroProfile.preferences.meetingPreferences.duration,
      breakFrequency: client.neuroProfile.preferences.meetingPreferences.breakFrequency,
      agendaRequired: client.neuroProfile.preferences.meetingPreferences.agendaRequired,
      cameraOn: client.neuroProfile.preferences.meetingPreferences.cameraOn,
      stressTriggers: client.neuroProfile.stressTriggers.join(', '),
      strengths: client.neuroProfile.strengths.join(', '),
      notes: client.notes || ''
    });

    // Set contact methods
    const contactMethodsArray = this.clientForm.get('contactMethods') as FormArray;
    contactMethodsArray.clear();
    client.neuroProfile.preferences.contactMethods.forEach(method => {
      contactMethodsArray.push(new FormControl(method.method));
    });
  }

  isMethodSelected(method: string): boolean {
    const methodsArray = this.clientForm.get('contactMethods') as FormArray;
    return methodsArray.controls.some(control => control.value === method);
  }

  toggleContactMethod(method: string): void {
    const methodsArray = this.clientForm.get('contactMethods') as FormArray;
    const index = methodsArray.controls.findIndex(control => control.value === method);

    if (index > -1) {
      methodsArray.removeAt(index);
    } else {
      methodsArray.push(new FormControl(method));
    }
    this.clientForm.markAsDirty();
  }

  onSubmit() : void{
    if(this.clientForm.valid){
      const formValue = this.clientForm.value;
      
      
      const clientData = {
        name: formValue.name,
        company: formValue.company || undefined,
        email: formValue.email || undefined,
        phone: formValue.phone || undefined,
        neuroProfile: {
          communicationStyle: {
            primary: formValue.primary,
            detailLevel: formValue.detailLevel,
            responseTime: formValue.responseTime
          },
          preferences: {
            contactMethods: formValue.contactMethods.map((method: string) => ({
              method: method,
              effectiveness: 5 // Default effectiveness
            })),
            meetingPreferences: {
              duration: formValue.meetingDuration,
              breakFrequency: formValue.breakFrequency,
              agendaRequired: formValue.agendaRequired,
              cameraOn: formValue.cameraOn
            },
            communicationTips: [] // Can be added later
          },
          stressTriggers: formValue.stressTriggers ? 
            formValue.stressTriggers.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
          strengths: formValue.strengths ? 
            formValue.strengths.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []
        }
      } as CreateClientRequest | UpdateClientRequest;

      if (this.isEditMode() && this.currentClientId()) {
         // Update existing client
        (clientData as UpdateClientRequest).relationshipScore = formValue.relationshipScore;
        (clientData as UpdateClientRequest).status = formValue.status;
        (clientData as UpdateClientRequest).notes = formValue.notes || undefined;

        this.clientService.updateClient(this.currentClientId()!, clientData as UpdateClientRequest).subscribe({
          next: () => {
            this.snackbar.open('Client updated successfully!', 'Close', { duration: 3000 });
            this.router.navigate(['/clients', this.currentClientId()]);
          },
          error: (error) => {
            this.snackbar.open('Failed to update client', 'Close', { duration: 3000 });
          }
        });

      }else{
          // Create new client
        this.clientService.createClient(clientData as CreateClientRequest).subscribe({
          next: (newClient) => {
            this.snackbar.open('Client created successfully!', 'Close', { duration: 3000 });
            this.router.navigate(['/clients', {ɵnormalizeQueryParams : newClient.id}]);
          },
          error: (error) => {
            this.clientService.isLoading.set(false);
            this.snackbar.open('Failed to create client', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  resetForm(): void {
    if (this.isEditMode() && this.currentClientId()) {
      this.loadClientData(this.currentClientId()!);
    } else {
      this.clientForm.reset({
        status: 'prospect',
        relationshipScore: 50,
        primary: 'unknown',
        detailLevel: 'medium',
        responseTime: 'hours',
        meetingDuration: 30,
        breakFrequency: 45,
        agendaRequired: true,
        cameraOn: true
      });
      const contactMethodsArray = this.clientForm.get('contactMethods') as FormArray;
      contactMethodsArray.clear();
    }
  }

  onCancel(): void {
    if (this.isEditMode() && this.currentClientId()) {
      this.router.navigate(['/clients', this.currentClientId()]);
    } else {
      this.router.navigate(['/clients']);
    }
  }

}
