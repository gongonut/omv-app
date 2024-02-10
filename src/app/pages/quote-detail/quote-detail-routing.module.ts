import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteDetailComponent } from './quote-detail.component';

const routes: Routes = [{path: '', component: QuoteDetailComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteDetailRoutingModule { }
