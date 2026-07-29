import { Component } from '@angular/core';
import { MenuComponent } from "../../components/menu/menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-explore-page',
  imports: [MenuComponent, RouterOutlet],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.css',
})
export class ExplorePageComponent {

}
