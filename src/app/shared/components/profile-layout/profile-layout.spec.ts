import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProfileLayout } from './profile-layout';

describe('ProfileLayout', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProfileLayout);
    fixture.detectChanges();
    return fixture;
  }

  function setProfile(fixture: ReturnType<typeof setup>) {
    fixture.componentRef.setInput('user', {
      username: 'traveler', first_name: 'Test', last_name: 'User',
      birthday: '', gender: '', image_path: 'photo.jpg', visited_countries: [],
    });
    fixture.componentRef.setInput('profilePhoto', 'photo.jpg');
    fixture.componentRef.setInput('profileLoaded', true);
    fixture.detectChanges();
  }

  it('waits for profile data and the image before revealing the card', () => {
    const fixture = setup();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('app-loader')).toBeTruthy();
    expect(element.querySelector('img')).toBeNull();
    fixture.componentRef.setInput('profileLoaded', true);
    fixture.detectChanges();
    expect(element.querySelector('app-loader')).toBeTruthy();
    setProfile(fixture);
    expect(element.querySelector('.profile-pending')).toBeTruthy();
    element.querySelector('img')!.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    expect(element.querySelector('app-loader')).toBeNull();
    expect(element.querySelector('.profile-pending')).toBeNull();
    expect(element.textContent).toContain('Test User');
  });

  it('shows the loader again when the photo changes', () => {
    const fixture = setup();
    setProfile(fixture);
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector('img')!.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    fixture.componentRef.setInput('profilePhoto', 'new-photo.jpg');
    fixture.detectChanges();
    expect(element.querySelector('app-loader')).toBeTruthy();
    expect(element.querySelector('img')!.getAttribute('src')).toBe('new-photo.jpg');
    element.querySelector('img')!.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    expect(element.querySelector('app-loader')).toBeNull();
  });

  it('waits for the fallback and stops loading if the fallback also fails', () => {
    const fixture = setup();
    setProfile(fixture);
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(element.querySelector('img')!.getAttribute('src')).toBe('assets/user.png');
    expect(element.querySelector('app-loader')).toBeTruthy();
    element.querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(element.querySelector('app-loader')).toBeNull();
  });
});
