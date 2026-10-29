import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SectionNavigationItem {
  readonly label: string;
  readonly link: string;
  readonly fragment?: string;
  readonly active?: boolean;
}

@Component({
  selector: 'app-section-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './section-navigation.html',
  styleUrl: './section-navigation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionNavigation {
  readonly items = input.required<readonly SectionNavigationItem[]>();
  readonly ariaLabel = input('Sections');
}

