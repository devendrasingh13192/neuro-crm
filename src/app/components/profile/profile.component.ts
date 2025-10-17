import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService } from '../../services/profile.service';
import { UpdateProfileRequest } from '../../interfaces/profile';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private snackBar = inject(MatSnackBar);
  profileService = inject(ProfileService);
  breakFrequencyValue = signal(45);

  profileForm!: FormGroup;
  isSaving = signal(false);

  communicationChannels = [
    { value: 'email', label: '📧 Email' },
    { value: 'phone', label: '📞 Phone Call' },
    { value: 'text', label: '📞 text message' },
    { value: 'video', label: '🎥 Video Call' },
    { value: 'in-person', label: '👥 In-Person' }
  ]

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
    
  }

  // ngAfterViewInit() : void{
  //   this.loadProfile();
  // }

  private initForm(): void {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      role: new FormControl('sales', Validators.required),
      primary: new FormControl('direct', Validators.required),
      preferredChannels: new FormArray([], Validators.required),
      startTime: new FormControl('09:00', Validators.required),
      endTime: new FormControl('17:00', Validators.required),
      timeZone : new FormControl('UTC',Validators.required),
      videoCalls: new FormControl(true),
      backgroundNoise: new FormControl(false),
      breakFrequency: new FormControl(45, [Validators.required, Validators.min(15), Validators.max(120)])
    });
  }


  private loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.populateForm(profile);
      },
      error: (error) => {
        this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 });
      }
    });
  }

 

  private populateForm(profile: any): void {
    
    this.profileForm.patchValue({
      name: profile.name || '',
      role: profile.role || 'sales',
      primary: profile.communicationStyle?.primary || 'direct',
      startTime: profile.communicationStyle?.workingHours?.start || '09:00',
      endTime: profile.communicationStyle?.workingHours?.end || '17:00',
      timeZone: profile.communicationStyle?.workingHours?.timezone || 'UTC',
      videoCalls: profile.communicationStyle?.sensoryPreferences?.videoCalls ?? true,
      backgroundNoise: profile.communicationStyle?.sensoryPreferences?.backgroundNoise ?? false,
      breakFrequency: profile.communicationStyle?.sensoryPreferences?.breakFrequency || 45
    });



    // Set preferred channels
    const channelsArray = this.profileForm.get('preferredChannels') as FormArray;
    channelsArray.clear();
    
    const channels = profile.communicationStyle?.preferredChannels || ['email'];
    channels.forEach((channel: string) => {
      channelsArray.push(new FormControl(channel));
    });
  }

  isChannelSelected(channel: string): boolean {
    const channelsArray = this.profileForm.get('preferredChannels') as FormArray;
    return channelsArray.controls.some(control => control.value === channel);
  }

  toggleChannel(channel: string): void {
    const channelsArray = this.profileForm.get('preferredChannels') as FormArray;
    const index = channelsArray.controls.findIndex(control => control.value === channel);

    if (index > -1) {
      channelsArray.removeAt(index);
    } else {
      channelsArray.push(new FormControl(channel));
    }
    
    this.profileForm.markAsDirty();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      
      const updateData = {
        name: formValue.name,
        role: formValue.role,
        communicationStyle: {
          primary: formValue.primary,
          preferredChannels: formValue.preferredChannels,
          workingHours: {
            start: formValue.startTime,
            end: formValue.endTime,
            timezone : formValue.timeZone
          },
          sensoryPreferences: {
            videoCalls: formValue.videoCalls,
            backgroundNoise: formValue.backgroundNoise,
            breakFrequency: formValue.breakFrequency
          }
        }
      };

      this.profileService.updateProfile(updateData).subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
          this.profileForm.markAsPristine();
        },
        error: (error) => {
          this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
          this.profileService.isLoading.set(false);
        }
      });
    }
  }

  resetForm(): void {
    if (this.profileService.profile$()) {
      this.populateForm(this.profileService.profile$());
    }
    this.profileForm.markAsPristine();
  }

  get preferredChannelsArray(): FormArray {
    return this.profileForm.get('preferredChannels') as FormArray;
  }

}
