import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QoutePreviewRoutingModule } from './qoute-preview-routing.module';
import { QoutePreviewComponent } from './qoute-preview.component';
import { MatIconModule } from '@angular/material/icon';
import { CondQuoteModule } from '../cond-quote/cond-quote.module';


@NgModule({
  declarations: [
    QoutePreviewComponent
  ],
  imports: [
    CommonModule,
    QoutePreviewRoutingModule,
    MatIconModule,
    CondQuoteModule
  ],
  exports: [QoutePreviewComponent]
})
export class QoutePreviewModule { }
