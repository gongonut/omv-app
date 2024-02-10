import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailShortComponent } from './detail-short.component';

const routes: Routes = [{path: '', component: DetailShortComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailShortRoutingModule { }
