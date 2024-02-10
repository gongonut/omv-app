import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { General } from './datatypes';
import { SharedVarsService } from './shared-vars.service';
// import { env } from './environmets';

@Injectable({
  providedIn: 'root'
})
export class HttpGeneralService {

  constructor(private httgen: HttpClient, private sharedvar: SharedVarsService) { }

  newGeneral(): General {
    return {id: 'only', quote_condition: '', consecutive: 0, p_iva: 19} as General;
  }

  getGeneral(): Observable<General> {
    return this.httgen.get<General>(`${this.sharedvar.OMV_SERVER}general`);
  }

  updateGeneral(general: General): Observable<General> {
    
    return this.httgen.put<General>(`${this.sharedvar.OMV_SERVER}general`, general);
    // return this.httpq.put<CotizaWish>(`${env.OMV_SERVER}quote/${id}`, quote);
  }

}
