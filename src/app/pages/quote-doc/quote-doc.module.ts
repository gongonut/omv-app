import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuoteDocRoutingModule } from './quote-doc-routing.module';
import { QuoteDocComponent } from './quote-doc.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DynamicFormModule } from 'src/app/components/dynamic-form/dynamic-form.module';
import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { CondQuoteModule } from 'src/app/components/cond-quote/cond-quote.module';


@NgModule({
  declarations: [
    QuoteDocComponent
  ],
  imports: [
    CommonModule,
    QuoteDocRoutingModule,
    NavBarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    DynamicFormModule,
    CondQuoteModule,
    MatSnackBarModule
  ]
})
export class QuoteDocModule { }
