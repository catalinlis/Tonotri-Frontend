import { NgModule } from '@angular/core';
import { CanMatchFn, RouterModule, Routes } from '@angular/router';
import { CountryOverviewPage } from './pages/country-overview-page/country-overview-page';
import { CountryPage } from './pages/country-page/country-page';
import { CountryReviewDetailPage } from './pages/country-review-detail-page/country-review-detail-page';

const COUNTRY_SECTION_PATHS = new Set(['overview', 'posts', 'photos', 'reviews']);
const isCountrySection: CanMatchFn = (_route, segments) =>
  segments.length === 1 && COUNTRY_SECTION_PATHS.has(segments[0].path);

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
      { path: ':section', component: CountryOverviewPage, canMatch: [isCountrySection] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountriesRoutingModule {}
