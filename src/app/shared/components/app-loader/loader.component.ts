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
  rgb = input<string>('rgb(235, 235, 235)');
  radius = input<number>(4);

  constructor() {
    effect(() => {
      console.log(this.Cwidth());
    });
  }

  getMyStyles(){
    const myStyles = {
      'width.px': this.Cwidth() ? this.Cwidth() : '',
      'height.px': this.Cheight() ? this.Cheight(): '',
      'margin-left.px': this.MarginLeft() ? this.MarginLeft() : '',
      'margin-top.px': this.MarginTop() ? this.MarginTop() : '',
      'margin-bottom.px': this.MarginBottom() ? this.MarginBottom() : '',
      'display': this.inlineBlock() ? 'inline-block' : '',
      'border-radius': this.circle() ? '50%' : this.radius() + 'px',
      'background-color': this.rgb()
    }

    return myStyles;
  }
}
