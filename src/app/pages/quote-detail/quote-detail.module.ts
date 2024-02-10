import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuoteDetailRoutingModule } from './quote-detail-routing.module';
import { QuoteDetailComponent } from './quote-detail.component';

import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DetailLongModule } from 'src/app/components/detail-long/detail-long.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QoutePreviewModule } from 'src/app/components/qoute-preview/qoute-preview.module';
import { MatMenuModule } from '@angular/material/menu';
import { DynamicFormModule } from 'src/app/components/dynamic-form/dynamic-form.module';


@NgModule({
  declarations: [
    QuoteDetailComponent
  ],
  imports: [
    CommonModule,
    QuoteDetailRoutingModule,
    NavBarModule,
    DetailLongModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    QoutePreviewModule,
    DynamicFormModule
  ]
})
export class QuoteDetailModule { }
