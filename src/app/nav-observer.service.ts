import { Injectable } from '@angular/core';
import { NavigateDetail } from './datatypes';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JsonFormData } from './components/dynamic-form/dynamic-form.component';
// import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { OtherService } from './other.service';
import { MongoBaseService } from './mongo-base.service';
import { SharedVarsService } from './shared-vars.service';

interface NavList {
  title?: string;
  icon?: string;
  route?: string;
  tag?: string;
  jsonDefSelect?: JsonFormData;
}

@Injectable({
  providedIn: 'root'
})
export class NavObserverService {

  private RouteDetailObs = new Subject<NavigateDetail>();
  private comeFromPage = '';
  actualTitle = ''
  routeTitleLst: string[] = [];
  routePrevList: NavList[] = [{
    title: 'Lista de solicitudes', icon: '', route: 'main', tag: '', jsonDefSelect: undefined
  }];
  backarrow = '';
  // private ready = false;
  jsonDefSelect!: JsonFormData;

  constructor(
    private router: Router,
    private mongodb: MongoBaseService,
    private sharedvar: SharedVarsService
    // private snkBar: MatSnackBar
    ) { }

  /*
  getReady(): boolean {return this.ready; }

  setReady() {this.ready = true; }
  */
  getRouteDetailObs(): Observable<NavigateDetail> {
    return this.RouteDetailObs.asObservable();
  }

  getPrevPage(): string { return this.comeFromPage; }

  onRouteDefPollDetail(title: string, icon: string, route: string, addToNav: boolean, tag: string, jsonDefSelect: JsonFormData) {
    this.jsonDefSelect = jsonDefSelect;
    this.onRouteDetail(title, icon, route, addToNav, tag);
  }

  onRouteBack() {
    if (this.routePrevList.length > 1) {
      const nv = this.routePrevList[this.routePrevList.length - 2];
      if (nv.jsonDefSelect?.controls) {this.jsonDefSelect = nv.jsonDefSelect}
      this.routePrevList.splice(this.routePrevList.length - 1, 1)
      this.RouteDetailObs.next(nv);
    }
  }

  onRouteDetail(title: string, icon: string, route: string, addToNav: boolean, tag: string = '') {

    
    // if (!this.getReady()) return;
    if (!this.sharedvar.isLogged()) {
      
      return;
    }
    this.jsonDefSelect = {};
    // if (sidenav) {this.sidenav = !this.sidenav; return;}
    this.comeFromPage = this.router.url;

    this.actualTitle = title;

    if (addToNav) {
      this.routePrevList.push({title, icon, route, tag, jsonDefSelect: this.jsonDefSelect});
    } else {this.routePrevList = []}
    /*
    if (back) {
      this.routeTitleLst.splice(this.routeTitleLst.length - 1, 1);}
    else {this.routeTitleLst.push(title || '---'); }
    this.backarrow = this.routeTitleLst[this.routeTitleLst.length - 1];
    */
    this.RouteDetailObs.next({ title, icon, route, tag });
  }

      /*
  $("#map").on('click', function () {
  coordinates = $('#coordinates').val();
  url         = "https://www.google.com.sa/maps/search/"+ coordinates +",12.21z?hl=en";

  window.open(url, '_blank');
});
*/

}
