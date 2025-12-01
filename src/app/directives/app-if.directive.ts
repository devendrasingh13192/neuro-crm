import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAppIf]',
  standalone: true
})
export class AppIfDirective {

  constructor(private renderer : Renderer2, private element : ElementRef) { }

  @HostListener('mouseenter') onEnter(){
    this.renderer.setStyle(this.element.nativeElement, 'background', 'yellow');
  }

  @HostListener('mouseleave') onLeave(){
    this.renderer.setStyle(this.element.nativeElement, 'background', 'transparent');
  }

}
