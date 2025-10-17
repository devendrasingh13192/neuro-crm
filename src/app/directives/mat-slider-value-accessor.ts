import { Directive, forwardRef, inject, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'mat-slider[formControlName], mat-slider[formControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSliderValueAccessor),
      multi: true
    }
  ],
  standalone: true
})
export class MatSliderValueAccessor implements ControlValueAccessor, OnDestroy {
  private matSlider = inject(MatSlider);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private subscriptions = new Subscription();
  
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {
    // Listen to the native input event for value changes
    const inputSubscription = this.matSlider.input.subscribe((event: any) => {
      this.onChange(event.value);
    });

    // Listen to change event for final value
    const changeSubscription = this.matSlider.change.subscribe((event: any) => {
      this.onChange(event.value);
      this.onTouched();
    });

    this.subscriptions.add(inputSubscription);
    this.subscriptions.add(changeSubscription);
  }

  writeValue(value: number): void {
    if (value !== undefined && value !== null) {
      this.matSlider.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.matSlider.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}