import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from "@angular/router";

@Component({
  selector: 'app-menu',
  imports: [RouterLinkActive, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {

}
