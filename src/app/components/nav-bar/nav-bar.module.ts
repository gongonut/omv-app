import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarRoutingModule } from './nav-bar-routing.module';
import { NavBarComponent } from './nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    NavBarRoutingModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [NavBarComponent]
})
export class NavBarModule { }
