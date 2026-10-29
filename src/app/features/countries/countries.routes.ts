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
    component: CountryOverviewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountriesRoutingModule {}
