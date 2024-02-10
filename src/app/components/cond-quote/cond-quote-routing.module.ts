import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CondQuoteComponent } from './cond-quote.component';

const routes: Routes = [{path: '', component: CondQuoteComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondQuoteRoutingModule { }
