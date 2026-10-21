import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

export interface PhotoGalleryData {
  images: SafeUrl[];
  startIndex: number;
  title?: string;
}

@Component({
  selector: 'app-photo-gallery-dialog',
  imports: [],
  templateUrl: './photo-gallery-dialog.component.html',
  styleUrl: './photo-gallery-dialog.component.css'
})
export class PhotoGalleryDialogComponent {
  readonly data = inject<PhotoGalleryData>(DIALOG_DATA);
  readonly dialogRef = inject(DialogRef);
  readonly selectedIndex = signal(this.data.startIndex);
  readonly selectedImage = computed(() => this.data.images[this.selectedIndex()]);

  constructor() {
    console.log('Gallery data:', this.data);
  }

  previous(): void {
    this.selectedIndex.update(index =>
      (index - 1 + this.data.images.length) % this.data.images.length
    );
  }

  next(): void {
    this.selectedIndex.update(index =>
      (index + 1) % this.data.images.length
    );
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
