import { Component, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [ CommonModule ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class AppLoaderComponent {
  Cwidth = input<string>('');
  Cheight = input<string>('');
  MarginLeft = input<string>('');
  MarginTop = input<string>('');
  MarginBottom = input<string>('');
  circle = input<boolean>(false);
  inlineBlock = input<boolean>(false);
  rgb = input<string>('rgb(210, 210, 210)');
  radius = input<number>(4);

  constructor() {
    effect(() => {
      console.log(this.Cwidth());
    });
  }

  getMyStyles(){
    const myStyles = {
      'width': this.toCssSize(this.Cwidth()),
      'height': this.toCssSize(this.Cheight()),
      'margin-left': this.toCssSize(this.MarginLeft()),
      'margin-top': this.toCssSize(this.MarginTop()),
      'margin-bottom': this.toCssSize(this.MarginBottom()),
      'display': this.inlineBlock() ? 'inline-block' : '',
      'border-radius': this.circle() ? '50%' : this.radius() + 'px',
      'background-color': this.rgb()
    }

    return myStyles;
  }

  private toCssSize(value: string): string {
    return value && /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
  }
}
