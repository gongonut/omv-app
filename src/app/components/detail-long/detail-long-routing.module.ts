import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailLongComponent } from './detail-long.component';

const routes: Routes = [{path: '', component: DetailLongComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailLongRoutingModule { }
