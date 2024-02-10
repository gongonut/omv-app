import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { MatIconModule } from '@angular/material/icon';
import { DynamicFormModule } from 'src/app/components/dynamic-form/dynamic-form.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    CatalogComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    NavBarModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormModule,
    MatMenuModule
  ]
})
export class CatalogModule { }
