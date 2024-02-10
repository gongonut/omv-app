import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailShortRoutingModule } from './detail-short-routing.module';
import { DetailShortComponent } from './detail-short.component';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
// import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    DetailShortComponent
  ],
  imports: [
    CommonModule,
    DetailShortRoutingModule,
    MatIconModule,
    MatMenuModule,
    // MatSnackBarModule
  ],
  exports: [DetailShortComponent]
})
export class DetailShortModule { }
