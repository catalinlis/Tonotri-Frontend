import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core';

export interface SectionDropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-section-dropdown',
  templateUrl: './section-dropdown.html',
  styleUrls: ['./section-dropdown.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionDropdown {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly label = input.required<string>();
  readonly value = input('');
  readonly options = input.required<readonly SectionDropdownOption[]>();
  readonly active = input(false);
  readonly alignRight = input(false);
  readonly selectionChange = output<string>();
  readonly open = signal(false);
  readonly opensUp = signal(false);
  readonly selectedLabel = computed(() => this.options().find(option => option.value === this.value())?.label ?? this.label());

  toggle(trigger: HTMLButtonElement): void {
    const bounds = trigger.getBoundingClientRect();
    this.opensUp.set(window.innerHeight - bounds.bottom < bounds.top);
    this.open.update(value => !value);
  }

  select(value: string, trigger: HTMLButtonElement): void {
    this.selectionChange.emit(value);
    this.open.set(false);
    trigger.focus();
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:focusin', ['$event'])
  closeOutside(event: Event): void {
    if (event.target instanceof Node && !this.element.nativeElement.contains(event.target)) this.open.set(false);
  }
}
