import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { CountriesComponent } from './components/countries/countries.component';
import { CitiesComponent } from './components/cities/cities.component';
import { Landmarks } from './components/landmarks/landmarks';

const routes: Routes = [
  {
    path: '',
    component: ExplorePageComponent,
    children: [
      { path: '', redirectTo: 'countries', pathMatch: 'full' },
      { path: 'countries', component: CountriesComponent },
      { path: 'cities', component: CitiesComponent },
      { path: 'landmarks', component: Landmarks }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExploreRoutingModule {}