import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteListComponent } from './pages/quote-list/quote-list.component';

const routes: Routes = [
  {
    path: 'quotedeta',
    loadChildren: () => import('./pages/quote-detail/quote-detail.module').then(m => m.QuoteDetailModule),
    // canLoad: [AllowNavGuard]    
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
    // canLoad: [AllowNavGuard]    
  },
  {
    path: 'quotedoc',
    loadChildren: () => import('./pages/quote-doc/quote-doc.module').then(m => m.QuoteDocModule),
    // canLoad: [AllowNavGuard]    
  },
  {
    path: 'catalog',
    loadChildren: () => import('./pages/catalog/catalog.module').then(m => m.CatalogModule),
    // canLoad: [AllowNavGuard]    
  },
  {path: 'main',
    component: QuoteListComponent},
  { path: '404', component: QuoteListComponent },
  { path: '', component: QuoteListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
