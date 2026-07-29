import { NgModule } from "@angular/core";
import { ExplorePageComponent } from "./pages/explore-page/explore-page.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: ExplorePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule {}