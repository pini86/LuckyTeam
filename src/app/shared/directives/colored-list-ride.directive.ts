import { Directive, ElementRef, input, OnInit } from '@angular/core';

@Directive({
  selector: '[appColoredStroke]',
  standalone: true,
})
export class ColoredBorderDirective implements OnInit {
  public readonly item = input.required<number>();
  protected readonly _element: ElementRef;

  constructor(element: ElementRef) {
    this._element = element;
  }

  public ngOnInit(): void {
    if (this.item() % 2 !== 0) {
      this._element.nativeElement.style.backgroundColor = '#f7f7f7';
    }
  }
}
