import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryOverviewPage } from './pages/country-overview-page/country-overview-page';
import { CountryPage } from './pages/country-page/country-page';
import { CountryReviewDetailPage } from './pages/country-review-detail-page/country-review-detail-page';

const routes: Routes = [
  {
    path: '',
    component: CountryPage,
    pathMatch: 'full',
  },
  {
    path: ':countrySlug/reviews/:reviewId',
    component: CountryReviewDetailPage,
  },
  {
    path: ':countrySlug',
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: CountryOverviewPage, data: { section: 'overview' } },
      { path: 'posts', component: CountryOverviewPage, data: { section: 'posts' } },
      { path: 'photos', component: CountryOverviewPage, data: { section: 'photos' } },
      { path: 'reviews', component: CountryOverviewPage, data: { section: 'reviews' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountriesRoutingModule {}
