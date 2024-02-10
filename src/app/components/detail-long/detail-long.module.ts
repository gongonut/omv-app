import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailLongRoutingModule } from './detail-long-routing.module';
import { DetailLongComponent } from './detail-long.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    DetailLongComponent
  ],
  imports: [
    CommonModule,
    DetailLongRoutingModule,
    MatIconModule,
    MatMenuModule,
    // MatSnackBarModule
  ],
  exports: [DetailLongComponent]
})
export class DetailLongModule { }
