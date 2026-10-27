import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Photos } from './components/photos/photos';
import { Posts } from './components/posts/posts';
import { Reviews } from './components/reviews/reviews';
import { VisitedPlaces } from './components/visited-places/visited-places';
import { ProfilePage } from './pages/profile-page/profile-page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: Posts },
      { path: 'photos', component: Photos },
      { path: 'visited-places', component: VisitedPlaces },
      { path: 'reviews', component: Reviews },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
