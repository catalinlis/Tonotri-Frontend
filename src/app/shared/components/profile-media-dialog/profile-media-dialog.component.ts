import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgComponentOutlet } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Type, ViewChild, computed, inject, signal } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

export interface MediaGalleryImage<TMetadata = unknown> {
  url: string | SafeUrl;
  alt: string;
  title?: string;
  metadata?: TMetadata;
}

export interface ProfileMediaDialogData {
  images: Array<MediaGalleryImage>;
  startIndex: number;
  eyebrow?: string;
  showThumbnails?: boolean;
  detailsComponent: Type<unknown>;
  detailsContext: unknown;
}

@Component({
  selector: 'app-profile-media-dialog',
  imports: [NgComponentOutlet],
  templateUrl: './profile-media-dialog.component.html',
  styleUrl: './profile-media-dialog.component.css',
})
export class ProfileMediaDialogComponent implements AfterViewInit {
  @ViewChild('dialogShell') private dialogShell?: ElementRef<HTMLElement>;

  readonly data = inject<ProfileMediaDialogData>(DIALOG_DATA);
  readonly dialogRef = inject(DialogRef);
  readonly selectedIndex = signal(
    Math.min(Math.max(this.data.startIndex, 0), Math.max(this.data.images.length - 1, 0)),
  );
  readonly selectedImage = computed(() => this.data.images[this.selectedIndex()]);
  readonly detailsInputs = computed(() => ({
    photo: this.selectedImage(),
    context: this.data.detailsContext,
    index: this.selectedIndex(),
    total: this.data.images.length,
  }));

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.dialogShell?.nativeElement.scrollTo({ top: 0 }));
  }

  previous(): void {
    if (this.data.images.length < 2) return;
    this.selectedIndex.update(
      (index) => (index - 1 + this.data.images.length) % this.data.images.length,
    );
  }

  next(): void {
    if (this.data.images.length < 2) return;
    this.selectedIndex.update((index) => (index + 1) % this.data.images.length);
  }

  select(index: number): void {
    this.selectedIndex.set(index);
  }

  close(): void {
    this.dialogRef.close();
  }

  @HostListener('document:keydown.arrowleft')
  onPreviousKey(): void {
    this.previous();
  }

  @HostListener('document:keydown.arrowright')
  onNextKey(): void {
    this.next();
  }
}
