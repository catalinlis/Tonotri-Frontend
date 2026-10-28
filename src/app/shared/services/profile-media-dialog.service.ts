import { Dialog } from '@angular/cdk/dialog';
import { Injectable, inject } from '@angular/core';
import {
  ProfileMediaDialogComponent,
  ProfileMediaDialogData,
} from '../components/profile-media-dialog/profile-media-dialog.component';

@Injectable({ providedIn: 'root' })
export class ProfileMediaDialogService {
  private readonly dialog = inject(Dialog);

  open(data: ProfileMediaDialogData): void {
    this.dialog.open(ProfileMediaDialogComponent, {
      data,
      width: 'min(1200px, 96vw)',
      height: 'min(900px, 92dvh)',
      maxWidth: '96vw',
      maxHeight: '92dvh',
      autoFocus: 'dialog',
      panelClass: 'profile-media-dialog-panel',
      backdropClass: 'photo-gallery-backdrop',
    });
  }
}
