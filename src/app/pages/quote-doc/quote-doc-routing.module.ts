import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteDocComponent } from './quote-doc.component';

const routes: Routes = [{path: '', component: QuoteDocComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteDocRoutingModule { }
