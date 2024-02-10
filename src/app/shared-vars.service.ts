import { Injectable } from '@angular/core';
import { CotizaWish, General, Item, User } from './datatypes';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedVarsService {

  private logedReady = new BehaviorSubject<boolean>(false);

  readonly DEV_STATUS=true;
  readonly OMV_SERVER = this.DEV_STATUS? 'http://localhost:3000/' : `https://${window.location.hostname}/`; // 'https://omv-production.up.railway.app/' // 'https://catalogos.omvpublicidadsas.com/'
  // readonly OMV_SERVER = 'http://localhost:3000/'; 
  user!: User;
  cotizaWishList: CotizaWish[] = [];
  selQuote!: CotizaWish;
  marpicoItems: Item[] = [];
  defaWishData: { [index: string]: any } = {};
  general!: General;
  
  // token = '';
  private logged = false;

  constructor() { }

  getLoggedReady(): Observable<boolean> {
    return this.logedReady.asObservable();
  }

  setLogged(ok: boolean) {
    this.logged = ok;
    this.logedReady.next(ok);
  }

  isLogged(): boolean {
    return this.logged;
  }

  getTime2NumberByHours(hour: number): number {
    return hour * 3600 * 1000;
  }

  /*
  getHeaderOptions() {
    const httpOptions = {

      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:4311/',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Authorization': "Bearer " + this.token
      })
    };
    
    return httpOptions;
  }
  */

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = localStorage.getItem('token'); // you probably want to store it in localStorage or something

    if (!token) {
      return next.handle(req);
    }

    const req1 = req.clone({
      // headers: req.headers.set('access_token', token),
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next.handle(req1);
  }

  removeAccents(str: string | undefined) {
    if (!str) return '';
    str = str.replaceAll(/,/g,'').toLowerCase();
    str = str.replaceAll(' ','');
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 

  updatePropResult(obj: any, propVal: any): any {

    Object.keys(propVal).forEach(key => {
      // if (obj.hasOwnProperty(key)) { obj[key] = propVal[key] }
      if (propVal[key] !== null) { obj[key] = propVal[key]; }
    });
    return obj;
  }

  

}
