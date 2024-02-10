import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DialogComponent } from './modal/dialog/dialog.component';
import { QuoteListComponent } from './pages/quote-list/quote-list.component';
import { DynamicFormModule } from './components/dynamic-form/dynamic-form.module';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NavBarModule } from './components/nav-bar/nav-bar.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { QouteEditComponent } from './modal/qoute-edit/qoute-edit.component';
import { DetailLongModule } from './components/detail-long/detail-long.module';
import { MatMenuModule } from '@angular/material/menu';
import { APP_BASE_HREF } from '@angular/common';
import { SharedVarsService } from './shared-vars.service';
import { SelectDialogComponent } from './modal/select-dialog/select-dialog.component';
import { FormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    QuoteListComponent,
    QouteEditComponent,
    SelectDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DynamicFormModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    NavBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    DetailLongModule
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: '/app'},
    {provide: HTTP_INTERCEPTORS, useClass: SharedVarsService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
