import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CondQuoteRoutingModule } from './cond-quote-routing.module';
import { CondQuoteComponent } from './cond-quote.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    CondQuoteComponent
  ],
  imports: [
    CommonModule,
    CondQuoteRoutingModule,
    MatIconModule
  ],
  exports: [CondQuoteComponent]
})
export class CondQuoteModule { }
